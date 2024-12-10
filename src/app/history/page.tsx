'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from "../../lib/tokenManager";
import { apiUrl } from '@/apiConfig';

// Define types for the API response structure
interface Item {
  id: number;
  name: string;
  description: string;
  type: string;
  itemType: string;
  price: number;
  duration: number;
  status: string;
  deleted: boolean;
  createdAt: string;
}

interface OrderItem {
  id: number;
  OrderId: string;
  ItemId: number;
  quantity: number;
  createdAt: string;
  Item: Item;
}

interface Order {
  id: string;
  WaiterId: number;
  OrderStatus: string; // Added OrderStatus
  TableNumber: string; // Added TableNumber
  createdAt: string;
  OrderItems: OrderItem[];
}

// Function to format date
const formatDate = (dateString: string): string => {
  const now = new Date();
  const createdAt = new Date(dateString);
  const diffInMs = now.getTime() - createdAt.getTime();
  const diffInMinutes = Math.floor(diffInMs / 1000 / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);

  // If less than a day
  if (diffInHours < 24) {
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }

  // If more than a day
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOfWeek = days[createdAt.getDay()];
  return `${dayOfWeek}, ${createdAt.toLocaleDateString()}`;
};

export default function History() {
  const accessToken = getAccessToken();

  if (!accessToken || accessToken === '0') {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch order history from the API
    const fetchHistory = async () => {
      try {
        const response = await axios.get<Order[]>(`${apiUrl}/orderitem/history_for_waiter`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the Bearer Token
          },
        });

        setOrderHistory(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error fetching order history:', error.response?.data || error.message);
        } else {
          console.error('Error fetching order history:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='mt-14'>
      <h1 className='text-2xl font-bold mb-4 mx-5'>Order History</h1>
      <table className='table-auto border-collapse border border-gray-300 w-5/6 mx-auto'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='border border-gray-300 px-4 py-2'>Order Status</th>
            <th className='border border-gray-300 px-4 py-2'>Table Number</th>
            <th className='border border-gray-300 px-4 py-2'>Items</th>
            <th className='border border-gray-300 px-4 py-2'>Quantities</th>
            <th className='border border-gray-300 px-4 py-2'>Each Price</th>
            <th className='border border-gray-300 px-4 py-2'>Total Price</th>
            <th className='border border-gray-300 px-4 py-2'>Created At</th>
          </tr>
        </thead>
        <tbody>
          {orderHistory.map((order) => (
            <tr key={order.id} className='hover:bg-gray-100'>
              <td className='border border-gray-300 px-4 py-2'>{order.OrderStatus}</td>
              <td className='border border-gray-300 px-4 py-2'>{order.TableNumber}</td>
              <td className='border border-gray-300 px-4 py-2'>
                <ul>
                  {order.OrderItems.map((item) => (
                    <li key={item.id}>{item.Item.name}</li>
                  ))}
                </ul>
              </td>
              <td className='border border-gray-300 px-4 py-2'>
                <ul>
                  {order.OrderItems.map((item) => (
                    <li key={item.id}>{item.quantity}</li>
                  ))}
                </ul>
              </td>
              <td className='border border-gray-300 px-4 py-2'>
                <ul>
                  {order.OrderItems.map((item) => (
                    <li key={item.id}>${item.Item.price.toFixed(2)}</li>
                  ))}
                </ul>
              </td>
              <td className='border border-gray-300 px-4 py-2'>
                ${order.OrderItems.reduce((total, item) => total + item.quantity * item.Item.price, 0).toFixed(2)}
              </td>
              <td className='border border-gray-300 px-4 py-2'>{formatDate(order.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
