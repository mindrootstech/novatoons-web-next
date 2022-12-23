import React, { useEffect, useState, Fragment } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
//Images


//Form
import * as yup from 'yup'
import { Col, Row, FormFeedback } from 'reactstrap'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import classnames from 'classnames'

//third-party
import { toast } from 'react-toastify'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';


//component
import {Content_typeModel,PreviewModel, Commingsoon, RejectionHandler, CroppingPopup, RedirectModel} from '../model'


//api
// import { axiosRequest } from '../../http';
// import { isUserLoggedInToken, base_url } from '../../config'
import axios from "axios"

//redux
// import { useSelector, useDispatch } from 'react-redux'
// import { modelShow, resettypes, uploadContent } from '../../components/header/store/headerReducer'
// import { getTags, getGenre, resetTags } from '../../redux/tagReducer'
// import { previewpopup, closepreviewpopup, is_content_duplicate, cover_image_ratio } from './ContentSeriesReducer';
// import { cropPopUp } from './editContentSeriesReducer';
// import { processLoader, progressBar } from '../../redux/commonReducer'
// import { getUser, appendNotifications } from '../user/userReducer'
// import { redirectToHomeModel } from '../../redux/modelReducer';


//style
import { customStyles } from '../../assets/themeconfig';
// import 'react-tabs/style/react-tabs.css';
// import './content.css'
import { isWindow } from '../../utils/window';
import Link from 'next/link';

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


