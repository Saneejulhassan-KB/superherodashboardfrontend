import React, { useEffect, useState } from 'react';
import { auth, provider } from '../Components/googleSignin/config';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import SuperheroDashboard from './SuperheroDashboard';

const AdminLogin = () => {
    const [value, setValue] = useState('');
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        signInWithPopup(auth, provider).then((data) => {
            setValue(data.user.email);
            localStorage.setItem('email', data.user.email);

            // Navigate to dashboard after login
            navigate('/dashboard');
        }).catch((error) => {
            console.error("Login failed: ", error);
        });
    };

    useEffect(() => {
        setValue(localStorage.getItem("email"));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-700">
            {value ? (
                // Load the SuperheroDashboard component
                <SuperheroDashboard />
            ) : (
                // Only apply centering when on the login screen
                <div className="flex items-center justify-center h-screen">
                    <div className="max-w-md w-full space-y-8 p-10 bg-gray-800 rounded-xl shadow-lg">
                        <h2 className="text-center text-3xl font-extrabold text-white">
                            Admin Login
                        </h2>
                        <div className="flex justify-center">
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Sign in with Google
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLogin;