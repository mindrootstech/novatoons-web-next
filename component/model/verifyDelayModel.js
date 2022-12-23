import React, { Fragment, useState, useEffect, useRef } from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import logo from '../../assets/images/errorpage/logo.png'
//Third party
import { useNavigate, useSearchParams } from 'react-router-dom'
//redux
import { useDispatch, useSelector } from 'react-redux';
import { verifyUserShow } from '../../redux/modelReducer';
import { resetUserData } from '../../pages/user/userReducer';
//api
import { axiosRequest } from '../../http'

import { toast } from 'react-toastify'
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

const VerifyModel = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [count, setCount] = useState(30)
    const countRef = useRef(30)
    const [searchParams] = useSearchParams()
    const { verifyUserModel } = useSelector(state => state.modelReducer)
    const { userData, error } = useSelector(state => state.userReducer)

    useEffect(() => {
        if (userData.is_verified === "1") {
            dispatch(
                verifyUserShow(false)
            )
        }
    }, [userData])


    const handleResendEmail = async () => {
        try {
            const response = await axiosRequest({ sub_url: './resendverifyemail' })
            if (response.status === 200) {
                toast.success(<SuccessToast message={response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
                let interval = setInterval(() => {
                    if (countRef.current === 0) {
                        clearInterval(interval)
                        setCount(30)
                        countRef.current = 30
                        return interval = undefined
                    }
                    countRef.current = countRef.current - 1
                    setCount(countRef.current)
                }, 1000)
            }
        } catch (err) {
            return toast.success(<SuccessToast message={err.response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
        }
    }

    const handleLogout = async () => {
        try {
            const response = await axiosRequest({sub_url: "/logout"})
            if(response.status === 200) {
                localStorage.clear()
                sessionStorage.clear()
                dispatch(resetUserData())
                dispatch(
                    verifyUserShow(false)
                )
                navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/login`)
            }
        } catch (err) {
            return toast.success(<SuccessToast message={err.response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
        }
    }

    return (
        <Fragment>
            <Modal
                fullscreen='xl'
                isOpen={verifyUserModel}
                toggle={() =>
                    dispatch(
                        verifyUserShow(false)
                    )
                }
                className='modal-dialog-centered'>
                    <ModalHeader
                    toggle={() =>
                        dispatch(
                            verifyUserShow(false)
                        )
                    }
                ></ModalHeader>

                <ModalBody className='ContentTypeModel'>
                    <div className="row pt-5 pb-5">
                        <div className="text-align-center col-sm-12">
                            <img className="logoImage verifyLogo" src={logo} alt="" />
                        </div>
                        {
                            searchParams.get('token') && !error ?
                                <h3 className='text-center w-100 mt-5 mb-5'>Verifying...</h3> :
                                <div className="text-align-center col-sm-12">
                                    <p className="white dummy verifyUserText">Seems like you haven't verified your email yet. Please verify your email to use the platform. Please check your registered email id for the verification link.</p>
                                </div>
                        }
                        <div className='w-100 d-flex align-items-center justify-content-center flex-direction-column'>
                            <div className='actionBtn'>
                                <button className={count !== 30 ? 'submit m-auto resentEmail disableBtn' : 'submit m-auto resentEmail'} disabled={count !== 30} onClick={handleResendEmail}>Resend Email </button>
                                <button className='submit m-auto resentEmail' onClick={handleLogout}>Logout</button>
                            </div>
                            {count !== 30 && <p className='mt-2 fw-600'>Resend email in {count}s</p>}
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default VerifyModel