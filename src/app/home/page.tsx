'use client';

import React, { useEffect, useState } from 'react';
import { setAccessToken, getAccessToken, clearAccessToken } from "../../lib/tokenManager";
import NavBar from '@/components/custom_components/nav_bar';



export default function Home() {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);

  useEffect(() => {
    // Only run on the client-side
    const token = getAccessToken();
    setAccessTokenState(token);
  }, []); // Empty dependency array ensures it runs only once after the initial render

  return (

    // <div>
    //   <h1>This is a home page</h1>
    //   {accessToken ? (
    //     <p>Access Token: {accessToken}</p>
    //   ) : (
    //     <p>No Access Token found.</p>
    //   )}
    // </div>



    <div className='w-full'>
         {/* <NavBar />  */}
    </div>
  );
}
