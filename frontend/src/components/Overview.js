import React from 'react'

const Overview = ({ totalExpenses, totalIncome }) => {
    return (
        // Overview component
        <div
            className='w-full h-full flex flex-col'>
            <h1 className='text-2xl font-bold mb-4'>Overview</h1> {/* Overview title */}
            <hr />
            {/* Display total expenses, total income, and total savings */}
            <div
                className='flex-1 flex justify-between items-center text-center'>
                <div>
                    <p className='text-xl font-bold'>${totalExpenses}</p>
                    <p>Total Expenses</p>
                </div>
                <div>
                    <p className='text-xl font-bold'>${totalIncome}</p>
                    <p>Total Income</p>
                </div>
                <div>
                    <p className='text-xl font-bold'>{totalIncome - totalExpenses < 0 ? '-$' : '$'}{Math.abs(totalIncome - totalExpenses)}</p>
                    <p>Total Savings</p>
                </div>
            </div>
        </div>
    )
}

export default Overview