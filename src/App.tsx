//core 
import {Routes,Route,Navigate,useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';




//others
// import Navbar from "./components/Navbar"
import Login from './pages/Login';
import Home from './pages/Home';
import axios from 'axios';
import { userData } from './types/userDataTypes';
import {LoginType} from './types/LoginFunctionType'
import { TokenData } from './types/tokenDataType';




const App = () => {

 const navigateTo = useNavigate();


  // login system ====================================
 

  const initialData = {
    mobile:undefined,
    password:""
  }
  const [user,setUser] = useState<null|boolean>(null);
  const [data,setData] = useState<userData>(initialData);
  const [button,setButton] = useState<boolean>(false);
  
  

  // for token function =======
  const setTokenWithExpiration = (token: string, expirationInMinutes: number): void => {
    const expirationTime = new Date().getTime() + expirationInMinutes * 60 * 1000;
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
  


   const LoginFunction:LoginType = async () => {
    try{
      setButton(true);
      axios.post("http://localhost:8080/api/v1/auth/login",data,{
        headers:{
          "Content-Type":"application/json"
        }
      }).then(res => {
        let {data}:any = res;
        setTokenWithExpiration(data.token,5);
        setUser(true);
        alert(data.message);
        setData(initialData);
        navigateTo("/")

      }).catch(err => {
        if(err.request.status == 401){
          alert(err.response.data.message);
        }else if(err.request.status == 404){
          alert(err.response.data.message);
        }else{
          console.log(err);
          alert("something went wrong");
        }
        setUser(false);
        setButton(false);
      })
    
    }catch(err){
      console.log(err);
      alert("Network connection error");
      setUser(false);
      setButton(false);
    }
   }


// login a loggedIn user =========================== 

const loginOfLoggedIn = async () => {
  try{
    let tokenData = localStorage.getItem("__token");
    if(!tokenData){
      setUser(false);
      return;
    }

    let {token}:TokenData = JSON.parse(tokenData);
    
    axios.get("http://localhost:8080/api/v1/auth/login",{
      headers:{
        "Authorization" : `Bearer ${token}`
      }
    }).then(res  => {
      let {data} = res;
      if(data.user){
        setUser(true);
      }
    }).catch(err => {
      console.log(err);
      alert("something went wrong");
      setUser(false);
      localStorage.removeItem("__token");
    })

  }
  catch(err){
    console.log(err);
    alert("Network connection error");
    setUser(false);
  }
}

  useEffect(() => {
    getToken();
  loginOfLoggedIn();
  },[]);


  return (
    <>
     {/* <Navbar/> */}
     <Routes>
      <Route path="/" element={user == null ? "loading..." : user ? <Home/> : <Navigate to="/login" replace={true}/>}/>
      <Route path='/login' element={<Login button={button} data={data} setData={setData} loginFunc={LoginFunction}/>}/>
     </Routes>
    </>
  )
}

export default App