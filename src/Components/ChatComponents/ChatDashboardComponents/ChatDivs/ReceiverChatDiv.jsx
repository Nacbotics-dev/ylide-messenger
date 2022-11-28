import React from 'react';

function ReceiverChatDiv({key,message}) {
    return (
        <>
            <div key={key} className='flex items-center justify-start w-full my-2'>
                <div className='w-full max-w-xs px-2  py-4 bg-[#cbffe9] rounded-b-2xl rounded-l-2xl break-words'>
                    <h4 className='font-normal text-left text-sm text-black'>{message}</h4>
                </div>
            </div>
        </>
    );
}

export default ReceiverChatDiv;