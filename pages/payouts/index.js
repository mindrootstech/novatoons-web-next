import React, { Fragment, useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
//component
import {PayoutModel} from '../../component/model'
import Loader from '../../component/loader/loader'
import { axiosRequest } from '../../http'
//third-party
import { toast } from 'react-toastify'
import moment from 'moment'
// redux
import { payoutModelShow } from '../../redux/modelReducer'
import { getPayoutTransaction } from '../../redux/userReducer'
import { useDispatch, useSelector } from 'react-redux'

import Link from 'next/link'
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

function PayOut() {
    const payout = '/images/icon/payout.png'
const requested_img = '/images/icon/green.png'
const received_img = '/images/icon/yellow.png'
const greentick = '/images/icon/greentick.png'
const pending = '/images/contentImages/pending.svg'
const [show, setShow] = useState(false)
const { payoutTransaction, loading, userData } = useSelector(state => state.userReducer)
    const { payoutModel } = useSelector(state => state.modelReducer)
    const dispatch = useDispatch()
    const [paypal_id, setPaypal_id] = useState("")
    const [readOnly, setReadOnly] = useState(true)
    useEffect(()=>{
     setShow(true)
    },[])
    useEffect(() => {
        dispatch(
            getPayoutTransaction()
        )

    }, [dispatch])

    const paymentRequest = async () => {
        if (parseFloat(userData.monthly_payout) < 100) {
            return toast.info(<SuccessToast message={"Minimum Payout request amount can't be less than $100"} />, { hideProgressBar: true,  autoClose:  8000, })
        }

        try {
            if ((paypal_id !== "" && paypal_id.length > 12 ) || (userData.paypal_id !== "" && userData.paypal_id.length > 12) ) {
                const response = await axiosRequest({ sub_url: '/updateuserpaypalid', dataMain: { paypal_id : paypal_id !== "" ? paypal_id : userData.paypal_id } })
                setReadOnly(true)
                if (response.status === 200) {
                    dispatch(
                        payoutModelShow(true)
                    )
                    return toast.success(<SuccessToast message={response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
                }
            }
            return toast.success(<SuccessToast message="Please Enter a valid paypal id" />, { hideProgressBar: true,  autoClose:  8000, })
        } catch (err) {
            setReadOnly(true)
            return toast.success(<SuccessToast message={err.response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
        }
        
    }
    

    if (loading && payoutTransaction.data.length === 0 && paypal_id === "") {
        return <Loader />
    } else {
        return ( show &&
            <>
                <div className="tf-section tf-item-details style-2 comicpromotion_section">
                    <div className="themesflat-container pt-80">
                        <div className="row">
                            <div className="col-xl-3 col-md-5 col-xs-12">
                                <div className="content-left">
                                    <div className="payout_image">
                                        <img src={payout} alt="payout" />
                                        <ul className='payout_list'>
                                            <li>
                                                <p className='title_payout_'>Total Revenue Earned:</p>
                                                <p className='price_payout'>${userData.user_revenue}</p>
                                            </li>
                                            <li>
                                                <p className='title_payout_ d-flex justifyViewDetails'>
                                                    <span>Available payout
                                                        <i className="fa fa-question-circle ml-3" aria-hidden="true">
                                                            <div className="tooltiptext third">Payout is only possible when a threshold of $100 is reached. </div>
                                                        </i>
                                                    </span>
                                                
                                                    <Link href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/revenuetransaction`}>View Details</Link></p>
                                                <p className='price_payout'>${userData.monthly_payout}</p>
                                            </li>
                                            <li>
                                                <p className='title_payout_'>Paypal Id</p>
                                                <div className='paypal_field d-flex align-items-center'>
                                                    <input
                                                        className='paypalInput'
                                                        type='text'
                                                        name='paypal_id'
                                                        id='paypal_id'
                                                        value={paypal_id !== "" ? paypal_id : userData.paypal_id}
                                                        onChange={(e) => {
                                                            setPaypal_id(e.target.value)
                                                        }}
                                                        onBlur={paymentRequest}
                                                        readOnly={readOnly} />
                                                    <i className='fa fa-edit' onClick={() => {
                                                        let element = document.getElementById('paypal_id')
                                                        element.focus()
                                                        setReadOnly(false)
                                                    }}></i>
                                                </div>
                                            </li>
                                        </ul>
                                        <div className='comicp_edit_btn'>
                                            <button className="btn transparent-btn" onClick={paymentRequest}>Request for payout</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={!loading && payoutTransaction.data.length > 0 ? "col-xl-9 col-md-7 col-xs-12" : "col-xl-9 col-md-7 col-xs-12 d-flex align-items-center justify-content-center"}>
                                {!loading && payoutTransaction.data.length > 0 ?
                                    <div className="content-right">
                                        {payoutTransaction.data.map((item, index) => {
                                            return <div key={index} className='payment_re_box'>
                                                <div className='row'>
                                                    <div className="col-xl-12 col-md-12 col-xs-12 payment_single_box">
                                                        <div className='d-flex PaymentCardDetails'>
                                                            <div className='d-flex align-items-center'>
                                                                <div className='ImageIcon'>
                                                                    <img src={item.status === "1" ? received_img : requested_img} alt='payment' />
                                                                </div>
                                                                <div className='PaymentContent'>
                                                                    <h4 className='mb-3'>{item.status === "1" ? 'Received' : 'Requested'}</h4>
                                                                    {/* <p>For the month : {moment(item.created_at).format('MMMM YYYY')}</p> */}
                                                                    <div className="Date_Timee">Date: {moment(item.created_at).format('DD-MM-YYYY')}</div>

                                                                </div>
                                                            </div>
                                                            <div className='rightSection'>
                                                                <div className='paymet_Total'>${item.amount}</div>
                                                                <div className='Date_Timee'>
                                                                    <img src={item.status === "1" ? greentick : pending} alt='pending' /> {item.status === "1" ? 'Payment Received' : 'Pending'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        })}

                                    </div>
                                    : <Fragment>
                                        <div className='DataNotFound'>
                                            <h3 className='text-white'>There is no payout history available</h3>
                                        </div>
                                    </Fragment>}
                            </div>
                        </div>
                    </div>
                </div>
                {payoutModel && <PayoutModel />}
            </>
        )
    }
}

export default PayOut