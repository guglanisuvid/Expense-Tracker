import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div
            className='absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 flex flex-col gap-4 text-center'>
            <h1 className='text-3xl font-semibold'>Not Found</h1> {/* Heading */}

            {/* SVG icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-40 w-40 mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5" />
            </svg>

            <Link className="font-medium hover:text-[#E35933] hover:underline underline-offset-[6px] transition-all duration-300 ease-in-out" to="/login">Go Home</Link> {/* Link to Login component */}
        </div>
    );
}

export default NotFound