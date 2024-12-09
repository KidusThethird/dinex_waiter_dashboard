'use client';
import React, { useEffect, useState } from 'react';
import { setAccessToken, getAccessToken, clearAccessToken } from "../../lib/tokenManager";
import { apiUrl } from '@/apiConfig';

interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  type: string;
  status: string;
  email: string;
  password: string;
  phoneNumber: string;
  deleted: boolean;
  createdAt: string;
}

const accessToken = getAccessToken();

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null); // State for profile data
  const [error, setError] = useState<string | null>(null); // State for error handling

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!accessToken) {
          setError('Waiter is not logged in');
          return;
        }

        const response = await fetch(`${apiUrl}/login_waiter/profile`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 403) {
          setError('Waiter is not logged in');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data: Profile = await response.json();
        setProfile(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-3xl font-bold text-red-600 mb-6">{error}</h1>
        <button
          onClick={() => (window.location.href = '/')}
          className="px-6 py-3 bg-primaryColor text-white rounded-lg hover:bg-blue-600 transition"
        >
          Log In
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <h1 className="text-xl font-bold text-primaryColor">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-primaryColor text-center">
          Profile Information
        </h1>
        <div className="space-y-4">
          <p className="text-lg">
            <strong className="text-primaryColor">First Name:</strong> {profile.firstName}
          </p>
          <p className="text-lg">
            <strong className="text-primaryColor">Last Name:</strong> {profile.lastName}
          </p>
          <p className="text-lg">
            <strong className="text-primaryColor">Type:</strong> {profile.type}
          </p>
          <p className="text-lg">
            <strong className="text-primaryColor">Status:</strong> {profile.status}
          </p>
          <p className="text-lg">
            <strong className="text-primaryColor">Email:</strong> {profile.email}
          </p>
          <p className="text-lg">
            <strong className="text-primaryColor">Phone Number:</strong> {profile.phoneNumber}
          </p>
          <p className="text-lg">
            <strong className="text-primaryColor">Created At:</strong> {new Date(profile.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
