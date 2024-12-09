'use client';
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { setAccessToken } from '../../lib/tokenManager';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname(); // Get the current route

  const setTokenLogout = () => {
    setAccessToken('0');
    window.location.href = '/';
  };

  // Hide the NavBar if the current route is "/login"
  if (pathname === '/') {
    return null;
  }

  return (
    <div className="w-full fixed px-5 top-0 bg-primaryColor">
      <div className="text-white py-2 flex justify-between w-full">
        <div className="flex space-x-7">
          <a href="/home">Home</a>
          <a href="/new_order">New Order</a>
          <a href="/pending">Pending Orders</a>
          <a href='/history'>History</a>
          <a className="" href="/profile">Profile</a>
        </div>
        <div className="text-white">
          <Popover>
            <PopoverTrigger>
              <Menu />
            </PopoverTrigger>
            <PopoverContent>
              <button onClick={() => setTokenLogout()}>Log Out</button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
