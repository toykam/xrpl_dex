
import React, { createContext, useContext, useEffect, useState } from "react";
import AccountInfoContext from "./AccountInfoContext";

const AccountContext = createContext();

export function AccountProvider({children}) {

    const [account, setAccount] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const {loadAccountInfo} = useContext(AccountInfoContext);

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

    const initialize = () => {
        try {
            const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
            setAccounts(accounts);
            accounts.length > 0 && loadAccountInfo(accounts[0].classicAddress);
        } catch (eror) {
        }
    }

    useEffect(() => {
        initialize();

        
    }, [])

    return (
        <AccountContext.Provider value={{
            account, setAccount,
            accounts, setAccounts, addAccount, removeAccount
        }}>
            {children}
        </AccountContext.Provider>
    )
}

export default AccountContext;