

import React from 'react'
// import { AccountInfoProvider } from '../contexts/AccountInfoContext'
import AccountInfoPage from './AccountInfo'
import ConnectWallet from './ConnectWallet'

export default function HomePage() {
  return (
    <div className='container-fluid row bg-light p-2 overflow-auto'>

        <div className='col-md-4'>
          <ConnectWallet></ConnectWallet>
        </div>

        
        <div className='col-md-8'>
            <AccountInfoPage></AccountInfoPage>
        </div>

    </div>
  )
}
