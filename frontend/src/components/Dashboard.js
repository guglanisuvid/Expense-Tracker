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
                const res = await fetch(`${process.env.REACT_APP_API_URL}/is-authenticated`,
                    {
                        method: 'GET',
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
            className="w-full h-full flex flex-col lg:flex-row lg:gap-6 gap-4 overflow-auto md:overflow-hidden scrollbar-none">
            {/* className="w-full h-full flex flex-col lg:flex-row lg:gap-6 gap-4"> */}
            <Navbar user={user} /> {/* Navbar component */}
            <div
                className="h-[160dvh] sm:h-[140dvh] md:h-full flex-1 flex flex-col gap-4 md:overflow-hidden scrollbar-none">
                {/* className="h-full flex-1 flex flex-col gap-4"> */}
                <Header search={search} setSearch={setSearch} /> {/* Header component */}
                <div
                    className="w-full flex-1 grid gap-4 grid-rows-11 sm:grid-rows-9 md:grid-rows-6 grid-cols-4 lg:grid-cols-6 overflow-hidden">
                    {/* className="w-full flex-1 grid gap-4 grid-rows-11 sm:grid-rows-9 md:grid-rows-6 grid-cols-4 lg:grid-cols-6 overflow-hidden"> */}
                    <div
                        className="row-span-2 sm:row-span-3 lg:row-span-2 col-span-4 sm:col-span-1 lg:col-span-3 bg-[#1C1C1C] p-4 rounded-2xl order-1 sm:order-3 md:order-1">
                        <Overview totalExpenses={expenses.reduce((acc, expense) => (acc + expense?.amount), 0)} totalIncome={(income.reduce((acc, inc) => (acc + inc?.amount), 0))} /> {/* Overview component */}
                    </div>
                    <div
                        className="row-span-3 col-span-4 md:col-span-2 lg:col-span-3 bg-[#1C1C1C] p-4 rounded-2xl order-2 sm:order-1 md:order-3 lg:order-2">
                        <Expenses expenses={expenses} setExpenses={setExpenses} search={search} /> {/* Expenses component */}
                    </div>
                    <div
                        className="row-span-3 lg:row-span-4 col-span-4 sm:col-span-3 bg-[#1C1C1C] p-4 rounded-2xl order-4 md:order-2 lg:order-3">
                        <Statistics expensesData={expenses} incomeData={income} /> {/* Statistics component */}
                    </div>
                    <div
                        className="row-span-3 col-span-4 md:col-span-2 lg:col-span-3 bg-[#1C1C1C] p-4 rounded-2xl order-3 sm:order-2 md:order-4">
                        <Income income={income} setIncome={setIncome} search={search} /> {/* Income component */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;