import React, { useState, useEffect, Fragment } from 'react';

//third-party
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Col, Row, FormFeedback } from 'reactstrap'

//component
import {DeleteProfilePictueModel, MaturePopup, ChangePassword} from '../../component/model';
import Link from 'next/link';

//redux 
import { useDispatch, useSelector } from 'react-redux';
import { getUser, updateProfileImage, setUserData } from '../../redux/userReducer'
import { profilePictureShow, changePassShow, mutureModelToggle, resetSwitch } from '../../redux/modelReducer';
import { postRequest } from '../../commonApi';
import Loader from '../../component/loader/loader';
import {axiosRequest} from '../../http'
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

const EditProfile = () => {
   const avt = '/images/avatar/profileimage.png'
    const dispatch = useDispatch()
    const [dateOfBirth, setDateOfBirth] = useState(null)

    const { userData, loading } = useSelector(state => state.userReducer)
    const user = userData
    const { profilePicture, mutureModel, resetSwitchbtn } = useSelector(state => state.modelReducer)

    useEffect(() => {
        dispatch(getUser())
    }, [dispatch])
    const resetRequest = yup.object().shape({
        facebook_url: yup.string().url('Please Enter Valid Url'),  
        instagram_url:yup.string().url('Please Enter Valid Url'),
        tiktok_url:yup.string().url('Please Enter Valid Url'),
        twitter_url:yup.string().url('Please Enter Valid Url')
    })
    const { register, formState: { errors }, handleSubmit } = useForm({ mode: 'onChange', resolver: yupResolver(resetRequest) })

    useEffect(()=> {
        if(user?.is_mature === "1") {
            dispatch(
                resetSwitch(true)
            )
        }
    }, [user])

    
    const onSubmit = async (data) => {
        if (userData.is_verified === 0  || userData.is_verified === "0") {
            return toast.error(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true,  autoClose:  8000, })
          }
        let dataMain = {}
        if (data.first_name !== "") {
            dataMain.first_name = data.first_name
        }

        if (data.last_name !== "") {
            dataMain.last_name = data.last_name
        }

        dataMain.user_name = data.user_name
        
        if (data.bio !== "") {
            dataMain.bio = data.bio
        }
        if (data.dob !== "") {
            dataMain.dob = data.dob
        }
        if (data.email !== '') {
            dataMain.email = data.email
        }
        if (data.gender !== "") {
            dataMain.gender = data.gender
        }
        if (data.facebook_url !== "") {
            dataMain.facebook_url = data.facebook_url
        }
        if (data.twitter_url !== "") {
            dataMain.twitter_url = data.twitter_url
        }
        if (data.instagram_url !== "") {
            dataMain.instagram_url = data.instagram_url
        }
        if (data.tiktok_url !== "") {
            dataMain.tiktok_url = data.tiktok_url
        }

        const response = await postRequest({ sub_url: '/updateprofile', dataMain })
        if (response) {
            dispatch(getUser())
            return toast.success(<SuccessToast message={response.message} />, { hideProgressBar: true,  autoClose:  8000, })
        }
    }

    const uploadProfileImg = (e) => {
        if (userData.is_verified === 0  || userData.is_verified === "0") {
            return toast.error(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true,  autoClose:  8000, })
          }
        const uplaodfile = e.target.files[0]
        const reader = new FileReader()
        reader.onloadend = () => {
            const upload_File = reader.result
            dispatch(
                updateProfileImage({
                    profile_img: upload_File
                })
            )
        }
        reader.readAsDataURL(uplaodfile)
    }


    const handleDeleteProfilePicture = () => {
        if (userData.is_verified === 0  || userData.is_verified === "0") {
            return toast.error(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true,  autoClose:  8000, })
          }
        dispatch(
            profilePictureShow(true)
        )
    }


    const handleChangePassword = () => {
        if (userData.is_verified === 0  || userData.is_verified === "0") {
            return toast.error(<SuccessToast message='Verify your email to use this feature' />, { hideProgressBar: true,  autoClose:  8000, })
          }
        // dispatch(
        //     changePassShow(true)
        // )
    }

    const handleMature = async (e) => {
        if(e.target.checked) {
            if(userData.is_mature !== "1") {
                dispatch(
                    mutureModelToggle(true)
                )
                dispatch(
                    resetSwitch(true)
                )
            }
        } else {
            try {
                const response = await axiosRequest({sub_url: '/updateprofile', dataMain: {is_mature: "0"}}) 
                if(response.status === 200) {
                    dispatch(
                        setUserData(response.data.body.profile)
                    )
                    dispatch(
                        resetSwitch(false)
                    )
                    return toast.success(<SuccessToast message={response.data.message} />, { hideProgressBar: true,  autoClose: 8000, })
                }
            } catch (err) {
                return toast.error(<SuccessToast message={err.response.message} />, { hideProgressBar: true,  autoClose: 8000, })
            }
        }
    }

    if (!loading && Object.keys(user).length > 0) {
        return (
            <Fragment>
                <div className="tf-create-item tf-section">
                    <div className="themesflat-container pt-80">
                        <div className="row">
                            <div className="col-xl-3 col-lg-4 col-md-6 col-8 profileImage">
                                <div className="sc-card-profile text-center">
                                    <div className="card-media positionRelative">
                                        <img id="profileimg" src={user?.profile_img ? user?.profile_img : avt} alt="Novatoons" />
                                        <input id="tf-upload-img" onChange={uploadProfileImg} accept='.jpeg, .png, .jpg' type="file" name="profile" required="" />
                                    </div>
                                    {/* <div id="upload-profile">
                                        <div className="btn-upload">
                                            Upload New Photo </div>
                                    </div> */}
                                    { !user?.profile_img ? <div className="btn-upload style2 cursorPointer"> Update Profile Picture
                                    <input id="tf-upload-img" onChange={uploadProfileImg} accept='.jpeg, .png, .jpg' type="file" name="profile" required="" />
                                    </div>
                                    : <div onClick={handleDeleteProfilePicture} className="btn-upload style2 cursorPointer"> Remove Profile Picture</div>
                                    }
                                    {
                                        user?.is_creator !== 0 && <Link href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/author/${user?.id}`} className="btn-upload style2 cursorPointer"> View As Public </Link>
                                    }

                                    <div className='mutureContent mt-3'>
                                        <p className='lableSwitch mb-2'>View mature content</p>
                                        <div>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    className={resetSwitchbtn ? "react-switch-checkbox active" : "react-switch-checkbox"}
                                                    id={`react-switch-new`}
                                                    onChange={(e) => handleMature(e)}
                                                    checked={resetSwitchbtn}
                                                />
                                                <span className={resetSwitchbtn ? "slider round bgChange active" : "slider round bgChange"}></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-9 col-lg-8 col-md-12 col-12">
                                <div className="form-upload-profile form-inner ">
                                    {/* <h4 className="title-create-item">Choice your Cover image</h4>
                                <div className="option-profile clearfix">
                                    <form action="#">
                                        <label className="uploadFile">
                                            <input type="file" className="inputfile form-control" name="file" />
                                        </label>
                                    </form>
                                    <div className="image">
                                        <img src={bg1} alt="Novatoons" />
                                    </div>
                                    <div className="image style2">
                                        <img src={bg2} alt="Novatoons" />
                                    </div>
                                </div> */}
                                    <form onSubmit={handleSubmit(onSubmit)} className="form-profile">
                                        <h4 className="title-create-item">Account info</h4>
                                        <div className="form-infor-profile">
                                            <div className="info-account">
                                                <Row>
                                                    
                                                    <Col sm={6}>
                                                        <h4 className="title-infor-account text-white">First Name</h4>
                                                        <input
                                                            id="first_name"
                                                            defaultValue={user?.first_name}
                                                            {...register('first_name')}
                                                            type="text"
                                                            placeholder="First Name"
                                                        />
                                                        {errors.first_name && <p>{errors.first_name.message}</p>}
                                                    </Col>
                                                    <Col sm={6}>
                                                        <h4 className="title-infor-account text-white">Last Name</h4>
                                                        <input
                                                            id="last_name"
                                                            defaultValue={user?.last_name}
                                                            {...register('last_name')}
                                                            type="text"
                                                            placeholder="First Name"
                                                        />
                                                        {errors.last_name && <p>{errors.last_name.message}</p>}
                                                    </Col>
                                                    <Col sm={6}>
                                                        <h4 className="title-infor-account text-white">Display Name <i className="fa fa-question-circle ml-3" aria-hidden="true"><div className="tooltiptext">This display name will only be shown on the platform, if you have created a content.</div></i> </h4>
                                                        <input
                                                            id="user_name"
                                                            defaultValue={user?.user_name}
                                                            {...register('user_name')}
                                                            type="text"
                                                            placeholder="User Name"
                                                        />
                                                        {errors.user_name && <p>{errors.user_name.message}</p>}
                                                    </Col>
                                                    {userData.source_type === 1 &&
                                                        <Fragment>
                                                        <Col sm={6}>
                                                            <h4 className="title-infor-account text-white">Password</h4>
                                                            <input
                                                                id="password"
                                                                value="sorry password is secured"
                                                                type="password"
                                                                placeholder="password"
                                                                className='input'
                                                            />
                                                            <div onClick={handleChangePassword} className="h3 cursorPointer float-right mt-0 pt-2 text-danger changePass">Change Password</div>
                                                        </Col>

                                                    <Col sm={6}>
                                                        <h4 className="title-infor-account text-white">Email</h4>
                                                        <input
                                                            id="email"
                                                            defaultValue={user?.email}
                                                            {...register('email',
                                                                {
                                                                    pattern: {
                                                                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                                                        message: 'Please enter a valid email',
                                                                    },
                                                                }
                                                            )}
                                                            type="email"
                                                            placeholder="Email"
                                                            disabled={userData.source_type !== 1 && 'true'}
                                                        />
                                                        {errors.email?.message && (
                                                            <FormFeedback errorMessage={errors.email?.message} />
                                                        )}
                                                    </Col> 
                                                    </Fragment>}

                                                    <Col sm={6}>
                                                        <Row>
                                                            
                                                            <Col sm={6}>
                                                                <h4 className="title-infor-account text-white">Date Of Birth</h4>
                                                                <input
                                                                    id="dob"
                                                                    min="1900-01-01"
                                                                    max="2020-12-31"
                                                                    defaultValue={(dateOfBirth !== null) ? dateOfBirth : user?.dob}
                                                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                                                    name="dob"
                                                                    type="date"
                                                                    {...register('dob')}
                                                                    placeholder="Date of Birth"
                                                                    className='input'

                                                                />
                                                            </Col>
                                                            <Col sm={6}>  
                                                            <h4 className="title-infor-account text-white">Gender
                                                            </h4>                                                            
                                                            {
                                                                user?.gender === 0 || user?.gender !== 0 ? 
                                                                <select
                                                                    name="gender"
                                                                    id="gender"
                                                                    {...register('gender')}
                                                                    defaultValue={`${user?.gender}`}
                                                                >
                                                                    <option value="0" disabled selected>Select Gender</option>
                                                                    <option value="1">Male</option>
                                                                    <option value="2">Female</option>
                                                                    <option value="3">Prefer not to say</option>
                                                                </select> : null
                                                            }
                                                            
                                                            </Col> 
                                                        </Row>
                                                    </Col>

                                                    <Col sm={12}>
                                                        <h4 className="title-infor-account text-white">Bio</h4>
                                                        <textarea tabIndex="4" rows="5"
                                                            defaultValue={user?.bio}
                                                            {...register('bio')} >
                                                        </textarea>
                                                    </Col>

                                                </Row>
                                            </div>
                                        </div>

                                        <div className='socialMediaLink'>
                                            <h4 className="title-create-item">Social Media</h4>
                                            <Row>
                                                <Col sm={6} >
                                                    <h4 className="title-infor-account text-white">Facebook</h4>
                                                    <input
                                                        id="facebook_link"
                                                        defaultValue={user?.facebook_url}
                                                        {...register('facebook_url')}
                                                        type="text"
                                                        placeholder="Facebook Link" 
                                                        style={{
                                                            border: errors?.facebook_url?.message && '1px  solid red'  
                                                        }}
                                                    />
                                                    {errors?.facebook_url?.message && (
                                                        <FormFeedback className='mb-4'>
                                                        {errors?.facebook_url?.message}
                                                        </FormFeedback>
                                                    )}
                                                </Col>

                                                <Col sm={6}>
                                                    <h4 className="title-infor-account text-white">Instagram</h4>
                                                    <input
                                                        id="instagram_link"
                                                        defaultValue={user?.instagram_url}
                                                        {...register('instagram_url')}
                                                        type="text"
                                                        placeholder="instagram Link"
                                                        style={{
                                                            border: errors?.instagram_url?.message && '1px  solid red'  
                                                        }}
                                                    />
                                                    {errors?.instagram_url?.message && (
                                                        <FormFeedback className='mb-4'>
                                                        {errors?.instagram_url?.message}
                                                        </FormFeedback>
                                                    )}
                                                </Col>

                                                <Col sm={6}>
                                                    <h4 className="title-infor-account text-white">Twitter</h4>
                                                    <input
                                                        id="twitter_link"
                                                        defaultValue={user?.twitter_url}
                                                        {...register('twitter_url')}
                                                        type="text"
                                                        placeholder="twitter Link"
                                                        style={{
                                                            border: errors?.twitter_url?.message && '1px  solid red'  
                                                        }}
                                                    />
                                                    {errors?.twitter_url?.message && (
                                                        <FormFeedback className='mb-4'>
                                                        {errors?.twitter_url?.message}
                                                        </FormFeedback>
                                                    )}
                                                </Col>

                                                <Col sm={6}>
                                                    <h4 className="title-infor-account text-white">Tiktok</h4>
                                                    <input
                                                        id="tiktok_link"
                                                        defaultValue={user?.tiktok_url}
                                                        {...register('tiktok_url')}
                                                        type="text"
                                                        placeholder="tiktok Link"
                                                        style={{
                                                            border: errors?.tiktok_url?.message && '1px  solid red'  
                                                        }}
                                                    />
                                                    {errors?.tiktok_url?.message && (
                                                        <FormFeedback className='mb-4'>
                                                        {errors?.tiktok_url?.message}
                                                        </FormFeedback>
                                                    )}
                                                </Col>

                                            </Row>

                                        </div>
                                        <button className="tf-button-submit mg-t-15" type="submit">
                                            Update Profile
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {profilePicture && <DeleteProfilePictueModel />}
                {changePassShow && <ChangePassword />}
                {mutureModel && <MaturePopup /> }
            </Fragment>
        );
    } else {
         return <Loader />
    }
}

export default EditProfile;
