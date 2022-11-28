import { useState,useCallback,useMemo,useEffect } from 'react'
import './backgroundcss.css';
import Homepage from './Components/Homepage';
import { YlideContext } from './Context/YlideContext';
import IndexHeader from './Components/Headers/IndexHeader';
import LoginPage from './Components/OnboardingComponents/LoginPage';
import ChatDashboard from "./Components/ChatComponents/ChatDashboard";
import OnboardUser from './Components/OnboardingComponents/OnboardUser';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';


import {everscaleBlockchainFactory,everscaleWalletFactory,} from "@ylide/everscale";
import {evmFactories,ethereumWalletFactory,EVMNetwork,EVM_NAMES,} from "@ylide/ethereum";
import {
    Ylide,
    YlideKeyStore,
    BrowserLocalStorage,
    MessagesList,
} from "@ylide/sdk";

Ylide.registerBlockchainFactory(evmFactories[EVMNetwork.ETHEREUM]);
// Ylide.registerBlockchainFactory(evmFactories[EVMNetwork.BNBCHAIN]);
// Ylide.registerBlockchainFactory(evmFactories[EVMNetwork.POLYGON]);
// Ylide.registerBlockchainFactory(evmFactories[EVMNetwork.ARBITRUM]);
// Ylide.registerBlockchainFactory(evmFactories[EVMNetwork.OPTIMISM]);
// Ylide.registerBlockchainFactory(evmFactories[EVMNetwork.AVALANCHE]);
Ylide.registerBlockchainFactory(evmFactories[EVMNetwork.FANTOM]);
Ylide.registerBlockchainFactory(everscaleBlockchainFactory);
Ylide.registerWalletFactory(ethereumWalletFactory);
Ylide.registerWalletFactory(everscaleWalletFactory);


function App() {
	const [keys, setKeys] = useState([]);
    const [ylide, setYlide] = useState(null);
	const [wallets, setWallets] = useState([]);
    const [readers, setReaders] = useState([]);
    const [finalData,setFinalData] = useState([]);
    const [walletsList, setWalletsList] = useState([]);
    const [ylideInstance,setYlideInstance] = useState({});
    const [accountsState, setAccountsState] = useState(null);

	const storage = new BrowserLocalStorage();
	const keystore = useMemo(
        () =>
            new YlideKeyStore(storage, {
                onPasswordRequest: async () => null,
                onDeriveRequest: async () => null,
            }),
        [storage]
    );

	const handlePasswordRequest = useCallback(async (reason) => {
        return prompt(`Enter Ylide password for ${reason}`);
    }, []);

    const handleDeriveRequest = useCallback(
        async (reason,blockchain,wallet,address,magicString) => {
            const state = accountsState[address];
            if (!state) {
                return null;
            }
            try {
                return state.wallet.wallet.signMagicString(
                    { address, blockchain, publicKey: null },
                    magicString
                );
            } catch (err) {
                return null;
            }
        },
        [accountsState]
    );

    useEffect(() => {
        (async () => {
            const list = Ylide.walletsList;
            const result = [];
            for (const { factory } of list) {
                result.push({
                    factory,
                    isAvailable: await factory.isWalletAvailable(),
                });
            }
            setWalletsList(result);
        })();
    }, []);  

	useEffect(() => {
        keystore.options.onPasswordRequest = handlePasswordRequest;
        keystore.options.onDeriveRequest = handleDeriveRequest;
    }, [handlePasswordRequest, handleDeriveRequest, keystore]);

    useEffect(() => {
        if (!ylide) {
            return;
        }
        (async () => {
            const availableWallets = await Ylide.getAvailableWallets();
            setWallets(
                await Promise.all(
                    availableWallets.map(async (w) => {
                        return {
                            factory: w,
                            wallet: await ylide.addWallet(
                                w.blockchainGroup,
                                w.wallet,
                                {
                                    dev: false, //true,
                                    onNetworkSwitchRequest: async (
                                        reason,
                                        currentNetwork,
                                        needNetwork,
                                        needChainId
                                    ) => {
                                        alert(
                                            "Wrong network (" +
                                                (currentNetwork
                                                    ? EVM_NAMES[currentNetwork]
                                                    : "undefined") +
                                                "), switch to " +
                                                EVM_NAMES[needNetwork]
                                        );
                                    },
                                }
                            ),
                        };
                    })
                )
            );
        })();
    }, [ylide]);

    useEffect(()=>{
        setYlideInstance({ylide:ylide,readers:readers,wallets:wallets,keystore:keystore,keys:keys,accountsState:accountsState})
    },[wallets,accountsState])

    useEffect(() => {
        (async () => {
            const list = Ylide.walletsList;
            const result = [];
            for (const { factory } of list) {
                result.push({
                    factory,
                    isAvailable: await factory.isWalletAvailable(),
                });
            }
            setWalletsList(result);
        })();
    }, []);


	useEffect(() => {
        const setData = async () => {
            await keystore.init();
            const _ylide = new Ylide(keystore);
            const _readers = [
                await _ylide.addBlockchain("FANTOM"),
                // await _ylide.addBlockchain("BNBCHAIN"),
                // await _ylide.addBlockchain("POLYGON"),
                // await _ylide.addBlockchain("ARBITRUM"),
                // await _ylide.addBlockchain("OPTIMISM"),
                // await _ylide.addBlockchain("AVALANCHE"),
            ];

            setYlide(_ylide);
            setReaders(_readers);
            setKeys([...keystore.keys]);
        }
       
        setData().catch(console.error)
	},[]);

	return (
		<div className="w-full h-full min-h-screen pt-5 pb-20 App bg-color">

			<YlideContext.Provider value={{
				ylideInstance,
				setYlideInstance,
				finalData,
				setFinalData
			}}>

	
				<Router>
					<IndexHeader/>

					<div>
					<Routes>
						<Route exact path='/' element={<Homepage/>} />
						<Route exact path='/sign-up' element={<OnboardUser setAccountsState={setAccountsState}/>} />
						<Route exact path='/sign-in' element={<LoginPage setAccountsState={setAccountsState}/>} />
						<Route exact path='/chats' element={<ChatDashboard setAccountsState={setAccountsState}/>}/>
					</Routes>
					</div>
					
				</Router>

			</YlideContext.Provider>

		</div>
	)
}

export default App
