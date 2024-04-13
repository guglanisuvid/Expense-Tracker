import React, { useEffect, useState } from "react"; // Import the useEffect and useState hooks from the react library
import { useNavigate } from "react-router-dom"; // Import the Link and useNavigate components from the react-router-dom library
import Modal from "react-modal"; // Import the Modal component from the react-modal library
import AddExpense from "./AddExpense";

Modal.setAppElement('#root'); // Set the app element for the Modal component

const Profile = () => {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [addExpenseBtnClicked, setAddExpenseBtnClicked] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState();
    const [title, setTitle] = useState();
    const [amount, setAmount] = useState();
    const [category, setCategory] = useState();

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
                    console.log(data);
                    setExpenses(data?.user?.expenses);
                    data.user ? navigate('/profile') : navigate('/login'); // If user is authenticated, navigate to profile page, else navigate to login page
                }
            } catch (err) {
                console.error(err);
            }
        };

        isAuthenticated();
    }, [navigate]);

    // Logout user
    const handleLogout = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/logout',
                {
                    credentials: 'include'
                });
            if (res.ok) {
                const data = await res.json();
                data.error ? alert(data.message) : navigate('/login'); // If error, alert the message, else navigate to login
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Edit expense
    const editExpense = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            const res = await fetch(`http://localhost:5000/api/edit-expense/${selectedExpense._id}`,
                {
                    method: 'PUT',
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
                data.error ? alert(data.message) : setExpenses([...expenses, data.expense]); // If error, alert the message, else add the expense to the expenses
            }
            setModalIsOpen(false);
        } catch (err) {
            console.error(err);
        }
    }

    // Delete expense
    const handleDelete = async (e) => {
        try {
            const res = await fetch(`http://localhost:5000/api/delete-expense/${e._id}`,
                {
                    method: 'DELETE',
                    credentials: 'include'
                });
            if (res.ok) {
                const data = await res.json();

                // NEED TO FIX THIS PART
                data.error ? alert(data.message) : setExpenses(expenses.filter(expense => expense._id !== e._id)); // If error, alert the message, else filter the expenses
            }
        } catch (err) {
            console.error(err);
        }
    }

    // If user clicks on add expense
    const handleAddExpense = () => {
        setAddExpenseBtnClicked(true);
        setModalIsOpen(true);
    };

    // If user clicks on edit expense
    const handleEditExpense = (e) => {
        setSelectedExpense(e);
        setTitle(e.title);
        setAmount(e.amount);
        setCategory(e.category);
        setModalIsOpen(true);
    }

    //  Close modal
    const closeModal = () => {
        setAddExpenseBtnClicked(false);
        setModalIsOpen(false);
    };

    return (
        <div>
            <h1 className="text-center">WELCOME TO PROFILE</h1> {/* Profile heading */}
            <div
                className="flex justify-around">
                <button onClick={handleAddExpense}>Add Expense</button> {/* Add expense button */}
                <button onClick={handleLogout}>Logout</button> {/* Logout button */}
            </div>
            {/* Display expenses */}
            <div>
                {/* Display expenses */}
                {expenses.map(expense => (
                    <div>
                        <div
                            key={expense._id} onClick={() => handleEditExpense(expense)}
                            className="flex justify-between">
                            <h3>{expense.title}</h3> {/* Expense title */}
                            <p>{expense.amount}</p> {/* Expense amount */}
                            <p>{expense.category}</p> {/* Expense category */}
                        </div>
                        <button onClick={() => handleDelete(expense)}>Delete</button> {/* Delete expense button */}
                    </div>
                ))}
            </div>

            {/* Modal to add or edit expense */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Expense Details"
            >
                {/* Add expense or edit expense */}
                {addExpenseBtnClicked ? (
                    <AddExpense closeModal={closeModal} /> // Add expense component
                ) : (
                    // Edit expense form
                    <form onSubmit={editExpense} method='POST'>
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
                )}


                <button onClick={closeModal}>Close</button>
            </Modal>
        </div>
    )
}

export default Profile;