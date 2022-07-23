
import React, { createContext, useContext, useEffect, useState } from "react";
import AccountInfoContext from "./AccountInfoContext";

const AccountContext = createContext();

export function AccountProvider({children}) {

    const [account, setAccount] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [currentAccount, setCurrentAccount] = useState(null);

    const addAccount = (account) => {
        /// check if account exists by checking classicAddress
        const existingAccount = accounts.find(a => a.classicAddress === account.classicAddress);
        if (!existingAccount) {
            setAccounts([...accounts, account]);
            localStorage.setItem("accounts", JSON.stringify([...accounts, account]));
        }
    }

    const removeAccount = (account) => {
        try {
            console.log("Remove account", account);
            const accts = accounts.filter(acc => acc.classicAddress !== account.classicAddress)
            setAccounts(accts);
            localStorage.setItem("accounts", JSON.stringify(accts));
        } catch (error) {
            console.log(error);
        }
    }

    const switchCurrentAccount = (address) => {
        const account = accounts.find(a => a.classicAddress === address);
        setCurrentAccount(account);
    }

    const initialize = () => {
        try {
            console.log("AccountContextCalled: ")
            const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
            setAccounts(accounts);
            accounts.length > 0 && switchCurrentAccount(accounts[0].classicAddress);
        } catch (eror) {
        }
    }

    useEffect(() => {
        initialize();
    }, [])

    return (
        <AccountContext.Provider value={{
            account, setAccount,
            accounts, addAccount, removeAccount,
            currentAccount, switchCurrentAccount
        }}>
            {children}
        </AccountContext.Provider>
    )
}

export default AccountContext;