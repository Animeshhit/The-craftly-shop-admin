//core
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

//others
// import Navbar from "./components/Navbar"
import Login from "./pages/Login";
import axios from "axios";
import { userData } from "./types/userDataTypes";
import { LoginType } from "./types/LoginFunctionType";
import { TokenData } from "./types/tokenDataType";
import Navbar from "./components/Navbar";
import Layout from "./components/Layout";
import Banners from "./pages/Banners";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import { Skeleton } from "./components/ui/skeleton";
import LoadingPage from "./components/LoadingPage";
import { ProductsLoadingPage } from "./components/LoadingPage";
import AddProduct from "./pages/AddProduct";
import Drafts from "./pages/Drafts";
import Categories from "./pages/Categories";
import CupponCode from "./pages/CupponCode";
import getToken from "./helper/token";
import LoadingBar from "react-top-loading-bar";
import EditProduct from "./pages/EditProduct";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./components/ui/use-toast";
import { ToastAction } from "./components/ui/toast";
import Dashboard from "./pages/Dashboard";

//redux
import { useDispatch, useSelector } from "react-redux";
import { login } from "./store/Slices/userSlice";
import { setProgress } from "./store/Slices/LoadingSlice";

const App = () => {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector((state: any) => state.loading);

  const { toast } = useToast();

  // login system ====================================

  const initialData = {
    phone: undefined,
    password: "",
  };
  let user = useSelector((s: any) => s.user.user);
  const [data, setData] = useState<userData>(initialData);
  const [button, setButton] = useState<boolean>(false);

  // for token function =======
  const setTokenWithExpiration = (
    token: string,
    expirationInMinutes: number
  ): void => {
    const expirationTime =
      new Date().getTime() + expirationInMinutes * 60 * 1000;
    localStorage.setItem("__token", JSON.stringify({ token, expirationTime }));
  };

  const LoginFunction: LoginType = async () => {
    try {
      setButton(true);
      dispatch(setProgress(30));
      console.log(data);
      axios
        .post(`${import.meta.env.VITE_BASE_API_URL}/auth/login`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res);
          let { data }: any = res;
          if (data.user.isAdmin) {
            setTokenWithExpiration(data.token, 1200000);
            dispatch(login(true));
            toast({
              title: "Login successfully ✅",
              description: "Process Completed",
            });
            setData(initialData);
            setButton(false);

            navigateTo("/");
          } else {
            dispatch(login(false));
            toast({
              variant: "destructive",
              title: "Login Error ❌",
              description: "you are not and admin",
            });
            setData(initialData);
            setButton(false);
          }
          dispatch(setProgress(100));
        })
        .catch((err) => {
          if (err.request.status == 401) {
            toast({
              variant: "destructive",
              description: err.response.data.message,
            });
          } else if (err.request.status == 404) {
            toast({
              variant: "destructive",
              description: err.response.data.message,
            });
          } else {
            console.log(err);
            toast({
              variant: "destructive",
              title: "Error",
              description: "something went wrong",
            });
          }
          dispatch(login(false));
          setButton(false);
          dispatch(setProgress(100));
        });
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Please Check Your Network Connection",
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => {
              location.reload();
            }}
          >
            Try again
          </ToastAction>
        ),
      });
      dispatch(login(false));
      setButton(false);
      dispatch(setProgress(100));
    }
  };

  // login a loggedIn user ===========================

  const loginOfLoggedIn = async () => {
    try {
      let tokenData = localStorage.getItem("__token");
      if (!tokenData) {
        dispatch(login(false));
        return;
      }

      let { token }: TokenData = JSON.parse(tokenData);
      dispatch(setProgress(30));

      axios
        .get(`${import.meta.env.VITE_BASE_API_URL}/auth/login`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          let { data } = res;
          if (data.user.isAdmin) {
            dispatch(login(true));
          } else {
            dispatch(login(false));
          }
          dispatch(setProgress(100));
        })
        .catch((err) => {
          console.log(err);
          toast({
            variant: "destructive",
            title: "Error",
            description: "something went wrong",
          });
          dispatch(login(false));
          dispatch(setProgress(100));
        });
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Please Check Your Network Connection",
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => {
              location.reload();
            }}
          >
            Try again
          </ToastAction>
        ),
      });
      dispatch(login(false));
      dispatch(setProgress(100));
    }
  };

  const session = () => {
    getToken();
    loginOfLoggedIn();
  };

  useEffect(() => {
    session();
  }, []);

  return (
    <>
      <LoadingBar
        color="#f11946"
        progress={loading}
        onLoaderFinished={() => dispatch(setProgress(0))}
      />
      <Toaster />
      {user == null ? (
        <Skeleton className="w-[300px] fixed top-0 left-0 bottom-0 bg-zinc-800 rounded-none" />
      ) : user ? (
        //fix error here
        <Navbar />
      ) : (
        ""
      )}
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              {user == null ? (
                <LoadingPage />
              ) : user ? (
                <Dashboard />
              ) : (
                <Navigate to="/login" replace={true} />
              )}
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            user == null ? (
              "loading..."
            ) : user ? (
              <Navigate to="/" replace={true} />
            ) : (
              <Login
                button={button}
                data={data}
                setData={setData}
                loginFunc={LoginFunction}
              />
            )
          }
        />
        <Route
          path="/banners"
          element={
            <Layout>
              {user == null ? (
                <>
                  <Skeleton className="w-full h-[100px] bg-zinc-800 mb-8" />
                  {Array.from({ length: 5 }).map(() => {
                    return (
                      <Skeleton className="bg-zinc-800 mb-6 w-full h-[450px]" />
                    );
                  })}
                </>
              ) : user ? (
                <Banners />
              ) : (
                <Navigate to="/login" replace={true} />
              )}
            </Layout>
          }
        />
        <Route
          path="/products"
          element={
            <Layout>
              {user == null ? (
                <div>
                  <Skeleton className="mb-4 w-[200px] h-8 bg-zinc-800 rounded-md" />
                  <ProductsLoadingPage />
                </div>
              ) : user ? (
                <Products />
              ) : (
                <Navigate to="/login" replace={true} />
              )}
            </Layout>
          }
        />
        <Route
          path="/addproduct"
          element={
            <Layout>
              {user == null ? (
                <div>
                  <Skeleton className="mb-4 w-[200px] h-8 bg-zinc-800 rounded-md" />
                  <ProductsLoadingPage />
                </div>
              ) : user ? (
                <AddProduct />
              ) : (
                <Navigate to="/login" replace={true} />
              )}
            </Layout>
          }
        />

        <Route
          path="/editproduct/:id"
          element={
            <Layout>
              {user == null ? (
                <div>
                  <Skeleton className="mb-4 w-[200px] h-8 bg-zinc-800 rounded-md" />
                  <ProductsLoadingPage />
                </div>
              ) : user ? (
                <EditProduct />
              ) : (
                <Navigate to="/login" replace={true} />
              )}
            </Layout>
          }
        />

        <Route
          path="/categories"
          element={
            <Layout>
              {user == null ? (
                <div>
                  <Skeleton className="mb-4 w-[200px] h-8 bg-zinc-800 rounded-md" />
                  <ProductsLoadingPage />
                </div>
              ) : user ? (
                <Categories />
              ) : (
                <Navigate to="/login" replace={true} />
              )}
            </Layout>
          }
        />

        <Route
          path="/drafts"
          element={
            <Layout>
              {user == null ? (
                <div>
                  <Skeleton className="mb-4 w-[200px] h-8 bg-zinc-800 rounded-md" />
                  <ProductsLoadingPage />
                </div>
              ) : user ? (
                <Drafts />
              ) : (
                <Navigate to="/login" replace={true} />
              )}
            </Layout>
          }
        />
        <Route
          path="/cuppon-codes"
          element={
            <Layout>
              {user == null ? (
                <div>
                  <Skeleton className="mb-4 w-[200px] h-8 bg-zinc-800 rounded-md" />
                  <ProductsLoadingPage />
                </div>
              ) : user ? (
                <CupponCode />
              ) : (
                <Navigate to="/login" replace={true} />
              )}
            </Layout>
          }
        />

        <Route
          path="/users"
          element={
            <Layout>
              {user == null ? (
                "loading..."
              ) : user ? (
                <Users />
              ) : (
                <Navigate to="/login" replace={true} />
              )}
            </Layout>
          }
        />
        <Route
          path="/orders"
          element={
            <Layout>
              {user == null ? (
                "loading..."
              ) : user ? (
                <Orders />
              ) : (
                <Navigate to="/login" replace={true} />
              )}
            </Layout>
          }
        />
      </Routes>
    </>
  );
};

export default App;
