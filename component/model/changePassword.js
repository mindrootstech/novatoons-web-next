import React, { Fragment, useEffect, useState } from 'react'
import { Col, Row, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { postRequest } from '../../commonApi'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux';
import { changePassShow } from '../../redux/modelReducer';


function SuccessToast({ message }) {
  return (
    <Fragment>
      <div className='toastify-header'>
        <div className='title-wrapper'>
          <h6 className='toast-title'>{message}</h6>
        </div>
      </div>
    </Fragment>
  )
}

const ChangePassword = () => {
  const dispatch = useDispatch()
  const [password, setPassword] = useState('')
  const [c_password, setC_Password] = useState('')
  const [error, setError] = useState(false)
  const [passwordError, setPasswordError] = useState(null)
  const { changePass } = useSelector(state => state.modelReducer)
  const onSubmit = async () => {
    if(passwordError !== null) {
      return setPasswordError("Please enter 6 or more digit password")
    }
    if(c_password !== password) {
      return setError(true)
    } else {
      setError(false)
    }
    if(c_password === '') {
      return setError(true)
    }
    if(error) return 
    const dataMain = {
      password
    }
    const response = await postRequest({ sub_url: '/updateprofile', dataMain })
    if (response.status === true) {
      toast.success(<SuccessToast message={response.message} />, { hideProgressBar: true,  autoClose:  8000, })
      setC_Password('')
      setPassword('')
    } else {
      setC_Password('')
      setPassword('')
      toast.success(<SuccessToast message={response.message} />, { hideProgressBar: true,  autoClose:  8000, })
    }
    dispatch(
      changePassShow(false)
    )
  }

  const handleChange = (value, type) => {
    if(type === 'password'){
      if(value.length < 6) {
        setPasswordError("Please enter 6 or more digit password")
      } else {
        setPasswordError(null)
      }
      setPassword(value)
    } else if (type === 'c_password') {
      setC_Password(value)
    }
    
  }

  useEffect(()=>{
    if(c_password !== password) {
      setError(true)
    } else {
      setError(false)
    }
  }, [c_password])

  return (
    <Fragment>
      <Modal fullscreen="sm"
        isOpen={changePass}
        toggle={() => 
          dispatch(
            changePassShow(false)
          )
        }
        className='modal-dialog-centered'>

        <ModalHeader
          toggle={() => 
            dispatch(
              changePassShow(false)
            )
          }></ModalHeader>

        <ModalBody className='ContentTypeModel typeModel'>
          <Row className='mt-2'>
            <Col sm={12}>
              <h3 className='mb-3'>Change Password</h3>
            </Col>
            <Col sm={12}>
              <h4 className="title-infor-account text-white pt-4">New Password</h4>
              <input
                id="password"
                type="password"
                placeholder="New Password"
                className={passwordError !== null ? 'is-invalid' : 'valid'}
                name='password'
                autoComplete="new-password"
                value={password}
                onChange={(e)=> handleChange(e.target.value, 'password')}
              />
              {passwordError !== null && <p className='error_message_pass mt-1'>{passwordError}</p>}
            </Col>
            <Col sm={12}>
              <h4 className="title-infor-account text-white pt-4">Confirm Paasword</h4>
              <input
                id="c_Password"
                type="password"
                placeholder="Confirm Password"
                className={error ? 'is-invalid' : 'valid'}
                name='c_Password'
                value={c_password}
                onChange={(e) => handleChange(e.target.value, 'c_password')}
              />
              {error && <p className='error_message_pass'>Please enter confirm password</p>}
            </Col>
            <Col sm={12} className='text-center'>
              <button onClick={onSubmit} className="tf-button-submit mg-t-15 updatePass mt-5">
                Update Password
              </button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default ChangePassword