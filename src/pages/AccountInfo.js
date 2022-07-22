

import React, { useContext } from 'react'
import AccountInfoContext from '../contexts/AccountInfoContext';

export default function AccountInfoPage() {

  const {account, transactions, loadingAccountInfo} = useContext(AccountInfoContext);
  return (
    <div>
      <h3>Account Info</h3>

      {account == null ? 
        <p>Select an account to display its info</p> : 
        loadingAccountInfo ? <p>Please wait loading</p> :
        <div>
          <p>Account: {account.Account}</p>
          <p>Balance: {account.Balance / 1000000} XRP</p>
          <p>Transactions: {transactions.length} tx</p>

          <hr/>

          <h3>Transactions</h3>

          <table className='table table-responsive table-stripe'>
            <thead>
              <tr>
                <th>Fee</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(txx => {
                const {tx} = txx;
                const date = new Date(tx.date);
                return (
                  <tr key={tx.hash}>
                    <td>{Number(tx.Fee)/1000000} XRP</td>
                    <td>{
                      tx.Amount == null ? "--" : 
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
