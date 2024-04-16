import React, { useState } from "react"; // Import the useEffect and useState hooks from the react library
import Modal from "react-modal"; // Import the Modal component from the react-modal library

Modal.setAppElement('#root'); // Set the app element for the Modal component

const Expenses = ({ expenses, setExpenses }) => {
    const [addExpenseModalIsOpen, setAddExpenseModalIsOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');

    // Add new expense
    const addExpense = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            const res = await fetch('http://localhost:5000/api/add-expense',
                {
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
                }
            );

            if (res.ok) {
                const data = await res.json();
                data.error ? alert(data.message) : setExpenses([data.expense, ...expenses]);
            }

            closeModal();
        } catch (err) {
            console.error(err);
        }
    }

    // Edit expense
    const editExpense = async (e) => {
        try {
            const res = await fetch(`http://localhost:5000/api/edit-expense/${e._id}`,
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
                }
            );

            if (res.ok) {
                const data = await res.json();
                data.error ? alert(data.message) : setExpenses(expenses.map(expense => expense._id === e._id ? { ...expense, title, amount, category } : expense));
            }

            closeModal();
        } catch (err) {
            console.error(err);
        }
    }

    // Delete expense
    const deleteExpense = async (e) => {
        try {
            const res = await fetch(`http://localhost:5000/api/delete-expense/${e._id}`,
                {
                    method: 'DELETE',
                    credentials: 'include'
                });
            if (res.ok) {
                const data = await res.json();
                data.error ? alert(data.message) : setExpenses(expenses.filter(expense => expense._id !== e._id));
            }
        } catch (err) {
            console.error(err);
        }
    }

    // If user clicks on add expense
    const handleAddExpenseClick = () => {
        setAddExpenseModalIsOpen(true);
        setTitle('');
        setAmount('');
        setCategory('');
        setModalIsOpen(true);
    };

    // If user clicks on edit expense
    const handleEditExpenseClick = (expense) => {
        if (addExpenseModalIsOpen) {
            setAddExpenseModalIsOpen(false);
        }
        setSelectedExpense(expense);
        setTitle(expense.title);
        setAmount(expense.amount);
        setCategory(expense.category);
        setModalIsOpen(true);
    }

    // Close the modal
    const closeModal = () => {
        if (addExpenseModalIsOpen) {
            setAddExpenseModalIsOpen(false);
        }
        setModalIsOpen(false);
    }

    // Expense form
    const expenseForm = () => {
        return (
            <>
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
                    <option value="Food/Groceries">Food/Groceries</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Personal">Personal</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                </select>
                {/* Submit button to add/edit expense */}
                <input
                    type="submit"
                    value={addExpenseModalIsOpen ? "Add Expense" : "Edit Expense"}
                />
            </>
        );
    }

    return (
        <div
            className="w-full h-full flex flex-col">
            <div
                className="flex justify-between items-center mb-4">
                <h1
                    className="text-2xl font-bold">
                    Expenses
                </h1>
                {/* Add expense button */}
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
                    onClick={handleAddExpenseClick}>
                    Add Expense
                </button>
            </div>
            <hr />
            <div
                className="flex-1 overflow-auto">
                {/* Display expenses */}
                {expenses.map(expense => (
                    <div
                        className="flex justify-between items-center gap-6 my-4"
                        key={expense._id}>
                        <div
                            className="flex-1 flex justify-between cursor-pointer"
                            onClick={() => handleEditExpenseClick(expense)}>
                            <p>{expense.title}</p> {/* Expense title */}
                            <p>{expense.category}</p> {/* Expense category */}
                            <p>{expense.amount}</p> {/* Expense amount */}
                        </div>
                        {/* Delete expense button */}
                        <button
                            className="bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer"
                            onClick={() => deleteExpense(expense)}>
                            Delete
                        </button>
                    </div>
                ))}

                <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Expense Modal">
                    {addExpenseModalIsOpen ? (
                        <form onSubmit={addExpense} method="POST">
                            {expenseForm()}
                        </form>
                    ) : (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            editExpense(selectedExpense);
                        }}>
                            {expenseForm()}
                        </form>
                    )}
                    <button onClick={closeModal}>Close</button>
                </Modal>
            </div>
        </div>
    )
}

export default Expenses;