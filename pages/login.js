import React, { useState, Fragment, useEffect } from 'react';
import Link from 'next/link'
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input, FormFeedback } from 'reactstrap'
import { toast } from 'react-toastify'
import { Col, Row } from 'reactstrap';
import { axiosRequest } from '../http'
import { Model } from '../component/model';
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userReducer';
import { forgotPassShow } from '../redux/modelReducer';
import { useRouter } from 'next/router';
function SuccessToast({ err_code, message }) {
    return (
        <Fragment>
            {err_code === 404 ? <Link href={`/sign-up`}>
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

const Login = () => {
  
    const dispatch = useDispatch()
    const router = useRouter()
    // const navigate = useNavigate()
    const [remember, setRemember] = useState(false)
    const [passShowHide, setPassShowHide] = useState(false)
    const [loading, setLoading] = useState(false);

    const { forgotPass } = useSelector(state => state.modelReducer)

    const handleChange = (e, type) => {
        if (type === "remember" && e.target.checked) {
            setRemember(!remember)
        } else if (type === "remember" && !e.target.checked) {
            setRemember(!remember)
        }
    }

    const registerUser = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().min(4).max(16).required()
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
        loadScriptByURL("recaptcha-key", `https://www.google.com/recaptcha/api.js?render=${process.env.REACT_APP_RECAPTCHAKEY}`, function () {
            console.log("Script loaded!");
        });
    }, []);

    const onSubmit = async (data) => {
        const dataMain = {
            ...data,
            source_type: 1,
            source_id: ""
        }
        setLoading(true);
        window.grecaptcha.ready(() => {
            window.grecaptcha.execute(`${process.env.REACT_APP_RECAPTCHAKEY}`, { action: 'submit' }).then(token => {
                captachaValid()
            });
        });

        const captachaValid = async () => {
            try {
                const response = await axiosRequest({ sub_url: '/login', dataMain })
                if (response.status === 200) {
                    if (remember === true) {
                        localStorage.setItem('token', response.data.body.token);
                        localStorage.setItem('userData', JSON.stringify(response.data.body.profile));
                    } else {
                        sessionStorage.setItem('token', response.data.body.token);
                        sessionStorage.setItem('userData', JSON.stringify(response.data.body.profile));
                    }

                    dispatch(
                        setUserData(response.data.body.profile)
                    )
                    toast.success(<SuccessToast message={response.data.body.message} />, { hideProgressBar: true,  autoClose:  8000, })
                    setLoading(false);
                    router.push('/')
                    // navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/`)
                }
            } catch (err) {
                setLoading(false);
                if(err.response.data.message === "The login details are incorrect.") {
                    return toast.warning(<SuccessToast message={err?.response?.data?.message} />, { hideProgressBar: true,  autoClose:  8000, })
                } else {
                    return toast.warning(<SuccessToast
                        err_code={err?.response?.status}
                        message={err?.response?.data?.message}
                    />,
                        {
                            hideProgressBar: true,
                            autoClose: 13000,
                            closeOnClick: true,
                            pauseOnHover: true,
                        })
                }
            }
        }

    }

    const socialLogin = async (dataMain) => {
        try {
            dataMain.is_social_login = "0"
            const res = await axiosRequest({ sub_url: '/register', dataMain })
            if (res.data.status === true) {
                localStorage.setItem('token', res.data.body.token);
                localStorage.setItem('userData', JSON.stringify(res.data.body.profile));
                dispatch(
                    setUserData(res.data.body.profile)
                )
                toast.success(<SuccessToast message={res.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
                router.push('/')

                // navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/`)
            } else {
                toast.success(<SuccessToast message={res.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
            }

        } catch (err) {
            return toast.warning(<SuccessToast message={err.response.message} />, { hideProgressBar: true,  autoClose:  8000, })
        }
    }



    const responseFacebook = async (response) => {
        const name = response?.name.split(" ")
        let firstName ;
        let lastName ;
        if(name.length === 3) {
            firstName = name[0] + ' ' + name[1]
            lastName = name[2]
        } else {
            firstName = name[0]
            lastName = name[1] 
        }
        let dataMain
        if (response.accessToken) {
            dataMain = {
                source_type: 2,
                email: response.email,
                first_name: firstName,
                source_id: response.id,
                last_name: lastName,
                gender: "",
                password: "",
                is_creator: ""
            }
        } else {
            return
        }
        if (response.accessToken) {
            try {
                const response = await axiosRequest({ sub_url: '/sociallogin', dataMain })
                if (response.status === 200) {
                    localStorage.setItem('token', response.data.body.token);
                    localStorage.setItem('userData', JSON.stringify(response.data.body.profile));
                    dispatch(
                        setUserData(response.data.body.profile)
                    )
                    toast.success(<SuccessToast message={response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
                    router.push('/')
                    
                    // navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/`)
                } else {
                    toast.success(<SuccessToast message={response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
                }
            } catch (err) {
                if (err?.response?.status === 400 && err?.response?.data.new_account) {
                    socialLogin(dataMain)
                } else {
                    return toast.warning(<SuccessToast message={err?.response?.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
                }
            }
        }
    }

    const responseGoogle = async (response) => {
        const profileData = response.profileObj
        const name = profileData?.name.split(" ")
        let firstName ;
        let lastName ;
        if(name.length === 3) {
            firstName = name[0] + ' ' + name[1]
            lastName = name[2]
        } else {
            firstName = name[0]
            lastName = name[1] 
        }
        let dataMain
        if (profileData?.googleId && profileData?.googleId !== '') {
            dataMain = {
                source_type: 3,
                source_id: profileData?.googleId,
                email: profileData?.email,
                first_name: firstName,
                last_name: lastName,
                gender: "",
                password: "",
                is_creator: ""
            }
        } else {
            return
        }

        try {
            const response = await axiosRequest({ sub_url: '/sociallogin', dataMain })
            if (response.status === 200) {
                localStorage.setItem('token', response.data.body.token);
                localStorage.setItem('userData', JSON.stringify(response.data.body.profile));
                dispatch(
                    setUserData(response.data.body.profile)
                )
                toast.success(<SuccessToast message={response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
                router.push('/')
                
                // navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/`)
            } else {
                return toast.success(<SuccessToast message={response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
            }
        } catch (err) {
            if (err?.response?.status === 400 && err?.response?.data.new_account) {
                socialLogin(dataMain)
            } else {
                return toast.warning(<SuccessToast message={err?.response?.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
            }
        }
    }

    const handleForgotPassword = () => {
        dispatch(
            forgotPassShow(true)
        )
    }

    return (
        <Fragment>
            <section className="tf-login tf-section">
                <div className="themesflat-container pt-80">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="tf-title-heading ct style-1">
                                Login To Novatoons
                            </h2>

                            <div className="flat-form box-login-social">
                                <div className="box-title-login">
                                    <h5>Login with social</h5>
                                </div>
                                <ul className='SocialIcons'>
                                    <li>
                                        <GoogleLogin
                                            clientId={process.env.REACT_APP_CLIENT_ID}
                                            autoLoad={false}
                                            render={renderProps => (
                                                <div className="google-btn" onClick={renderProps.onClick} disabled={renderProps.disabled} type="button">
                                                    <div className="google-icon-wrapper">
                                                        <img alt="google" className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
                                                    </div>
                                                    <p className="btn-text"><b>Login with google</b></p>
                                                </div>
                                            )}
                                            buttonText="Login"
                                            onSuccess={(data) => { responseGoogle(data) }}
                                            onFailure={(data) => { responseGoogle(data) }}
                                            cookiePolicy={'single_host_origin'}
                                        />

                                    </li>

                                    <li>
                                        <FacebookLogin
                                            appId={process.env.REACT_APP_FACEBOOK_KEY}
                                            autoLoad={false}
                                            fields="name,email,picture,birthday,gender"
                                            scope="public_profile,user_friends"
                                            componentClicked={false}
                                            render={renderProps => (
                                                <button onClick={renderProps.onClick} className="sc-button style-2 social_loginbtn fl-button pri-3">
                                                    <i className="icon-fl-facebook"></i>
                                                    <span>Facebook</span>
                                                </button>
                                            )}
                                            callback={responseFacebook}
                                            disableMobileRedirect={true}
                                            icon="fa-facebook"
                                        />
                                    </li>
                                </ul>
                            </div>

                            <div className="flat-form box-login-email">
                                <div className="box-title-login">
                                    <h5>Or login with email</h5>
                                </div>

                                <div className="form-inner">
                                    <form id="loginform" onSubmit={handleSubmit(onSubmit)}>
                                        <Row>
                                            <Col sm={12}>
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="text"
                                                    placeholder="Your Email Address"
                                                    {...register('email', { required: true })}
                                                    autocomplete="on"
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
                                                    <span className='PassShowHide cursorPointer' onClick={() => setPassShowHide(!passShowHide)}>
                                                        {passShowHide ? <i className='fa fa-eye-slash'></i> : <i className='fa fa-eye'></i>}
                                                    </span>
                                                </div>

                                                {errors && errors?.password && <FormFeedback>Please provide a valid password</FormFeedback>}
                                            </Col>

                                            <Col className='mb-2' sm={12}>
                                                <p className='f-12'>This site is protected by reCAPTCHA and the Google 
                                                    <a className='googleLink' href="https://policies.google.com/privacy"> Privacy Policy</a> and
                                                    <a className='googleLink' href="https://policies.google.com/terms"> Terms of Service</a> apply.
                                                </p>
                                            </Col>

                                            <Col sm={6} xs={6} className="rememberCheck">
                                                <Input
                                                    onChange={(e) => handleChange(e, "remember")}
                                                    name="remember"
                                                    id='remember'
                                                    type="checkbox"
                                                />
                                                <label htmlFor='remember' className='labling'>Remember me</label>
                                            </Col>

                                            <Col sm={6} xs={6} className="alignRight">
                                                <div onClick={handleForgotPassword} className="forgot-pass">Forgot Password ?</div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm={12} className="mt-5">
                                                <button type="submit" className="submit" disabled={loading}>{loading ? 'Login...' : 'Login'}</button>
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

export default Login;
