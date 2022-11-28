import React from 'react';

function EmptyChat(props) {
    return (
        <div className='h-full w-full bg-white p-10'>
            
            <div className='mt-[100px]'>
                <div className='w-full max-w-xs  min-h-[11rem] mx-auto'>
                    <img className='w-full h-full' src="/Images/MessengerIllus.svg" alt="" />
                </div>

                <div>
                    <h2 className='font-semibold text-2xl text-center text-[#A3FDDA]'>Ylide Messenger</h2>
                    <h5 className='text-base text-gray-500 text-center'>Send and receive messages across different <br/> blockchains with just your wallet</h5>
                </div>
            </div>
        </div>
    );
}

export default EmptyChat;