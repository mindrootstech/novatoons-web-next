import React, { Fragment, useState, useEffect } from 'react'
import { Col, Row, Modal, ModalBody, ModalHeader, Form } from 'reactstrap';
//third-party
import { toast } from 'react-toastify'
//redux
// import { useDispatch, useSelector } from 'react-redux'
// import { payoutModelShow } from '../../redux/modelReducer'
// import {getPayoutTransaction} from '../../pages/user/userReducer'
// import { postRequest } from '../../commonApi';

//fakedata
 import {user} from '../../assets/fake-data/fake-user'
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

const PayoutModel = () => {
    // const dispatch = useDispatch()
    // const { payoutModel } = useSelector(state => state.modelReducer)
    // const { userData } = useSelector(state => state.userReducer)
    const [amount, setAmount] = useState("")
   const payoutModel = false
   const userData = user
   

    useEffect(() => {
        if(payoutModel) {
            document.body.style.overflowX = 'hidden';
            document.body.style.overflowY = 'hidden';
            document.body.style.height = '100vh';
            return ()=> {
                document.body.style.height = 'auto'; 
                document.body.style.overflowY = 'unset'; 
            }
        }
     }, [payoutModel]);

    const handlePayment = async () => {
        if (amount === 0 || amount === "") {
            return toast.success(<SuccessToast message="Please enter valid amount for get payment" />, { hideProgressBar: true,  autoClose:  8000, })
        } else if (parseFloat(amount) > parseFloat(userData.monthly_payout)) {
            return toast.success(<SuccessToast message="Your withdrawal amount is more then you have" />, { hideProgressBar: true,  autoClose:  8000, })
        } else {
            const response = await postRequest({ sub_url: '/payoutrequest', dataMain: { amount } })
            if (response) {
                dispatch(
                    payoutModelShow(false)
                )
                dispatch(
                    getPayoutTransaction()
                )
                return toast.success(<SuccessToast message={response.message} />, { hideProgressBar: true,  autoClose:  8000, })
            }
        }
    }

    return (
        <Fragment>
            <Modal
                fullscreen="xl"
                isOpen={payoutModel}
                toggle={() => {
                    dispatch(
                        payoutModelShow(false)
                    )
                }}
                className='modal-dialog-centered previewModel'
            >
                <ModalHeader toggle={() => {
                    dispatch(
                        payoutModelShow(false)
                    )
                }}>
                </ModalHeader>
                <ModalBody className='ContentTypeModel'>
                    <Row>
                        <Col sm={12}>
                            <h3 className="mb-5 text-center">Withdraw</h3>
                        </Col>
                        <Col sm={12}>
                            <Row className='paymet_popup_container'>
                                <Col md={12} className='d-flex flex-column align-items-center'>
                                    <div className='requestPayment_box'>
                                        <div className='payment_popup_line_payout'>Your Balance:<span>${userData.monthly_payout}</span></div>
                                        <Form className='requestPayoutForm'>
                                            <label>Amount</label>
                                            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='Enter Amount' />
                                        </Form>

                                    </div>
                                    <button className='pay_btn' onClick={handlePayment}>Send Request</button>


                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default PayoutModel