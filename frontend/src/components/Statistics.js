import React, { useState } from 'react'
import ExpensesChart from './ExpensesChart'
import IncomeChart from './IncomeChart'

const Statistics = ({ expensesData, incomeData }) => {
    const [expensesChart, setExpensesChart] = useState(true);

    const toggleExpensesChart = () => {
        setExpensesChart(!expensesChart);
    }

    return (
        <div
            className='w-full h-full flex flex-col gap-4'>
            <div
                className='flex justify-between items-center'>
                <h1 className='text-xl font-semibold'>{expensesChart ? 'Expense' : 'Income'} Statistics</h1>
                <button
                    className={`text-sm md:text-md hover:underline underline-offset-[6px] transition-all duration-300 ease-in-out ${expensesChart ? 'text-[#5C8D7B]' : 'text-[#E35933]'}`}
                    onClick={toggleExpensesChart}>
                    {expensesChart ? 'Go to Income Statistics' : 'Go to Expense Statistics'}
                </button>
            </div>
            <div
                className='flex-1 overflow-auto scrollbar-none'>
                {expensesChart ? <ExpensesChart expensesData={expensesData} /> : <IncomeChart incomeData={incomeData} />}
            </div>
        </div>
    )
}

export default Statistics