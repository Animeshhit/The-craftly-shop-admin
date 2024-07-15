//cores
import React from 'react';


//others
import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

import { userData } from "../types/userDataTypes"
import { LoginType } from '../types/LoginFunctionType';
import { ReloadIcon } from "@radix-ui/react-icons"



export default function Login(props:{button:boolean,data:userData,setData:React.Dispatch<React.SetStateAction<userData>>,loginFunc:LoginType}) {



  const handleChange = (e:any) => {
    props.setData({...props.data,[e.target.name]:e.target.value});
  }

  const loginUser = () => {
     if(props.data.mobile == ""){
      alert("Invalid Mobile number");
    }
    else if(props.data.password == ""){
      alert("Password Can't be empty");
    }
    else{
      props.loginFunc();
    }
  }

  return (
    <section>
      <div className="container mx-auto px-4 h-screen flex items-center justify-center">
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle>Admin Login</CardTitle>
        <CardDescription>Welcome to The Craftly Shop Admin Page</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="mobile">Mobile</Label>
              <Input name='mobile' value={props.data.mobile} id="mobile" required={true} type="Number" placeholder="Enter Mobile Number" onChange={handleChange}/>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input name='password' value={props.data.password} id="password" required={true} type="text" placeholder="Enter Password" onChange={handleChange}/>
            </div>
         
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {
          props.button ? (
            <Button className='w-full' disabled>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
          ) : (
            <Button onClick={loginUser} className="w-full">Login</Button>
          )
        }
       
      </CardFooter>
    </Card>
    </div>
    </section>
  )
}
