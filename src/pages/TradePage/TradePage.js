

import React, { useContext, useEffect, useState } from 'react'
import AccountContext from '../../contexts/AccountContext'
import XRPLClientContext from '../../contexts/XRPLClientContext'

export default function TradePage() {

  const {connected, client} = useContext(XRPLClientContext)
  const {accounts} = useContext(AccountContext)
  const [whatToBuy, setWhatToBuy] = useState(null)
  const [whatToSell, setWhatToSell] = useState(null)
  const [offers, setOffers] = useState([])

  const [findingOffers, setFindingOffers] = useState(false)

  const [amount, setAmount] = useState(0)

  const [account, setAccount] = useState(null);
  const [accountDetail, setAccountDetail] = useState(null);

  const tradables = [
    {
      'symbol': 'XRP',
      'name': 'XRP',
      'issuer': '',
    },
    {
      'symbol': 'SOLO',
      'name': 'Sologenic',
      'issuer': 'rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz',
    },
    {
      'symbol': 'ELS',
      'name': 'ELS',
      'issuer': 'rHXuEaRYnnJHbDeuBH5w8yPh5uwNVh5zAg',
    }
  ]

  const getAccountDetail = async (acct) => {
    console.log(acct)
    try {
        setAccount(null)
        setAccountDetail(null)
        client.connect().then(async () => {
            const {classicAddress} = JSON.parse(acct)
            const account = await client.request({
                "command": "account_info",
                "account": classicAddress
            });
            setAccount(account.result.account_data);
            setAccountDetail(JSON.parse(acct))
            // client.disconnect();
        }).catch (err => {client.disconnect()})
    } catch(err) {
        // setMessage(err.message);
        setAccount(null);
        setTimeout(() => {
            // setMessage("");
        }, 2000)
    }
  }

  const swap = () => {
    const temp = whatToBuy
    setWhatToBuy(whatToSell)
    setWhatToSell(temp)
  }
  const findOffers = async () => {
    try {
      const offerRequesr = {
        "id": 4,
        "command": "book_offers",
        "taker": accountDetail.classicAddress,
        "taker_gets": {
          "currency": whatToSell.symbol,
          ...(whatToSell.symbol == "XRP" ? {} : {"issuer": whatToSell.issuer})
        },
        "taker_pays": {
          "currency": whatToBuy.symbol,
          ...(whatToBuy.symbol == "XRP" ? {} : {"issuer": whatToBuy.issuer}),
          "value": "10"
        },
        "limit": 50
      }

      setFindingOffers(true)

      client.connect()
      .then(async (res) => {
        console.log("Connected: ", res)
        console.log("Request: ", offerRequesr)
        const offerResponse = await client.request(offerRequesr)

        console.log("Offer Response: ", offerResponse)

        setOffers(offerResponse.result.offers)
        setFindingOffers(false)
      })
      .catch (err => {
        console.log("Error: ", err)
        setFindingOffers(false)
        client.disconnect()
      })
    } catch (error) {
      setFindingOffers(false)
      console.log(error)
    }
  }

  const acceptOffer = async (offer) => {

  }

  return (
    <div className='container-fluid bg-light p-2 h-100'>
      {connected ? 
      <div className='row'>
        {/* The Side Bar to provide over detail */}
        <div className='col-md-4'>
            <div class="input-group input-group-sm mb-3">
                <label className="input-group-text" for="source">Wallet</label>
                <select class="form-select" aria-label="Select Source" id='source' onChange={(elem) => getAccountDetail(elem.target.value)}>
                    <option selected>Select Wallet</option>
                    {accounts.map((account, index) => {
                        return <option key={index} value={JSON.stringify(account)}>{account.name}</option>
                    })}
                </select>
                <label class="input-group-text" for="source">{account != null ? (Number(account.Balance)/1000000).toFixed(2) : '0'} XRP</label>
            </div>

            {accountDetail != null ? <>

              <div class="input-group input-group-sm mb-3">
                <label className="input-group-text" for="source">Buy</label>
                <select class="form-select" aria-label="Select what to buy" id='source' value={JSON.stringify(whatToBuy)} onChange={(elem) => {
                    setWhatToBuy(JSON.parse(elem.target.value))
                }}>
                    <option value={JSON.stringify(null)}>Select what to buy</option>
                    {tradables.map((account, index) => {
                        // return <option key={index} value={JSON.stringify(account)}>{account.name}</option>
                        return <option disabled={whatToSell == null ? false : whatToSell.symbol === account.symbol} key={index} value={JSON.stringify(account)}>{account.name}</option>
                    })}
                </select>
                {/* <label class="input-group-text" for="source">{account != null ? (Number(account.Balance)/1000000).toFixed(2) : '0'} XRP</label> */}
              </div>


              <div class="input-group input-group-sm mb-3">
                <label className="input-group-text" for="source">Sell</label>
                <select class="form-select" aria-label="Select what to sell" id='source' value={JSON.stringify(whatToSell)} onChange={(elem) => {
                    setWhatToSell(JSON.parse(elem.target.value))
                }}>
                    <option value={JSON.stringify(null)}>Select what to sell</option>
                    {tradables.map((account, index) => {
                        return <option disabled={whatToBuy == null ? false : whatToBuy.symbol === account.symbol} key={index} value={JSON.stringify(account)}>{account.name}</option>
                    })}
                </select>
                {/* <label class="input-group-text" for="source">{account != null ? (Number(account.Balance)/1000000).toFixed(2) : '0'} XRP</label> */}
              </div>

              {/* <div class="input-group input-group-sm mb-3">
              <input 
                  value={amount} onChange={(val) => setAccount(val.target.value)} placeholder={`How much XRP to sell for ${whatToBuy != null ? whatToBuy.name : ''}`}
                  type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"></input>
              </div> */}
            </> : <></>}


            {!findingOffers ? 
            <>
              <button onClick={() => findOffers()} type="button" 
                  className="btn btn-primary"
                      style={{
                          "--bs-btn-padding-y": ".25rem", "--bs-btn-padding-x": ".5rem", "--bs-btn-font-size": ".75rem"
                      }}>
                  {findingOffers ? 'Please wait...' : 'Find Offers'}
              </button>

              {
                (whatToBuy && whatToSell) && <button onClick={() => swap()} type="button" 
                    className="btn btn-primary"
                        style={{
                            "--bs-btn-padding-y": ".25rem", "--bs-btn-padding-x": ".5rem", "--bs-btn-font-size": ".75rem"
                        }}>
                    Swap
                </button>
              }
            </>
            :
            <button class="btn btn-primary" type="button" disabled={findingOffers}>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span class="visually-hidden">Loading...</span>
            </button>}
        </div>


        {/* The list of available offers */}
        <div className='col-md-8'>
          {/* {JSON.stringify(offers)} */}
          <p>{offers.length} Offers for {whatToBuy && whatToBuy.symbol} / {whatToSell && whatToSell.symbol}</p>
          <table className='table table-responsive table-stripe'>
            <thead>
              <tr>
                {/* <th>Quality</th> */}
                <th>A/T</th>
                <th>Taker Gets</th>
                <th>Taker Pays</th>
                <th>Expiry</th>
                <th>Cancel</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer, index) => {
                const tgs = typeof offer.TakerGets == "object" ?  
                Number(offer.TakerGets.value ): 
                Number(offer.TakerGets) / 1000000;

                const tgc = whatToSell.symbol;;
                const tps = typeof offer.TakerPays == "object" ?  
                Number(offer.TakerPays.value ): 
                Number(offer.TakerPays) / 1000000;;
                const tpc = whatToBuy.symbol;
                return <tr key={index}>
                  {/* <td>{offer.quality}</td> */}
                  <td>1 XRP = {(tps/tgs).toFixed(2)}<br/>1 XRP = {(tgs/tps).toFixed(2)}</td>
                  <td>{tgs} {tgc}</td>
                  <td>{tps} {tpc}</td>
                  <td>{offer.Expiration}</td>
                  <td><button onClick={() =>{}} type="button" className="btn btn-danger">Cancel</button></td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
      </div> :
      <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
          </div>
      </div>}
    </div>
  )
}
