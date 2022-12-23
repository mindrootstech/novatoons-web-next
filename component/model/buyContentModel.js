import React, { Fragment } from 'react'
import { Col, Row, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { postRequest } from '../../commonApi'
import { toast } from 'react-toastify'

import { planData } from "../../redux/payoutReducer";
import { useSelector, useDispatch } from 'react-redux';
import { buyContentShow } from '../../redux/modelReducer'
import {resetUserBalance} from '../../redux/userReducer'
import { downloading, buyAction, resetActionTextState } from '../../redux/editContentSeriesReducer'

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

const BuyContent = ({ data }) => {
    const dispatch = useDispatch()
    const { buyContent } = useSelector(state => state.modelReducer)
    const { isSeries, series, content ,price} = useSelector(state => state.editSeriesReducer)
    const {selectedContent} = useSelector(state => state.pdfReducer)
    const {userData} = useSelector(state => state.userReducer)
    const HandleBuy = async () => {
        const fileName = isSeries ? series.seriesdata.title : !isSeries && content.contentData.title
        const fileType = isSeries ? series.seriesdata.content_type : !isSeries && content.contentData.content_type
        const response = await postRequest({ sub_url: '/buycontent', dataMain: data })
        if (response.status === true) {
            dispatch(planData())
            const a = document.createElement('a')
           dispatch(resetUserBalance(
            {
                total_amount: userData.total_amount- parseFloat(price) ,
                total_credits: parseFloat((userData.total_amount- parseFloat(price))/ userData.credit_cost)
            }
           ))
            if (isSeries) {
                //for paid series download
                // response.data.map(item => {
                //     function toDataURL(url) {
                //         return fetch(url).then((response) => {
                //             return response.blob();
                //         }).then(blob => {
                //             return URL.createObjectURL(blob);
                //         });
                //     }
                //     const seriesDownload = async () => {
                //         a.href = await toDataURL(item)
                //         if (fileType === 1) { //comic
                //             a.download = `${fileName}.pdf`;
                //         } else if (fileType === 2) { //art
                //             a.download = `${fileName}.png`;
                //         }
                //         document.body.appendChild(a);
                //         a.click();
                //         document.body.removeChild(a);
                //         dispatch(downloading(true))

                //     }

                //     seriesDownload()
                // })

                dispatch(
                    buyAction({
                        actionType: null
                    })
                )

                dispatch(
                    resetActionTextState({
                        is_already_downloaded: false,
                        is_paid: true,
                        is_downloadable: series.seriesdata.is_downloadable === 1 ? true : false,
                        price: null,
                        is_bought: true
                    })
                )

            } else {
                //for paid content download
                function toDataURLs(url) {
                    return fetch(url).then((response) => {
                        return response.blob();
                    }).then(blob => {
                        return URL.createObjectURL(blob);
                    });
                }
                const contentDownload = async () => {
                    a.href = await toDataURLs(response.data[0])
                    if (fileType === 1) { //comic
                        a.download = `${fileName}.pdf`;
                    } else if (fileType === 2) { //art
                        a.download = `${fileName}`;
                    }
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    dispatch(downloading(true))

                }

                if (data.is_download === 1) {
                    contentDownload()
                }

            }
            dispatch(
                buyAction({
                    actionType: null
                })
            )
            dispatch(
                resetActionTextState({
                    is_already_downloaded: false,
                    is_paid: true,
                    is_downloadable: content.contentData.is_downloadable === 1 ? true : false,
                    price: null,
                    is_bought: true
                })
            )
            dispatch(
                buyContentShow(false)
            )
            return toast.success(<SuccessToast message={response.message} />, { hideProgressBar: true,  autoClose:  8000, })
        } else {
            return toast.success(<SuccessToast message={response.message} />, { hideProgressBar: true,  autoClose:  8000, })
        }
    }

    return (
        <Fragment>
            <Modal
                isOpen={buyContent}
                toggle={() => {
                    dispatch(
                        buyContentShow(false)
                    )
                    dispatch(
                        buyAction({
                            actionType: null
                        })
                    )
                }
                }
                className='modal-dialog-centered'>
                <ModalHeader
                    toggle={() => {
                        dispatch(
                            buyContentShow(false)
                        )
                        dispatch(
                            buyAction({
                                actionType: null
                            })
                        )
                    }
                    }
                >
                </ModalHeader>
                <ModalBody className='ContentTypeModel'>
                    <Row>
                        <Col sm={12}>
                            <div className='deleteHeader text-center'>
                                <i class="fa fa-usd f-36" aria-hidden="true"></i>
                                <h5 className='mt-3'>You are about to purchase this content for{<br/>} Credits {parseFloat(price / parseInt(userData.credit_cost))} CR / {parseFloat(price)} USD ( 1 CR = {parseInt(userData.credit_cost)} USD)?</h5>
                            </div>
                        </Col>
                        <Col sm={12} className="mt-5 text-center">
                            <button type="button" onClick={HandleBuy} className="submit submitReset py-3 mr-2">Continue</button>
                            <button type="button" onClick={() => {
                                dispatch(
                                    buyContentShow(false)
                                )
                            }} className="submit ml-2 submitReset py-3">Cancel</button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default BuyContent