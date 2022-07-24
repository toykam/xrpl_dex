

import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import AccountContext from '../contexts/AccountContext'
// import XRPLClientContext from '../contexts/XRPLClientContext';

export default function NavBar() {

    const {accounts, switchCurrentAccount, currentAccount} = useContext(AccountContext);
    // const {client} = useContext(XRPLClientContext);

  return (
    <nav class="navbar navbar-expand-lg bg-dark App-header sticky-top px-2">

      <div class="container-fluid">
        <a class="navbar-brand text-light" href="#">XRPL Trading App</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">

            <li class="nav-item">
              <Link to="/" className='nav-link fs-6 text-light'>Home</Link>
            </li>

            <li class="nav-item">
              <Link to="/transfer" className='nav-link fs-6 text-light'>Transfer</Link>
            </li>

            <li class="nav-item">
              <Link to="/trade" className='nav-link fs-6 text-light'>Trade</Link>
            </li>

            <li class="nav-item">
              <Link to="/my_offers" className='nav-link fs-6 text-light'>My Offers</Link>
            </li>

          </ul>
        </div>

        <div class="d-flex">

            <div class="input-group input-group-sm">
                <label className="input-group-text" for="source">Wallet</label>
                <select 
                  value={currentAccount && currentAccount.classicAddress}
                  class="form-select" aria-label="Select Source" 
                  id='source' onChange={(elem) => switchCurrentAccount(elem.target.value)}>
                    <option selected>Select Wallet</option>
                    {accounts.map((account, index) => {
                        return <option key={index} value={account.classicAddress}>{account.name}</option>
                    })}
                </select>
            </div>

        </div>
      </div>

    </nav>
  )
}
