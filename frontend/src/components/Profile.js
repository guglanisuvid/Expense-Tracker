import React from 'react'
import Modal from "react-modal"; // Import the Modal component from the react-modal library

Modal.setAppElement('#root'); // Set the app element for the Modal component

const Profile = ({ user, isModalOpen, setIsModalOpen }) => {

    return (
        <Modal
            className="w-[90%] sm:w-4/5 max-w-[600px] absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 px-4 py-8 sm:p-12 md:p-16 rounded-xl bg-[#0F0F0F] outline-[#F6F6F6] border-2"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Profile Modal">

            <div className='flex flex-col gap-6 text-[#F6F6F6]'>
                <p
                    className='text-2xl md:text-3xl font-semibold text-center'>
                    PROFILE
                </p>
                <img
                    className='w-12 sm:w-16 h-12 sm:h-16 rounded-full mx-auto bg-slate-300'
                    src=''
                    alt=''
                />
                <p className='flex justify-between gap-1 sm:gap-2 md:gap-4 text-sm sm:text-md md:text-lg whitespace-nowrap'>
                    <span className=' flex-[2_2_100%] text-left font-medium'>Username</span>
                    <span className=' flex-[1_3_50%] text-center font-medium'>:</span>
                    <span className=' flex-[2_2_100%] text-right font-normal'>@{user?.username}</span>
                </p>
                <p className='flex justify-between gap-1 sm:gap-2 md:gap-4 text-sm sm:text-md md:text-lg whitespace-nowrap'>
                    <span className='flex-[2_2_100%] text-left font-medium'>Email</span>
                    <span className='flex-[1_3_50%] text-center font-medium'>:</span>
                    <span className='flex-[2_2_100%] text-right font-normal'>{user?.email}</span>
                </p>
            </div>

            {/* Close modal button */}
            <button
                className="absolute top-1 sm:top-4 right-1 sm:right-4 text-[#F6F6F6] p-1 cursor-pointer"
                onClick={() => setIsModalOpen(false)}>
                <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </Modal>
    );
}

export default Profile