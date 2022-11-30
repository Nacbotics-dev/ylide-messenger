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
                        <div key={index} className='w-full'>
                            {
                                msg?.from === address?
                                <SenderChatDiv message={msg.msg}/>
                                :
                                <ReceiverChatDiv message={msg.msg}/>
                            }
                            
                        </div>
                    )
                }
        </div>
    );
}


export default MessageHistory;