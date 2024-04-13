import React, { useState } from 'react'; // Import the useState hook from the react library
import { useNavigate } from 'react-router-dom'; // Import the useNavigate component from the react-router-dom library

const AddExpense = () => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');

    const navigate = useNavigate(); // To navigate to different routes

    // Add expense
    const addExpense = async (e) => {
        e.preventDefault(); // Prevent default form submission

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
                data.error ? alert(data.message) : navigate('/profile'); // If error, alert the message, else navigate to profile
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            {/* Form to add expense */}
            <form onSubmit={addExpense} method='POST'>
                {/* Input field to enter the title */}
                <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Title"
                />
                {/* Input field to enter the amount */}
                <input
                    type="number"
                    name="amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Amount"
                />
                {/* Select category from the dropdown */}
                <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    <option value="Academic">Academic</option>
                    <option value="Housing">Housing</option>
                    <option value="Food and Groceries">Food and Groceries</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                </select>
                {/* Submit button to add expense */}
                <input
                    type="submit"
                    value="Add Expense"
                />
            </form>
        </div>
    )
}

export default AddExpense;