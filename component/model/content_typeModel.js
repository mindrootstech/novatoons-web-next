import { useRouter } from 'next/router';
import React, { useState, Fragment } from 'react';
// import { useNavigate } from "react-router-dom";

//images 

//design
import { Row, Col, Modal, ModalBody, ModalHeader } from 'reactstrap'
//redux
import { resetPage, contentTypeName } from '../../redux/ContentSeriesReducer';
import { selecttype, modelShow, selectsubtype, uploadContent } from '../../redux/headerReducer'
import { resetDetails } from '../../redux/editContentSeriesReducer';
import { useSelector, useDispatch } from 'react-redux'
const Content_typeModel = () => {
    
    const comic = '/images/icon/comic.png'
    const art = '/images/icon/art.png'
    const multiple = '/images/icon/multiple.png'
    const single = '/images/icon/single.png'
    const router = useRouter()
    const { steps, showModel, content_type, type } = useSelector(state => state.headerReducer)
    const seriesreducer = useSelector(state => state.seriesReducer)

    // const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleMovetoCreate = (value) => {
        if (value) {
            dispatch(modelShow(false))
        }
        localStorage.setItem('uploadcontent', JSON.stringify({ content_type, type: value }))
        if (value === "multiple") {
        router.push('/createseries')
            // navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/createseries/`)
        }
        router.push('/createcontent')
        // navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/createcontent/`)
    }
    return (
        <Fragment>
            <Modal
                fullscreen="xl"
                isOpen={showModel}
                toggle={() => {
                    dispatch(modelShow(false))
                }}
                className='modal-dialog-centered contentTypeModel headerContentPopup'>
                <ModalHeader
                    toggle={() => {
                        dispatch(modelShow(false))
                    }}
                >
                    {steps === 1 && <i onClick={() => {
                        dispatch(
                            uploadContent({
                                content_type,
                                type,
                                steps: 0
                            })
                        )
                    }} className='stepBackBtn fa fa-long-arrow-left'></i>}
                </ModalHeader>
                {steps === 0 ?
                    <ModalBody className='ContentTypeModel selectTypeModel'>
                        <Row>
                            <Col sm={12}>
                                <h2 className='categoryModelHeading'>Select Content Type</h2>
                            </Col>
                        </Row>
                        <Row className='my-3 contentModel justify-content-center'>
                            <Col xs={12} md={{ size: '3' }} sm={6}>
                                <input type="radio" onClick={(e) => {
                                    dispatch(
                                        uploadContent({
                                            content_type: parseInt(e.target.value),
                                            type,
                                            steps: 1
                                        })
                                    )
                                }} name="content_type" value="1" />
                                <div className="contentType">
                                    <img src={comic} alt="comic" />
                                    <p className="categoryName">Comic</p>
                                </div>
                            </Col>
                            {/* <Col xs={6} md={3} sm={6}>
                                <input type="radio" onClick={(e)=> {
                                    dispatch(
                                        uploadContent({
                                            content_type: parseInt(e.target.value),
                                            type,
                                            steps: 1
                                        })
                                    )
                                 }} name="content_type" value="2" />
                                <div className="contentType">
                                    <img src={art} alt="art" />
                                    <p className="categoryName">Art</p>
                                </div>
                            </Col> */}
                        </Row>

                        <Row className='pb-3'>
                            <Col sm={12}>
                                <p className='text-center content_size'>By proceeding, you confirm you own the rights to use the work, art, image or uploaded content for commercial purposes and are NOT infringing on ANY intellectual property rights or copyright, which could lead to an account ban, closure or withholding of some or all of your revenue and/or compensation. </p>
                            </Col>
                        </Row>

                    </ModalBody> :
                    <ModalBody className='ContentTypeModel typeModel selectTypeModel step2'>
                        <Row>
                            <Col sm={12}>
                                <h2 className='categoryModelHeading'>Select Type</h2>
                            </Col>
                        </Row>
                        <Row className='my-3 contentModel'>
                            <Col className='selectTypesection' md={{ size: '3', offset: '3' }} xs={6} sm={6}>
                                <input type="radio" onClick={(e) => {
                                    // dispatch(
                                    //     uploadContent({
                                    //         content_type,
                                    //         type: e.target.value,
                                    //         steps: 0
                                    //     })
                                    // )
                                    // dispatch(resetDetails())
                                    // dispatch(resetPage())
                                    handleMovetoCreate(e.target.value)
                                }} name="type" value="single" />

                                <div className="contentType">
                                    <img src={single} alt="single" />
                                    <p className="categoryName">Single Upload</p>
                                </div>
                            </Col>
                            <Col className='selectTypesection' md={3} sm={6} xs={6}>
                                <input type="radio" onClick={(e) => {
                                    // dispatch(
                                    //     uploadContent({
                                    //         content_type,
                                    //         type: e.target.value,
                                    //         steps: 0
                                    //     })
                                    // )
                                    // dispatch(resetDetails())
                                    // dispatch(resetPage())
                                    handleMovetoCreate(e.target.value)
                                }} name="type" value="multiple" />

                                <div className="contentType ">
                                    <img src={multiple} alt="multiple" />
                                    <div className='icon_style2'>
                                        <p className="categoryName">Bulk Upload</p>
                                        <i class="fa fa-info-circle position-relative icon_style" aria-hidden="true">
                                            <span className='tooltip tooltip1'>Multiple works as part of a series or collection.
                                            </span></i>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </ModalBody>
                }
            </Modal>
        </Fragment>
    )
}

export default Content_typeModel