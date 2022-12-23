import React, { Fragment } from 'react'
import { Col, Row, Modal, ModalBody, ModalHeader } from 'reactstrap';
import {useParams, useNavigate} from 'react-router-dom'
import { postRequest } from '../../commonApi'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux';
import { deleteModel, getSeries, deleteSingleContent } from '../../pages/content/editContentSeriesReducer';


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

const DeleteModel = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {slug} = useParams()
    const {deleteStuff, isSeries, series: {seriesContent},content: {contentData}} = useSelector(state => state.editSeriesReducer)
    const HandleDelete = async () => {
        if(!deleteStuff.isContent) {
            const response = await postRequest({ sub_url: "/deleteseries", dataMain: { series_id: deleteStuff.deleteContent } })
            if(response.status === true) {
                toast.success(<SuccessToast message={response.message} />, { hideProgressBar: true,  autoClose:  8000, })
                navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/`)
                dispatch(
                    deleteModel({
                        modelShow: false,
                        deleteContent: null,
                        isContent: null
                    })
                )
            }
        } else if (deleteStuff.isContent) {
                if(seriesContent[deleteStuff.index].newContent && !seriesContent[deleteStuff.index].id) {
                    
                    dispatch(deleteSingleContent(deleteStuff.index))
                    return dispatch(
                        deleteModel({
                            modelShow: false,
                            deleteContent: null,
                            isContent: null
                        })
                    )
                }

            const response = await postRequest({ sub_url: "/deletecontent", dataMain: { content_id: deleteStuff.deleteContent } })
            if(response.status === true) {
                toast.success(<SuccessToast message={response.message} />, { hideProgressBar: true,  autoClose:  8000, })
                dispatch(
                    deleteModel({
                        modelShow: false,
                        deleteContent: null,
                        isContent: null
                    })
                )
                if(!isSeries) {
                    navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/`)
                } else {
                    dispatch(
                        getSeries({
                        slug
                        })
                    )
                }
            }

        }
    }

    return (
        <Fragment>
            <Modal 
            isOpen={deleteStuff.modelShow} 
            toggle={() => 
                dispatch(
                    deleteModel({
                        modelShow: false,
                        deleteContent: null,
                        isContent: null
                    })
                )
            } 
            className='modal-dialog-centered'>
                <ModalHeader 
                toggle={() => 
                    dispatch(
                        deleteModel({
                            modelShow: false,
                            deleteContent: null,
                            isContent: null
                        })
                    )
                }
                >
                </ModalHeader>
                <ModalBody className='ContentTypeModel'>
                    <Row>
                        <Col sm={12}>
                            <div className='deleteHeader text-center'>
                                <i className='fa fa-trash f-36'></i>
                                <h5 className='mt-3'>Are you sure want to delete this content?</h5>
                            </div>
                        </Col>
                        <Col sm={12} className="mt-5 text-center">
                            <button type="button" onClick={HandleDelete} className="submit submitReset py-3 mr-2">Delete</button>
                            <button type="button" onClick={()=>{
                                 dispatch(
                                    deleteModel(dispatch(
                                        deleteModel({
                                            modelShow: false,
                                            deleteContent: null,
                                            isContent: null
                                        })
                                    ))
                                )
                            }} className="submit ml-2 submitReset py-3">Cancel</button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default DeleteModel