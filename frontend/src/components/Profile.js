import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/is-authenticated');
                const data = await res.json();
                if (data.error === true) {
                    console.log(data.message);
                    navigate('/login');
                }
            } catch (err) {
                console.error(err);
            }
        };

        isAuthenticated();
    }, []);

    const handleLogout = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/logout');
            const data = await res.json();
            console.log(data);
            if (data.error === false) {
                navigate('/login');
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <h1>WELCOME TO PROFILE</h1>
            <Link to="/add-expense">Add Expense</Link>
            <button onClick={handleLogout} >Logout</button>
        </div>
    )

    // <div>Profile Page</div>
}

export default Profile;