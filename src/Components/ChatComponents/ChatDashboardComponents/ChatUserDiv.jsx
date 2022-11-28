import React,{useContext} from 'react';
import { MessageContext } from '../../../Context/MessengerContext';

function ChatUserDiv({chatUser}) {
    const {currentChat,setCurrentChat} = useContext(MessageContext);
    return (
        <>
            <div onClick={()=>{setCurrentChat(chatUser)}} className='border-y p-5 cursor-pointer bg-white w-full'>
                <div className='flex items-center gap-2'>
                    <div className='p-5 h-11 w-11 rounded-full !bg-[#36c1b4] avatar2'></div>
                    <h4 className='font-medium text-base text-black'>{chatUser?.userName?chatUser?.userName:"Unknown User"}</h4>
                </div>

                <div className='w-full  pl-12'>
                    <h5 className='text-gray-500  font-normal text-sm'>{chatUser?.lastMessage?chatUser?.lastMessage:"[None]"}</h5>
                </div>
            </div>
        </>
    );
}

export default ChatUserDiv;