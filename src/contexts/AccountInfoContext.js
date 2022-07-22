

import React, { createContext, useState } from "react";

const AccountInfoContext = createContext();

// client

export function AccountInfoProvider({children, client}) {

    const [account, setAccount] = useState(null);
    const [currentAccount, setCurrentAccount] = useState("");
    const [loadingAccountInfo, setLoadingAccountInfo] = useState(false);

    const [transactions, setTransactions] = useState([]);


    const loadAccountInfo = async (address, client) => {

        
        if (client.isConnected) {
            setLoadingAccountInfo(true);
            _loadAccountInfo(address, client);
            _loadTransactions(address, client);
        } else {
            client.connect().then(() => {
                loadAccountInfo(address, client);
            })
        }
    }

    const _loadTransactions = async (address, client) => {
        try {
            client.connect().then(async () => {
                const account = await client.request({
                    "command": "account_tx",
                    "account": address
                });
        
                console.log("account", account);
                setTransactions(account.result.transactions);
        
                setLoadingAccountInfo(false);
    
                // client.disconnect();
            })
        } catch (err) {
            setLoadingAccountInfo(false);
            console.log(err);
        }
    }
    const _loadAccountInfo = async (address, client) => {
        try {
            client.connect().then(async () => {
                const account = await client.request({
                    "command": "account_info",
                    "account": address
                });
        
                console.log("account", account);
                setAccount(account.result.account_data);
                setCurrentAccount(address);
    
                // client.disconnect();
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
            currentAccount,
            loadingAccountInfo,
            transactions,
        }}>
            {children}
        </AccountInfoContext.Provider>
    )
}

export default AccountInfoContext;