import React, { useState } from "react"; // Import the useEffect and useState hooks from the react library
import Modal from "react-modal"; // Import the Modal component from the react-modal library

Modal.setAppElement('#root'); // Set the app element for the Modal component

const Expenses = ({ expenses, setExpenses, search }) => {
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
            const res = await fetch(`${process.env.REACT_APP_API_URL}/add-expense`,
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
            const res = await fetch(`${process.env.REACT_APP_API_URL}/edit-expense/${e._id}`,
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
            const res = await fetch(`${process.env.REACT_APP_API_URL}/delete-expense/${e._id}`,
                {
                    method: 'DELETE',
                    credentials: 'include'
                });

            if (res.ok) {
                const data = await res.json();
                data.error ? alert(data.message) : setExpenses(expenses.filter(expense => expense._id !== e._id));
            }

            closeModal();
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
                    className="px-4 py-2 rounded-full border-none outline-none bg-[#1C1C1C] text-[#F6F6F6] focus:shadow-lg hover:shadow-lg focus:bg-[#2C2C2C] hover:bg-[#2C2C2C] transition-all duration-300 ease-in-out"
                    type="text"
                    name="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                />
                {/* Input field to enter the amount */}
                <input
                    className="appearance-none px-4 py-2 rounded-full border-none outline-none bg-[#1C1C1C] text-[#F6F6F6] focus:shadow-lg hover:shadow-lg focus:bg-[#2C2C2C] hover:bg-[#2C2C2C] transition-all duration-300 ease-in-out"
                    type="number"
                    name="amount"
                    value={amount}
                    onChange={e => setAmount(Math.abs(e.target.value))}
                    placeholder="Amount"
                    required
                />
                {/* Select category from the dropdown */}
                <select
                    className="appearance-none px-4 py-2 rounded-full border-none outline-none bg-[#1C1C1C] text-[#F6F6F6] focus:shadow-lg hover:shadow-lg focus:bg-[#2C2C2C] hover:bg-[#2C2C2C] transition-all duration-300 ease-in-out"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    required>
                    <option value="">Select Category...</option>
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

                <div
                    className="flex gap-4">
                    {!addExpenseModalIsOpen && (<button
                        className="w-full text-[#F6F6F6] font-medium opacity-50 hover:opacity-100 hover:underline underline-offset-[6px] transition-all duration-300 ease-in-out"
                        onClick={() => deleteExpense(selectedExpense)}>
                        Delete
                    </button>)}
                    {/* Submit button */}
                    <input
                        className="w-full p-2 bg-[#E35933] text-[#F6F6F6] font-medium rounded-full cursor-pointer border-none outline-none hover:bg-[#F6F6F6] hover:text-[#E35933] transition-all duration-300 ease-in-out"
                        type="submit"
                        value={addExpenseModalIsOpen ? "Add Expense" : "Edit"}
                    />
                </div>
            </>
        );
    }

    return (
        <div
            className="w-full h-full flex flex-col gap-4">
            <div
                className="flex justify-between items-center">
                <h1
                    className="text-xl font-semibold">
                    Expenses
                </h1>

                {/* Add expense button */}
                <button
                    className="bg-[#E35933] text-[#F6F6F6] font-medium text-sm md:text-md px-4 py-2 rounded-full cursor-pointerr border-none outline-none hover:bg-[#F6F6F6] hover:text-[#E35933] transition-all duration-300 ease-in-out"
                    onClick={handleAddExpenseClick}>
                    Add Expense
                </button>
            </div>
            <div
                className="flex-1 overflow-auto scrollbar-none">
                {/* Display expenses */}
                {search === '' ? expenses.map(expense => (
                    <div
                        className="flex justify-between items-center gap-6 my-4"
                        key={expense._id}>
                        <div
                            className="flex-1 flex gap-4 justify-between cursor-pointer"
                            onClick={() => handleEditExpenseClick(expense)}>
                            <p className="flex-[2_1_100%] truncate">{expense.title}</p> {/* Expense title */}
                            <p className="flex-[2_1_100%] truncate">{expense.category}</p> {/* Expense category */}
                            <p className="flex-[1_1_50%] text-right">${expense.amount}</p> {/* Expense amount */}
                        </div>
                    </div>
                )) : (
                    expenses.filter(expense => expense.title.toLowerCase().includes(search.toLowerCase())).map(expense => (
                        <div
                            className="flex justify-between items-center gap-6 my-4"
                            key={expense._id}>
                            <div
                                className="flex-1 flex gap-4 justify-between cursor-pointer"
                                onClick={() => handleEditExpenseClick(expense)}>
                                <p className="flex-[2_1_100%] truncate">{expense.title}</p> {/* Expense title */}
                                <p className="flex-[2_1_100%] truncate">{expense.category}</p> {/* Expense category */}
                                <p className="flex-[1_1_50%] text-right">${expense.amount}</p> {/* Expense amount */}
                            </div>
                        </div>
                    ))
                )}

                {/* Modal to add/edit expense */}
                <Modal
                    className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 px-4 py-12 sm:p-16 rounded-xl bg-[#0F0F0F] outline-[#F6F6F6] border-2"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Expense Modal">
                    {addExpenseModalIsOpen ? (
                        // If user clicks on add expense
                        <form
                            className="flex flex-col gap-4"
                            onSubmit={addExpense}
                            method="POST">
                            {expenseForm()}
                        </form>
                    ) : (
                        // If user clicks on edit expense
                        <form
                            className="flex flex-col gap-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                editExpense(selectedExpense);
                            }}>
                            {expenseForm()}
                        </form>
                    )}

                    {/* Close modal button */}
                    <button
                        className="absolute top-1 sm:top-4 right-1 sm:right-4 text-[#F6F6F6] p-1 cursor-pointer"
                        onClick={closeModal}>
                        <svg
                            className="w-6 h-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </Modal>
            </div>
        </div>
    )
}

export default Expenses;