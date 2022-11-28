import React,{useState,useCallback,useContext,useEffect} from 'react';
import {EVMNetwork} from "@ylide/ethereum";
import { useNavigate } from 'react-router-dom';
import WheelLoader from '../LoadingBar/WheelLoader';
import { YlideContext } from '../../Context/YlideContext';


function LoginPage({setAccountsState}) {
    let navigate = useNavigate();
    const {ylideInstance,} = useContext(YlideContext);
    const [loadAccountState,setLoadAccountState] = useState(true);
    const [accounts, setAccounts] = useState(localStorage.getItem("accs")? JSON.parse(localStorage.getItem("accs")): []);


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


    const publishKey = useCallback(
        async (wallet, address, key) => {
            const pk = await ylideInstance?.readers[0].extractPublicKeyFromAddress(address);
            if (!pk) {
                // There is no public key connected to this address in the Registry
                await wallet.wallet.attachPublicKey({ address, blockchain: "", publicKey: null },key?.publicKey,{address,network: EVMNetwork.FANTOM,}).then(()=>{
                    setLoadAccountState(false);
                    navigate("/chats");
                }).catch((e)=>{
                    setLoadAccountState(false);
                });
                
            } else {
                if (
                    pk.bytes.length === key.publicKey.length
                    && pk.bytes.every((e, idx) => e === key.publicKey[idx])
                ) {
                    // This key connected to this address in the Registry
                    navigate("/chats")
                } else {
                    // Another key connected to this address in the Registry
                    alert("Address already exists in the registry")
                    setLoadAccountState(false);

                }
            }
           
        },
        [ylideInstance?.accountsState]
    );
   
    

    const onSubmit = (e) =>{
        e.preventDefault()
        try {
            setLoadAccountState(true)
            const {address,wallet} = accounts?accounts[0]:null;
            const account = ylideInstance?.accountsState[address];
            console.log(account)
            if (!account.localKey) {
                document.location.reload();
                return
            }

            publishKey(account.wallet,address,account.localKey)
        } catch (error) {
            console.error(error)
            alert("Account not found")
        }
    }
    

    return (
        <>
            {
                !ylideInstance?.accountsState | loadAccountState && <WheelLoader/>
            }
            {
                ylideInstance?.accountsState | !loadAccountState &&
       
                <div className='w-full h-screen p-5 home-bg-image'>
                    
                    
                    <div className='w-full max-w-md p-5 mx-auto mt-32 bg-white form-glass-morph min-h-[8rem] rounded-2xl'>
                            <div className='text-center'>
                                <h1 className='text-3xl font-semibold text-center'>SignIn to Ylide Messenger</h1>
                            </div>
                        
                        <form>
                            <div className='flex flex-col w-full h-full my-10 space-y-10'>
                                <div onClick={onSubmit} className='w-full h-14'>
                                        <button className='bg-[#0aaf81] w-full h-full font-medium text-base rounded-2xl text-[#edfbf7]'>Log In</button>
                                    </div> 
                                </div>
                        </form>
                        
                    </div>      
                </div>
            }

        </>
    );
}

export default LoginPage;