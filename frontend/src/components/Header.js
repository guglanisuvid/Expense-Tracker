import React, { useState } from 'react'

const Header = () => {
    const [search, setSearch] = useState('')

    return (
        <div
            className='flex justify-between items-center bg-slate-500 px-6 py-2'>
            {/* Header component */}
            <h1
                className='text-2xl font-bold'>
                DASHBOARD
            </h1>
            <div
                className='flex gap-2 items-center'>
                <label
                    className='text-lg font-medium'>Search</label>
                <input
                    className='py-2 px-4 rounded-md'
                    type='text'
                    name='search'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
        </div>
    );
}

export default Header;