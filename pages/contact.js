import React, { useState, Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import classnames from 'classnames'
import { FormFeedback } from 'reactstrap'
import { toast } from 'react-toastify'
import { Col, Row } from 'reactstrap';
//redux
import { useDispatch, useSelector } from 'react-redux';
import { axiosRequest } from '../http';
import { setSupportMessageStatus } from '../redux/userReducer'
import { useRouter } from 'next/router';
// import './contact.css'

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

const Contact = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [loadingReq, setLoadingReq] = useState(false)
  const { userData } = useSelector(state => state.userReducer)
  const contactUser = yup.object().shape({
    subject: yup.string().required(), 
    ...(userData.email && ({ email: yup.string().email().required() })),
    category: yup.string().required(),
    name: yup.string().required(),
    message: yup.string().required(),
  })

  useEffect(() => {
 if(Object.keys(userData).length === 0){
  router.push('/login')
 }
  },[userData])
  const { register, formState: { errors }, reset, handleSubmit } = useForm({ mode: 'onChange', resolver: yupResolver(contactUser) })

  useEffect(()=>{
    reset({
      ...userData,
      'name': userData?.user_name !== "" ? userData?.user_name : `${userData?.first_name} ${userData?.last_name}`,
    })

  },[userData])


  const onSubmit = async (data) => {
    if (userData.is_verified === 0  || userData.is_verified === "0") {
      return toast.error(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true,  autoClose:  8000, })
    }
    setLoadingReq(true)
    const dataMain = {
      name: data.name,
      email: data.email === '' ? userData.email : data.email,
      subject: data.subject,
      category: data.category,
      message: data.message
    }

    try {
      const response = await axiosRequest({ sub_url: '/submitmessage', dataMain })
      if (response.status === 200) {
        dispatch(
          setSupportMessageStatus(1)
        )
        reset()
        setLoadingReq(false)
        return toast.success(<SuccessToast message={response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
      }
    } catch (err) {
      setLoadingReq(false)
      return toast.success(<SuccessToast message={err.response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
    }
  }


  return (
    <Fragment>
      <section className="tf-contact tf-section ContactUsPage">
        <div className="themesflat-container pt-80">
          <div className="row">
            <div className="col-12">
              <h2 className="tf-title-heading ct style-1 mb-2"> Drop Us A  Message </h2>
              <p className='dropMessage mt-2'>Having issues on the Novatoons? Please feel free to drop us a message and someone from our team will surely address your concerns.</p>


              <div className="flat-form box-contact-email">

                <div className="form-inner">
                  <form id="contactform" className='mt-25' onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                      <Col sm={12}>
                        <input
                          id="name"
                          type="text"
                          placeholder="Your Full Name"
                          {...register('name')}
                          autocomplete="on"
                          className={classnames('input', { 'is-invalid': errors && errors?.name })}
                        />
                        {errors && errors?.name && <FormFeedback className='mb-2'>Please enter a valid name</FormFeedback>}
                      </Col>

                      {((userData.source_type === 1) || (userData.source_type !== 1 && (userData.email !== "" || userData.email !== null || userData.email !== undefined))) && 
                      <Col sm={12} className='mt-2'>
                        <input
                          id="email"
                          type="text"
                          placeholder="Your Email Address"
                          {...register('email')}
                          autocomplete="on"
                          className={classnames('input', { 'is-invalid': errors && errors?.email })}
                        />
                        {errors && errors?.email && <FormFeedback className='mb-2'>Please enter a valid email</FormFeedback>}
                      </Col> }

                      <Col sm={12} className='mt-2'>
                        <input
                          id="subject"
                          type="text"
                          placeholder="Subject"
                          {...register('subject')}
                          // autocomplete="on"
                          className={classnames('input', { 'is-invalid': errors && errors?.subject })}
                        />
                        {errors && errors?.subject && <FormFeedback className='mb-2'>Please enter a valid subject</FormFeedback>}
                      </Col>

                      <Col sm={12} className='mt-2'>
                        <select
                          name="category"
                          id="category"
                          defaultValue="0"
                          {...register('category', { required: true })}
                          className={classnames('input', { 'is-invalid': errors && errors?.category })}
                        >
                          <option value="0" disabled selected>Select Category</option>
                          <option value="1">General Enquiry</option>
                          <option value="2">System Downtime</option>
                          <option value="3">Feature request</option>
                        </select>
                        {errors && errors?.category && <FormFeedback className='mb-2'>Please enter a valid category</FormFeedback>}
                      </Col>

                      <Col sm={12}>
                        <textarea tabIndex="4" rows="5"
                          placeholder="Message"
                          className={classnames('input', { 'is-invalid': errors && errors?.message })}
                          {...register('message')} >
                        </textarea>
                        {errors && errors?.message && <FormFeedback className='mb-2'>Please enter a valid message</FormFeedback>}
                      </Col>

                    </Row>
                    <Row>
                      <Col sm={12} className="mt-5">
                        <button type="submit" className="submit" disabled={loadingReq}>{loadingReq ? 'Sending' : 'Send Message'}</button>
                      </Col>
                      {userData.support_message === 1 &&
                        <Col sm={12} className="mt-5 text-center">
                          <div className='mysupportMessage'>
                            <Link to={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/support-messages`} className="mySupportText">My support messages</Link>
                          </div>
                        </Col>}
                    </Row>
                  </form>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default Contact;
