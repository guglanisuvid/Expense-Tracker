import React, { useEffect, useState } from "react"; // Import the useEffect and useState hooks from the react library
import { useNavigate } from "react-router-dom"; // Import the Link and useNavigate components from the react-router-dom library
import Navbar from "./Navbar";
import Header from "./Header";
import Expenses from "./Expenses";
import Income from "./Income";
import Overview from "./Overview";
import Statistics from "./Statistics";

const Dashboard = () => {
    const [user, setUser] = useState({});
    const [expenses, setExpenses] = useState([]);
    const [income, setIncome] = useState([]);
    const [search, setSearch] = useState('');

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
                    setUser(data?.user);
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
            className="w-full h-full flex gap-6">
            <Navbar username={user.username} /> {/* Navbar component */}
            <div
                className="h-full flex-1 flex flex-col gap-4">
                <Header search={search} setSearch={setSearch} /> {/* Header component */}
                <div
                    className="w-full flex-1 grid gap-4 grid-rows-6 grid-cols-6 overflow-hidden">
                    <div
                        className="row-span-2 col-span-3 bg-[#1C1C1C] p-4 rounded-2xl">
                        <Overview totalExpenses={expenses.reduce((acc, expense) => (acc + expense.amount), 0)} totalIncome={(income.reduce((acc, inc) => (acc + inc.amount), 0))} /> {/* Overview component */}
                    </div>
                    <div
                        className="row-span-3 col-span-3 bg-[#1C1C1C] p-4 rounded-2xl">
                        <Expenses expenses={expenses} setExpenses={setExpenses} search={search} /> {/* Expenses component */}
                    </div>
                    <div
                        className="row-span-4 col-span-3 bg-[#1C1C1C] p-4 rounded-2xl">
                        <Statistics expensesData={expenses} incomeData={income} />
                    </div>
                    <div
                        className="row-span-3 col-span-3 bg-[#1C1C1C] p-4 rounded-2xl">
                        <Income income={income} setIncome={setIncome} search={search} /> {/* Income component */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;