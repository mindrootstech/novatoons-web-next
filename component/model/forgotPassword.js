import React, { Fragment } from 'react'
import { Col, Row, Modal, ModalBody, ModalHeader, FormFeedback } from 'reactstrap';
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { postRequest } from '../../commonApi'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux';
import { forgotPassShow } from '../../redux/modelReducer';


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

const Model = () => {
    const dispatch = useDispatch()
    const {forgotPass } = useSelector(state => state.modelReducer)

    const resetRequest = yup.object().shape({
        email: yup.string().email().required()
    })

    const { register, formState: { errors }, handleSubmit } = useForm({ mode: 'onChange', resolver: yupResolver(resetRequest) })

    const onSubmit = async (dataMain) => { 
        const response = await postRequest({ sub_url: '/requestforgotpassword', dataMain })
        if (response.status === true) {
            toast.success(<SuccessToast message={response.message} />, { hideProgressBar: true,  autoClose:  8000, })
        } else {
            toast.success(<SuccessToast message={response.message} />, { hideProgressBar: true,  autoClose:  8000, })
        }
        dispatch(
            forgotPassShow(false)
        )
        
    }

    return (
        <Fragment>
            <Modal 
            fullscreen="xl" 
            isOpen={forgotPass} 
            toggle={() => 
                dispatch(
                    forgotPassShow(false)
                )
            } 
            className='modal-dialog-centered'>
                <ModalHeader 
                toggle={() => 
                    dispatch(
                        forgotPassShow(false)
                    )
                }
                >
                </ModalHeader>
                <ModalBody className='ForgotPasswordModel pb-5'>
                    <form id="loginform" onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col sm={12}>
                                <h5>Reset Password</h5>
                            </Col>
                            <Col sm={12}>
                                <input
                                    type="text"
                                    className='text-white'
                                    placeholder='Enter your email'
                                    {...register('email', { required: true })}
                                />
                                {errors && errors?.email && <FormFeedback>Please enter a valid email</FormFeedback>}
                            </Col>
                            <Col sm={12} className="mt-3">
                                <button type="submit" className="submit submitReset">Submit</button>
                            </Col>
                        </Row>
                    </form>

                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default Model