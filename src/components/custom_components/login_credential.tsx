'use client'
import React, { useState } from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { Button } from '../ui/button'
import axios from 'axios';
import { setAccessToken } from '@/lib/tokenManager';
import { toast } from 'sonner';
import { apiUrl } from '@/apiConfig';


interface PassedData {
    id: number;
    firstName: string;
   lastName: string;
   email: string;

   
  }
export default function Login_Dialog({id, firstName , lastName , email}: PassedData) {

    //const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const [accessToken, setAccessToken] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

const WaiterId = id;  
const FirstName = firstName;
const LastName = lastName;
const Email = email;

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        setErrorMessage(null); // Clear previous errors
    console.log("Email: "+ Email)
        try {
          const response = await axios.post(`${apiUrl}/login_waiter/login`, {
            Email,
            password,
          });
    
          if (response.data.accessToken) {
            setAccessToken(response.data.accessToken);
           // setAccessToken(responseData.accessToken);
    
            console.log('Access Token:', response.data.accessToken);
            toast("Login Successful.")
    window.location.href = "/home";
          } else {
            setErrorMessage("Login failed. Please try again.");
          }
        } catch (error) {
          console.log("Error from catch: "+error)
          setErrorMessage( 'Log in failed. Try again with correct credentials.');
        }
      };

      

  return (
    <div>
      <Drawer>
  <DrawerTrigger className='text-white bg-primaryColor text-sm px-2'>Proceed </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Password</DrawerTitle>
      {/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
    </DrawerHeader>
    
<div>

     <form onSubmit={handleSubmit} className="mt-6">
         

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primaryColor hover:bg-primaryColor-light text-white py-2 px-4 rounded focus:outline-none"
          >
            Login
          </button>
        </form> 

</div>

    
  </DrawerContent>
</Drawer>
    </div>
  )
}
