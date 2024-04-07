import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [action, setAction] = useState('');

    useEffect(() => {
        const isAuthenticated = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/is-authenticated',
                    {
                        credentials: 'include'
                    });
                if (res.ok) {
                    const data = await res.json();
                    console.log(data);
                    setExpenses(data?.user?.expenses);
                    data.user ? navigate('/profile') : navigate('/login');
                }
            } catch (err) {
                console.error(err);
            }
        };

        isAuthenticated();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/logout',
                {
                    credentials: 'include'
                });
            if (res.ok) {
                const data = await res.json();
                data.error ? <p>{data.message}</p> : navigate('/login');
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <h1
                className="text-center">WELCOME TO PROFILE</h1>
            <div
                className="flex justify-around">
                <Link to="/add-expense">Add Expense</Link>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div>
                {expenses.map(expense => (
                    <div
                        key={expense._id}
                        className="flex justify-between">
                        <h3>{expense.title}</h3>
                        <p>{expense.amount}</p>
                        <p>{expense.category}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Profile;