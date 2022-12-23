import React, { Fragment } from 'react'
import { Col, Row, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { postRequest } from '../../commonApi'
import { toast } from 'react-toastify'

//redux
import { profilePictureShow } from '../../redux/modelReducer'
import {getUser} from '../../redux/userReducer'
import { useSelector, useDispatch } from 'react-redux';


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

const DeleteProfilePictueModel = () => {
    const dispatch = useDispatch()
    const { profilePicture } = useSelector(state => state.modelReducer)

    const HandleDelete = async () => {
        const response = await postRequest({ sub_url: '/updateprofileimg', dataMain: {profile_img : ''}})
        if (response.status === true) {
            toast.success(<SuccessToast message={response.message} />, { hideProgressBar: true,  autoClose:  8000, })
            dispatch(
                getUser()
            )
        }
        dispatch(
            profilePictureShow(false)
        )
    }

    return (
        <Fragment>
            <Modal
                isOpen={profilePicture}
                toggle={() =>
                    dispatch(
                        profilePictureShow(false)
                    )
                }
                className='modal-dialog-centered'>
                <ModalHeader
                    toggle={() =>
                        dispatch(
                            profilePictureShow(false)
                        )
                    }
                >
                </ModalHeader>
                <ModalBody className='ContentTypeModel'>
                    <Row>
                        <Col sm={12}>
                            <div className='deleteHeader text-center'>
                                <i className='fa fa-trash f-36'></i>
                                <h5 className='mt-3'>Are you sure want to delete this profile picture?</h5>
                            </div>
                        </Col>
                        <Col sm={12} className="mt-5 text-center">
                            <button type="button" onClick={HandleDelete} className="submit submitReset py-3 mr-2">Delete</button>
                            <button type="button" onClick={() => {
                                dispatch(
                                    profilePictureShow(false)
                                )
                            }} className="submit ml-2 submitReset py-3">Cancel</button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default DeleteProfilePictueModel