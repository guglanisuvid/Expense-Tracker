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
            className='w-full h-full flex flex-col'>
            <div
                className='flex justify-between items-center mb-4'>
                <h1 className='text-2xl font-bold'>{expensesChart ? 'Expense' : 'Income'} Statistics</h1>
                <button
                    className='px-2 py-1 bg-blue-500 text-white rounded-md'
                    onClick={toggleExpensesChart}>
                    {expensesChart ? 'Go to Income Statistics' : 'Go to Expense Statistics'}
                </button>
            </div>
            <hr />
            <div
                className='flex-1'>
                {expensesChart ? <ExpensesChart expensesData={expensesData} /> : <IncomeChart incomeData={incomeData} />}
            </div>
        </div>
    )
}

export default Statistics