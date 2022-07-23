

import React, { createContext, useContext, useEffect, useState } from "react";
import AccountContext from "./AccountContext";
import XRPLClientContext from "./XRPLClientContext";

const AccountInfoContext = createContext();

// client

export function AccountInfoProvider({children}) {

    /// account info
    const [account, setAccount] = useState(null);
    /// current wallet details
    /// const [currentAccount, setCurrentAccount] = useState(null);
    const [loadingAccountInfo, setLoadingAccountInfo] = useState(false);
    /// current wallet transactions
    const [transactions, setTransactions] = useState([]);

    const {client} = useContext(XRPLClientContext)
    const {currentAccount} = useContext(AccountContext)

    const loadAccountInfo = async () => {
        if (currentAccount != null) {
            console.log("AccountToLoad: ", currentAccount);
            setLoadingAccountInfo(true);
            _loadAccountInfo();
            _loadTransactions();
        }
    }

    const _loadTransactions = async () => {
        try {
            client.connect().then(async () => {
                const account = await client.request({
                    "command": "account_tx",
                    "account": currentAccount.classicAddress,
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

    const _loadAccountInfo = async () => {
        try {
            client.connect().then(async () => {
                const account = await client.request({
                    "command": "account_info",
                    "account": currentAccount.classicAddress
                });
        
                console.log("account", account);
                setAccount(account.result.account_data);
            })
        } catch (err) {
            setLoadingAccountInfo(false);
            console.log(err);
        }
    }

    useEffect(() => {
        loadAccountInfo();
    }, [currentAccount])
    
    return (
        <AccountInfoContext.Provider value={{
            loadAccountInfo,
            loadingAccountInfo,
            account,
            currentAccount, 
            transactions,
        }}>
            {children}
        </AccountInfoContext.Provider>
    )
}

export default AccountInfoContext;