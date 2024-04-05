import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();

    const isAuthenticated = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/is-authenticated');
            const data = await res.json();
            data.isAuthenticated ? console.log('User is authenticated') : console.log('User is not authenticated');
            data.isAuthenticated ? navigate('/profile') : navigate('/login');
        } catch (error) {
            console.error('An error occurred', error);
        }
    };

    useEffect(() => {
        isAuthenticated();
    }, []);

    return (
        <div>
            <h1>WELCOME TO PROFILE</h1>
            <Link to="/add-expense">Add Expense</Link>
        </div>
    )

    // <div>Profile Page</div>
}

export default Profile;