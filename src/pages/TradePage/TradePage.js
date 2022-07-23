

import React, { useContext, useState } from 'react'
import LoadingComponent from '../../components/LoadingComponent'
import AccountContext from '../../contexts/AccountContext'
import AccountInfoContext from '../../contexts/AccountInfoContext'
import OfferContext from '../../contexts/OfferContext'
import XRPLClientContext from '../../contexts/XRPLClientContext'
import MyOfferContext from '../../contexts/MyOfferContext'
import { xrpl } from '../../utils/constants'

export default function TradePage() {

  const {connected, client} = useContext(XRPLClientContext)
  const {accounts, currentAccount} = useContext(AccountContext)
  // const {currentAccount} = useContext(AccountInfoContext)
  // const {account} = useContext(AccountInfoCon)

  const {
    offers, setOffers,
    whatToBuy, setWhatToBuy,
    whatToSell, setWhatToSell,
    amountToSell, setAmountToSell,
    amountToGet, setAmountToGet,
    findingOffers, setFindingOffers,
    quality, setQuality,
    tradables, swap
  } = useContext(OfferContext)

  const {
    loadMyOffers
  } = useContext(MyOfferContext)

  // const [account, setAccount] = useState(null);
  // const [accountDetail, setAccountDetail] = useState(null);

  // const getAccountDetail = async (acct) => {
  //   console.log(acct)
  //   try {
  //       setAccount(null)
  //       setAccountDetail(null)
  //       client.connect().then(async () => {
  //           const {classicAddress} = JSON.parse(acct)
  //           const acct = accounts.find(a => a.classicAddress === acct)

  //           const account = await client.request({
  //               "command": "account_info",
  //               "account": acct.classicAddress
  //           });
  //           setAccount(account.result.account_data);
  //           setAccountDetail(acct)
  //           // client.disconnect();
  //       }).catch (err => {client.disconnect()})
  //   } catch(err) {
  //       // setMessage(err.message);
  //       setAccount(null);
  //       setTimeout(() => {
  //           // setMessage("");
  //       }, 2000)
  //   }
  // }

  const findOffers = async () => {
    try {
      console.log("Account: ", currentAccount)
      const offerRequesr = {
        "command": "book_offers",
        "taker": currentAccount.classicAddress,
        "taker_gets": {
          "currency": whatToSell.symbol,
          ...(whatToSell.symbol == "XRP" ? {} : {"issuer": whatToSell.issuer}),
          "value": `${whatToSell.symbol == "XRP" ? xrpl.xrpToDrops(amountToSell) : amountToSell}`
        },
        "taker_pays": {
          "currency": whatToBuy.symbol,
          ...(whatToBuy.symbol == "XRP" ? {} : {"issuer": whatToBuy.issuer}),
          "value": `${whatToBuy.symbol == "XRP" ? xrpl.xrpToDrops(amountToGet) : amountToGet}`
        },
        "limit": 1000,
        "ledger_index" : "current"
      }

      setFindingOffers(true)

      client.connect()
      .then(async (res) => {
        console.log("Connected: ", res)
        console.log("Request: ", offerRequesr)
        const offerResponse = await client.request(offerRequesr)

        console.log("Offer Response: ", offerResponse)
        const offers = offerResponse.result.offers;
        setOffers(offers)
        if (amountToSell && amountToGet) {

          // setQuality((Number(whatToSell.symbol == "XRP" ? xrpl.xrpToDrops(amountToSell) : amountToSell) 
          // / Number(whatToBuy.symbol == "XRP" ? xrpl.xrpToDrops(amountToGet) : amountToGet)))

          // setOffers(offers.filter(offer => {
          //   const isMet = offer.quality <= quality;
          //   return isMet
          // }))
        }
        // setOffers(offerResponse.result.offers)
        setFindingOffers(false)
      })
      .catch (err => {
        console.log("CatchError: ", err)
        setFindingOffers(false)
        client.disconnect()
      })
    } catch (error) {
      setFindingOffers(false)
      console.log("TryCatchedError: ", error)
    }
  }

  const acceptOffer = async (offerValue) => {
      try {
        const offer_1 = {
          "TransactionType": "OfferCreate",
          "Account": currentAccount.classicAddress,
          "TakerPays": whatToBuy.symbol == "XRP" ? xrpl.xrpToDrops(amountToGet) : {
            currency: whatToBuy.symbol,
            ...(whatToBuy.symbol == "XRP" ? {} : {issuer: whatToBuy.issuer}),
            value: `${whatToBuy.symbol == "XRP" ? xrpl.xrpToDrops(amountToGet) : amountToGet}`
          },
          // "TakerGets": xrpl.xrpToDrops(amount)
          "TakerGets": whatToSell.symbol == "XRP" ? xrpl.xrpToDrops(amountToSell) : {
            currency: whatToSell.symbol,
            ...(whatToSell.symbol == "XRP" ? {} : {issuer: whatToSell.issuer}),
            value: `${whatToSell.symbol == "XRP" ? xrpl.xrpToDrops(amountToSell) : amountToSell}`
          },
          "Flags": xrpl.OfferCreateFlags.tfSell
        }
    
        console.log("Offer 1: ", offer_1)
    
        
        client.connect()
        .then(async (res) => {
          console.log("Conected: ", res)

          const prepared = await client.autofill(offer_1)
          console.log("PreparedTransaction:", JSON.stringify(prepared, null, 2))
          const wallet = xrpl.Wallet.fromSeed(currentAccount.seed)
          const signed = wallet.sign(prepared)

          const createOfferResponse = await client.submitAndWait(signed.tx_blob)
          console.log("CreateOfferRes: ", createOfferResponse)
          loadMyOffers()
        })
        .catch (err => {
          console.log("Error: ", err)
          client.disconnect()
        })
      } catch (error) {
        console.log("Error: ", error)
          client.disconnect()
      }
  }

  return (
    <div className='container-fluid bg-light p-2 h-100'>
      {connected ? 
      <div className='row'>
        {/* The Side Bar to provide over detail */}
        <div className='col-md-3'>
            {/* <div class="input-group input-group-sm mb-3">
                <label className="input-group-text" for="source">Wallet</label>
                <select class="form-select" aria-label="Select Source" id='source' onChange={(elem) => getAccountDetail(elem.target.value)}>
                    <option selected>Select Wallet</option>
                    {accounts.map((account, index) => {
                        return <option key={index} value={account.classicAddress}>{account.name}</option>
                    })}
                </select>
                <label class="input-group-text" for="source">{account != null ? (Number(account.Balance)/1000000).toFixed(2) : '0'} XRP</label>
            </div> */}

            {currentAccount != null ? <>

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

              <div class="input-group input-group-sm mb-3">
              <input 
                  value={amountToSell} onChange={(val) => setAmountToSell(val.target.value)} placeholder={`How much ${whatToSell && whatToSell.symbol} to sell?`}
                  type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"></input>
              </div>

              <div class="input-group input-group-sm mb-3">
              <input 
                  value={amountToGet} onChange={(val) => setAmountToGet(val.target.value)} placeholder={`How much ${whatToBuy && whatToBuy.symbol} do you want to get`}
                  type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"></input>
              </div>
            </> : <div className='alert alert-info'>
              Please connect/select a wallet
            </div>}


            {(!findingOffers) ? 
              <>
                <button onClick={() => findOffers()} type="button" 
                    className="btn btn-primary"
                        style={{
                            "--bs-btn-padding-y": ".25rem", "--bs-btn-padding-x": ".5rem", "--bs-btn-font-size": ".75rem"
                        }}>
                    {findingOffers ? 'Please wait...' : 'Find Offers'}
                </button>
                <br/>
                <div style={{height: "10px"}}></div>

                {
                  (whatToBuy && whatToSell) && <>
                    {/* <div style={{width: "10px"}}></div> */}
                    <button onClick={() => swap()} type="button" 
                        className="btn btn-primary"
                            style={{
                                "--bs-btn-padding-y": ".25rem", "--bs-btn-padding-x": ".5rem", "--bs-btn-font-size": ".75rem"
                            }}>
                        Swap
                    </button>
                    <br/>
                    <div style={{height: "10px"}}></div>
                  </> 
                }
              </>
              :
              <button class="btn btn-primary" type="button" disabled={findingOffers}>
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span class="visually-hidden">Loading...</span>
              </button>
            }

            {(amountToGet && amountToSell) ? <button onClick={() => acceptOffer(0)} type="button" 
                className="btn btn-primary"
                    style={{
                        "--bs-btn-padding-y": ".25rem", "--bs-btn-padding-x": ".5rem", "--bs-btn-font-size": ".75rem"
                    }}>
                Create Offer
            </button> : <></>}
        </div>


        {/* The list of available offers */}
        <div className='col-md-9'>
          {/* {JSON.stringify(offers)} */}
          {findingOffers ? 
            <LoadingComponent/> :
            <>
              <p>{offers.length} Offers for {whatToBuy && whatToBuy.symbol} / {whatToSell && whatToSell.symbol} {quality} QTY</p>
              <div style={{
                height: "85vh",
                overflowY: "scroll"
              }}>
                <table className='table table-responsive table-stripe'>
                  <thead className='sticky-top bg-dark text-light'>
                    <tr>
                      <th>ID</th>
                      <th>A/T</th>
                      <th>Taker Gets</th>
                      <th>Taker Pays</th>
                      <th>Owner Fund</th>
                      <th>Expiry</th>
                      {/* <th></th> */}
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

                      
                      return <tr key={index} className={currentAccount && (offer.Account == currentAccount.classicAddress ? `bg-primary` : ``)}>
                        <td>{index}</td>
                        <td>1 {whatToSell.symbol} = {(tps/tgs).toFixed(2)} {whatToBuy.symbol}</td>
                        <td>{tgs} {tgc}</td>
                        <td>{tps} {tpc}</td>
                        <td>{!offer.owner_funds ? "-" : whatToSell.symbol === 'XRP' ?
                          Number(offer.owner_funds)/1000000 : Number(offer.owner_funds)
                        } 
                          {whatToSell.symbol} 
                        </td>
                        <td>{offer.Expiration}</td>
                        {/* <td><button onClick={() => acceptOffer(tgs)} type="button" className="btn btn-success">Take Offer</button></td> */}
                      </tr>
                    })}
                  </tbody>
                </table>
              </div>
            </>
          }
          
        </div>
      </div> :
      <LoadingComponent/>}
    </div>
  )
}
