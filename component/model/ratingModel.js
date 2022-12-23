import React, { Fragment, useState } from 'react'
import { Col, Row, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { useSearchParams } from 'react-router-dom';

//Third party
import { toast } from 'react-toastify'
import { Rating } from 'react-simple-star-rating'

//redux
// import { useSelector, useDispatch } from 'react-redux';
// import { ratingShow } from '../../redux/modelReducer'
// import { setRatingContent } from '../../pages/content/editContentSeriesReducer'

//api
// import { axiosRequest } from '../../http'

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

const RatingModel = () => {
    // const dispatch = useDispatch()
    const [content_rating, setContent_rating] = useState(null)
    // const { ratingModel } = useSelector(state => state.modelReducer)
    const ratingModel = {show: false}
    const handleRating = async () => {
        if(content_rating === null) {

            // return dispatch(
            //     ratingShow({
            //         show: false,
            //         id: null
            //     })
            // )
        }
        let dataMain
        let value = (content_rating * 5 / 100)                                    
        ratingModel.type === "content" ? dataMain = { rating: value, content_id: ratingModel.id } : dataMain = { rating: value, series_id: ratingModel.id }
        try {
            const response = await axiosRequest({ sub_url: '/submitrating', dataMain })
            // dispatch(setRatingContent({
            //     rating: `${response.data.body}`,
            //     type: ratingModel.type
            // }))
            // dispatch(
            //     ratingShow({
            //         show: false,
            //         id: null
            //     })
            // )
            return toast.success(<SuccessToast message={response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })

        } catch (err) {
            return toast.success(<SuccessToast message={err.response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
        }
    }

    return (
        <Fragment>
            <Modal
                isOpen={ratingModel.show}
                toggle={() =>
                    dispatch(
                        ratingShow({
                            show: false,
                            id: null
                        })
                    )
                }
                className='modal-dialog-centered'>
                <ModalHeader
                    toggle={() =>
                        dispatch(
                            ratingShow({
                                show: false,
                                id: null
                            })
                        )
                    }
                >
                </ModalHeader>
                <ModalBody className='ContentTypeModel'>
                    <Row>
                        <Col sm={12}>
                            <div className='deleteHeader text-center'>
                                <h2 className='mt-3'>Rate this Content</h2>
                            </div>
                        </Col>
                        <Col sm={12} className="mt-4 text-center">
                            <h5 className='ratingHeading my-2'>Your rating is valuable for adding credibility to the content on the platform. Feel free to rate the content as it will help other users to see the top rated content. </h5>
                            <div className='ratingModel mb-3'>
                                <Rating
                                    ratingValue={0}
                                    allowHalfIcon={true}
                                    fillColor='#ffd700'
                                    emptyColor='#808080'
                                    onClick={(e) => {
                                        setContent_rating(e)
                                    }}
                                    iconsCount={5}
                                    size={40}
                                />
                            </div>
                            <button className="donate_btn commentingIcon mt-5 mb-2" onClick={handleRating}>Done</button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default RatingModel