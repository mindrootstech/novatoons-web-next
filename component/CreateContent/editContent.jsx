import React, { useEffect, useState, Fragment, useRef } from 'react';
import { isUserLoggedInToken, base_url } from '../../config'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating'

//Images
import dummyuser from '../../assets/images/avatar/dummyuser.png'
import free from '../../assets/images/contentImages/free.svg'
import paid from '../../assets/images/contentImages/paid.svg'
import download from '../../assets/images/contentImages/download.svg'
//Form
import { Col, Row, FormFeedback } from 'reactstrap'
import { useForm } from 'react-hook-form'
import classnames from 'classnames'

//third-party
import { toast } from 'react-toastify'
import Loader from '../../component/loader/loader'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';

//component
import EditMultipleContent from '../../components/model/EditMultiContent';
import MultipleContent from '../../components/model/multipleContent';
import PreviewModel from '../../components/model/previewModel';
import { processLoader } from '../../redux/commonReducer'
import CroppingPopup from '../../components/model/croppingPopup';
import RejectionHandler from '../../components/ErrorHandler/RejectionHandler'
import DeleteModel from '../../components/model/deletePopup';
import RestoreModel from '../../components/model/restorePopup';

//api
import { postRequest } from '../../commonApi';
import axios from "axios"

//redux
import { useSelector, useDispatch } from 'react-redux'
import { uploadContent } from '../../components/header/store/headerReducer'
import { getTags, getGenre, filterationTagsGenre, selectGenre, filterSubGenresAction } from '../../redux/tagReducer'
import { previewpopup, closepreviewpopup, is_content_duplicate } from './ContentSeriesReducer';
import { getContent, cropPopUp, deleteModel, resetDetails, EditSeries } from './editContentSeriesReducer';

import { getpdfImages } from '../../redux/pdfReducer'
import { axiosRequest } from "../../http";

//style
import { customStyles } from '../../assets/themeconfig';
import 'react-tabs/style/react-tabs.css';
import './content.css'

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


