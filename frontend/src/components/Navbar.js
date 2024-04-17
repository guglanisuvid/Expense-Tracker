import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logout from '../utils/logout';

const Navbar = ({ username }) => {

    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const navigate = useNavigate(); // useNavigate hook to navigate to different routes

    const handleClick = () => {
        setIsProfileOpen(!isProfileOpen);
    }

    // Logout user
    const handleLogout = () => {
        const logoutData = logout();
        logoutData.error ? alert(logoutData.message) : navigate('/login'); // If error, alert the message, else navigate to login
    }

    return (
        <div
            className='h-full flex flex-col justify-around p-6 bg-[#1C1C1C] rounded-2xl'>
            {/* User profile */}
            <div
                className='flex flex-col gap-2'>
                <img
                    className='w-16 h-16 rounded-full mx-auto bg-slate-300'
                    src=''
                    alt='' />
                <p className='text-2xl font-semibold text-center'>@{username}</p>
            </div>

            {/* Dashboard and Profile buttons */}
            <div
                className='flex flex-col gap-6 items-start'>
                <button
                    className={`uppercase font-medium hover:underline underline-offset-[6px] transition-all duration-300   ease-in-out ${isProfileOpen ? 'opacity-30' : 'opacity-100'}`}
                    onClick={handleClick}
                >
                    Dashboard
                </button>
                <button
                    className={`uppercase font-medium hover:underline underline-offset-[6px] transition-all duration-300 ease-in-out ${isProfileOpen ? 'opacity-100' : 'opacity-30'}`}
                    onClick={handleClick}
                >
                    Profile
                </button>
            </div>

            {/* Logout button */}
            <button
                className='w-full bg-[#F6F6F6] text-[#0F0F0F] font-medium px-4 py-2 rounded-full cursor-pointer border-none outline-none hover:text-[#F6F6F6] hover:bg-[#0F0F0F] transition-all duration-300 ease-in-out'
                onClick={handleLogout}>
                SIGN OUT
            </button>
        </div>
    )
}

export default Navbar