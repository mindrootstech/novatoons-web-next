import React, { Fragment } from 'react'
import { Col, Row, Modal, ModalBody, ModalHeader } from 'reactstrap';
import Previewcard from '../Previewcard';
// import Loader from '../../components/loader/loader'

//redux
import { useDispatch, useSelector } from 'react-redux'
// import {closepreviewpopup} from '../../pages/content/ContentSeriesReducer'


const PreviewModel = () => {
    // const dispatch = useDispatch()
    // const {previewItem} = useSelector(state => state.seriesReducer)

    const previewItem = {previewPopupData: { "id": 8,
    "genre_id": 4,
    "created_at": "2022-11-16T12:31:49.000Z",
    "type": "content",
    "series_id": 0,
    "status": 1,
    "file_uploaded": "1",
    "is_mature": 0,
    "total_comments": 0,
    "file_size": "76.92",
    "genre_name": "Comedy",
    "price": "0.00",
    "is_paid": 0,
    "title": "Take Away Products",
    "viewcount": 1,
    "user_id": 13,
    "content_type": 1,
    "cover_image": "https://novatoons.sfo3.digitaloceanspaces.com/dev/cover/cover-img-20221116T123149192Z263654.png",
    "total_rating": "0.00",
    "favourite_count": 0,
    "slug": "take-away-products-1668601909",
    "first_name": "Cooper",
    "last_name": "Mullins",
    "user_name": "",
    "is_creator": 1,
    "profile_img": "",
    "rating": "0.00",
    "start_time": null,
    "end_time": null,
    "is_banner": 0,
    "tag": "ghost"}, previewPopup: true}
    if(Object.keys(previewItem.previewPopupData).length === 0){
        return <Loader/>
    } else {
        return (
        <Fragment>
            <Modal 
            fullscreen="xl" 
            isOpen={previewItem.previewPopup} 
            toggle={() => {
                dispatch(closepreviewpopup())
            }} 
            className='modal-dialog-centered previewModel'
            >
                <ModalHeader toggle={() => {
                    dispatch(closepreviewpopup())
                    }}>
                </ModalHeader>
                <ModalBody className='ContentTypeModel'>
                    <Row className='scrolledView'>
                        <Col sm={12}>
                            <h2 className="mb-5 modelHeading text-center">Preview Item</h2>
                        </Col>
                        <Col sm={12}>
                            <Row className='previewItemPopUp'>
                                <Previewcard item= {previewItem.previewPopupData} />
                            </Row>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    )
                }
}

export default PreviewModel