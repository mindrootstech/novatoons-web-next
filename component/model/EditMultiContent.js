import React, { Fragment, useEffect, useState } from 'react'

//img
import free from '../../assets/images/contentImages/free.svg'
import paid from '../../assets/images/contentImages/paid.svg'
import download from '../../assets/images/contentImages/download.svg'
import placeholder from '../../assets/images/contentImages/placeholder.png'

//Form
import { Col, Row, FormFeedback, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { useForm } from 'react-hook-form'
import classnames from 'classnames'

//third-party
import { toast } from 'react-toastify'
//api
import { isUserLoggedInToken, base_url } from '../../config'
import axios from "axios"
//redux
import { useDispatch, useSelector } from 'react-redux'
import { is_content_duplicate } from '../../pages/content/ContentSeriesReducer'
import { getSeries, EditSeries } from '../../pages/content/editContentSeriesReducer'
import { processLoader, progressBar } from '../../redux/commonReducer'
import ReactCrop, { crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

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

const EditMultipleContent = ({ value }) => {

    const create_content = useSelector(state => state.headerReducer)
    const seriesreducer = useSelector(state => state.seriesReducer)
    const {processing} = useSelector(state => state.commonReducer)
    const {is_duplicate} = useSelector(state => state.seriesReducer)
    const {EditSeriesContent, dataType, series} = useSelector(state=> state.editSeriesReducer)
    const {userData} = useSelector(state => state.userReducer)

    const {selectedEditContent} =  EditSeriesContent

    const dispatch = useDispatch()
    const [cover_image, setCover_image] = useState(null)
    const [cover_image_name, setCover_image_name] = useState(null)
    const [is_available, setIs_available] = useState(false)
    const [is_downloadable, setIs_downloadable] = useState(false)
    const [original_file, setOriginal_file] = useState(null)
    const [image, setImage] = useState(null)
    const [crop, setCrop] = useState()
    const [placeholderImg, setPlaceholderImg] = useState(null)
    const [cropedView ,setCropedView] = useState(false)

    useEffect(() => {
        dispatch(
            getSeries({
                series_id: seriesreducer.series.seriesId
            })
        )
    }, [dispatch])



    const { register, formState: { errors }, handleSubmit, setError, watch } = useForm({ mode: 'onChange'})

    const onSubmit = async (data) => {
        if (seriesreducer.isSeries && seriesreducer.series?.seriesdata.is_paid === 1 && data.price === undefined) {
            setError("price", {
                type: "manual",
                message: is_duplicate.message
            });
        }
        const dataMain = {
            ...data,
            file: data.file[0],
            content_id: selectedEditContent.id,
            cover_image,
            is_downloadable: is_downloadable === false ? 0 : 1,
            type: create_content.type === "multiple" ? 2 : 1,
            is_paid: seriesreducer.series.seriesdata !== null && seriesreducer.series.seriesdata.is_paid,
            series_id: seriesreducer.series.seriesId,
            is_available: is_available === false ? 0 : 1,
            tag_ids: seriesreducer.series.seriesdata !== null && seriesreducer.series.seriesdata.tag_ids,
            content_type: series.seriesdata.content_type,
            genre_id: seriesreducer.series.seriesdata !== null && seriesreducer.series.seriesdata.genre_id,
            sub_genres_id: seriesreducer.series.seriesdata.sub_genre_id
        }
        dispatch(processLoader(false))

        var formdata = new FormData();
        formdata.append("content_type", dataMain.content_type);
        formdata.append("title", dataMain.title);
        formdata.append("is_paid", dataMain.is_paid);
        formdata.append("tag_ids", dataMain.tag_ids);
        formdata.append("is_available", dataMain.is_available);
        formdata.append("is_downloadable", dataMain.is_downloadable);
        formdata.append("series_id", dataMain.series_id);
        formdata.append("genre_id", dataMain.genre_id);
        formdata.append("description", data.description);
        formdata.append("content_id", dataMain.content_id)
        formdata.append("sub_genres_id", dataMain.sub_genres_id)
        
        if(dataMain.file !== undefined) {
            formdata.append("file", dataMain.file);
        }

        if(dataMain.cover_image !== null) {
            formdata.append("cover_image_name", cover_image_name)
            formdata.append("cover_image", dataMain.cover_image);
        }

        if (data.price) {
            formdata.append("price", data.price)
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

        let admin_token = sessionStorage.getItem("admin_token");
        let loggedinBy = sessionStorage.getItem("loggedinBy"); 

        if(admin_token && loggedinBy === "admin") {
            config.headers.admin_token = admin_token
        }

        try {
            dispatch(
                EditSeries({ 
                    model: false,
                    selectedEditContent: {}
                })
            )
            const res = await axios(config)
            if (res.data.status === true) {
                dispatch(processLoader(false))
                toast.success(<SuccessToast message={res.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
                dispatch(
                    getSeries({
                        series_id: seriesreducer.series.seriesId
                    })
                )
            } else {
                dispatch(processLoader(false))
                toast.success(<SuccessToast message={res.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
            }
        } catch (err) {
            toast.success(<SuccessToast message={err.response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
        }

    }

    useEffect(()=>{
        if(selectedEditContent.is_available === "0" || selectedEditContent.is_available === 0) {
            setIs_available(false)
        }else {
            setIs_available(true)
        }

        if(selectedEditContent.is_downloadable === "0" || selectedEditContent.is_downloadable === 0) {
            setIs_downloadable(false)
        } else {
            setIs_downloadable(true)
        }
    }, [])

    // image section 
    const uploadImage = (e, type) => {
        if (type === "uploadCover") {
            const uplaodfile = e.target.files[0]
            setCover_image_name(uplaodfile.name)
            const reader = new FileReader()
            reader.onloadend = () => {
                const upload_File = reader.result
                setCover_image(upload_File)
                setCropedView(true)
            }
            reader.readAsDataURL(uplaodfile)
        }
    }


    const handleFile = (e) => {
        setOriginal_file(e.target.files[0].name)
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

    function getCroppedimage() {
        const canvas = document.createElement('canvas');
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        const cuttingRatio = ((crop.width * 100) / image.target.width )
        const cuttingR = ((crop.height * 100) / image.target.height )
        const scaleWidth = ((crop.x * 100) / image.target.width )
        const scaleHeight = ((crop.y * 100) / image.target.height )

        const cuttingWidth = ((image.target.naturalWidth / 100) * cuttingRatio)
        const cuttingHeight = ((image.target.naturalHeight / 100) * cuttingR)
        const fromLeft = ((image.target.naturalWidth / 100) * scaleWidth)
        const fromTop = ((image.target.naturalHeight / 100) * scaleHeight)
        
        ctx.drawImage(
            image.target,
            fromLeft,
            fromTop,
            cuttingWidth,
            cuttingHeight,
            0, //left
            0,
            crop.width,
            crop.height,
        );

        
        const imagecrop = canvas.toDataURL('images/jpeg')
        setCover_image(imagecrop)
        setPlaceholderImg(imagecrop)
        setCropedView(false)
        // dispatch(
        //     cropPopUp({
        //         show: false,
        //         file: imagecrop,
        //         coverfilename: croppopup.coverfilename
        //     })
        // )
    }



    return (
        <Fragment>
            <Modal
                fullscreen="xl"
                isOpen={EditSeriesContent.model}
                toggle={() => {
                    dispatch(
                        EditSeries({ 
                            model: false,
                            selectedEditContent: {}
                        })
                    )
                }}
                className='modal-dialog-centered'
            >
                <ModalHeader toggle={()=>{
                    dispatch(
                        EditSeries({ 
                            model: false,
                            selectedEditContent: {}
                        })
                    )
                }}></ModalHeader>
                <ModalBody className='ContentTypeModel'>
                    <form id="multiple" onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col className='mb-5' sm={12}>
                                <h2 className='text-center'>Upload {dataType === 1 ? "Comic" : dataType === 2 && "Art"}</h2>
                            </Col>

                            <Col md={5}>
                                <div className='imgPopupCrop'>
                                    {cropedView !== false ? <Fragment>
                                        <ReactCrop 
                                        crop={crop} 
                                        aspect={29 / 22} 
                                        onChange={c => {
                                            setCrop(c)
                                        }}
                                    >
                                        <img src={cover_image} onLoad={setImage} alt="novatoons" />
                                    </ReactCrop>
                                    <button type="button" className="submit m-auto CropingBtn" onClick={getCroppedimage}>Crop</button>
                                    </Fragment> : <img className='w-100' alt='novatoons' src={placeholderImg !== null ? placeholderImg : selectedEditContent.cover_image}/>}
                                </div>
                            </Col>

                           <Col md={7}>
                               <Row>
                                    <Col xs={12}>
                                        <h4 className="title-create-item">Upload {seriesreducer.series?.contenttypeName}</h4>
                                        <label
                                            className={classnames('uploadFile', { 'is-invalid': errors?.file })}
                                        >
                                            <span className="filename thumbFile">{original_file !== null ? original_file : selectedEditContent.original_file}</span>
                                                <div className="upload-btn-wrapper">
                                                    <div className="designedBtn">Select file</div>
                                                <input
                                                    type="file"
                                                    id="files"
                                                    {...register('file',  {
                                                        onChange: (e) => {
                                                            handleFile(e)
                                                        }
                                                    })}
                                                    className="inputfile form-control"
                                                    accept={dataType === 2 ? ".jpeg, .png, .jpg" : ".pdf"}
                                                    disabled={processing}
                                                />
                                                </div>
                                        </label>
                                        {errors?.file && <FormFeedback className='mb-4'>{errors?.file.message}</FormFeedback>}
                                    </Col>

                                    <Col xs={12}>
                                        <h4 className="title-create-item">Upload {seriesreducer.series.contenttypeName} {create_content.type === 'multiple' ? "Collection" : null} Cover</h4>
                                        <label
                                            className={classnames('uploadFile', { 'is-invalid': errors?.cover_image })}
                                        >
                                            <div className="filename thumbFile">{cover_image_name ? cover_image_name : selectedEditContent.cover_image_name } </div>
                                            <div className="upload-btn-wrapper">
                                                <div className="designedBtn">Select file</div>
                                            <input
                                                type="file"
                                                id="file"
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
                               </Row>
                           </Col>

                            <Col sm={12}>
                                <h4 className="title-create-item">Title</h4>
                                <input
                                    type="text"
                                    defaultValue={selectedEditContent.title}
                                    {...register('title')}
                                    placeholder="Item name"
                                    className={classnames('input', { 'is-invalid': errors?.title })}
                                    disabled={processing}
                                />
                                {errors?.title && <FormFeedback className='mb-4'>{errors?.title.message}</FormFeedback>}
                            </Col>

                            <Col sm={12}>
                                <h4 className="title-create-item">Description</h4>
                                <textarea
                                    className='textAreaField'
                                    defaultValue={selectedEditContent.description}
                                    {...register('description')}
                                    placeholder="e.g. “This is very limited item”"
                                    disabled={processing}
                                >
                                </textarea>
                            </Col>
                            {seriesreducer.series.seriesdata !== null && seriesreducer.series.seriesdata?.is_paid === 0 ? <Col className="mb-2" xxl={4} xl={6}>
                                <input
                                    type="radio"
                                    {...register('is_paid')}
                                    className="isPaidOrFree"
                                    value="0"
                                    disabled={processing}
                                />
                                <div className={seriesreducer.series.seriesdata !== null && seriesreducer.series.seriesdata?.is_paid === 0 ? "activebtn btnforPaid" : "btnforPaid"}>
                                    <img className="imgTabs" src={free} alt="free" />Free to Read
                                </div>
                            </Col> : null}

                            {seriesreducer.series.seriesdata !== null && seriesreducer.series.seriesdata?.is_paid === 1 ? <Col className="mb-2" xxl={4} xl={6}>
                                <input
                                    type="radio"
                                    {...register('is_paid')}
                                    className="isPaidOrFree"
                                    value="1"
                                    disabled={processing}
                                />
                                <div className={seriesreducer.series.seriesdata !== null && seriesreducer.series.seriesdata?.is_paid === 1 ? "activebtn btnforPaid" : "btnforPaid"}>
                                    <img className="imgTabs" src={paid} alt="free" />Purchase
                                </div>
                            </Col> : null}

                            <Col className="mb-2" xxl={4} xl={6}>
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
                            </Col>

                            {seriesreducer.series.seriesdata !== null && seriesreducer.series.seriesdata?.is_paid === 1 ?
                                <Fragment>
                                    <Col className="mt-4" sm={12}>
                                        <h4 className="title-create-item">Price (USD)  
                                        <i className="fa fa-question-circle ml-3" aria-hidden="true">
                                                <div className="tooltiptext second">Platform Fees : {userData.owner_fee}%
                                                </div>
                                            </i></h4>
                                        <input
                                            type="text"
                                            defaultValue={selectedEditContent.price}
                                            {...register('price', {
                                                required: true,
                                                min: 2
                                            })}
                                            placeholder="Enter Price"
                                            className={classnames('input', { 'is-invalid': errors?.price })}
                                            disabled={processing}
                                        />
                                        {parseInt(watch("price")) > 1 ? <div className='PlatformInfo'> You will receive ${(parseFloat(watch("price") - ((parseFloat(watch("price")) / 100) * parseFloat(userData.owner_fee)))).toFixed(2)}, when user purchases the content.</div> : null}
                                    </Col>
                                    {errors?.price && <FormFeedback className='mb-4'>Please enter a valid Price(*Note - minimum value need to be $2*)</FormFeedback>}
                                </Fragment>
                                : null}

                            {/* <Col className="mt-2" sm={12}>
                                <h4 className="title-create-item mb-0 mt-1">Revenue sharing</h4>
                                <div className="switchbtn">
                                    <Row className='alignItemEnd'>
                                        <Col className='lableSwitch' xs={8} xl={6} xxl={4}>Available for subscribed users</Col>
                                        <Col xl={6} xs={4} xxl={8}>
                                            <input
                                                className="react-switch-checkbox"
                                                id={`react-switch-btn`}
                                                type="checkbox"
                                                {...register('is_available', {
                                                    onChange: ()=>{
                                                        setIs_available(!is_available)
                                                    }
                                                })}
                                                checked={is_available}
                                                disabled={processing}
                                            />
                                            <label
                                                className={is_available === false ? "react-switch-label" : "react-switch-label activeSwitch"}
                                                htmlFor={`react-switch-btn`}
                                            >
                                                <span className={`react-switch-button`} />
                                            </label>
                                        </Col>
                                    </Row>
                                </div>
                                <p className="switchBottom mt-4">Enabling this option would allow subscribed platform users to view the content. You will receive a percentage of revenue based on page views.</p>
                            </Col> */}
                            <Col className='doneBtn mt-4' sm={12}>
                                <button className='createButton' type='submit' disabled={processing}>{processing ? "Creating Content..." : "Done"}</button>
                            </Col>
                        </Row>
                    </form>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default EditMultipleContent