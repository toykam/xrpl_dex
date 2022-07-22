
import React, { createContext, useEffect, useState } from "react";
import { client } from "../utils/constants";

const XRPLClientContext = createContext();

export function XRPLClientProvider({children}) {
    const [connected, setConneted] = useState(false);

    const connect = () => {
        client.connect().then(() => {
            console.log("Connected to XRPL");
            setConneted(true);
        }).catch(err => {
            console.log("Error connecting to XRPL: ", err);
            setConneted(false);
            connect();
        })
    }


    useEffect(() => {
        connect();
    }, [])

    return (
        <XRPLClientContext.Provider value={{
            connected,
            client
        }}>
            {children}
        </XRPLClientContext.Provider>
    )
}

export default XRPLClientContext;