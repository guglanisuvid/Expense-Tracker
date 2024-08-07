import React from 'react'

const Overview = ({ totalExpenses, totalIncome }) => {
    return (
        // Overview component
        <div
            className='w-full h-full flex flex-col gap-4'>
            <div
                className='flex justify-between items-center'>
                <h1 className='text-xl font-semibold mx-0 sm:mx-auto lg:mx-0'>Overview</h1> {/* Overview title */}
                <p className='inline sm:hidden lg:inline text-sm cursor-pointer hover:underline underline-offset-[6px] transition-all duration-300 ease-in-out' onClick={() => window.location.reload()}>Refresh Page</p>
            </div>

            {/* Display total expenses, total income, and total savings */}
            <div
                className='flex-1 flex flex-row sm:flex-col lg:flex-row justify-between items-center text-center overflow-auto scrollbar-none'>
                <div>
                    <p className='text-lg font-medium text-[#5C8D7B]'>${totalIncome}</p>
                    <p className='text-sm md:text-md'>Total Income</p>
                </div>
                <div>
                    <p className='text-lg font-medium text-[#E35933]'>${totalExpenses}</p>
                    <p className='text-sm md:text-md'>Total Expenses</p>
                </div>
                <div>
                    <p className='text-lg font-medium'>{totalIncome - totalExpenses < 0 ? '-' : ''}${Math.abs(totalIncome - totalExpenses)}</p>
                    <p className='text-sm md:text-md'>Total Savings</p>
                </div>
            </div>
        </div>
    )
}

export default Overview