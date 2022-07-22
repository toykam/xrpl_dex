

import React, { useContext } from 'react'
import LoadingComponent from '../components/LoadingComponent';
import MyOfferContext from '../contexts/MyOfferContext'

export default function MyOffersPage() {

    const {myOffers, loadingMyOffers, loadMyOffers, cancelOffer} = useContext(MyOfferContext)
    

    return (
        <div className='col-md-12'>
          {loadingMyOffers ? 
            <LoadingComponent/> :
            myOffers.length == 0 ? <div className='text-center'>
                <h3>You have no offers</h3>
            </div> : <>
              <p>{myOffers.length} Offers <strong onClick={() => loadMyOffers()} className="fw-5 text-info">reload</strong></p>
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
                      {/* <th>Owner Fund</th> */}
                      {/* <th>Expiry</th> */}
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {myOffers.map((offer, index) => {
                        console.log("offer: ", index, " == ", offer);
                      const tgs = typeof offer.taker_gets == "object" ?  
                      Number(offer.taker_gets.value ): 
                      Number(offer.taker_gets) / 1000000;

                      let tgc = "XRP";
                      const tps = typeof offer.taker_pays == "object" ?  
                      Number(offer.taker_pays.value): 
                      Number(offer.taker_pays) / 1000000;;
                      let tpc = "XRP";

                      if (typeof offer.taker_gets == "object") {
                        tgc = offer.taker_gets.currency;
                      }

                      if (typeof offer.taker_pays == "object") {
                        tpc = offer.taker_pays.currency;
                      }

                    //   if (typeof offer.TakerGets )

                      
                      return <tr key={index}>
                        <td>{index}</td>
                        <td>1 {tgc} = {(tps/tgs).toFixed(2)} {tpc}</td>
                        <td>{tgs} {tgc}</td>
                        <td>{tps} {tpc}</td>
                        {/* <td>{!offer.owner_funds ? "-" : "whatToSell.symbol" === 'XRP' ?
                          Number(offer.owner_funds)/1000000 : Number(offer.owner_funds)
                        }
                        </td> */}

                        {/* <td>{offer.Expiration}</td> */}
                        <td><button onClick={() => cancelOffer(offer.seq)} type="button" className="btn btn-danger">Cancel Offer</button></td>
                      </tr>
                    })}
                  </tbody>
                </table>
              </div>
            </>
          }
          
        </div>
    )
}
