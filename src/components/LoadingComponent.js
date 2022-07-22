

import React from 'react'

export default function LoadingComponent() {
  return (
    <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
  )
}
