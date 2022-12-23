import React, { Fragment, useEffect, useState } from 'react'
import { Col, Row, Modal, ModalBody, ModalHeader, FormFeedback } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { sliderDurationShow } from '../../redux/modelReducer';


const SliderDurationModel = () => {
    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()
    const { sliderDuration } = useSelector(state => state.modelReducer)

    const [duration, setDuration] = useState(null)
    const [error, setError] = useState(null)

    const handleDuration = () => {
        if(duration === null || duration === 0) {
            setError('Please enter a valid value')
        } else {
            const value = (duration * 1000)
            setError(null)
            navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/series/view/${sliderDuration.series_id}?type=1&content=${sliderDuration.content_id}&duration=${value}`)
            dispatch(
                sliderDurationShow({
                    show: false,
                    series_id: null,
                    content_id: null
                })
            )
        }
    }


    return (
        <Fragment>
            <Modal
                isOpen={sliderDuration.show}
                fullscreen="xl"
                toggle={() =>
                    dispatch(
                        sliderDurationShow({
                            show: false,
                            series_id: null,
                            content_id: null
                        })
                    )
                }
                className='modal-dialog-centered'>
                <ModalHeader
                    toggle={() =>
                        dispatch(
                            sliderDurationShow({
                                show: false,
                                series_id: null,
                                content_id: null
                            })
                        )
                    }
                >
                </ModalHeader>
                <ModalBody className='ContentTypeModel'>
                    <div className='modelContainer py-4'>
                        <Row>
                            <Col sm={12}>
                                <h2 className='text-center mb-5'>Add Timer</h2>
                            </Col>
                            <Col sm={12} className='text-center'>
                                <p className='text-center text-white durationText mb-3'>Please enter Duration in Seconds for the slideshow. </p>
                                <input type='number' placeholder='Enter seconds' className={error !== null ? 'input durationInput m-auto mb-5 w-75 is-invalid' : 'input durationInput m-auto w-75'} value={duration} onChange={(e) => {
                                    duration !== null || duration !== 0 && setError(null)
                                    setDuration(e.target.value)
                                }}></input>
                                {error !== null && <FormFeedback> {error} </FormFeedback>}
                            </Col>
                            <Col className='doneBtn mt-5' sm={12}>
                                <button className='createButton w-100' type='button' onClick={handleDuration}>Done</button>
                            </Col>
                        </Row>
                    </div>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default SliderDurationModel