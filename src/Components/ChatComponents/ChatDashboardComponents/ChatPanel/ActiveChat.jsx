import React,{useState,useContext,useMemo,useEffect,useCallback} from 'react';
import { MessageContent,MessageContentV3 } from '@ylide/sdk';
import {EVMNetwork,} from "@ylide/ethereum";
import MessageHistory from '../MessageHistory';
import { YlideContext } from '../../../../Context/YlideContext';
import { MessageContext } from '../../../../Context/MessengerContext';
import { MessagesList } from '@ylide/sdk';

const useListHandler = () => {
    const [messages, setMessages] = useState([]);
    const list = useMemo(() => new MessagesList(), []);
    const [_, triggerRerender] = useState(0);

    useEffect(() => {
        const handler = () => setMessages([...list.getWindow()]);
        const stateHandler = () => triggerRerender((v) => v + 1);
        list.on("windowUpdate", handler);
        list.on("stateUpdate", stateHandler);
        return () => {
            list.off("windowUpdate", handler);
            list.off("stateUpdate", stateHandler);
        };
    }, [list]);

    return { messages, list };
};


function ActiveChat(props) {
    const [msgList,setMsgList] = useState([]);
    const [msgInput,setMsgInput] = useState("");
    const {ylideInstance,} = useContext(YlideContext);
    const {currentChat,setCurrentChat} = useContext(MessageContext);
    const [accounts, setAccounts] = useState(localStorage.getItem("accs")? JSON.parse(localStorage.getItem("accs")): []);
    // const { messages: inboxMessages, list: inbox } = useListHandler();
    // window.inbox = inbox;


    useEffect(()=>{
        getMessages()
    },[msgList])


    const getMessages = useCallback(
        async () => {
            const {address,wallet} = accounts?accounts[0]:null;
            const account = ylideInstance?.accountsState[address];
            const messages = await ylideInstance?.readers[0].retrieveMessageHistoryByBounds(account.address);

            // 

            for (let index = 0; index < messages.length; index++) {
                const message = messages[index];
                // console.log(message)
                const content = await ylideInstance?.readers[0].retrieveAndVerifyMessageContent(message);
                if (content || !content.corrupted) { // check content integrity
                   try {
                    const decodedContent = await ylideInstance?.ylide.decryptMessageContent(
                        {
                            address: address || "",
                            blockchain: "",
                            publicKey: null,
                        },
                        message,
                        content
                    );
                    setMsgList([...msgList,{from:message?.senderAddress,msg:decodedContent?.content}])

                   } catch (error) {
                    
                   }
                    
                }
                // try {
                //     const decodedContent = await ylideInstance?.ylide.decryptMessageContent(
                //         {
                //             address: address || "",
                //             blockchain: "",
                //             publicKey: null,
                //         },
                //         message,
                //         content
                //     );
                // } catch (error) {
                    
                // }

                
                
            }
            // const content = await ylideInstance?.readers[0].retrieveAndVerifyMessageContent(message);
            // if (!content || content.corrupted) { // check content integrity
            //     throw new Error('Content not found or corrupted');
            // }        

            // const decodedContent = await ylideInstance?.ylide.decryptMessageContent(
            //     {
            //         address: address || "",
            //         blockchain: "",
            //         publicKey: null,
            //     },
            //     message,
            //     content
            // );

            // console.log(decodedContent,'SSDDDDDD')

            // setMsgList([...msgList,...messages])
        },
        [ylideInstance]
    );

    // console.log(msgList,'@@@@@@@@@@@@')

    const onSend = async() =>{
        const state = ylideInstance?.accountsState[accounts[0]?.address];
        setMsgList([...msgList,{from:message?.accounts[0]?.address,msg:msgInput}])

        const content = MessageContentV3.plain(msgInput, msgInput);
        const msgId = await ylideInstance?.ylide.sendMessage(
            {
                wallet: state.wallet?.wallet,
                sender: (await state.wallet?.wallet.getAuthenticatedAccount()),
                content,
                recipients: [currentChat?.address],
            },
            { network: EVMNetwork.FANTOM }
        );


    }
    return (
        <>
            <div className='bg-[#F1ECE5] bg-image w-full h-full p-k5 relative flex flex-col justify-between'>
                    
                <MessageHistory msgList={msgList}/>
                
           
                <div className='bg-[#f5f3f3] w-full'>
                        
                    <div className='relative w-1/2 h-16 mx-auto rounded-full'>
                        <input onInput={e=>(setMsgInput(e.target.value))} type="text" id='msg_input' value={msgInput} placeholder='Enter message you want to send here' className='w-full h-full px-5 text-base font-normal rounded-full outline-none appearance-none bg-l-500' />
                        {
                            msgInput !== "" &&
                       
                            <div onClick={onSend} className='absolute top-0 bottom-0 right-0 grid p-5 bg-white rounded-r-full cursor-pointer place-content-center'>
                                <svg className=" w-8 h-8 relative text-[#0aaf81] rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default ActiveChat;