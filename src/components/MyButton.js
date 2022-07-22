

import React from 'react'

export default function MyButton({label, onClick, type='primary'}) {
  return (
    <button  onClick={() => onClick()} type="button" 
        className={`btn btn-${type}`}
            style={{
                "--bs-btn-padding-y": ".25rem", "--bs-btn-padding-x": ".5rem", "--bs-btn-font-size": ".75rem"
            }}>
        {label}
    </button>
  )
}
