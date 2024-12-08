'use client'
import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { setAccessToken, getAccessToken, clearAccessToken } from "../../lib/tokenManager";
import { Menu } from "lucide-react";



export default function NavBar() {


  const setTokenLogout= () =>{

    setAccessToken("0");
    window.location.href = "/";
  }

  return (
    <div className='w-full fixed px-5 top-0 bg-primaryColor'>
      

<div className='text-white py-2 flex justify-between  w-full '>
<div className='flex space-x-7'>
<a className=''>Home</a>
<h1>Pending Orders</h1>
<h1>History</h1>
<h1>Profile</h1>
</div>
<div className='text-white'>

<Popover>
  <PopoverTrigger><Menu/></PopoverTrigger>
  <PopoverContent>
    
    <button onClick={()=>setTokenLogout()}>Log Out</button>
    </PopoverContent>
</Popover>
</div>
</div>

    </div>
  )
}
