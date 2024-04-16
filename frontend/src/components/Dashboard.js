import React, { useEffect, useState } from "react"; // Import the useEffect and useState hooks from the react library
import { useNavigate } from "react-router-dom"; // Import the Link and useNavigate components from the react-router-dom library
import Navbar from "./Navbar";
import Header from "./Header";
import Expenses from "./Expenses";
import Income from "./Income";
import Overview from "./Overview";
import Statistics from "./Statistics";

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [income, setIncome] = useState([]);

    const navigate = useNavigate();

    // Check if user is authenticated
    useEffect(() => {
        const isAuthenticated = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/is-authenticated',
                    {
                        credentials: 'include'
                    });
                if (res.ok) {
                    const data = await res.json();
                    setExpenses(data?.user?.expenses);
                    setIncome(data?.user?.income);
                    data.user ? navigate('/dashboard') : navigate('/login'); // If user is authenticated, navigate to dashboard page, else navigate to login page
                }
            } catch (err) {
                console.error(err);
            }
        };

        isAuthenticated();
    }, [navigate]);

    return (
        // Dashboard component
        <div
            className="w-full h-full flex">
            <Navbar /> {/* Navbar component */}
            <div
                className="h-full flex-1 flex flex-col">
                <Header /> {/* Header component */}
                <div
                    className="w-full flex-1 grid gap-4 grid-rows-6 grid-cols-6 px-6 py-4 overflow-hidden">
                    <div
                        className="row-span-2 col-span-3 p-4 rounded-xl border-2">
                        <Overview totalExpenses={expenses.reduce((acc, expense) => acc + expense.amount, 0)} totalIncome={income.reduce((acc, inc) => acc + inc.amount, 0)} /> {/* Overview component */}
                    </div>
                    <div
                        className="row-span-3 col-span-3 p-4 rounded-xl border-2">
                        <Expenses expenses={expenses} setExpenses={setExpenses} /> {/* Expenses component */}
                    </div>
                    <div
                        className="row-span-4 col-span-3 p-4 rounded-xl border-2">
                        <Statistics expensesData={expenses} incomeData={income} />
                    </div>
                    <div
                        className="row-span-3 col-span-3 p-4 rounded-xl border-2">
                        <Income income={income} setIncome={setIncome} /> {/* Income component */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;