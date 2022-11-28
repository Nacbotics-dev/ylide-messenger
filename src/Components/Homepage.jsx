import React from 'react';
import { Link } from 'react-router-dom';

function Homepage(props) {
    return (
        <div className='w-full min-h-screen p-10 home-bg-image'>
            
            <div className='flex flex-wrap items-center justify-center mt-28'>
                <div className='flex flex-col w-full max-w-xl'>
                    <div className='text-center lg:text-left'>
                        <h1 className='text-3xl font-bold text-black md:text-4xl'>Ylide Messenger</h1>
                        <h5 className='text-base font-medium'>Send a messages across various blockchains anonymously and </h5>
                    </div>
                    <div className='flex flex-wrap justify-center w-full gap-5 my-10 lg:justify-start'>
                        <Link to={"/sign-up"}>
                            <button className='bg-[#202020] hover:bg-[#3a3939] hover:border-[#3a3939] border-2 border-[#202020] p-5 max-w-[250px] w-full h-16 rounded-full text-white text-base font-medium'>Create new account</button>
                        </Link>
                        <Link to={"/sign-in"}>
                            <button className='bg-transparent border-2 border-[#202020] hover:border-[#3a3939] p-5 max-w-[250px] w-full h-16 rounded-full text-base font-medium'>Login to Messenger</button>
                        </Link>
                        
                        
                    </div>
                </div>

                <div className='w-full h-full max-w-sm '>
                    <img className='w-full h-full' src="/Images/home_image1.svg" alt="" />
                </div>
            </div>

            <div className='w-full mt-20'>
                 <h2 className='text-2xl font-bold text-center'>Built with</h2>

                 <div className='flex flex-wrap justify-center w-full gap-10 mx-auto mt-10 md:w-1/2'>

                    <div className='w-40 h-full md:w-56'>
                        <img className='w-full h-full' src="https://ylide.io/images/logo-medium-p-500.png" alt="" />
                    </div>

                    <div className='w-40 h-full md:w-56'>
                        <img className='w-full h-full' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K" alt="" />
                    </div>
                 </div>
            </div>
            
        </div>
    ); 
}

export default Homepage;