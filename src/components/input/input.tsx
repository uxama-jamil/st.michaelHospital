import React from 'react'
import { CFormFloating, CFormInput } from '@coreui/react'



const Input = (
  props
) => {
  return (
    <div className='c-input-container'>

      <CFormInput
        {...props}
      />
    </div>
  )
}

export default Input;
