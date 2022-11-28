import React,{useState,useContext,useCallback,useEffect} from 'react';
import { getFormValues } from '../Misc/Misc';
import { useNavigate } from 'react-router-dom';
import { YlideContext } from '../../Context/YlideContext';
import WheelLoader from '../LoadingBar/WheelLoader';



export default function OnboardUser({setAccountsState}) {
    const navigate = useNavigate();
    const {ylideInstance,setYlideInstance} = useContext(YlideContext);
    const [passwordMatch,setPasswordMatch] = useState(true);
    const [loadAccountState,setLoadAccountState] = useState(true);
    const [accounts, setAccounts] = useState(localStorage.getItem("accs")? JSON.parse(localStorage.getItem("accs")): []);


    useEffect(() => {
        localStorage.setItem("accs", JSON.stringify(accounts));
    }, [accounts]);

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

    
    const addAccount = useCallback(
        async (factory) => {
            const tempWallet = await factory.create({
                onNetworkSwitchRequest: () => {},
            });
            const newAcc = await tempWallet.requestAuthentication();
            if (!newAcc) {
                alert("Auth was rejected");
                return;
            }
            const exists = accounts.some((a) => a.address === newAcc.address);
            if (exists) {
                alert("Already registered");
                return;
            }
            setAccounts(
                accounts.concat([
                    {
                        wallet: factory.wallet,
                        address: newAcc.address,
                    },
                ])
            );
            setLoadAccountState(true);
        },
        [accounts]
    );

    const generateKey = useCallback(
        async (wallet, address,password) => {
            const account = ylideInstance?.accountsState[address];
            let p = await ylideInstance?.keystore.create(
                `Generation key for ${address}`,
                account.wallet.factory.blockchainGroup,
                wallet,
                address,
                password
            );
        },
        [ylideInstance?.keystore, ylideInstance?.accountsState]
    );

   
    const onSubmit = (e) =>{
        e.preventDefault()
        let formData = getFormValues();
        if (formData.password === formData.confirm_password && formData.confirm_password != ""){
            const {address,wallet} = accounts[0]
            const account = ylideInstance?.accountsState[address];

            generateKey(wallet,address,formData.password).then(()=>{
                setTimeout(() => { 
                    localStorage.setItem("username", formData.username);
                    navigate("/sign-in")
                }, 5000);
                
            })
            
        }else{
            setPasswordMatch(false)
        }
        
    }

    return (
        <>
            {
                !ylideInstance?.accountsState | loadAccountState && <WheelLoader/>
            }
            {
                ylideInstance?.accountsState | !loadAccountState &&
           
        
                <div className='w-full h-full min-h-screen p-5 home-bg-image'>
                    <div onClick={()=>(addAccount(ylideInstance.wallets[0]?.factory))} className='p-3 cursor-pointer bg-teal-400 rounded-2xl max-w-[200px] absolute top-5 right-5 text-base font-semibold text-white overflow-hidden text-ellipsis'>{accounts[0]?.address?accounts[0]?.address:"Connect Wallet"}</div>
                    
                    <div className='w-full max-w-md p-5 mx-auto mt-32 bg-white form-glass-morph min-h-[24rem] rounded-2xl'>
                            <div className='text-center'>
                                <h1 className='text-3xl font-semibold text-center'>SignUp to Ylide Messenger</h1>
                            </div>
                        
                        <form>
                            <div className='flex flex-col w-full h-full my-10 space-y-10'>
                            <>
                                {
                                    accounts ==[] && <p className=' font-semibold text-base text-red-600 mt-2 text-center'>Please connect wallet</p>
                                }
                            </>

                                <div className="input-group w-full h-14">
                                    <input type="text" autoComplete='new-username' name='username' required className='w-full h-full p-2 text-black bg-transparent border-t-2 border-b-2 outline-none appearance-none border-t-transparent border-b-teal-500 input'/>
                                    <label className="input-label">Username</label>
                                </div>

                                <div className="input-group w-full h-14">
                                    <input type="password" autoComplete='new-password' name='password' required className='w-full h-full p-2 text-black bg-transparent border-t-2 border-b-2 outline-none appearance-none border-t-transparent border-b-teal-500 input'/>
                                    <label className="input-label font-medium text-base">Password</label>
                                </div>

                                <div className="input-group w-full h-14">
                                    <input type="password" autoComplete='new-password' name='confirm_password' required className='w-full h-full p-2 text-black bg-transparent border-t-2 border-b-2 outline-none appearance-none border-t-transparent border-b-teal-500 input'/>
                                    <label className="input-label font-medium text-base">Confirm Password</label>
                                    
                                </div>

                                <>
                                {
                                        !passwordMatch && <p className=' font-normal text-sm text-red-600 mt-2'>Password does not match</p>
                                    }
                                </>

                                <div onClick={(e)=>(onSubmit(e))} className='w-full h-14'>
                                    <button className='bg-[#0aaf81] w-full h-full font-medium text-base rounded-2xl text-[#edfbf7]'>SignUp</button>
                                </div>

                            </div>
                        </form>
                        
                    </div>      
                </div>

            }

        </>
    );
}