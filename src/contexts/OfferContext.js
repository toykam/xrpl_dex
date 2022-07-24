import XRPLClientContext from "./XRPLClientContext";
import React from 'react'
const { createContext, useContext, useState } = require("react");


const OfferContext = createContext();

export function OfferProvider({children}) {

    const [offers, setOffers] = useState([]);
    const [whatToBuy, setWhatToBuy] = useState(null)
    const [whatToSell, setWhatToSell] = useState(null)
    const [amountToSell, setAmountToSell] = useState(0)
    const [amountToGet, setAmountToGet] = useState(0)
    const [findingOffers, setFindingOffers] = useState(false)
    const [quality, setQuality] = useState(0)

    const {client} = useContext(XRPLClientContext)

    const tradables = [
        {
          'symbol': 'XRP',
          'name': 'XRP',
          'issuer': '',
        },
        {
          'symbol': '534F4C4F00000000000000000000000000000000',
          'name': 'Sologenic',
          'issuer': 'rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz',
        },
        {
          'symbol': 'ELS',
          'name': 'ELS',
          'issuer': 'rHXuEaRYnnJHbDeuBH5w8yPh5uwNVh5zAg',
        },
        {
          'symbol': 'VGB',
          'name': 'Vagabond',
          'issuer': 'rhcyBrowwApgNonehKBj8Po5z4gTyRknaU',
        },
        {
          'symbol': 'USD',
          'name': 'US Dollars',
          'issuer': 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
        },
        {
          'symbol': 'APX',
          'name': 'APXX',
          'issuer': 'rL2sSC2eMm6xYyx1nqZ9MW4AP185mg7N9t',
        },
        {
          'symbol': 'MLD',
          'name': 'MLD',
          'issuer': 'rhJYDuVMQxabTyiWuHQkQyDxr6uZEdpv5u',
        }
    ]

    const swap = () => {
      const temp = whatToBuy
      setWhatToBuy(whatToSell)
      setWhatToSell(temp)
    }



    return (
        <OfferContext.Provider 
            value={{
                tradables,
                swap,
                offers, setOffers,
                whatToBuy, setWhatToBuy,
                whatToSell, setWhatToSell,
                amountToSell, setAmountToSell,
                amountToGet, setAmountToGet,
                findingOffers, setFindingOffers,
                quality, setQuality,
            }}>
            {children}
        </OfferContext.Provider>
    )
}

export default OfferContext