const Header = ({ search, setSearch }) => {
    return (
        <div
            className='relative flex flex-col sm:flex-row justify-between items-center gap-6'>
            {/* Header component */}
            <h1
                className='text-2xl font-semibold'>
                DASHBOARD
            </h1>
            <div
                className="flex items-center gap-6">
                <p className='hidden md:inline lg:hidden text-sm cursor-pointer hover:underline underline-offset-[6px] transition-all duration-300 ease-in-out' onClick={() => window.location.reload()}>Refresh Page</p>
                <div
                    className='relative'>
                    <svg
                        className="absolute w-6 h-6 -translate-y-1/2 top-1/2 left-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input
                        className='py-2 pl-10 pr-4 rounded-full bg-[#1C1C1C] border-none outline-none text-[#F6F6F6] focus:shadow-lg hover:bg-[#2C2C2C] focus:bg-[#2C2C2C] transition-all duration-300 ease-in-out hover:shadow-lg'
                        type='text'
                        name='search'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search Transactions..."
                    />
                </div>
            </div>
        </div>
    );
}

export default Header;