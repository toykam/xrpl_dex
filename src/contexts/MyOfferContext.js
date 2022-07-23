import { createContext, useContext, useState, useEffect } from "react";
import React from 'react'
import XRPLClientContext from "./XRPLClientContext";
import AccountInfoContext from "./AccountInfoContext";
import AccountContext from "./AccountContext";
import { xrpl } from "../utils/constants";

const MyOfferContext = createContext();

export function MyOfferProvider({children}) {

    const [myOffers, setMyOffers] = useState([]);
    const [loadingMyOffers, setLoadingMyOffers] = useState(false)

    const {client} = useContext(XRPLClientContext)
    // const {currentAccount} = useContext(AccountInfoContext)
    const {accounts, currentAccount} = useContext(AccountContext)

    const loadMyOffers = async () => {
        if (currentAccount != null) {
            console.log("Account: ", currentAccount);
            try {
                client.connect()
                .then(async () => {
                    setLoadingMyOffers(true)
                    const offers = await client.request({
                        "command": "account_offers",
                        "account": currentAccount.classicAddress
                    });
                    setMyOffers(offers.result.offers);
                    setLoadingMyOffers(false)
                })
            } catch (error) {
                setLoadingMyOffers(false)
                console.log(error)
                client.disconnect();
            }
        }
    }

    const cancelOffer = async (offerSequence) => {
        console.log("Account: ", currentAccount);
        try {
            client.connect()
            .then(async () => {
                setLoadingMyOffers(true)

                const offerToCancel = {
                    "TransactionType": "OfferCancel",
                    "Account": currentAccount.classicAddress,
                    "OfferSequence": offerSequence
                };

                const acct = accounts.find(a => a.classicAddress === currentAccount)
                const wallet = xrpl.Wallet.fromSeed(acct.seed);
                const prepare = await client.autofill(offerToCancel)

                const tx = wallet.sign(prepare)

                const result = await client.submitAndWait(tx.tx_blob);
                console.log("CancelOfferRes: ", result)
                loadMyOffers()
            })
        } catch (error) {
            setLoadingMyOffers(false)
            console.log(error)
            client.disconnect();
        }
    }

    useEffect(() => {
        console.log("MyOfferProvider: useEffect")
        console.log("currentAccount: ", currentAccount)
        console.log("MyOfferProvider: useEffect")
      loadMyOffers();
    }, [currentAccount])
    
    return (
        <MyOfferContext.Provider value={{
            myOffers,
            loadingMyOffers,
            loadMyOffers, cancelOffer
        }}>
            {children}
        </MyOfferContext.Provider>
    )
}


export default MyOfferContext;