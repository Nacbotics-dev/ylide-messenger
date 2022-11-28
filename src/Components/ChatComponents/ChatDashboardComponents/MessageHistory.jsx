import React,{useState} from 'react';
import SenderChatDiv from './ChatDivs/SenderChatDiv';
import ReceiverChatDiv from './ChatDivs/ReceiverChatDiv';

function MessageHistory({msgList}) {
    const [accounts, setAccounts] = useState(localStorage.getItem("accs")? JSON.parse(localStorage.getItem("accs")): []);
    const {address,wallet} = accounts?accounts[0]:null;
    return (
        <div className='flex flex-col items-center p-5 h-full overflow-hidden overflow-y-scroll'>
            {
                msgList.map((msg,index)=>
                    <>
                        {
                            msg?.from === address?
                            <SenderChatDiv key={Math.random()+msg.msg} message={msg.msg}/>
                            :
                            <ReceiverChatDiv key={Math.random()+msg.msg} message={msg.msg}/>
                        }
                        
                    </>
                )
            }
        </div>
    );
}

export default MessageHistory;