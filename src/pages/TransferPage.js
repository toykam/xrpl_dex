

import React, { useContext, useState } from 'react'
import MyButton from '../components/MyButton';
import AccountContext from '../contexts/AccountContext';
import XRPLClientContext from '../contexts/XRPLClientContext';
import { xrpl } from '../utils/constants';

export default function TransferPage() {

    const [account, setAccount] = useState(null);
    const [accountDetail, setAccountDetail] = useState(null);
    const [prepared, setPrepared] = useState(null);
    const [amount, setAmount] = useState(0);
    const [destination, setDestination] = useState("");
    const [message, setMessage] = useState("");
    const {accounts} = useContext(AccountContext);
    const {connected, client} = useContext(XRPLClientContext)

    const [preparing, setPreparing] = useState(false);
    const [sendingToken, setSendingToken] = useState(false);
    const [loadingAccountDetail, setLoadingAccountDetail] = useState(false);



    const getAccountDetail = async (acct) => {
        console.log(acct)
        try {
            setAccount(null)
            setAccountDetail(null)
            client.connect().then(async () => {
                setLoadingAccountDetail(true)
                const {classicAddress} = JSON.parse(acct)
                const account = await client.request({
                    "command": "account_info",
                    "account": classicAddress
                });
                setAccount(account.result.account_data);
                setAccountDetail(JSON.parse(acct))
                setLoadingAccountDetail(false)
                // client.disconnect();
            }).catch (err => {client.disconnect()})
        } catch(err) {
            setMessage(err.message);
            setAccount(null);
            setTimeout(() => {
                setMessage("");
            }, 2000)
        }
    }

    const sendXRP = async () => {
        try {
            console.log("Account: ", account);
            
            if (amount <= 0) {
                setMessage("Amount must be greater than 0");
                return;
            }

            if (amount > Number(account.Balance)/1000000) {
                setMessage("Amount must be less than balance");
                return;
            }

            if (destination === "") {
                setMessage("Destination address is required");
                return;
            }
            client.connect()
            .then(async () => {
                setPreparing(true);
                const prepared = await client.autofill({
                    "TransactionType": "Payment",
                    "Account": account.Account,
                    "Amount": xrpl.xrpToDrops(amount),
                    "Destination": destination
                })
                console.log("Prepared: ", prepared)
                setPrepared(prepared);
                setPreparing(false);
            })
        } catch(err) {
            setMessage(err.message);
        }
    }

    const _confirmTransaction = async () => {
        try {
            setSendingToken(true);
            const wallet = xrpl.Wallet.fromSeed(accountDetail.seed)
            const signed = wallet.sign(prepared)

            const tx = await client.submitAndWait(signed.tx_blob)

            console.log("Transaction: ", tx)
            setMessage("Transaction sent successfully: ");
            setSendingToken(false);
        } catch(error) {
            setMessage(error.message);
        }
    }


    return (
        <div className='container row bg-light p-2 h-100' style={{
            width: '100%',
        }}>

            {connected ? <div className='col-md-6 offset-3'>
                {message.length === 0 ? <></> : <div className='alert alert-danger'>
                    {message}
                </div>}

                {prepared == null ?
                <div>
                    <div class="input-group input-group-sm mb-3">
                        <label className="input-group-text" for="source">Source</label>
                        <select class="form-select" aria-label="Select Source" id='source' onChange={(elem) => getAccountDetail(elem.target.value)}>
                            <option selected>Select Source</option>
                            {accounts.map((account, index) => {
                                return <option key={index} value={JSON.stringify(account)}>{account.name}</option>
                            })}
                        </select>
                        <label class="input-group-text" for="source">{account != null ? (Number(account.Balance)/1000000).toFixed(2) : '0'} XRP</label>
                    </div>

                    {account == null ?
                    <></> : 
                    <div>
                        <div class="input-group input-group-sm mb-3">
                            <label className="input-group-text" for="destination">Destination</label>
                            <input 
                                value={destination} onChange={(val) => setDestination(val.target.value)} placeholder="Provide destination address"
                                type="text" className="form-control" 
                                id='destination'
                                aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"></input>
                        </div>


                        <div class="input-group input-group-sm mb-3">
                            <label className="input-group-text" for="amount">Amount</label>
                            <input 
                                value={amount} onChange={(val) => setAmount(val.target.value)} placeholder="Amount"
                                id='amount' type="text" 
                                className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"></input>
                        </div>
                    </div>}
                    


                    <button  onClick={() => sendXRP()} type="button" 
                        className="btn btn-primary"
                            style={{
                                "--bs-btn-padding-y": ".25rem", "--bs-btn-padding-x": ".5rem", "--bs-btn-font-size": ".75rem"
                            }}>
                        {preparing ? 'please wait...': 'Send XRP'}
                    </button>
                </div>
                :
                <div class="card" style={{"width": "18rem"}}>
                    <div class="card-header">
                        Transfer Detail
                    </div>
                    <div className='card-body'>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">Destination: {prepared.Destination}</li>
                            <li class="list-group-item">Amount: {Number(prepared.Amount)/1000000} XRP</li>
                            <li class="list-group-item">Fee: {Number(prepared.Fee)/1000000} XRP</li>
                        </ul>
                    </div>

                    <div className='card-footer'>
                        <MyButton label={sendingToken ? "Please wait..." : "Confirm Transaction"} onClick={() => _confirmTransaction()}/>
                        <MyButton label={"Cancel Transaction"} onClick={() => setPrepared(null)} type="danger"/>
                    </div>
                </div>
                }
                
            </div> : <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>}

        </div>
    )
}


// {"TransactionType":"Payment","Account":"rsZzn8bL42Z54dfLp1g2jeYBnS2xXvXjJE","Amount":"10000000","Destination":"rBA6m7osy5PLZf3Uiuh9ZV2rFdf32kC3qW","Flags":0,"Sequence":20156353,"Fee":"12","LastLedgerSequence":20167867}