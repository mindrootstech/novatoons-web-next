import React, { Fragment } from 'react'

//third party
import { Col, Row, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { toast } from 'react-toastify'
//redux
import { useDispatch, useSelector } from 'react-redux'
import { reportAndDeleteShow } from '../../redux/modelReducer'
import { resetSelected, deleteComment } from '../../redux/commentsReducer'

//api
import { axiosRequest } from '../../http'

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


const ReportAndDelete = () => {
    const dispatch = useDispatch()
    const { reportAndDelete } = useSelector(state => state.modelReducer)
    const { selectedContent } = useSelector(state => state.pdfReducer)
    const handleReportAndDelete = async (type) => {
        if (type === "report") {
            const config = {
                sub_url: '/reportcomment',
                dataMain: {
                    comment_id: reportAndDelete.comment_id,
                    content_id: selectedContent.id
                }
            }
            try {
                const response = await axiosRequest(config)
                if (response.status === 200) {
                    dispatch(
                        reportAndDeleteShow({
                            show: false
                        })
                    )
                    dispatch(resetSelected())
                    return toast.success(<SuccessToast message={response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
                }
            } catch (err) {
                dispatch(
                    reportAndDeleteShow({
                        show: false
                    })
                )
                dispatch(resetSelected())
                return toast.warning(<SuccessToast message={err.response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
            }
        } else if (type === "delete") {
            dispatch(
                deleteComment({
                    is_childComment : reportAndDelete.is_childComment,
                    comment_id: reportAndDelete.comment_id,
                    parentComment: reportAndDelete.parentComment,
                    singleComment:reportAndDelete.singleComment,
                    myIndex: reportAndDelete.myIndex,
                    content_id: selectedContent.id,
                    parentOrChild: reportAndDelete.is_childComment ? "0" : "1"
                })
            )
            dispatch(
                reportAndDeleteShow({
                    show: false
                })
            )
            dispatch(resetSelected())
        }

    }

    return (
        <Fragment>
            <Modal
                // fullscreen="xl"
                isOpen={reportAndDelete.show}
                toggle={() => {
                    dispatch(
                        reportAndDeleteShow({
                            show: false
                        })
                    )
                }}
                className='modal-dialog-centered previewModel'
            >
                <ModalHeader className='ReportHeaderModel' toggle={() => {
                    dispatch(
                        reportAndDeleteShow({
                            show: false
                        })
                    )
                }}>
                </ModalHeader>
                <ModalBody className='ContentTypeModel deleteReportConfirmation'>
                    <Row>
                        <Col sm={12}>
                            <div className='popupIcon'>
                                {reportAndDelete.type === "report" ? <i className='fa fa-file'></i> : <i className='fa fa-trash'></i>}
                            </div>
                        </Col>
                        <Col className='confirmationBoxText' sm={12}>
                            {
                                reportAndDelete.type === "report" ?
                                    <h5 className='text-center'>Are you sure want to report this comment?</h5> :
                                    <h5 className='text-center'>Are you sure want to Delete this comment?</h5>
                            }
                        </Col>
                        <Col sm={12} className="mt-5 text-center">
                            {reportAndDelete.type === "report" ? <button type="button" onClick={() => handleReportAndDelete("report")} className="submit submitReset py-3 mr-2">Report</button> :
                                <button type="button" onClick={() => handleReportAndDelete("delete")} className="submit submitReset py-3 mr-2">Delete</button>}

                            <button type="button" onClick={() => {
                                dispatch(
                                    reportAndDeleteShow({
                                        show: false
                                    })
                                )
                            }} className="submit ml-2 submitReset py-3">Cancel</button>

                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default ReportAndDelete