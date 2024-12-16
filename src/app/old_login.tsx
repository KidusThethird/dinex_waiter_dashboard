'use client';

import { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '@/apiConfig';
import { toast } from "sonner"
import { setAccessToken, getAccessToken, clearAccessToken } from "../lib/tokenManager";
import Image from "next/image";




export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [accessToken, setAccessToken] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  //const accessToken = getAccessToken();


  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setErrorMessage(null); // Clear previous errors

    try {
      const response = await axios.post(`${apiUrl}/login_waiter/login`, {
        email,
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">



      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">



      <div className="flex items-center m-4">
            <Image
              src="/logo/logo3.png" // Path relative to the public directory
              alt="Company Logo"
              width={150} // Adjust width
              height={150} // Adjust height
              className=" rounded mx-auto" // Optional styling
            />
          </div>

        <h2 className="text-xl font-semibold text-primaryColor text-center">Login</h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

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

        {errorMessage && (
          <div className="mt-4 text-center text-sm text-red-500">
            {errorMessage}
          </div>
        )}

        {/* {accessToken && (
          <div className="mt-4 text-center text-sm text-green-500">
            Successfully logged in! Access token: {accessToken}
          </div>
        )} */}
      </div>
    </div>
  );
}
