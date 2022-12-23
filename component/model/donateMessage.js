import React, { Fragment } from 'react'
import { Row, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux'
//redux
import { donateModelShow } from '../../redux/modelReducer'
import Link from 'next/link';

const DonateMessage = () => {
    const dispatch = useDispatch()
    const {donateModel} = useSelector(state => state.modelReducer)

    const handleResetData = () => {
        dispatch(
            donateModelShow({
                donateFor: null,
                show: false,
                briefShow: false,
                message: null
            })
        )
    }

    return (
        <Fragment>
            <Modal
                fullscreen="xl"
                isOpen={donateModel.briefModel.briefShow}
                toggle={handleResetData}
                className='modal-dialog-centered'>
                <ModalHeader
                    toggle={() =>
                        dispatch(
                            donateModelShow({
                                donateFor: null,
                                show: false,
                                briefShow: false,
                                message: null
                            })
                        )
                    }
                >
                </ModalHeader>
                <ModalBody className='ContentTypeModel'>
                    <Row onClick={handleResetData}>
                        <p className='text-center text-white py-5'>{donateModel.briefModel.message}</p>
                        <Link onClick={handleResetData} className='sc-button backToHome header-slider style style-1 fl-button pri-1 m-auto' href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/`}>Back To Home Page</Link>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default DonateMessage