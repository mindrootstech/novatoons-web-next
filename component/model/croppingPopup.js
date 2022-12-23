import React, { Fragment, useState, useEffect } from 'react'
import { Modal, ModalBody, ModalHeader, Col, Row } from 'reactstrap';
// import { useSelector, useDispatch } from 'react-redux';
import ReactCrop from 'react-image-crop'
// import { cropPopUp } from '../../pages/content/editContentSeriesReducer'
// import {cover_image_ratio} from '../../pages/content/ContentSeriesReducer'
import 'react-image-crop/dist/ReactCrop.css'

const CroppingPopup = () => {
    const [image, setImage] = useState(null)

    const [crop, setCrop] = useState({
        unit: 'px',
        x: 25,
        y: 25,
        width: 270,
        height: 400
      })
    // const dispatch = useDispatch()
    // const { croppopup } = useSelector(state => state.editSeriesReducer)
    const croppopup = {show: false}

    useEffect(() => {
        document.body.style.overflowX = 'hidden';
        document.body.style.overflowY = 'hidden';
        document.body.style.height = '100vh';
        return ()=> {
            document.body.style.height = 'auto'; 
            document.body.style.overflowY = 'unset'; 
        }
     }, []);

    
    function getCroppedimage() {
        
        const canvas = document.createElement('canvas');
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        const cuttingRatio = ((crop.width * 100) / image.target.width )
        const cuttingR = ((crop.height * 100) / image.target.height )
        const scaleWidth = ((crop.x * 100) / image.target.width )
        const scaleHeight = ((crop.y * 100) / image.target.height )

        // const cuttingWidth = ((image.target.naturalWidth / 100) * cuttingRatio)
        // const cuttingHeight = ((image.target.naturalHeight / 100) * cuttingR)
        const cuttingWidth = 270
        const cuttingHeight = 400


        const fromLeft = ((image.target.naturalWidth / 100) * scaleWidth)
        const fromTop = ((image.target.naturalHeight / 100) * scaleHeight)
        
        ctx.drawImage(
            image.target,
            fromLeft,
            fromTop,
            cuttingWidth,
            cuttingHeight,
            0,
            0,
            crop.width,
            crop.height,
        );
        
        const imagecrop = canvas.toDataURL('images/jpeg')
        dispatch(
            cropPopUp({
                show: false,
                file: imagecrop,
                coverfilename: croppopup.coverfilename
            })
        )

        dispatch(
            cover_image_ratio({
                width: cuttingWidth,
                height: cuttingHeight,
                ratio: cuttingHeight <= 400 && cuttingWidth <= 270
            })
        )
    }

    return (
        <Fragment>
            <Modal
                fullscreen="xl"
                isOpen={croppopup.show}
                toggle={() =>
                    dispatch(
                        cropPopUp({
                            show: false,
                            file: croppopup.file !== null ? croppopup.file : {},
                            coverfilename: croppopup.coverfilename
                        })
                    )
                }
                className='modal-dialog-centered'>
                <ModalHeader
                    toggle={() =>
                        dispatch(
                            cropPopUp({
                                show: false,
                                file: croppopup.file !== null ? croppopup.file : {},
                                coverfilename: croppopup.coverfilename
                            })
                        )
                    }
                >
                </ModalHeader>
                <ModalBody className='ContentTypeModel customCropping'>
                    <div id="multiple">
                    <h2 className='text-center mb-4'>Crop Image</h2>
                    <Row>
                        <Col className='ImageCropping text-center mt-3' sm={{ size: 8, offset: 2 }} >

                            <ReactCrop 
                                crop={crop} 
                                aspect={27 / 40} 
                                onChange={c => {
                                    setCrop(c)
                                }}
                            >
                                <img src={croppopup.file} onLoad={setImage} alt="novatoons" />
                            </ReactCrop>
                        </Col>
                        <Col className='text-center mt-4' sm={12}>
                            <button type="button" className={crop === undefined ? "submit m-auto CropingBtn disabledBtn" : "submit m-auto CropingBtn"} disabled={crop === undefined ? true : false} onClick={getCroppedimage}>Crop</button>
                            <button type="button" className="submit ml-2 CropingBtn" onClick={() =>
                                dispatch(
                                    cropPopUp({
                                        show: false,
                                        file: croppopup.file !== null ? croppopup.file : {},
                                        coverfilename: croppopup.coverfilename
                                    })
                                )
                            }
                            >Continue without Crop</button>
                        </Col>
                    </Row>
                    </div>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default CroppingPopup