import React from 'react'
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const IncomeChart = ({ incomeData }) => {
    let data = incomeData.map(income => ({
        category: income.category,
        amount: income.amount
    }));

    data = data.reduce((acc, cur) => {
        if (acc[cur.category]) {
            acc[cur.category] += cur.amount;
        } else {
            acc[cur.category] = cur.amount;
        }
        return acc;
    }, {});

    data = Object.keys(data).map(category => ({
        category,
        amount: data[category],
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 16, right: 32 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" activeBar={<Rectangle fill="#555194" />} maxBarSize={100} />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default IncomeChart