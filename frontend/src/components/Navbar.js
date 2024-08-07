import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logout from '../utils/logout';
import Profile from './Profile';

const Navbar = ({ user }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate(); // useNavigate hook to navigate to different routes

    // Logout user
    const handleLogout = () => {
        const logoutData = logout();
        logoutData.error ? alert(logoutData.message) : navigate('/login'); // If error, alert the message, else navigate to login
    };

    const handleProfileClick = () => {
        setIsModalOpen(true);
    };

    const handleDashboardClick = () => {
        setIsModalOpen(false);
    };

    return (
        <div
            className='lg:h-full md:relative flex flex-col sm:flex-row items-center flex-wrap md:flex-nowrap lg:flex-col gap-6 justify-between lg:justify-around p-4 lg:p-6 bg-[#1C1C1C] rounded-2xl'>
            {/* User profile */}
            <div
                className='lg:flex-none flex md:flex-row lg:flex-col items-center gap-2 order-1'>
                <img
                    className='w-8 lg:w-12 h-8 lg:h-12 rounded-full mx-auto bg-slate-300'
                    src=''
                    alt='' />
                <p className='text-xl font-semibold text-center'>@{user?.username}</p>
            </div>

            <p className='hidden sm:inline md:hidden text-sm cursor-pointer hover:underline underline-offset-[6px] transition-all duration-300 ease-in-out order-2' onClick={() => window.location.reload()}>Refresh Page</p>

            {/* Dashboard and Profile buttons */}
            <div
                className='w-full md:w-auto lg:flex-none flex md:flex-row lg:flex-col justify-evenly gap-12 lg:gap-6 md:items-center lg:items-start order-4 md:order-3'>
                <button
                    className={`uppercase font-medium hover:underline underline-offset-[6px] transition-all duration-300 ease-in-out ${isModalOpen ? 'opacity-50' : 'opacity-100'}`}
                    onClick={handleDashboardClick}
                >
                    Dashboard
                </button>
                <button
                    className={`uppercase font-medium hover:underline underline-offset-[6px] transition-all duration-300 ease-in-out ${isModalOpen ? 'opacity-100' : 'opacity-50'}`}
                    onClick={handleProfileClick}
                >
                    Profile
                </button>
            </div>

            {/* Logout button */}
            <button
                className='lg:flex-none lg:w-full bg-[#F6F6F6] text-[#0F0F0F] font-medium px-8 py-2 rounded-full cursor-pointer border-none outline-none hover:text-[#F6F6F6] hover:bg-[#0F0F0F] transition-all duration-300 ease-in-out order-3 md:order-4'
                onClick={handleLogout}>
                SIGN OUT
            </button>

            {isModalOpen && <Profile user={user} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
        </div >
    );
}

export default Navbar