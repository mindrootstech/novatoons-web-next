import React, { Fragment } from 'react'
import { Col, Row, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { postRequest } from '../../commonApi'
import { toast } from 'react-toastify'

import { planData } from "../../pages/payout/payoutReducer";
import { useSelector, useDispatch } from 'react-redux';
import { cancelPlanShow } from '../../redux/modelReducer'

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

const ConfirmModel = ({ data }) => {
    const dispatch = useDispatch()
    const { cancelPlan } = useSelector(state => state.modelReducer)

    const HandleDelete = async () => {
        if (data.already_bought === 1) {
            const response = await postRequest({ sub_url: '/cancelsubscription', dataMain: { transaction_id: data.transaction_id } })
            if (response.status === true) {
                dispatch(planData())
                dispatch(
                    cancelPlanShow(false)
                )
                return toast.success(<SuccessToast message={response.message} />, { hideProgressBar: true,  autoClose:  8000, })
            } else {
                dispatch(
                    cancelPlanShow(false)
                )
                return toast.success(<SuccessToast message={response.message} />, { hideProgressBar: true,  autoClose:  8000, })
            }
        }
    }

    return (
        <Fragment>
            <Modal
                isOpen={cancelPlan}
                toggle={() =>
                    dispatch(
                        cancelPlanShow(false)
                    )
                }
                className='modal-dialog-centered'>
                <ModalHeader
                    toggle={() =>
                        dispatch(
                            cancelPlanShow(false)
                        )
                    }
                >
                </ModalHeader>
                <ModalBody className='ContentTypeModel'>
                    <Row>
                        <Col sm={12}>
                            <div className='deleteHeader text-center'>
                                <i className='fa fa-times f-36'></i>
                                <h5 className='mt-3'>Are you sure want to cancel this plan?</h5>
                            </div>
                        </Col>
                        <Col sm={12} className="mt-5 text-center">
                            <button type="button" onClick={HandleDelete} className="submit submitReset py-3 mr-2">Yes</button>
                            <button type="button" onClick={() => {
                                dispatch(
                                    cancelPlanShow(false)
                                )
                            }} className="submit ml-2 submitReset py-3">Cancel</button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default ConfirmModel