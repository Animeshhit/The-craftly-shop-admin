//core
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

//others
// import Navbar from "./components/Navbar"
import Login from "./pages/Login";
import Home from "./pages/Home";
import axios from "axios";
import { userData } from "./types/userDataTypes";
import { LoginType } from "./types/LoginFunctionType";
import { TokenData } from "./types/tokenDataType";
import { baseApiURL } from "./config/api";
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

const App = () => {
  const navigateTo = useNavigate();

  // login system ====================================

  const initialData = {
    mobile: undefined,
    password: "",
  };
  const [user, setUser] = useState<null | boolean>(null);
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

  const getToken = (): string | null => {
    const tokenData = localStorage.getItem("__token");
    if (!tokenData) return null;

    try {
      const { token, expirationTime }: TokenData = JSON.parse(tokenData);
      const currentTime = new Date().getTime();

      if (currentTime > expirationTime) {
        localStorage.removeItem("__token");
        return null;
      }

      return token;
    } catch (error) {
      console.error("Failed to parse token data:", error);
      localStorage.removeItem("__token");
      return null;
    }
  };

  const LoginFunction: LoginType = async () => {
    try {
      setButton(true);
      axios
        .post(`${baseApiURL}/auth/login`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          let { data }: any = res;
          if (data.user.isAdmin) {
            setTokenWithExpiration(data.token, 60);
            setUser(true);
            alert(data.message);
            setData(initialData);
            navigateTo("/");
          } else {
            localStorage.removeItem("__token");
            setUser(false);
            alert("You Are Not An Admin");
            setData(initialData);
            setButton(false);
          }
        })
        .catch((err) => {
          if (err.request.status == 401) {
            alert(err.response.data.message);
          } else if (err.request.status == 404) {
            alert(err.response.data.message);
          } else {
            console.log(err);
            alert("something went wrong");
          }
          setUser(false);
          setButton(false);
        });
    } catch (err) {
      console.log(err);
      alert("Network connection error");
      setUser(false);
      setButton(false);
    }
  };

  // login a loggedIn user ===========================

  const loginOfLoggedIn = async () => {
    try {
      let tokenData = localStorage.getItem("__token");
      if (!tokenData) {
        setUser(false);
        return;
      }

      let { token }: TokenData = JSON.parse(tokenData);

      axios
        .get(`${baseApiURL}/auth/login`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          let { data } = res;
          console.log(data.user.isAdmin);
          if (data.user.isAdmin) {
            setUser(true);
          } else {
            setUser(false);
            localStorage.removeItem("__token");
          }
        })
        .catch((err) => {
          console.log(err);
          alert("something went wrong");
          setUser(false);
          localStorage.removeItem("__token");
        });
    } catch (err) {
      console.log(err);
      alert("Network connection error");
      setUser(false);
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
      {user == null ? (
        <Skeleton className="w-[300px] fixed top-0 left-0 bottom-0 bg-zinc-800 rounded-none" />
      ) : user ? (
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
                <Home />
              ) : (
                <Navigate to="/login" replace={true} />
              )}
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Login
              button={button}
              data={data}
              setData={setData}
              loginFunc={LoginFunction}
            />
          }
        />
        <Route
          path="/banners"
          element={
            <Layout>
              {user == null ? (
                "loading..."
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
