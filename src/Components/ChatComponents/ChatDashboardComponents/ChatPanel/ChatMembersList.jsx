import React from 'react';
import ChatUserDiv from '../ChatUserDiv';

function ChatMembersList({chatMembers}) {
    return (
        <>
            <div className='w-full h-full border-t border-t-gray-50'>
                {
                    chatMembers.map((chatMember,index)=>
                        <ChatUserDiv key={index} chatUser={chatMember}/>
                    )
                }
                </div>
        </>
    );
}

export default ChatMembersList;