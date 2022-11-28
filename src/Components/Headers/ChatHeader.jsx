import React,{useContext} from 'react';
import { MessageContext } from '../../Context/MessengerContext';

function ChatHeader(props) {
    const {currentChat,setCurrentChat} = useContext(MessageContext);

    return (
        <div className='h-24 w-full flex bg-[#031224]'>
            <div className='p-2 w-full h-full border-r-2 border-r-[#A4FDDA] md:w-1/2'>
                <div className='flex items-center w-full h-full gap-2 cursor-pointer'>
                    {/* <div className='p-5 bg-teal-600 rounded-full h-11 w-11'></div>
                    <h4 className='font-medium text-sm text-[#f6efef]'>Ylide Messenger</h4> */}
                    <img className='w-full h-10' src="/Images/logo_white.svg" alt="" />
                </div>
            </div>
            
            <div className='hidden w-full p-2 md:block'>
                <div className='flex items-center justify-center w-full h-full gap-2 cursor-pointer'>
                    <div className='p-5 h-11 w-11 rounded-full bg-[#F5CFFC] avatar'></div>
                    <h4 className='font-medium text-sm text-[#F5CFFC]'>{currentChat?.userName?currentChat?.userName:currentChat?.address}</h4>
                </div>
            </div>
        </div>
    );
}

export default ChatHeader;