import React,{useState,useContext,useEffect} from 'react';
import { getFormValues } from '../Misc/Misc';
import indexedDB from '../Misc/IndexDbHandler';
import ChatHeader from '../Headers/ChatHeader';
import { YlideContext } from '../../Context/YlideContext';
import { MessageContext } from '../../Context/MessengerContext';
import EmptyChat from './ChatDashboardComponents/ChatPanel/EmptyChat';
import ActiveChat from './ChatDashboardComponents/ChatPanel/ActiveChat';
import ChatMembersList from './ChatDashboardComponents/ChatPanel/ChatMembersList';
import WheelLoader from '../LoadingBar/WheelLoader';


function ChatDashboard({setAccountsState}) {
    const [chatMembers,setChatMembers] = useState([
        {
            "userName":"NACBOTICS",
            "lastMessage":"",
            "address":"0xF2de1E1aEAf4843634a1227278016758d6d9Fc0e"
        },]);

    const [finalData,setFinalData] = useState([]);
    const [currentChat,setCurrentChat] = useState(null);

    const {ylideInstance,} = useContext(YlideContext);
    const [passwordMatch,setPasswordMatch] = useState(true);
    const [showContactForm,setShowContactForm] = useState(false);
    const [loadAccountState,setLoadAccountState] = useState(true);
    // const [emptyContactForm,setEmptyContactForm] = useState(false);
    const [accounts, setAccounts] = useState(localStorage.getItem("accs")? JSON.parse(localStorage.getItem("accs")): []);


    useEffect(() => {
        let handle = true;
        if (handle) {
            indexedDB.collection('contact').get().then(users => {
                setChatMembers([...chatMembers,...users]);
            })
        }
        
        return () => {
            handle = false;
        };
    },[]);

    useEffect(() => {
        let keys = ylideInstance?.keys
        let wallets = ylideInstance?.wallets;
        let readers = ylideInstance?.readers;
        
        if (!wallets?.length) {
            return;
        }
        (async () => {
            const result = {};
            for (let acc of accounts) {
                const wallet = wallets.find(
                    (w) => w.factory.wallet === acc.wallet
                );
                result[acc.address] = {
                    wallet: wallet || null,
                    localKey:
                        keys.find((k) => k.address === acc.address)?.key ||
                        null,
                    remoteKey:
                        (
                            await Promise.all(
                                readers.map(async (r) => {
                                    if (!r.isAddressValid(acc.address)) {
                                        return null;
                                    }
                                    const c =
                                        await r.extractPublicKeyFromAddress(
                                            acc.address
                                        );
                                    if (c) {
                                        console.log(
                                            `found public key for ${acc.address} in `,
                                            r
                                        );
                                        return c.bytes;
                                    } else {
                                        return null;
                                    }
                                })
                            )
                        ).find((t) => !!t) || null,
                };
            }
            setLoadAccountState(false);
            setAccountsState(result);
            
        })();
    }, [accounts,ylideInstance?.keys,ylideInstance?.readers,ylideInstance?.wallets]);



    const onSubmit =(e)=>{
        e.preventDefault()

        let formData = getFormValues();

        if (formData.username && formData.address) {
            setChatMembers([...chatMembers,{
                "userName":formData.username,
                "lastMessage":"",
                "address":formData.address,
            }])

            indexedDB.collection('contact').add({
                id: chatMembers.length+1,
                "userName":formData.username,
                "address":formData.address,
                "lastMessage":"",
              })
            // indexedDB.collection('contact').delete()
            setShowContactForm(!showContactForm)

            
        }
    }

    return (
        <div className='bg-[#A3FDDA] h-[85vh] w-full max-w-full xl:max-w-[80%] mx-auto'>
            <MessageContext.Provider value={{
				currentChat,
				setCurrentChat,
				finalData,
				setFinalData
			}}>

                <ChatHeader/>
                {
                    loadAccountState && <WheelLoader/>
                }
                {
                    !loadAccountState &&
               
                    <div className='flex items-center w-full h-full pb-5'>

                    
                        <div className='flex relative flex-col bg-[#f5f3f3] items-center justify-between w-full h-full overflow-hidden overflow-y-scroll md:w-1/2'>
                            
                            <ChatMembersList chatMembers={chatMembers}/>
                            

                            <div className='absolute bottom-0 w-full'>
                                <div onClick={e=>{setShowContactForm(!showContactForm)}} className='bg-[#0aaf81] fixed bottom-0  mb-16 ml-44 flex space-x-2 max-w-[160px] flex-nowrap w-full cursor-pointer p-5 rounded-2xl 2xl:ml-[16%]'>
                                    <h3 className='text-base font-semibold text-[#f5f3f3]'>New Chat</h3>
                                    <svg className="w-6 h-6" fill="none" stroke="#f5f3f3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </div>
                            </div>

                            {
                                showContactForm &&
                            
                                <div className='absolute bottom-0 w-full'>

                                    <form className='fixed bottom-0 mb-16 space-x-2 max-w-[350px] w-full cursor-pointer rounded-2xl ml-0'>
                                        <div className='bg-[#d9fbee] flex flex-col space-y-5 rounded-t-2xl p-5'>
                                            <svg onClick={e=>{setShowContactForm(!showContactForm)}} className="w-6 h-6 self-end" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>

                                            <div className="input-group w-full h-14">
                                                <input type="text" autoComplete='new-username' name='username' required className='w-full h-full p-2 text-black bg-transparent border-t-2 border-b-2 outline-none appearance-none border-t-transparent border-b-teal-500 input'/>
                                                <label className="input-label font-medium text-base">Username</label>
                                            </div>

                                            <div className="input-group w-full h-14">
                                                <input type="text" autoComplete='new-address' name='address' required className='w-full h-full p-2 text-black bg-transparent border-t-2 border-b-2 outline-none appearance-none border-t-transparent border-b-teal-500 input'/>
                                                <label className="input-label font-medium text-base">Contact Address</label>
                                            </div>

                                            <div onClick={onSubmit} className='w-full h-14'>
                                                <button className='bg-[#0aaf81] w-full h-full font-medium text-base rounded-2xl text-[#edfbf7]'>Add Contact</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            }

                        </div>

                        <div className='hidden w-full h-full md:block bg-[#f5f3f3]'>
                            {
                                currentChat?
                                <ActiveChat/>
                                :<EmptyChat/>
                            }
                        </div>

                    </div>

                }

			</MessageContext.Provider>


           
        </div>
    );
}

export default ChatDashboard;