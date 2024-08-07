import React, { useState } from "react"; // Import the useEffect and useState hooks from the react library
import Modal from "react-modal"; // Import the Modal component from the react-modal library

Modal.setAppElement('#root'); // Set the app element for the Modal component

const Income = ({ income, setIncome, search }) => {
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
            const res = await fetch(`${process.env.REACT_APP_API_URL}/add-income`,
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
            const res = await fetch(`${process.env.REACT_APP_API_URL}/edit-income/${i._id}`,
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
            const res = await fetch(`${process.env.REACT_APP_API_URL}/delete-income/${i._id}`,
                {
                    method: 'DELETE',
                    credentials: 'include'
                });

            if (res.ok) {
                const data = await res.json();
                data.error ? alert(data.message) : setIncome(income.filter(inc => inc._id !== i._id));
            }

            closeModal();
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
                    <option value="">Select Category</option>
                    <option value="Salary">Salary</option>
                    <option value="Business">Business</option>
                    <option value="Investments">Investments</option>
                    <option value="Rentals">Rentals</option>
                    <option value="Benefits/Insurance">Benefits/Insurance</option>
                    <option value="Miscellaneous">Miscellaneous</option>

                </select>

                <div
                    className="flex gap-4">
                    {!addIncomeModalIsOpen && (<button
                        className="w-full text-[#F6F6F6] font-medium opacity-50 hover:opacity-100 hover:underline underline-offset-[6px] transition-all duration-300 ease-in-out"
                        onClick={() => deleteIncome(selectedIncome)}>
                        Delete
                    </button>)}
                    {/* Submit button */}
                    <input
                        className="w-full p-2 bg-[#5C8D7B] text-[#F6F6F6] font-medium rounded-full cursor-pointer border-none outline-none hover:bg-[#F6F6F6] hover:text-[#5C8D7B] transition-all duration-300 ease-in-out"
                        type="submit"
                        value={addIncomeModalIsOpen ? "Add Income" : "Edit"}
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
                    Income
                </h1>
                {/* Add income button */}
                <button
                    className="bg-[#5C8D7B] text-[#F6F6F6] font-medium text-sm md:text-md px-4 py-2 rounded-full cursor-pointer border-none outline-none hover:bg-[#F6F6F6] hover:text-[#5C8D7B] transition-all duration-300 ease-in-out"
                    onClick={handleAddIncomeClick}>
                    Add Income
                </button>
            </div>
            <div
                className="flex-1 overflow-auto scrollbar-none">
                {/* Display income */}
                {search === '' ? income.map(inc => (
                    <div
                        className="flex justify-between items-center gap-6 my-4"
                        key={inc._id}>
                        <div
                            className="flex-1 flex gap-4 justify-between cursor-pointer"
                            onClick={() => handleEditIncomeClick(inc)}>
                            <p className="flex-[2_1_100%] truncate">{inc.title}</p> {/* Income title */}
                            <p className="flex-[2_1_100%] truncate">{inc.category}</p> {/* Income category */}
                            <p className="flex-[1_1_50%] truncate text-right">{inc.amount}</p> {/* Income amount */}
                        </div>
                    </div>
                )) : (
                    income.filter(inc => (inc.title.toLowerCase().includes(search.toLowerCase()))).map(inc => (
                        <div
                            className="flex justify-between items-center gap-6 my-4"
                            key={inc._id}>
                            <div
                                className="flex-1 flex justify-between cursor-pointer"
                                onClick={() => handleEditIncomeClick(inc)}>
                                <p className="flex-[2_1_100%] truncate">{inc.title}</p> {/* Income title */}
                                <p className="flex-[2_1_100%] truncate">{inc.category}</p> {/* Income category */}
                                <p className="flex-[1_1_50%] truncate text-right">{inc.amount}</p> {/* Income amount */}
                            </div>
                        </div>
                    ))
                )}

                {/* Modal to add/edit income */}
                <Modal
                    className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 px-4 py-12 sm:p-16 rounded-xl bg-[#0F0F0F] outline-[#F6F6F6] border-2"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Income Modal">
                    {addIncomeModalIsOpen ? (
                        // If user clicks on add income
                        <form
                            className="flex flex-col gap-4"
                            onSubmit={addIncome}
                            method="POST">
                            {incomeForm()}
                        </form>
                    ) : (
                        // If user clicks on edit income
                        <form
                            className="flex flex-col gap-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                editIncome(selectedIncome);
                            }}>
                            {incomeForm()}
                        </form>
                    )}

                    {/* Close the modal */}
                    <button
                        className="absolute top-1 sm:top-4 right-1 sm:right-4 text-[#F6F6F6] p-1 cursor-pointer"
                        onClick={closeModal}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6">
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

export default Income