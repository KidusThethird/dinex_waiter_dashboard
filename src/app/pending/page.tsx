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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
  }, [accessToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orderHistory.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(orderHistory.length / itemsPerPage);

  const handlePagination = (pageNumber: number) => setCurrentPage(pageNumber);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className='mt-14 mx-10'>
      <h1 className='text-2xl font-bold mb-4'>Order History</h1>
      <table className='table-auto border-collapse border border-gray-300 w-full'>
        <thead>
          <tr className='bg-primaryColor text-white'>
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
          {currentOrders.map((order) => (
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

      <div className='flex justify-center mt-4'>
        <nav>
          <ul className='flex space-x-2'>
            <li>
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-4 py-2 border rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primaryColor text-white'}`}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }).map((_, index) => (
              <li key={index}>
                <button
                  onClick={() => handlePagination(index + 1)}
                  className={`px-4 py-2 border rounded ${currentPage === index + 1 ? 'bg-primaryColor text-white' : 'bg-white text-gray-700'}`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primaryColor text-white'}`}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
