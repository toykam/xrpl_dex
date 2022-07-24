

import React, { useContext } from 'react'
import AccountInfoContext from '../contexts/AccountInfoContext';
import MyOfferContext from '../contexts/MyOfferContext';

export default function AccountInfoPage() {

  const {account, transactions, loadingAccountInfo, accountBalance, accountTrustLines} = useContext(AccountInfoContext);
  const {myOffers} = useContext(MyOfferContext)
  return (
    <div style={{
      height: "90vh",
      overflowY: "auto",
    }}>
      <h3>Account Info</h3>

      {account == null ? 
        <p>Select an account to display its info</p> : 
        loadingAccountInfo ? <p>Please wait loading</p> :
        <div>
          <p>Account: {account.Account}</p>
          <p>Balance: {accountBalance} XRP</p>
          <p>Trust Lines: {accountTrustLines.map((t) => t.currency).toString()}</p>
          <p>Transactions: {transactions.length} tx</p>
          <p>Offers: {myOffers.length} offers</p>

          <hr/>

          <h3>Transactions</h3>

          <table className='table table-responsive table-stripe'>
            <thead>
              <tr>
                <th>TransactionType</th>
                <th>Fee</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(txx => {
                const {tx} = txx;
                const date = new Date(tx.date);
                // console.log("tx: ", tx);
                return (
                  <tr key={tx.hash}>
                    <td className='d-flex flex-sm-column align-items-start flex-nowrap' style={{"width": "100px"}}>
                      <p style={{"marginBottom": 0}} className={tx.TransactionType.includes('Cancel') ? 'bg-danger' : 'bg-primary'}>{tx.TransactionType}</p>
                      <small>{
                        tx.TransactionType.includes("OfferCreate") ? 
                          typeof tx.TakerGets == "string" ? `${Number(tx.TakerGets) / 1000000} XRP for ${tx.TakerPays.value} ${tx.TakerPays.currency}` :  
                          `${Number(tx.TakerPays) / 1000000} XRP for ${tx.TakerGets.value} ${tx.TakerGets.currency}` :
                          <></>
                      }</small>
                    </td>
                    <td>{Number(tx.Fee)/1000000} XRP</td>
                    <td>{
                      tx.Amount == null ? "transaction" : 
                      (typeof tx.Amount) == "string" ? `${Number(tx.Amount) / 1000000} XRP` :
                      `${tx.Amount.value} ${tx.Amount.currency}`
                    }</td>
                    <td>{date.toDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      }
    </div>
  )
}
