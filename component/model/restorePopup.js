import React, { Fragment } from 'react'
import { Col, Row, Modal, ModalBody, ModalHeader } from 'reactstrap';
import {useParams, useNavigate} from 'react-router-dom'
import { postRequest } from '../../commonApi'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux';
import { restoreModel, getSeries, updateStatus, restoreSingleContent } from '../../pages/content/editContentSeriesReducer';


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

const RestoreModel = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {slug} = useParams()
    const {RestoreStuff, isSeries, series: {seriesContent},content: {contentData}} = useSelector(state => state.editSeriesReducer)
    const handleRestore = async () => {
        if(!RestoreStuff.isContent) {
            const response = await postRequest({ sub_url: "/admin/status_config", dataMain: { series_id: RestoreStuff.restoreContent, status: 1 } })
            if(response.status === true) {
                dispatch(
                    updateStatus({
                           status: 1,
                           type: 'series'
                                }))
                toast.success(<SuccessToast message={'Series data Restored'} />, { hideProgressBar: true,  autoClose:  8000, })
                dispatch(
                    restoreModel({
                        modelShow: false,
                        restoreContent: null,
                        isContent: null
                    })
                )
            }
        } else if (RestoreStuff.isContent) {
              
            const response = await postRequest({ sub_url: "/admin/status_config", dataMain: { content_id: RestoreStuff.restoreContent,  status: 1 } })
            if(response.status === true) {
                dispatch(
                    updateStatus({
                           status: 1
                                }))
                toast.success(<SuccessToast message={'Content data Restored'} />, { hideProgressBar: true,  autoClose:  8000, })
                dispatch(
                    restoreModel({
                        modelShow: false,
                        restoreContent: null,
                        isContent: null
                    })
                )
                if(isSeries) {
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
            isOpen={RestoreStuff.modelShow} 
            toggle={() => 
                dispatch(
                    restoreModel({
                        modelShow: false,
                        restoreContent: null,
                        isContent: null
                    })
                )
            } 
            className='modal-dialog-centered'>
                <ModalHeader 
                toggle={() => 
                    dispatch(
                        restoreModel({
                            modelShow: false,
                            restoreContent: null,
                            isContent: null
                        })
                    )
                }
                >
                </ModalHeader>
                <ModalBody className='ContentTypeModel'>
                    <Row>
                        <Col sm={12}>
                            <div className='restoreHeader text-center'>
                                <i className='fa fa-trash f-36'></i>
                                <h5 className='mt-3'>Are you sure want to Restore this content?</h5>
                            </div>
                        </Col>
                        <Col sm={12} className="mt-5 text-center">
                            <button type="button" onClick={() => handleRestore()} className="submit submitReset py-3 mr-2">Restore</button>
                            <button type="button" onClick={()=>{
                                 dispatch(
                                    restoreModel(dispatch(
                                        restoreModel({
                                            modelShow: false,
                                            restoreContent: null,
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

export default RestoreModel