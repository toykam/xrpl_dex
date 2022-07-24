

import React, { createContext, useContext, useEffect, useState } from "react";
import AccountContext from "./AccountContext";
import XRPLClientContext from "./XRPLClientContext";

const AccountInfoContext = createContext();

// client

export function AccountInfoProvider({children}) {

    /// account info
    const [account, setAccount] = useState(null);
    const [accountTrustLines, setAccountTrustLines] = useState([]);
    const [accountObjects, setAccountObjects] = useState([]);
    const [accountBalance, setAccountBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    
    /// current wallet details
    /// const [currentAccount, setCurrentAccount] = useState(null);
    const [loadingAccountInfo, setLoadingAccountInfo] = useState(false);
    /// current wallet transactions

    const {client} = useContext(XRPLClientContext)
    const {currentAccount} = useContext(AccountContext)

    const loadAccountInfo = async () => {
        if (currentAccount != null) {
            console.log('AccountBalance:', accountBalance);
            // console.log("AccountToLoad: ", currentAccount);
            setLoadingAccountInfo(true);
            _loadAccountInfo();
            _loadAccountTrustLines();
            _loadAccountObjets();
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
                const balanceInDrop = account.result.account_data.Balance;
                console.log("balanceInDrop", balanceInDrop);
                const balanceInXRPL = Number(balanceInDrop)/1000000;
                console.log("balanceInXRPL", balanceInXRPL);
                setAccountBalance((bal) => bal + (balanceInXRPL - 10));
            })
        } catch (err) {
            setLoadingAccountInfo(false);
            console.log(err);
        }
    }

    const _loadAccountObjets = async () => {
        try {
            client.connect().then(async () => {
                const account = await client.request({
                    "command": "account_objects",
                    "account": currentAccount.classicAddress,
                    "ledger_index": "validated",
                });
        
                console.log("account", account);
                setAccountObjects(account.result.account_objects);
                // useCallback(
                //   () => {
                //     first
                //   },
                //   [second],
                // )
                setAccountBalance((bal)=> bal - (2 * account.result.account_objects.length))
                
            })
        } catch (err) {
            setLoadingAccountInfo(false);
            console.log(err);
        }
    }

    const _loadAccountTrustLines = async () => {
        try {
            client.connect().then(async () => {
                const account = await client.request({
                    "command": "account_lines",
                    "account": currentAccount.classicAddress,
                    "ledger_index": "validated"
                });
        
                console.log("account", account);
                setAccountTrustLines(account.result.lines);
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
            accountTrustLines,
            accountObjects,
            accountBalance
        }}>
            {children}
        </AccountInfoContext.Provider>
    )
}

export default AccountInfoContext;