import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddExpense = () => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');

    const navigate = useNavigate();

    const addExpense = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:5000/api/add-expense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    amount,
                    category
                }),
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                console.log(data);
                data.error ? alert(data.message) : navigate('/profile');
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <form onSubmit={addExpense} method='POST'>
                <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Title"
                />
                <input
                    type="number"
                    name="amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Amount"
                />
                <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    <option value="academic">Academic</option>
                    <option value="housing">Housing</option>
                    <option value="foodGroceries">Food and Groceries</option>
                    <option value="transportation">Transportation</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="personalCare">Personal Care</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="clothing">Clothing</option>
                    <option value="miscellaneous">Miscellaneous</option>
                </select>
                <input
                    type="submit"
                    value="Add Expense"
                />
            </form>
        </div>
    )
}

export default AddExpense;