const EditContentSeries = () => {
    const dispatch = useDispatch()
    const {slug} = useParams()
    const [searchParams] = useSearchParams()

    const [data, setData] = useState()

    const [changedTag, setChangedTag]  = useState(false)
    const [tagPlaceholder, setTagPlaceholder] = useState(false)

    const [is_paid, setIs_paid] = useState(null)
    const [is_downloadable, setIs_downloadable] = useState(false)
    const [is_available, setIs_available] = useState(false)
    const [cover_image, setCover_image] = useState(null)
    const [preview, setPreview] = useState()
    const [multiplePopUp, setMultiplePopUp] = useState(false)
    const [manualError, setManualError] = useState(false)
    const [tagError, setTagError] = useState(false)
    const [contenttypeName, setContenttypeName] = useState('')
    const [genre_id, setGenre_id] = useState(null)
    const [tags_ids, setTags_ids] = useState([])
    const [changeTags, setChangeTags] = useState(false)
    const [cover_image_name, setCover_image_name] = useState("")
    const [is_mature, setIs_mature] = useState(null)
    const [tagsSelected, setTagsSelected] = useState([])
    const [tagsForPopup, setTagsForPopup] = useState()
    const [fileName, setFileName] = useState(null)
    const [coverFileName, setCoverFileName] = useState(null)
    const [popupvalue, setPopupvalue] = useState()

    const [subGenre, setSubGenre] = useState([])

    const withOutChangeID = useRef()

    //redux tables
    const { isSeries, series, content, loading, croppopup, deleteStuff, restoreStuff, EditSeriesContent, price, dataType } = useSelector(state => state.editSeriesReducer)
    const userReducer = useSelector(state => state.userReducer)
    const { tags, genres, error, filteredGenre, filteredTags, filterSubGenre } = useSelector(state => state.tagReducer)
    const { processing } = useSelector(state => state.commonReducer)
    const { previewItem, is_duplicate, popup } = useSelector(state => state.seriesReducer)

    const { register, formState: { errors }, setError, watch, handleSubmit } = useForm({ mode: 'onChange' })
 
    useEffect(() => {
        if (genres.length > 0) {
            const toSearch = !isSeries ? content.contentData?.genre_id : series.seriesdata?.genre_id
            if (toSearch !== undefined) {
                const filter = genres.filter(item => {
                    return item.id === toSearch
                })
                dispatch(
                    filterationTagsGenre({
                        filteredTags: filteredTags,
                        filteredGenre: filter[0]
                    })
                )
            }
            if (content.contentData?.sub_genre_id !== "" || series.seriesdata?.sub_genre_id !== "") {
                const sub_genreArray = !isSeries ? content.contentData?.sub_genre_id?.split(",") : series.seriesdata?.sub_genre_id?.split(",")
                if (sub_genreArray !== undefined) {
                    const newArray = sub_genreArray.map(item => {
                        const xyz = genres.filter(e => {
                            return e.id === parseInt(item)
                        })
                        return xyz
                    })
                    let finalData = newArray.map(item => {
                        return item[0]
                    }) 
                    dispatch(
                        filterSubGenresAction({
                            data: finalData
                        })
                    )
                }
            }

        }
    }, [loading, genres])

    useEffect(() => {
        if ((tags.length > 0 && content.contentData?.tag_ids) || (tags.length > 0 && series.seriesdata?.tag_ids)) {
            const lockdown = !isSeries ? content.contentData?.tag_ids.split(",") : series.seriesdata?.tag_ids.split(",")

            const abc = lockdown.map(item => {
                const filterData = tags.filter(e => {
                    return e.id === parseInt(item)
                })
                return filterData
            })
            const newDataFound = abc.map(item => {
                return item[0]
            })

            const tagsForPopupdata = newDataFound.map(item => {
                return item?.value
            })
            setTagsForPopup(tagsForPopupdata)
            setTags_ids(newDataFound)

            dispatch(
                filterationTagsGenre({
                    filteredTags: newDataFound,
                    filteredGenre
                })
            )

        }
    }, [tags])

    useEffect(() => {
        dispatch(resetDetails())
        dispatch(
            cropPopUp({
                show: false,
                file: null,
                coverfilename: null
            })
        )
            dispatch(
                getContent({
                    slug
                })
            )

        // const uploadcontentData = JSON.parse(localStorage.getItem('uploadcontent'))
        // dispatch(
        //     uploadContent({
        //         content_type: uploadcontentData.content_type,
        //         type: uploadcontentData.type,
        //         steps: uploadcontentData.steps
        //     })
        // )

        dispatch(
            getGenre()
        )
    }, [dispatch, slug])

    useEffect(() => {
        if (isSeries === true) {
            setGenre_id(series?.seriesdata?.genre_id)
            setData(series.seriesdata)
            if (series.seriesdata?.genre_id) {
                dispatch(
                    getTags({ genre_id: series.seriesdata?.genre_id })
                )
            }
            if (series?.seriesdata?.is_paid !== undefined) {
                setIs_paid(series?.seriesdata?.is_paid)
            }
            if (series?.seriesdata?.is_mature !== undefined) {
                setIs_mature(series?.seriesdata?.is_mature)
            }
            if (series?.seriesdata?.is_downloadable === 0) {
                setIs_downloadable(false)
            } else {
                setIs_downloadable(true)
            }

            if (series?.seriesdata?.is_available === "1") {
                setIs_available(true)
            } else {
                setIs_available(false)
            }

        } else {
            setGenre_id(content.contentData?.genre_id)
            setData(content.contentData)
            if (content.contentData?.is_paid !== undefined) {
                setIs_paid(content.contentData?.is_paid)
            }
            if (content.contentData?.is_mature !== undefined) {
                setIs_mature(content.contentData?.is_mature)
            }
            if (content.contentData?.is_downloadable === 0) {
                setIs_downloadable(false)
            } else {
                setIs_downloadable(true)
            }

            if (content.contentData?.is_available === "1") {
                setIs_available(true)
            } else {
                setIs_available(false)
            }
            if (content.contentData?.genre_id) {
                dispatch(
                    getTags({ genre_id: content.contentData?.genre_id })
                )
            }

        }

        if (searchParams.get("type") === "1") {
            
            dispatch(
                uploadContent({
                    content_type: series.seriesdata?.content_type,
                    type: "multiple",
                    steps: 0
                })
            )
        } else if (searchParams.get("type") === "0") {
            dispatch(
                uploadContent({
                    content_type: content.contentData?.content_type,
                    type: "single",
                    steps: 0
                })
            )
        }
    }, [loading])

    useEffect(() => {
        if (content.contentData?.content_type === 1) {
            setContenttypeName("Comic")
        } else if (content.contentData?.content_type === 2) {
            setContenttypeName("ART")
        } else if (content.contentData?.content_type === 3) {
            setContenttypeName("E-Books")
        } else if (content.contentData?.content_type === 4) {
            setContenttypeName("NFT")
        }

    }, [content])

    useEffect(() => {
        if (croppopup.file !== null) {
            setPreview(croppopup.file)
            if (Object.keys(croppopup.file).length === 0) {
                setCover_image(null)
            } else {
                setCover_image(croppopup.file)
            }
        }
    }, [croppopup])

    useEffect(() => {
        if (is_duplicate?.status === false) {
            setError("file", {
                type: "manual",
                message: is_duplicate.message
            });
        }

    }, [is_duplicate])

    const onSubmit = async (dataForm) => {
        let admin_token = sessionStorage.getItem("admin_token");
        let loggedinBy = sessionStorage.getItem("loggedinBy"); 
        
        if (genre_id === undefined || genre_id === null) {
            return setManualError(true)
        } else if ((tags_ids === null && changedTag) || (tags_ids === undefined && changedTag) || (tags_ids.length === 0 && changedTag)) {
            return setTagError(true)
        } 

        if (changeTags === false) {
            const abc = tags_ids.map(item => {
                return item.id
            })

            withOutChangeID.current = abc
        }
       
        dispatch(processLoader(true))
        let mysubGenre
        if(subGenre.length > 0 && filterSubGenre.length > 0) {
            mysubGenre = subGenre.length > 0 ? subGenre.map(item => item.id).join() : filterSubGenre.map(item => item.id).join()
        }
        let myPrice = (is_paid === 1 && price !== "" && dataForm.price === "") ? price : dataForm.price

        let dataMain = {
            ...dataForm,
            cover_image: cover_image === null ? null : cover_image,
            cover_image_name,
            content_type: !isSeries ? content.contentData.content_type : series.seriesdata.content_type,
            is_paid,
            is_downloadable: is_downloadable === false ? 0 : 1,
            series_id: series.seriesId !== null ? parseInt(`${series.seriesId}`) : "",
            tag_ids: changeTags === false ? withOutChangeID.current.toString() : tags_ids.toString(),
            is_available: is_available === false ? 0 : 1,
            genre_id: genre_id,
            is_mature,
            sub_genres_id:  mysubGenre,
            price: myPrice,
            is_agree: data.is_agree ? 1 : 0
        }

        if (cover_image !== null) {
            dataMain.cover_image = cover_image
            dataMain.cover_image_name = cover_image_name
        }

        if (multiplePopUp === false) {
            var formdata = new FormData()
            formdata.append("content_id", content.contentData.id)
            formdata.append("content_type", dataMain.content_type)
            formdata.append("is_paid", dataMain.is_paid)
            formdata.append("tag_ids", dataMain.tag_ids)
            formdata.append("is_available", dataMain.is_available)
            formdata.append("is_downloadable", dataMain.is_downloadable)
            formdata.append("series_id", dataMain.series_id)
            formdata.append("genre_id", dataMain.genre_id)
            formdata.append("description", dataMain.description)
            formdata.append("is_mature", dataMain.is_mature)
            formdata.append("file", dataMain.file)
            formdata.append('is_agree', dataMain.is_agree)
            
            if(dataMain.sub_genres_id) {
                formdata.append("sub_genres_id", dataMain.sub_genres_id)
            }

            if (dataMain.title !== "") {
                formdata.append("title", dataMain.title);
            }
            if (dataMain.price && dataMain.is_paid !== 0) {
                formdata.append("price", dataMain.price)
            }

            if (dataMain.cover_image !== null) {
                formdata.append("cover_image", dataMain.cover_image);
                formdata.append("cover_image_name", dataMain.cover_image_name)
            }

            if (dataMain.is_matured === null) {
                formdata.append("is_matured", dataMain.is_matured);
            }
            if (dataMain.file.length !== 0) {
                formdata.append("file", dataMain.file[0]);
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
                }
            }

            
            if(admin_token && loggedinBy === "admin") {
                config.headers.admin_token = admin_token
              }

            try {
                const res = await axios(config)
                if (res.data.status === true) {
                    dispatch(processLoader(false))
                    toast.success(<SuccessToast message={res.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
                } else {
                    dispatch(processLoader(false))
                    toast.success(<SuccessToast message={res.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
                }
            } catch (error) {
                toast.success(<SuccessToast message={error.response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
            }
        }
    }

    const handlePdfView = (item) => {
        if(item.file_uploaded === "0" && item.type === "content"){
            return toast.success(<SuccessToast message="File is under process" />, { hideProgressBar: true,  autoClose:  8000, }) 
        } else {
            handleViewPdf(item)
        }
    }

    //Tags Handle
    const TagsHandle = async (newValue, actionMeta) => {
        const filtered = newValue.slice(-1)[0]
        if (actionMeta.action === "create-option" && filtered.__isNew__ === true) {
            const response = await postRequest({ sub_url: "/inserttags", dataMain: { tag: filtered.value, genre_id } })
            if (response.status === true) {
                newValue[newValue.length - 1].id = response.data;
                dispatch(
                    getTags({ genre_id })
                )
            } else {
                toast.success(<SuccessToast message="Tag not created, please try again after some time" />, { hideProgressBar: true,  autoClose:  8000, })
            }
        }

        setChangedTag(true)
        if (newValue.length !== 0) {
            setTagError(false)
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
        setChangeTags(true)
        setTagsSelected(filterTags)
        setTags_ids(filterids)

    }

    const uploadImage = (e, type) => {
        if (type === "uploadCover") {
            setCoverFileName(e.target.files[0].name)
            const uplaodfile = e.target.files[0]
            setCover_image_name(uplaodfile.name)
            const reader = new FileReader()
            reader.onloadend = () => {
                const upload_File = reader.result
                var img = new Image;
                img.src = upload_File
                img.onload = function() {
          
                    if(img.width !== 270 && img.height !== 400) {
                        return setError("cover_image", {
                            type: "manual",
                            message: "Image size must be 270x400(px) and less than 2MB"
                        });
                    }
                }
                // dispatch(
                //     cropPopUp({
                //         show: true,
                //         file: upload_File
                //     })
                // )
                setPreview(upload_File)
                setCover_image(upload_File)
            }
            reader.readAsDataURL(uplaodfile)
        }
    }

    const handlePreviewModel = () => {
        if (!previewItem.previewPopup) {
            dispatch(previewpopup(
                {
                    cover_image: cover_image === null ? isSeries ? series.seriesdata.cover_image : content.contentData.cover_image : cover_image,
                    is_paid: is_paid === 1 ? "1" : "0",
                    is_downloadable: is_downloadable === false ? 0 : 1,
                    tagsSelected: tagsSelected.length === 0 ? tagsForPopup : tagsSelected,
                    is_available: is_available === false ? 0 : 1,
                    price: watch("price") === undefined ? data.price : watch("price"),
                    title: watch("title") === undefined ? data.title : watch("title"),
                    contentDescription: watch("description") === undefined || watch("description") === "" ? data.description : watch("description"),
                }
            ))
        } else {
            dispatch(closepreviewpopup())
        }

    }

    const handleViewPdf = (item) => {
        dispatch(getpdfImages({
            content_id: content.contentData.id,
            page: 1,
            selectedContent: data,
        }))
    }

    const GenreHandle = async (item) => {

        if (item) {
            setManualError(false)
        }
        dispatch(
            selectGenre({
                genreSelected: item
            })
        )
        dispatch(
            getTags({ genre_id: item.id })
        )
        setGenre_id(item.id)
    }

    const handleRadio = (e) => {
        if (e.target.value === "0") {
            setIs_paid(0)
        } else {
            setIs_paid(1)
        }
    }

    const handleContentPreview = (e, id) => {
        const contentThumbPreview = series.seriesContent.filter(item => {
            return item.id === id
        })
        if (!previewItem.previewPopup) {
            dispatch(previewpopup(contentThumbPreview[0]))
        } else {
            dispatch(closepreviewpopup())
        }

    }

    const handleFile = (e) => {
        setFileName(e.target.files[0].name)
        dispatch(
            is_content_duplicate({ file_name: e.target.files[0].name })
        )
    }

    const handleDelete = async () => {
            dispatch(deleteModel({
                showHide: true,
                content: content.contentData.id,
                isContent: true
            }))
      }
    
    const HandleEditContent = (e, item) => {
        dispatch(
            EditSeries({
                model: true,
                selectedEditContent: item
            })
        )
    }

    if ((genres.length === 0) || (data === undefined)) {
        return <Loader />
    } else if (error !== null) {
        return <RejectionHandler data={error} />
    } else {
        return (
            <Fragment>
                <div className='create-item editContentView'>
                    <div className="tf-create-item tf-section">
                        <div className="themesflat-container pt-80">
                            <div className="row">
                                <div className="col-xl-3 col-lg-4 col-md-6 col-12 previewItemCard">
                                    <h4 className="title-create-item">Preview item</h4>
                                    <div className="sc-card-product">
                                        <div className="card-media">
                                            { isSeries ? <img src={series.seriesdata?.cover_image} alt="novatoons" /> : !isSeries ? <img src={content.contentData?.cover_image} alt="novatoons" /> : cover_image !== null && <img src={preview} alt="novatoons" /> }
                                        </div>
                                        <div className="card-title">
                                            <h5>{isSeries ? series.seriesdata?.title : content.contentData?.title}</h5>
                                        </div>
                                        <div className="meta-info">
                                            <div className="author">
                                                <div className="avatar">
                                                    <img src={userReducer.userData.profile_img && userReducer.userData.profile_img !== "" ? userReducer.userData.profile_img : dummyuser} alt="novatoons" />
                                                </div>
                                                <div className="info">
                                                    <span>Author</span>
                                                    <h6> <Link to={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/edit-profile`}>{(userReducer.userData.user_name !== "" && userReducer.userData.is_creator === 1) ? userReducer.userData.user_name : `${userReducer.userData.first_name} ${userReducer.userData.last_name}`}</Link></h6>
                                                </div>
                                            </div>
                                            <div className="Rating price">
                                                <h6 className='rating'>Rating</h6>
                                                <Rating
                                                    ratingValue={isSeries ? (parseInt(series.seriesdata?.total_rating) * 100 / 5) : (parseInt(content.contentData?.total_rating) * 100 / 5)}
                                                    allowHalfIcon={true}
                                                    fillColor='#ffd700'
                                                    emptyColor='#808080'
                                                    iconsCount={5}
                                                    size={20}
                                                    readonly={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="previewBtn" onClick={handlePreviewModel}>Preview</div>
                                    <div className="previewBtn" onClick={ () =>  handleDelete() }
                                    >Delete</div>
                                    {!isSeries && <div className="previewBtn"><Link to={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/myuploads/view/${slug}?type=0`}>{dataType === 1 ? "View Pdf" : "View Image"}</Link></div>}

                                </div>

                                <div className="col-xl-9 col-lg-8 col-md-12 col-12">
                                    <div className="form-create-item createItem">
                                        <form className="createContentForm" onSubmit={handleSubmit(onSubmit)}>
                                            <Row>
                                                <Col sm={12}>
                                                    <h4 className="title-create-item">Type</h4>
                                                    {!isSeries ? <select
                                                        id="type"
                                                        {...register('type')}
                                                        value={"1"}
                                                        disabled={true}
                                                    >
                                                        <option value="1">Single Upload</option>
                                                        <option value="2">Multiple Uploads</option>
                                                    </select> : <select
                                                        id="type"
                                                        {...register('type')}
                                                        value={"2"}
                                                        disabled={true}
                                                    >
                                                        <option value="1">Single Upload</option>
                                                        <option value="2">Multiple Uploads</option>
                                                    </select>}
                                                </Col>

                                                {!isSeries ?
                                                    <Col sm={6}>
                                                        <h4 className="title-create-item">Upload {contenttypeName}</h4>
                                                        <label
                                                            className={classnames('uploadFile', { 'is-invalid': errors?.file })}
                                                        >
                                                            <span className="filename thumbFile">{fileName === null ? content.contentData?.original_file : fileName} </span>
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
                                                                    accept={series.seriesdata?.content_type === 2 || content.contentData.content_type === 2 ? ".jpeg, .png, .jpg" : ".pdf"}
                                                                />
                                                            </div>
                                                        </label>
                                                        {errors?.file && <FormFeedback className='mb-4'>{errors?.file.message}</FormFeedback>}
                                                    </Col> : null}

                                                <Col sm={!isSeries ? '6' : '12'}>
                                                    <h4 className="title-create-item">Upload {contenttypeName} {isSeries ? "Series" : null} Cover</h4>
                                                    <label
                                                        className={classnames('uploadFile', { 'is-invalid': errors?.cover_image })}
                                                    >
                                                        <span className="filename thumbFile">
                                                            {coverFileName !== null ? coverFileName : content.contentData?.cover_image_name ? content.contentData?.cover_image_name : series.seriesdata?.cover_image_name}

                                                        </span>
                                                        <div className="upload-btn-wrapper">
                                                            <div className="designedBtn">Select file</div>
                                                            <input
                                                                type="file"
                                                                id="cover_image"
                                                                className="inputfile form-control"
                                                                accept=".jpeg, .png, .jpg"
                                                                {...register('cover_image')}
                                                                onChange={(e) => { uploadImage(e, "uploadCover") }}
                                                                disabled={processing}
                                                            />
                                                        </div>
                                                    </label>
                                                    {errors?.cover_image && <FormFeedback className='mb-4'>{errors?.cover_image.message}</FormFeedback>}
                                                </Col>

                                                <Col sm={12}>
                                                    <h4 className="title-create-item">{!isSeries ? '' : 'Series '}Title</h4>
                                                    <input
                                                        type="text"
                                                        defaultValue={!isSeries ? content.contentData?.title : series.seriesdata?.title}
                                                        {...register('title')}
                                                        placeholder="Item name"
                                                        className={classnames('input', { 'is-invalid': errors?.title })}
                                                        disabled={processing}
                                                    />
                                                    {errors?.title && <FormFeedback className='mb-4'>{errors?.title.message}</FormFeedback>}
                                                </Col>

                                                <Col sm={12}>
                                                    <h4 className="title-create-item">{!isSeries ? '' : 'Series '}Description</h4>
                                                    <textarea
                                                        className='textAreaField'
                                                        {...register('description')}
                                                        placeholder="e.g. “This is very limited item”"
                                                        defaultValue={!isSeries ? content.contentData?.description : series.seriesdata?.description}
                                                        disabled={processing}
                                                    >
                                                    </textarea>
                                                </Col>

                                                <Col sm={12}>
                                                    <h4 className="title-create-item">Options for readers</h4>
                                                    <Row>
                                                        <Col className="mb-2" xs={6} sm={4}>
                                                            <input
                                                                type="radio"
                                                                {...register('is_paid')}
                                                                className="isPaidOrFree"
                                                                value="0"
                                                                onChange={handleRadio}
                                                                disabled={processing}
                                                            />
                                                            <div className={is_paid === 0 ? "activebtn btnforPaid" : "btnforPaid"}>
                                                                <img className="imgTabs" src={free} alt="free" />Free to Read
                                                            </div>
                                                        </Col>
                                                        <Col className="mb-2" xs={6} sm={4}>
                                                            <input
                                                                type="radio"
                                                                {...register('is_paid')}
                                                                className="isPaidOrFree"
                                                                value="1"
                                                                onChange={handleRadio}
                                                                disabled={processing}
                                                            />

                                                            <div className={is_paid === 1 ? "activebtn btnforPaid" : "btnforPaid"}>
                                                                <img className="imgTabs" src={paid} alt="free" />Purchase
                                                            </div>
                                                        </Col>

                                                        {!isSeries ? <Col className="mb-2" sm={4}>
                                                            <input
                                                                type="checkbox"
                                                                className="isPaidOrFree"
                                                                {...register('is_downloadable')}
                                                                onChange={(e) => {
                                                                    setIs_downloadable(!is_downloadable)
                                                                }}
                                                                name="availableForDownload"
                                                                disabled={processing}
                                                            />
                                                            <div className={is_downloadable === true ? "activebtn btnforPaid" : "btnforPaid"}>
                                                                <img className="imgTabs" src={download} alt="free" />Available for Download
                                                            </div>
                                                        </Col> : null}


                                                        {errors?.is_paid && <Col sm={12}> <FormFeedback className='mb-4'>Please select if this content is Free or Paid</FormFeedback> </Col>}


                                                        {(is_paid === 1 && !loading)?
                                                            <Col className="mt-4" sm={12}>
                                                                <h4 className="title-create-item">{!isSeries ? '' : 'Series '}Price (USD)
                                                                    <i className="fa fa-question-circle ml-3" aria-hidden="true">
                                                                        <div className="tooltiptext second">Platform Fees : {userReducer.userData.owner_fee}%
                                                                        </div>
                                                                    </i>
                                                                </h4>
                                                                <input
                                                                    type="number"
                                                                    defaultValue={isSeries ? parseInt(series?.seriesdata?.price) : parseInt(content?.contentData?.price)}
                                                                    {...register('price', {
                                                                        required: true,
                                                                        min: 2
                                                                    })}
                                                                    disabled={processing}
                                                                    placeholder="Enter Price"
                                                                    className={classnames('input', { 'is-invalid': errors?.price })}
                                                                />
                                                                {parseInt(watch("price")) > 1 ? <div className='PlatformInfo mt-2'> You will receive ${(parseFloat(watch("price") - ((parseFloat(watch("price")) / 100) * parseFloat(userReducer.userData.owner_fee)))).toFixed(2)}, when user purchases the content.</div> : null}

                                                                {errors?.price && <FormFeedback className='mb-4'>Please enter a valid Price(*Note - minimum value need to be $2*)</FormFeedback>}
                                                            </Col> : null}
{/* 
                                                        <Col className={content.contentData?.is_paid === 1 || series.seriesdata?.is_paid === 1 ? "mt-2" : "mt-3"} sm={12}>
                                                            <h4 className="title-create-item">Revenue sharing</h4>
                                                            <div className="switchbtn">
                                                                <Row>
                                                                    <Col className='lableSwitch' sm={4} xs={9}>Available for subscribed users</Col>
                                                                    <Col sm={8} xs={3}>
                                                                        <label className="switch">
                                                                            <input 
                                                                            type="checkbox" 
                                                                            className="react-switch-checkbox"
                                                                            id={`react-switch-new`}
                                                                            {...register('is_available')}
                                                                            onChange={() => {
                                                                                setIs_available(!is_available)
                                                                            }}
                                                                            disabled={processing}
                                                                            checked={is_available}
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
                                                        <Col className="mb-2" xs={6} sm={4}>
                                                            <input
                                                                type="radio"
                                                                {...register('is_mature')}
                                                                className="isPaidOrFree"
                                                                value="0"
                                                                onChange={() => { setIs_mature(1) }}
                                                                disabled={processing}
                                                            />
                                                            <div className={is_mature === 1 ? "activebtn btnforMature" : "btnforMature"}> Yes </div>
                                                        </Col>
                                                        <Col className="mb-2" xs={6} sm={4}>
                                                            <input
                                                                type="radio"
                                                                {...register('is_mature')}
                                                                className="isPaidOrFree"
                                                                value="1"
                                                                onChange={() => { setIs_mature(0) }}
                                                                disabled={processing}
                                                            />
                                                            <div className={is_mature === 0 ? "activebtn btnforMature" : "btnforMature"}> No </div>
                                                        </Col>
                                                    </Row>

                                                </Col>
                                                {(Object.keys(filteredGenre).length !== 0) &&

                                                    <Col sm={12} className='mt-4'>
                                                        <h4 className="title-create-item">Genre 1</h4>
                                                        <Select
                                                            defaultValue={filteredGenre}
                                                            {...register('genre_id')}
                                                            styles={customStyles}
                                                            options={genres}
                                                            className={classnames('basic-multi-select', { 'is-invalid': manualError })}
                                                            classNamePrefix="select"
                                                            placeholder="Genres"
                                                            onChange={GenreHandle}
                                                            disabled={processing}
                                                        />
                                                        {manualError && <FormFeedback className='mb-4'>Please Select any Genre</FormFeedback>}
                                                    </Col>}

                                                {filterSubGenre.length !== 0 &&
                                                    <Col sm={12} className='mt-4'>
                                                        <h4 className="title-create-item">Genre 2</h4>
                                                        <Select
                                                            isMulti
                                                            isClearable={false}
                                                            defaultValue={filterSubGenre}
                                                            {...register('sub_genres_id')}
                                                            styles={customStyles}
                                                            options={genres}
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            onChange={(e) => {
                                                                setSubGenre(e)
                                                            }}
                                                            placeholder="Genre 2"
                                                            disabled={processing}
                                                        />
                                                    </Col>}
                                                
                                                {(filteredTags.length !== 0 && !loading) &&
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
                                                            defaultValue={filteredTags}
                                                            isClearable={false}
                                                            {...register('tag_ids')}
                                                            onChange={TagsHandle}
                                                            onFocus={() => setTagPlaceholder(true)}
                                                            onBlur={() => setTagPlaceholder(false)}
                                                            options={tags}
                                                            className={classnames('basic-multi-select', { 'is-invalid': tagError })}
                                                            classNamePrefix="select"
                                                            styles={customStyles}
                                                            placeholder={!tagPlaceholder && "Add Tags"}
                                                            disabled={processing}
                                                        />
                                                        {tagError && <FormFeedback className='mb-4'>Please Select any Tags</FormFeedback>}
                                                    </Col>}

                                                    <Col sm={12} className="mt-4">
                                                    <input 
                                                        id="is_agree" 
                                                        type="checkbox"
                                                        checked={true}
                                                    />
                                                    <label className='termsLable' htmlFor='is_agree'>I agree that I have the rights and/or permission to upload the work and if infringing on any rights, I agree my account can be blocked and all payments withheld permanently.</label>
                                                
                                                </Col>

                                            </Row>
                                            {isSeries ? <Row className='submitbtnTag'>
                                                <Col sm={12}>
                                                    <button className='PrimaryBtn' onClick={() => {
                                                        setPopupvalue(true)
                                                        setMultiplePopUp(true)
                                                    }} type='submit' disabled={processing}>{processing ? 'Updating Series...' : 'Save and Update Series'}</button>

                                                    {series.seriesContent.length !== 0 ? <button className='PrimaryBtn ml-3' onClick={() => {
                                                        setPopupvalue(false)
                                                        setMultiplePopUp(true)
                                                    }} type='submit' disabled={processing}>{processing ? 'Updating...' : 'Update'}</button> : null}

                                                </Col>
                                            </Row> : <Row className='submitbtnTag'>
                                                <Col sm={12}>
                                                    <button className='PrimaryBtn' disabled={processing} type='submit'>{processing ? 'Updating...' : "Update"}</button>
                                                </Col>
                                            </Row>}
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <Col sm={12}>
                                <Row className='tf-section'>
                                    {series.seriesContent.length !== 0 ? series.seriesContent.map((item, index) => {
                                        return <Fragment>
                                            <Col sm={6} md={4} lg={3}>
                                                <Row>
                                                    <Col sm={12}>
                                                        <div className="sc-card-product">
                                                            <div className='controlBtns Edit_Btn'>
                                                                <div className="sc-button header-slider style style-1 fl-button pri-1 cursorPointer" onClick={(e) => HandleEditContent(e, item)}><i className='fas fa-edit'></i></div>
                                                                <div className="sc-button header-slider style style-1 fl-button pri-1 cursorPointer trashIcon" onClick={
                                                                    () => {
                                                                        dispatch(deleteModel({
                                                                            showHide: true,
                                                                            content: item.id,
                                                                            isContent: true
                                                                        }))
                                                                    }
                                                                }><i className='fas fa-trash'></i></div>
                                                            </div>
                                                            <div className="card-media">
                                                                <img src={item.cover_image} alt="novatoons" />
                                                            </div>
                                                            <div className="card-title">
                                                                <h5>{item.title}</h5>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col sm={12}>
                                                        <div className="previewBtn" onClick={(e) => { handleContentPreview(e, item.id) }}>Preview</div>
                                                        <div className="previewBtn" onClick={(e) => handlePdfView(item)}>{dataType === 1 ? "View Pdf" : "View Image"}</div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Fragment>
                                    })
                                        : null
                                    }
                                </Row>
                            </Col>
                        </div>
                    </div>
                </div>
                {previewItem.previewPopup && <PreviewModel />}
                {popup === true ? <MultipleContent value={popup} /> : null}
                {EditSeriesContent.model && <EditMultipleContent />}
                {croppopup.show && <CroppingPopup />}
                {deleteStuff.modelShow && <DeleteModel />}

            </Fragment>
        );
    }
}

export default EditContentSeries;
