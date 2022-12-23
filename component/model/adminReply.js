import React, { Fragment } from 'react'
import { Col, Row, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment'
import { adminReplyShow } from '../../redux/modelReducer'


const AdminReply = () => {
    const dispatch = useDispatch()
    const { adminReplyModel } = useSelector(state => state.modelReducer)


    return (
        <Fragment>
            <Modal
                isOpen={adminReplyModel.show}
                fullscreen='xl'
                toggle={() =>
                    dispatch(
                        adminReplyShow({
                            show: false,
                            supportMessageReply: null
                        })
                    )
                }
                className='modal-dialog-centered'>
                <ModalHeader
                    toggle={() =>
                        dispatch(
                            adminReplyShow({
                                show: false,
                                supportMessageReply: null
                            })
                        )
                    }
                >
                </ModalHeader>
                <ModalBody className='ContentTypeModel'>
                    <Row>
                        <Col sm={12} className='mb-3'>
                            <h2 className='mt-3 text-center'>Admin Reply</h2>
                        </Col>
                        <Col sm={12}>
                            <p className='mt-3 text-right'>Date: {moment(adminReplyModel.supportMessageReply.updated_at).format('MM/DD/YYYY')}
                            </p>
                        </Col>
                        <Col sm={12} className='mb-5'>
                            <p className='mt-3 text-center ReplyMessage'>
                                {adminReplyModel.supportMessageReply}
                            </p>
                        </Col>

                        <Col sm={12} className='mt-5'>
                            <div onClick={() => {
                                dispatch(
                                    adminReplyShow({
                                        show: false,
                                        supportMessageReply: null
                                    })
                                )
                            }} className='close_btn cursorPointer'>Close</div>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default AdminReply