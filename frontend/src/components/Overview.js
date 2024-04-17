import React from 'react'

const Overview = ({ totalExpenses, totalIncome }) => {
    return (
        // Overview component
        <div
            className='w-full h-full flex flex-col gap-4'>
            <div
                className='flex justify-between items-center'>
                <h1 className='text-2xl font-semibold'>Overview</h1> {/* Overview title */}
                <p className='text-sm cursor-pointer hover:underline underline-offset-[6px] transition-all duration-300 ease-in-out' onClick={() => window.location.reload()}>Refresh</p>
            </div>
            {/* Display total expenses, total income, and total savings */}
            <div
                className='flex-1 flex justify-between items-center text-center'>
                <div>
                    <p className='text-xl font-medium text-[#5C8D7B]'>${totalIncome}</p>
                    <p>Total Income</p>
                </div>
                <div>
                    <p className='text-xl font-medium text-[#E35933]'>${totalExpenses}</p>
                    <p>Total Expenses</p>
                </div>
                <div>
                    <p className='text-xl font-medium'>{totalIncome - totalExpenses < 0 ? '-' : ''}${Math.abs(totalIncome - totalExpenses)}</p>
                    <p>Total Savings</p>
                </div>
            </div>
        </div>
    )
}

export default Overview