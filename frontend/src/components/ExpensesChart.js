import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ExpensesChart = ({ expensesData }) => {
    let data = expensesData.map(expense => ({
        category: expense?.category,
        amount: expense?.amount
    }));

    data = data.reduce((acc, cur) => {
        if (acc[cur?.category]) {
            acc[cur?.category] += cur?.amount;
        } else {
            acc[cur?.category] = cur?.amount;
        }
        return acc;
    }, {});

    data = Object.keys(data).map(category => ({
        category,
        amount: data[category],
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active) {
            return (
                <div className="custom-tooltip flex flex-col gap-4 p-4 bg-[#0F0F0F] text-[#F6F6F6] rounded-xl">
                    <p className="label text-center font-medium text-[#E35933]">{`${label}`}</p>
                    <p className="label">{`Amount : ${payload[0]?.value}`}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <ResponsiveContainer className='flex justify-between items-center' width="100%">
            <BarChart data={data} margin={{ top: 16, right: 32 }}>
                <XAxis dataKey="category" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="#E35933" radius={[8, 8, 0, 0]} maxBarSize={100} />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default ExpensesChart;