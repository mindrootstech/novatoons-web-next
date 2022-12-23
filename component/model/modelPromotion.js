import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Col, Row, Modal, ModalBody, ModalHeader } from 'reactstrap';
import payment from '../../../src/assets/images/icon/Frame.png'
//redux
import { useDispatch, useSelector } from 'react-redux'
import { selectPromotion_id } from '../../pages/user/userReducer'
import { axiosRequest } from '../../http';

const PromotionModel = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()
    const [isSeries, setIsSeries] = useState()
    const { userData, selectedPromtion } = useSelector(state => state.userReducer)
    useEffect(()=>{
        if(params.category === "content") {
            setIsSeries(0)
        }else if (params.category === "series"){
            setIsSeries(1)
        }
    }, [])

    const promotionHandle = async () => {
        // if(selectedPromtion.price > userData.total_amount) {
        //     return toast.success(<SuccessToast message="Please add some more credits" />, { hideProgressBar: true,  autoClose:  8000, })
        // }

        // try {
        //     const response = await axiosRequest({sub_url: '/promotecontent', dataMain})

        // } catch (err) {
        //     return toast.success(<SuccessToast message="Please add some more credits" />, { hideProgressBar: true,  autoClose:  8000, })
        // }

        navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/payment-method?paymenttype=4&package=${selectedPromtion.id}&content=${selectedPromtion.content_id}&type=${isSeries}`)
    }

    return (
        <Fragment>
            <Modal
                fullscreen="xl"
                isOpen={selectedPromtion.show}
                className='modal-dialog-centered previewModel'
            >
                <ModalHeader toggle={() => {
                    dispatch(selectPromotion_id({
                        show: false
                    }))
                }}>
                </ModalHeader>
                <ModalBody className='ContentTypeModel'>
                    <Row>
                        <Col sm={12}>
                            <h3 className="mb-5 text-center">Promotion Payment</h3>
                        </Col>
                        <Col sm={12}>
                            <Row className='paymet_popup_container'>
                                <Col md={12} className='d-flex flex-column align-items-center'>
                                    <img src={payment} alt='payment' />
                                    <div className='payment_popup_line'>Amount to be paid:<span>${selectedPromtion.price}</span></div>
                                    <button className='pay_btn' onClick={promotionHandle}>Pay</button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default PromotionModel