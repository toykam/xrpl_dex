

import React, { createContext, useContext, useState } from "react";
import XRPLClientContext from "./XRPLClientContext";

const AccountInfoContext = createContext();

// client

export function AccountInfoProvider({children}) {

    const [account, setAccount] = useState(null);
    const [currentAccount, setCurrentAccount] = useState("");
    const [loadingAccountInfo, setLoadingAccountInfo] = useState(false);

    const [transactions, setTransactions] = useState([]);

    const {client} = useContext(XRPLClientContext)

    const loadAccountInfo = async (address) => {
        console.log("AccountToLoad: ", address);
        setLoadingAccountInfo(true);
        _loadAccountInfo(address);
        _loadTransactions(address);
    }

    const _loadTransactions = async (address) => {
        try {
            client.connect().then(async () => {
                const account = await client.request({
                    "command": "account_tx",
                    "account": address
                });
        
                console.log("account", account);
                setTransactions(account.result.transactions);
        
                setLoadingAccountInfo(false);
            })
        } catch (err) {
            setLoadingAccountInfo(false);
            console.log(err);
        }
    }
    const _loadAccountInfo = async (address) => {
        try {
            client.connect().then(async () => {
                const account = await client.request({
                    "command": "account_info",
                    "account": address
                });
        
                console.log("account", account);
                setAccount(account.result.account_data);
                setCurrentAccount(address);
            })
        } catch (err) {
            setLoadingAccountInfo(false);
            console.log(err);
        }
    }
    
    return (
        <AccountInfoContext.Provider value={{
            account, setAccount,
            loadAccountInfo,
            currentAccount, loadingAccountInfo,
            transactions,
        }}>
            {children}
        </AccountInfoContext.Provider>
    )
}

export default AccountInfoContext;