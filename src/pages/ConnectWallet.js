import { xrpl } from '../utils/constants';
import React, { useContext, useState } from 'react'
import AccountContext from '../contexts/AccountContext';
import AccountInfoContext from '../contexts/AccountInfoContext';
import XRPLClientContext from '../contexts/XRPLClientContext';

export default function ConnectWallet() {

    const [message, setMessage] = useState('');
    const [secret, setSecret] = useState('');
    const [name, setName] = useState('');

    const { addAccount, accounts, removeAccount, currentAccount } = useContext(AccountContext);
    const { account, loadAccountInfo } = useContext(AccountInfoContext);
    const {client} = useContext(XRPLClientContext)

    // const loadAccountInfo = (add) => {}

    const connectWallet = async () => {
        try {
            // this.setState({message: "Connecting..."});
            setMessage("Connecting...");
            const wallet = await xrpl.Wallet.fromSecret(secret);
            console.log("Wallet: ", wallet);
            addAccount({...wallet, name});
            setMessage("Connected");

            setTimeout(() => {
                setMessage("");
            }, 1500);

            setSecret('');
            setName('');
        } catch (e) {
            setMessage(e.message);
        }
    }

    const generateWallet = async () => {
        try {
            // this.setState({message: "Connecting..."});
            setMessage("Connecting...");
            const wallet = xrpl.Wallet.generate();
            console.log("Wallet: ", wallet);
            addAccount({...wallet, "name": name || "New Wallet" });
            setMessage("Connected");

            setTimeout(() => {
                setMessage("");
            }, 1500);

            setSecret('');
            setName('');
        } catch (e) {
            setMessage(e.message);
        }
    }

    return (
        <div className='ConnectAccount overflow-scroll' >

            <small>{message}</small>

            {/* <input ></input> */}

            <div class="input-group input-group-sm mb-3">
            {/* <span class="input-group-text" id="inputGroup-sizing-sm">Small</span> */}
            <input 
                value={secret} onChange={(val) => setSecret(val.target.value)} placeholder="Provide wallet secret"
                type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"></input>
            </div>

            <div class="input-group input-group-sm mb-3">
            {/* <span class="input-group-text" id="inputGroup-sizing-sm">Small</span> */}
            <input 
                value={name} onChange={(val) => setName(val.target.value)} placeholder="Account Name"
                type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"></input>
            </div>

            <button  onClick={() => connectWallet()} type="button" 
                className="btn btn-primary"
                    style={{
                        "--bs-btn-padding-y": ".25rem", "--bs-btn-padding-x": ".5rem", "--bs-btn-font-size": ".75rem"
                    }}>
                Connect Wallet
            </button>

            <button  onClick={() => generateWallet()} type="button" 
                className="btn btn-primary"
                    style={{
                        "--bs-btn-padding-y": ".25rem", "--bs-btn-padding-x": ".5rem", "--bs-btn-font-size": ".75rem"
                    }}>
                Generate Wallet
            </button>

            <hr />

            <h5>Connected Accounts ({accounts.length})</h5>

        
            <ul class="list-group">
                {currentAccount == null ? <div className='alert alert-info'>
                    <p>Please select a wallet</p>
                </div> : accounts.map(account => (
                    <div 
                        key={account.classicAddress} 
                        className={currentAccount.classicAddress === account.classicAddress ? "SelectedAccountAddress list-group-item active mb-1" : "AccountAddress list-group-item mb-1"}>
                        <p 
                            onClick={() => loadAccountInfo(account.classicAddress, client)} 
                            >{account.name}<br/>{account.classicAddress}</p>
                        {/* <button className='btn text-primary text-btn ' >copy secret</button>
                        <button className='btn text-secondary text-btn ' >copy address</button>
                        <button className='btn text-danger text-btn ' >remove</button> */}
                        <div class="btn-group">
                            <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                options
                            </button>
                            <ul class="dropdown-menu">
                                <li onClick={() => navigator.clipboard.writeText(account.classicAddress)}><a class="dropdown-item" href="#">copy address</a></li>
                                <li onClick={() => navigator.clipboard.writeText(account.seed)}><a class="dropdown-item" href="#">copy seed</a></li>
                                <li onClick={() => removeAccount(account.classicAddress)}><a class="dropdown-item" href="#">remove account</a></li>
                            </ul>
                        </div>
                    </div>
                ))}
            </ul>


        </div>
    )
}

