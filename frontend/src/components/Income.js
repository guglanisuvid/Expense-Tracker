import React, { useState } from "react"; // Import the useEffect and useState hooks from the react library
import Modal from "react-modal"; // Import the Modal component from the react-modal library

Modal.setAppElement('#root'); // Set the app element for the Modal component

const Income = ({ income, setIncome }) => {
    const [addIncomeModalIsOpen, setAddIncomeModalIsOpen] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');

    // Add new income
    const addIncome = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            const res = await fetch('http://localhost:5000/api/add-income',
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
                data.error ? alert(data.message) : setIncome([data.income, ...income]);
            }

            closeModal();
        } catch (err) {
            console.error(err);
        }
    }

    // Edit income
    const editIncome = async (i) => {
        try {
            const res = await fetch(`http://localhost:5000/api/edit-income/${i._id}`,
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
                data.error ? alert(data.message) : setIncome(income.map(inc => inc._id === i._id ? { ...inc, title, amount, category } : inc));
            }

            closeModal();
        } catch (err) {
            console.error(err);
        }
    }

    // Delete income
    const deleteIncome = async (i) => {
        try {
            const res = await fetch(`http://localhost:5000/api/delete-income/${i._id}`,
                {
                    method: 'DELETE',
                    credentials: 'include'
                });
            if (res.ok) {
                const data = await res.json();
                data.error ? alert(data.message) : setIncome(income.filter(inc => inc._id !== i._id));
            }
        } catch (err) {
            console.error(err);
        }
    }

    // If user clicks on add income
    const handleAddIncomeClick = () => {
        setAddIncomeModalIsOpen(true);
        setTitle('');
        setAmount('');
        setCategory('');
        setModalIsOpen(true);
    };

    // If user clicks on edit income
    const handleEditIncomeClick = (income) => {
        if (addIncomeModalIsOpen) {
            setAddIncomeModalIsOpen(false);
        }
        setSelectedIncome(income);
        setTitle(income.title);
        setAmount(income.amount);
        setCategory(income.category);
        setModalIsOpen(true);
    }

    // Close the modal
    const closeModal = () => {
        if (addIncomeModalIsOpen) {
            setAddIncomeModalIsOpen(false);
        }
        setModalIsOpen(false);
    }

    // Income form
    const incomeForm = () => {
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
                    <option value="Salary">Salary</option>
                    <option value="Business">Business</option>
                    <option value="Investments">Investments</option>
                    <option value="Rentals">Rentals</option>
                    <option value="Benefits/Insurance">Benefits/Insurance</option>
                    <option value="Miscellaneous">Miscellaneous</option>

                </select>
                {/* Submit button to add/edit income */}
                <input
                    type="submit"
                    value={addIncomeModalIsOpen ? "Add Income" : "Edit Income"}
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
                    Income
                </h1>
                {/* Add income button */}
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
                    onClick={handleAddIncomeClick}>
                    Add Income
                </button>
            </div>
            <hr />
            <div
                className="flex-1 overflow-auto">
                {/* Display income */}
                {income.map(inc => (
                    <div
                        className="flex justify-between items-center gap-6 my-4"
                        key={inc._id}>
                        <div
                            className="flex-1 flex justify-between cursor-pointer"
                            onClick={() => handleEditIncomeClick(inc)}>
                            <p>{inc.title}</p> {/* Income title */}
                            <p>{inc.category}</p> {/* Income category */}
                            <p>{inc.amount}</p> {/* Income amount */}
                        </div>
                        {/* Delete income button */}
                        <button
                            className="bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer"
                            onClick={() => deleteIncome(inc)}>
                            Delete
                        </button>
                    </div>
                ))}

                <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Expense Modal">
                    {addIncomeModalIsOpen ? (
                        <form onSubmit={addIncome} method="POST">
                            {incomeForm()}
                        </form>
                    ) : (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            editIncome(selectedIncome);
                        }}>
                            {incomeForm()}
                        </form>
                    )}
                    <button onClick={closeModal}>Close</button>
                </Modal>
            </div>
        </div>
    )
}

export default Income