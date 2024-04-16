import React from 'react'
import { useNavigate } from 'react-router-dom';
import logout from '../utils/logout';

const Navbar = () => {
    const navigate = useNavigate(); // useNavigate hook to navigate to different routes

    // Logout user
    const handleLogout = () => {
        const logoutData = logout();
        logoutData.error ? alert(logoutData.message) : navigate('/login'); // If error, alert the message, else navigate to login
    }

    return (
        <div
            className='h-full py-4 px-6 bg-slate-400'>
            <div>
                <p>Hey,</p>
                <p>Suvid</p>
            </div>
            <div>
                <p>DashBoard</p>
                <p>Profile</p>
            </div>
            <button onClick={handleLogout}>Logout</button> {/* Logout button */}
        </div>
    )
}

export default Navbar