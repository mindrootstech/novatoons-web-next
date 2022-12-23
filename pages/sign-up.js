import React, { useState, Fragment, useEffect } from 'react';
import Link from 'next/link';
import { Col, Row } from 'react-bootstrap';
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input, FormFeedback } from 'reactstrap'
import { toast } from 'react-toastify'

function SuccessToast({ err_code, message }) {
    return (
        <Fragment>
            {err_code === 400 ? <Link to={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/login`}>
                <div className='toastify-header'>
                    <div className='title-wrapper'>
                        <h6 className='toast-title'>{message}</h6>
                    </div>
                </div>
            </Link> : <div className='toastify-header'>
                <div className='title-wrapper'>
                    <h6 className='toast-title'>{message}</h6>
                </div>
            </div>}
        </Fragment>
    )
}

const SignUp = () => {
    const [is_creator, setIs_creator] = useState(false)
    const [passShowHide, setPassShowHide] = useState(false)
    const [loading, setLoading] = useState(false);

    const handleChange = (e, type) => {
        if (type === "creator" && e.target.checked) {
            setIs_creator(!is_creator)
        } else if (type === "creator" && !e.target.checked) {
            setIs_creator(!is_creator)
        }
    }

    const registerUser = yup.object().shape({
        first_name: yup.string().min(3).required(),
        password: yup.string().min(4).max(16).required(),
        email: yup.string().email().required()
    })

    const { register, formState: { errors }, handleSubmit } = useForm({ mode: 'onChange', resolver: yupResolver(registerUser) })

    useEffect(() => {
        const loadScriptByURL = (id, url, callback) => {
            const isScriptExist = document.getElementById(id);

            if (!isScriptExist) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = url;
                script.id = id;
                script.onload = function () {
                    if (callback) callback();
                };
                document.body.appendChild(script);
            }

            if (isScriptExist && callback) callback();
        }

        // load the script by passing the URL
        loadScriptByURL("recaptcha-key", `https://www.google.com/recaptcha/api.js?render=6Lecc7gfAAAAABIQHn6thjTqauocDMLzsV0b9z1K`, function () {
            console.log("Script loaded!");
        });
    }, []);


    const onSubmit = async (data) => {

    }

    const socialRegister = async (dataMain) => {

    }

    return (
        <Fragment>
            <section className="tf-login tf-section">
                <div className="themesflat-container pt-80">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="tf-title-heading ct style-1">
                                Signup To Novatoons
                            </h2>

                            <div className="flat-form box-login-social">
                                <div className="box-title-login">
                                    <h5>Signup with social</h5>
                                </div>
                                <ul className='socialIcons'>
                                    <li>
                                        <Link href="#" className="sc-button style-2 fl-button pri-3">
                                            <i className="icon-fl-google-2"></i>
                                            <span>Google</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="sc-button style-2 fl-button pri-3">
                                            <i className="icon-fl-facebook"></i>
                                            <span>Facebook</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div className="flat-form box-login-email">
                                <div className="box-title-login">
                                    <h5>Or signup with email</h5>
                                </div>

                                <div className="form-inner">
                                    <form id="signup" onSubmit={handleSubmit(onSubmit)} className='signup'>
                                        <Row>
                                            <Col sm={6}>
                                                <input
                                                    id="first_name"
                                                    {...register('first_name', { required: true })}
                                                    type="text"
                                                    placeholder="First Name"
                                                    className={(errors && errors?.first_name) ? 'is-invalid input' : 'input' }
                                                />
                                                {errors && errors?.first_name && <FormFeedback>Please enter your first name</FormFeedback>}
                                            </Col>
                                            <Col sm={6}>
                                                <input
                                                    id="last_name"
                                                    {...register('last_name')}
                                                    type="text"
                                                    placeholder="Last Name" />
                                            </Col>
                                            <Col sm={12}>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    placeholder="Your Email Address"
                                                    {...register('email', { required: true })}
                                                    className={(errors && errors?.email) ? 'is-invalid input' : 'input' }
                                                />
                                                {errors && errors?.email && <FormFeedback>Please enter a valid email</FormFeedback>}
                                            </Col>
                                            <Col sm={12}>
                                                <div className='passwordField'>
                                                    <input
                                                        id="password"
                                                        type={passShowHide ? "text" : "password"}
                                                        placeholder="Password"
                                                        {...register('password', { required: true })}
                                                        autocomplete="on"
                                                        className={(errors && errors?.password) ? 'is-invalid input' : 'input' }
                                                    />
                                                    <span className='PassShowHide' onClick={() => setPassShowHide(!passShowHide)}>
                                                        {passShowHide ? <i className='fa  fa-eye-slash'></i> : <i className='fa fa-eye'></i>}
                                                    </span>
                                                </div>

                                                {errors && errors?.password && <FormFeedback>Please provide a valid password</FormFeedback>}
                                            </Col>
                                            <Col sm={12}>
                                                <select
                                                    name="gender"
                                                    id="gender"
                                                    {...register('gender', { required: true })}
                                                    defaultValue="0"
                                                >
                                                    <option value="0" disabled selected>Select Gender</option>
                                                    <option value="1">Male</option>
                                                    <option value="2">Female</option>
                                                    <option value="3">Prefer not to say</option>
                                                </select>
                                            </Col>

                                            <Col className='mb-2' sm={12}>
                                                <p className='f-12'>This site is protected by reCAPTCHA and the Google 
                                                    <a className='googleLink' href="https://policies.google.com/privacy"> Privacy Policy</a> and
                                                    <a className='googleLink' href="https://policies.google.com/terms"> Terms of Service</a> apply.
                                                </p>
                                            </Col>

                                            <Col sm={12}>
                                                <Row>
                                                    <Col sm={12}>
                                                        <div className="row-from style-1 formText mt-1 mb-4">if you are a creator, please check the option if it applies to you.</div>
                                                        <div className="row-from style-1 pl-3 IscreatorCheck">
                                                            <Input
                                                                onChange={(e) => handleChange(e, "creator")}
                                                                name="is_creator"
                                                                type="checkbox"
                                                                id='is_creator'
                                                            />
                                                            <label className='labling' htmlFor='is_creator'>I am a Creator or part of a team of Creators has persons that are Black, African or people of Colour.</label>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            {/* <Col className="paddingLeft" sm={12}>

                                            </Col> */}
                                        </Row>

                                        <Row>
                                            <Col sm={12} className="mt-5">
                                                <button type="submit" className="submit" disabled={loading}>{loading ? 'Submitting...' : 'Sign up'}</button>
                                            </Col>
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

export default SignUp;
