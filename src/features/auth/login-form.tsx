import React from 'react'
import {
  CButton,
  CForm,
  CFormInput,
  CCard,
  CCardBody,
} from '@coreui/react'
import Input from '@component/input/input'
import Button from '@component/button/button'

const Loginform = ()=>{

    return<>
    <CCard className="login-box">
          <CCardBody>
            <div className="form-title">Sign In</div>
            <div className="form-subtitle">Enter your credentials to sign in to your account</div>

            <CForm>
              <Input  placeholder='Email' label='' />
              <CFormInput type="password" placeholder="Password" className="mb-3" />

              <a className="forgot-link" href="#">Forgot password?</a>

              {/* <CButton type="submit" className="login-btn mt-4">Sign In</CButton> */}
              <Button />
            </CForm>
          </CCardBody>
        </CCard>
    </>
}

export default Loginform