const CreateContent = (socket) => {
    const placeholder = 'images/contentImages/placeholder.png'
    const dummyuser = 'images/avatar/dummyuser.png'
    const free = 'images/contentImages/free.svg'
    const paid = 'images/contentImages/paid.svg'
    const download = 'images/contentImages/download.svg'
    // const dispatch = useDispatch()
    // const navigate = useNavigate()
    const [cover_image, setCover_image] = useState(null)
    const [preview, setPreview] = useState()
    const [manualError, setManualError] = useState(false)
    const [tagError, setTagError] = useState(false)

    const [tagPlaceholder, setTagPlaceholder] = useState(false)

    const [genre_id, setGenre_id] = useState(null)
    const [tags_ids, setTags_ids] = useState(null)
    const [tagsSelected, setTagsSelected] = useState([])
    const [cover_image_name, setCover_image_name] = useState("")

    const [subGenre, setSubGenre] = useState([])
    const [myTags, setMyTags] = useState([])

    //redux tables
    // const create_content = useSelector(state => state.headerReducer)
    // const { valueReset, previewItem, contenttypeName, is_duplicate, cover_image_dimention } = useSelector(state => state.seriesReducer)
    // const { tags, genres, error } = useSelector(state => state.tagReducer)
    // const { processing } = useSelector(state => state.commonReducer)
    // const userReducer = useSelector(state => state.userReducer)
    // const { redirectToHome } = useSelector(state => state.modelReducer)
    // const { userData } = userReducer
    // const EditReducer = useSelector(state => state.editSeriesReducer)
   const error = null
   const processing = false
    const is_duplicate = false
    const userReducer = {userData:{profile_img: ''}}
    const create_content = {type: "content", showModel: true }
    const genres = ["hello"]
    const tags = ["hello"]
    const previewItem = {previewPopup: false}
    const EditReducer = {croppopup:{show:false}} 
    const redirectToHome = false
    
    const createContentSchema = yup.object().shape({
        is_agree: yup.bool().oneOf([true]).required(),
        is_paid: yup.string().required(),
        is_matured: yup.number().required(),
        title: yup.string().required(),
        price: yup.number().when('is_paid', (is_paid, createContentSchema) => {
            return is_paid === "1" ? createContentSchema.min(2) : createContentSchema
        }),
        file: yup.mixed().when("type", {
            is: "1",
            then: yup
                .mixed()
                .test("required", "You need to provide a file", (value) => {
                    if (value.length > 0) {
                        return true
                    }
                    return false
                })
                .test("fileSize", "The file is too large (Max-limit is 150mb)", (value) => {
                    if (value.length > 0) {
                        return value && value[0].size <= 150000000;
                    }
                    return true
                }).test("type", "The file format should be the .pdf only", (value) => {
                    if (create_content.content_type === 2 && value.length > 0) {
                        return value && (
                            value[0].type === 'image/png' ||
                            value[0].type === 'image/jpeg' ||
                            value[0].type === 'image/jpg'
                        );
                    } else if ((create_content.content_type === 1 && value.length > 0) || (create_content.content_type === 3 && value.length > 0)) {
                        return value && (
                            value[0].type === 'application/pdf'
                        );
                    }
                }),
        }),
        cover_image: yup.mixed().test("required", "You need to provide a file", (value) => {
            if (value.length > 0) {
                return true
            }
            return false
        }).test("fileSize", "The file is too large (Max-limit is 2mb)", (value) => {
            if (value.length > 0) {
                return value && value[0].size <= 2000000;
            }
            return true
        }).test("type", "The file format should be the jpeg, png, jpg only", (value) => {
            if (value.length > 0) {
                return value && (
                    value[0].type === 'image/jpg' ||
                    value[0].type === 'image/png' ||
                    value[0].type === 'image/jpeg'
                );
            }
        }),
    })

    const { register, formState: { errors }, reset, setError, handleSubmit, watch, clearErrors } = useForm({ mode: 'onChange', resolver: yupResolver(createContentSchema) })

    // useEffect(() => {
    //     const uploadcontentData = localStorage.getItem("uploadcontent")
    //     let content_Data = uploadcontentData ? JSON.parse(uploadcontentData) : {
    //         content_type: null,
    //         type: null,
    //         steps: 0
    //     }
    //     dispatch(
    //         uploadContent({
    //             content_type: content_Data.content_type,
    //             type: "single",
    //             steps: content_Data.steps,
    //         })
    //     )
    //     dispatch(
    //         cropPopUp({
    //             show: false,
    //             file: null,
    //             coverfilename: null
    //         })
    //     )
    //     dispatch(
    //         getGenre()
    //     )
    //     if (valueReset) {
    //         reset()
    //         setPreview(placeholder)
    //     }

    // }, [dispatch])


    // useEffect(() => {
    //     if (EditReducer.croppopup.file !== null) {
    //         setPreview(EditReducer.croppopup.file)
    //         if (Object.keys(EditReducer.croppopup.file).length === 0) {
    //             setCover_image(null)
    //         } else {
    //             setCover_image(EditReducer.croppopup.file)
    //             setCover_image_name(EditReducer.croppopup.coverfilename)
    //         }
    //     } else {
    //         setPreview(placeholder)
    //     }
    // }, [EditReducer])

    const is_paid_val = watch("is_paid")
    const matured_content_val = watch("is_matured")

    const onSubmit = async (data) => {
        let admin_token = isWindow() && sessionStorage.getItem("admin_token");
        let loggedinBy = isWindow() && sessionStorage.getItem("loggedinBy");
        if (genre_id === undefined || genre_id === null) {
            return setManualError(true)
        } else if (tags_ids === null || tags_ids === undefined || tags_ids.length === 0) {
            return setTagError(true)
        }

        if (create_content.content_type === null || isNaN(create_content.content_type)) {
            dispatch(resettypes())
            dispatch(modelShow(true))
            return toast.success(<SuccessToast message={"Please select a content type"} />, { hideProgressBar: true, autoClose: 8000, })
        }

        let dataMain = {
            ...data,
            cover_image,
            content_type: create_content.content_type,
            is_downloadable: data.is_downloadable === false || data.is_downloadable === undefined ? 0 : 1,
            series_id: 0,
            genre_id,
            tag_ids: tags_ids.join(),
            cover_image_name,
            is_available: data.is_available === false || data.is_available === undefined ? 0 : 1,
            sub_genres_id: subGenre.map(item => item.id).join(),
            is_agree: data.is_agree ? 1 : 0
        }

        dispatch(processLoader(true))
        var formdata = new FormData();
        formdata.append("content_type", dataMain.content_type);
        formdata.append("title", dataMain.title);
        formdata.append("is_paid", dataMain.is_paid);
        formdata.append("tag_ids", dataMain.tag_ids);
        formdata.append("is_available", dataMain.is_available);
        formdata.append("is_downloadable", dataMain.is_downloadable);
        formdata.append("series_id", dataMain.series_id);
        formdata.append("is_mature", dataMain.is_matured);
        formdata.append("file", dataMain.file[0]);
        formdata.append("cover_image", dataMain.cover_image);
        formdata.append("genre_id", dataMain.genre_id);
        formdata.append("cover_image_name", dataMain.cover_image_name)
        formdata.append("desription", data.description)
        formdata.append("sub_genres_id", dataMain.sub_genres_id)
        formdata.append('is_agree', dataMain.is_agree)

        if (dataMain.price) {
            formdata.append("price", dataMain.price)
        }

        let config = {
            baseURL: `${base_url}/createcontent`,
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                token: isUserLoggedInToken(),
            },
            data: formdata,
            onUploadProgress(progressEvent) {
                const { loaded, total } = progressEvent;
                let percent = Math.floor((loaded * 100) / total)
                dispatch(
                    progressBar(`${percent}`)
                )
            }
        }


        if (admin_token && loggedinBy === "admin") {
            config.headers.admin_token = admin_token
        }

        try {
            dispatch(processLoader(true))
            dispatch(redirectToHomeModel(true))
            const res = await axios(config)
            if (res.data.status === true) {
                dispatch(processLoader(false))
                dispatch(getUser())
                dispatch(resetTags())
                dispatch(getGenre())
                // if(socket && res){
                //     socket?.emit("sendNotification", 
                //     JSON.stringify({
                //         sender_name: userData?.user_name !== "" ? userData?.user_name : `${userData.first_name} ${userData.last_name}`,
                //         receiver_id: userData?.id,
                //         content_id: res?.data?.body.id,
                //         slug: res?.data?.body?.slug,
                //         notification_type: 1,
                //         sender_id: userData.id,
                //     })
                // )
                // }
                // dispatch(
                //     appendNotifications({
                //         sender_name: userData?.id,
                //         receiver_id: userData?.id,
                //         content_id: res?.data?.body.id,
                //         slug: res?.data?.body?.slug,
                //         notification_type: 1,
                //         sender_id: userData?.id,
                //         status: 0,
                //         created_at: new Date(),
                //     })
                // );
                toast.success(<SuccessToast message={"Done! Your content is being uploaded and you will be notified when this is live."} />, { hideProgressBar: true, autoClose: 8000, })

            }
            if (create_content.content_type === 2 || create_content.content_type === "2") {
                navigate(`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/`)
            }

            setManualError(false)
            setTagError(false)
            reset()
            setPreview(placeholder)
            setSubGenre([])
            setMyTags([])

        } catch (err) {
            dispatch(processLoader(false))
            return toast.warning(<SuccessToast message={err.response.data.message} />, { hideProgressBar: true, autoClose: 8000, })
        }
    }

    const GenreHandle = async (item) => {
        if (item) {
            setManualError(false)
        }
        dispatch(
            getTags({ genre_id: item.id })
        )
        setGenre_id(item.id)
        setSubGenre([])
        setMyTags([])
    }

    //Tags Handle
    const TagsHandle = async (newValue, actionMeta) => {

        if (newValue.length !== 0) {
            setTagError(false)
        }

        setMyTags(newValue)

        const filtered = newValue.slice(-1)[0]
        if (actionMeta.action === "create-option" && filtered.__isNew__ === true) {
            try {
                const response = await axiosRequest({ sub_url: "/inserttags", dataMain: { tag: filtered.value, genre_id } })
                if (response.status === 200) {
                    newValue[newValue.length - 1].id = response.data.data;
                    dispatch(
                        getTags({ genre_id })
                    )
                }
            } catch (err) {
                toast.warning(<SuccessToast message={err.response.data.message} />, { hideProgressBar: true, autoClose: 8000, })
            }
        }

        const filterTags = newValue.map(item => {
            return item.value
        })
        let i = 0;
        let filterids = []

        filterTags.forEach(function (tag) {
            filterids.push(newValue[i].id);
            i++;
        });
        setTags_ids(filterids)
        setTagsSelected(filterTags)

    }

    // single image section 
    const uploadImage = (e, type) => {
        if (type === "uploadCover") {
            const uplaodfile = e.target.files[0]
            const reader = new FileReader()

            reader.onloadend = () => {
                const upload_File = reader.result
                //get dimention
                var img = new Image;
                img.src = upload_File
                img.onload = function () {

                    if (img.width !== 270 && img.height !== 400) {
                        return setError("cover_image", {
                            type: "manual",
                            message: "Image size must be 270x400(px) and less than 2MB"
                        });
                    }
                    // dispatch(
                    //     cover_image_ratio({
                    //         width: img.width,
                    //         height: img.height,
                    //         ratio: img.height <= 400 && img.width <= 270
                    //     })
                    // )
                };

                dispatch(
                    cropPopUp({
                        show: false,
                        file: upload_File,
                        coverfilename: uplaodfile.name
                    })
                )
                setPreview(upload_File)
                setCover_image(upload_File)
                setCover_image_name(uplaodfile.name)

            }
            reader.readAsDataURL(uplaodfile)
        }
    }

    // useEffect(()=> {
    //     if(!cover_image_dimention.ratio && cover_image_dimention.height){
    //         return setError("cover_image", {
    //             type: "manual",
    //             message: "Please enter a valid thumbnail dimension"
    //         });
    //     } else if (cover_image_dimention.height === 400 && cover_image_dimention.width === 270) {
    //         clearErrors("cover_image")
    //     }
    // }, [cover_image_dimention])


    const handlePreviewModel = () => {
        if (!previewItem.previewPopup) {
            dispatch(previewpopup(
                {
                    cover_image,
                    is_paid: is_paid_val,
                    is_downloadable: watch("is_downloadable") === false || watch("is_downloadable") === undefined ? 0 : 1,
                    genre_id,
                    is_available: watch("is_available") === false || watch("is_available") === undefined ? 0 : 1,
                    price: watch("price") ? watch("price") : null,
                    title: watch("title") ? watch("title") : null,
                    contentDescription: watch("description"),
                    tagsSelected
                }
            ))
        } else {
            dispatch(closepreviewpopup())
        }
    }

    const handleFile = (e) => {
        dispatch(
            is_content_duplicate({ file_name: e.target.files[0].name })
        )
    }


    useEffect(() => {
        if (is_duplicate?.status === false) {
            setError("file", {
                type: "manual",
                message: is_duplicate.message
            });
        }

    }, [is_duplicate])
    const errorsLength = Object.keys(errors).length
    if (isWindow() && (sessionStorage.getItem('content_type') === 4 || sessionStorage.getItem('content_type')) === "4") {
        return <Commingsoon />
    } else if (error !== null) {
        return <RejectionHandler data={error} />
    } else {
        return (
            <Fragment>
                <div className='create-item'>
                    {processing && <Fragment>
                        <div className="container-fluid">
                            <Row>
                                <Col className='mobPadding' sm={12}>
                                    <div className="bfGreen">
                                        <h6 className='toast-title'> Your content is under processing and will be available on the platform soon. You may check the status in "My Uploads" section. </h6>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Fragment>}
                    <div className="tf-create-item tf-section">
                        <div className="themesflat-container contentCreate pt-80">
                            <div className="row">
                                <div className="col-xl-3 col-lg-6 col-sm-6 col-12 previewItemCard">
                                    <h4 className="title-create-item">Preview item</h4>
                                    <div className="sc-card-product">
                                        <div className="card-media">
                                            {(cover_image !== null) ? <img src={preview} alt="preview" /> : <img src={placeholder} alt="placeholder" />}
                                        </div>
                                        <div className="card-title">
                                            <h5>{watch("title")}</h5>
                                        </div>
                                        <div className="meta-info">
                                            <div className="author">
                                                <div className="avatar">
                                                    <img src={(userReducer.userData.profile_img && userReducer.userData.profile_img !== "") ? userReducer.userData.profile_img : dummyuser} alt="novatoons" />
                                                </div>
                                                <div className="info">
                                                    <span>Author</span>
                                                    <h6> <Link href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/edit-profile`}>{(userReducer.userData.user_name !== "" && userReducer.userData.is_creator === 1) ? userReducer.userData.user_name : `${userReducer.userData.first_name} ${userReducer.userData.last_name}`}</Link></h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="previewBtn" onClick={handlePreviewModel}>Preview</div>
                                </div>

                                <div className="col-xl-9 col-lg-6 col-md-12 col-12">
                                    <div className="form-create-item createItem">
                                        <form className="createContentForm" onSubmit={handleSubmit(onSubmit)}>
                                            <Row>

                                                {create_content.type === 'single' || create_content.type === null ?
                                                    <Col md={12} xl={6} >
                                                        <h4 className="title-create-item">Upload {contenttypeName}</h4>
                                                        <label
                                                            className={classnames('uploadFile', { 'is-invalid': errors?.file })}
                                                        >
                                                            <span className="filename thumbFile">{
                                                                watch('file')?.length > 0 ? watch('file')[0].name :
                                                                    create_content.content_type === 2 ? "Upload (format - jpeg, jpg, png)" : "Upload (format - pdf, max-size is 150mb)"
                                                            }
                                                            </span>
                                                            <div className="upload-btn-wrapper">
                                                                <div className="designedBtn">Select file</div>
                                                                <input
                                                                    type="file"
                                                                    id="file"
                                                                    {...register('file', {
                                                                        onChange: (e) => {
                                                                            handleFile(e)
                                                                        }
                                                                    })}
                                                                    disabled={processing}
                                                                    className="inputfile form-control"
                                                                    accept={create_content.content_type === 2 ? ".jpeg, .png, .jpg" : ".pdf"}
                                                                />
                                                            </div>
                                                        </label>
                                                        {errors?.file && <FormFeedback className='mb-4'>{errors?.file.message}</FormFeedback>}
                                                    </Col> : null}

                                                <Col md={create_content.type === 'single' || create_content.type === null ? '12' : '12'} xl={create_content.type === 'single' || create_content.type === null ? '6' : '12'}>
                                                    <h4 className="title-create-item">Upload {create_content.type === 'multiple' ? "Collection" : null} Cover</h4>
                                                    <label
                                                        className={classnames('uploadFile', { 'is-invalid': errors?.cover_image })}
                                                    >
                                                        <div className="filename thumbFile">{cover_image_name !== "" ? cover_image_name : "Please upload image (jpeg, jpg, png) upto 2 mb in size (Dimension = width 270px and height 400px)"} </div>
                                                        <div className="upload-btn-wrapper">
                                                            <div className="designedBtn">Select file</div>
                                                            <input
                                                                type="file"
                                                                id="cover_image"
                                                                className="inputfile form-control"
                                                                accept=".jpeg, .png, .jpg"
                                                                {...register('cover_image', {
                                                                    onChange: (e) => {
                                                                        uploadImage(e, "uploadCover")
                                                                    }
                                                                })}
                                                                disabled={processing}
                                                            />
                                                        </div>
                                                    </label>
                                                    {errors?.cover_image && <FormFeedback className='mb-4'>{errors?.cover_image.message}</FormFeedback>}
                                                </Col>

                                                <Col sm={12}>
                                                    <h4 className="title-create-item">{create_content.type === 'single' || create_content.type === null ? '' : 'Collection '}Title</h4>
                                                    <input
                                                        type="text"
                                                        {...register('title', { required: "true" })}
                                                        placeholder="Item name"
                                                        className={classnames('input', { 'is-invalid': errors?.title })}
                                                        disabled={processing}
                                                    />
                                                    {errors?.title && <FormFeedback className='mb-4'>Title is a required field</FormFeedback>}
                                                </Col>

                                                <Col sm={12}>
                                                    <h4 className="title-create-item">{create_content.type === 'single' || create_content.type === null ? '' : 'Collection '}Description</h4>
                                                    <textarea
                                                        className='textAreaField'
                                                        {...register('description', { required: true })}
                                                        placeholder="e.g. “This is very limited item”"
                                                        disabled={processing}
                                                    >
                                                    </textarea>
                                                </Col>

                                                <Col sm={12}>
                                                    <h4 className="title-create-item">Options for readers</h4>
                                                    <Row>
                                                        <Col className="mb-2 mobileKliye" sm={4}>
                                                            <input
                                                                type="radio"
                                                                {...register('is_paid', {
                                                                    required: true,
                                                                    onChange: () => {
                                                                        clearErrors('price')
                                                                    }
                                                                })}
                                                                className="isPaidOrFree"
                                                                value="0"
                                                                disabled={processing}
                                                            />
                                                            <div className={is_paid_val === "0" ? "activebtn btnforPaid" : "btnforPaid"}>
                                                                <img className="imgTabs" src={free} alt="free" />Free to Read
                                                            </div>
                                                        </Col>
                                                        <Col className="mb-2 mobileKliye" sm={4}>
                                                            <input
                                                                type="radio"
                                                                {...register('is_paid', { required: true })}
                                                                className="isPaidOrFree"
                                                                value="1"
                                                                disabled={processing}
                                                            />
                                                            <div className={is_paid_val === "1" ? "activebtn btnforPaid" : "btnforPaid"}>
                                                                <img className="imgTabs" src={paid} alt="free" />Purchase
                                                            </div>
                                                        </Col>

                                                        {(create_content.type === 'single' || create_content.type === null) && <Col className="mb-2" sm={4}>
                                                            <input
                                                                type="checkbox"
                                                                className="isPaidOrFree"
                                                                {...register('is_downloadable', { required: true })}
                                                                disabled={processing}
                                                            />
                                                            <div className={watch("is_downloadable") ? "activebtn btnforPaid" : "btnforPaid"}>
                                                                <img className="imgTabs" src={download} alt="free" />Available for Download
                                                            </div>
                                                        </Col>
                                                        }


                                                        {errors?.is_paid && <Col sm={12}> <FormFeedback className='mb-4'>Please select if this content is Free or Paid</FormFeedback> </Col>}


                                                        {is_paid_val === "1" &&
                                                            <Fragment>
                                                                <Col className="mt-4 priceInput" sm={12}>
                                                                    <h4 className="title-create-item">{create_content.type === 'single' || create_content.type === null ? '' : 'Series '}Price (USD)
                                                                        <i className="fa fa-question-circle ml-3" aria-hidden="true">
                                                                            <div className="tooltiptext second">Platform Fees : {userReducer.userData.owner_fee}%
                                                                            </div>
                                                                        </i>
                                                                    </h4>
                                                                    <input
                                                                        type="number"
                                                                        {...register('price')}
                                                                        defaultValue="0"
                                                                        placeholder="Enter Price"
                                                                        className={classnames('input', { 'is-invalid': errors?.price })}
                                                                        disabled={processing}
                                                                    />
                                                                    {parseInt(watch("price")) > 1 ? <div className='PlatformInfo'>

                                                                        You will receive ${(parseFloat(watch("price") - ((parseFloat(watch("price")) / 100) * parseFloat(userReducer.userData.owner_fee)))).toFixed(2)}, when user purchases the content.</div> : null}
                                                                </Col>
                                                            </Fragment>}
                                                        <Col className='mb-2' sm={12}>
                                                            {errors?.price && watch('is_paid') === "1" && <FormFeedback className='mb-4'>Please enter a valid Price(*Note - minimum value need to be $2*)</FormFeedback>}
                                                        </Col>

                                                        {/* <Col className={is_paid_val === "1" ? "mt-2" : "mt-4"} sm={12}>
                                                            <h4 className="title-create-item">Revenue sharing</h4>
                                                            <div className="switchbtn">
                                                                <Row>
                                                                    <Col className='lableSwitch' sm={6} xs={9}>Available for subscribed users</Col>
                                                                    <Col sm={6} xs={3}>
                                                                        <label className="switch">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="react-switch-checkbox"
                                                                                id={`react-switch-new`}
                                                                                {...register('is_available')}
                                                                                disabled={processing}
                                                                            />
                                                                            <span className="slider round"></span>
                                                                        </label>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                            <p className="switchBottom mt-4">Enabling this option would allow subscribed platform users to view the content. You will receive a percentage of revenue based on page views.</p>
                                                        </Col> */}

                                                    </Row>
                                                </Col>

                                                <Col sm={12}>
                                                    <h4 className="title-create-item">Matured Content</h4>
                                                    <Row>
                                                        <Col className="mb-2 mobileKliye" sm={4}>
                                                            <input
                                                                type="radio"
                                                                {...register('is_matured', { required: true })}
                                                                className="isPaidOrFree"
                                                                value="1"
                                                                disabled={processing}
                                                            />
                                                            <div className={matured_content_val === "1" ? "activebtn btnforMature" : "btnforMature"}> Yes </div>
                                                        </Col>
                                                        <Col className="mb-2 mobileKliye" sm={4}>
                                                            <input
                                                                type="radio"
                                                                {...register('is_matured', { required: true })}
                                                                className="isPaidOrFree"
                                                                value="0"
                                                                disabled={processing}
                                                            />
                                                            <div className={matured_content_val === "0" ? "activebtn btnforMature" : "btnforMature"}> No </div>
                                                        </Col>
                                                        {errors?.is_matured && <Col sm={12}> <FormFeedback className='mb-4'>Is this content for 18+ audience? Please select Yes or No</FormFeedback> </Col>}
                                                    </Row>

                                                </Col>

                                                {genres.length > 0 &&
                                                    <Col sm={12} className='mt-4'>
                                                        <h4 className="title-create-item">Genre 1</h4>
                                                        <Select
                                                            defaultValue={genre_id}
                                                            {...register('genre_id', { required: true })}
                                                            styles={customStyles}
                                                            options={genres}
                                                            className={classnames('basic-multi-select', { 'is-invalid': manualError })}
                                                            classNamePrefix="select"
                                                            onChange={GenreHandle}
                                                            placeholder="Genre 1"
                                                            disabled={processing}
                                                        />
                                                        {manualError && <FormFeedback className='mb-4'>Please select any genre</FormFeedback>}
                                                    </Col>}

                                                {genres.length > 0 && <Col sm={12} className='mt-4'>
                                                    <h4 className="title-create-item">Genres 2</h4>
                                                    <Select
                                                        isMulti
                                                        value={subGenre}
                                                        isClearable={false}
                                                        {...register('sub_genres_id')}
                                                        styles={customStyles}
                                                        options={genres}
                                                        className='basic-multi-select'
                                                        classNamePrefix="select"
                                                        onChange={(e) => {
                                                            setSubGenre(e)
                                                        }}
                                                        placeholder="Genres 2"
                                                        disabled={processing}
                                                    />
                                                </Col>
                                                }

                                                {tags.length !== 0 && genre_id !== null ? <Fragment>
                                                    <Col className='mt-4 tagSection' sm={12}>
                                                        <h4 className="title-create-item">Tags
                                                            <i className="fa fa-question-circle ml-3" aria-hidden="true">
                                                                <div className="tooltiptext"><h6 className='mb-2'>Can't find your tag?</h6>
                                                                    Tags can be added manually by simply typing them in and hitting the "Enter" key. This will add the tag you want to the list.
                                                                </div>
                                                            </i>
                                                        </h4>
                                                        <CreatableSelect
                                                            isMulti
                                                            isClearable={false}
                                                            {...register('tag_ids', { required: true })}
                                                            value={myTags}
                                                            onChange={TagsHandle}
                                                            onFocus={() => setTagPlaceholder(true)}
                                                            onBlur={() => setTagPlaceholder(false)}
                                                            options={tags}
                                                            onMenuScrollToTop={true}
                                                            className={classnames('basic-multi-select', { 'is-invalid': tagError })}
                                                            classNamePrefix="select"
                                                            styles={customStyles}
                                                            placeholder={!tagPlaceholder && "Add Tags"}
                                                            disabled={processing}
                                                        />
                                                        {tagError && <FormFeedback className='mb-4'>Please Select any Tags</FormFeedback>}
                                                    </Col>
                                                </Fragment> : null}

                                                <Col sm={12} className="mt-4">
                                                    <input
                                                        id="is_agree"
                                                        type="checkbox"
                                                        className='d-inline mb-2'
                                                        {...register('is_agree', { required: true })}
                                                        disabled={processing}
                                                    />
                                                    <label className='termsLable d-inline' htmlFor='is_agree'>I agree that I have the rights and/or permission to upload the work and if infringing on any rights, I agree my account can be blocked and all payments withheld permanently.</label>
                                                    {
                                                        errors?.is_agree && <FormFeedback className='mb-4 mt-2'>Please agree to legal terms</FormFeedback>
                                                    }
                                                </Col>
                                            </Row>
                                            {(create_content.type === "single" || create_content.type !== null) && <Row className='submitbtnTag'>
                                                <Col sm={12}>

                                                    <button className='PrimaryBtn' type='submit' disabled={errorsLength === 0 ? false : true}>{processing ? 'Publishing...' : 'Publish'}</button>

                                                </Col>
                                            </Row>}
                                        </form>
                                    </div>
                                </div>
                            </div>
                            {/* <Col sm={12}>
                                <Row className='tf-section'>
                                    {series.seriesContent.length !== 0 ? series.seriesContent.map((item, index) => {
                                        return <Fragment>
                                            <Col sm={6} md={4} lg={3}>
                                                <Row>
                                                    <ContentThumbnail key={index} data={item} />
                                                    <Col sm={12}>
                                                        <div className="previewBtn" onClick={(e) => { handleContentPreview(e, item.id) }}>Preview</div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Fragment>
                                    })
                                        : null
                                    }
                                </Row>
                            </Col> */}
                        </div>
                    </div>
                </div>

                {previewItem.previewPopup && <PreviewModel />}
                {/* {popup && <MultipleContent value={popup} />} */}
                {create_content.showModel && <Content_typeModel />}
                {EditReducer.croppopup.show && <CroppingPopup />}
                {redirectToHome && <RedirectModel />}
            </Fragment>
        );
    }
}

export default CreateContent;