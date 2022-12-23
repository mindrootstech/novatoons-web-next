import React, { Fragment, useEffect, useState } from 'react'
import { Col } from 'reactstrap';
import placholder from '../../assets/images/contentImages/placeholder.png'
import { useSelector } from 'react-redux'

const PreviewSeriesCard = ({previewData}) => {
    const [content_t, setContent_t] = useState()
    const [type, setType] = useState()

    const create_content = JSON.parse(localStorage.getItem('uploadcontent'))

    useEffect(() => {
        if (create_content.content_type === 1) {
            setContent_t("Comic")
        } else if (create_content.content_type === 2) {
            setContent_t("ART")
        } else if (create_content.content_type === 3) {
            setContent_t("E-Book")
        } else if (create_content.content_type === 4){
            setContent_t("NFT")
        } else {
            setContent_t("null")
        }

        if (create_content.type === "single") {
            setType("Single")
        } else {
            setType("Multiple")
        }
    }, [])


    return (
        <Fragment>
            <Col sm={12} md={12} lg={4} className="p-0">
                <div className="sc-card-product">
                    <div className="card-media">
                        <img src={previewData?.cover_image ? previewData?.cover_image : placholder} alt="novatoons" />
                    </div>
                </div>
            </Col>

            <Col sm={12} md={12} lg={8} className='contentPreview'>
                <div className='listOfContent'>
                    <ul>
                        <li>
                            <label className='contentDetails'>Content Type : <span>{content_t}</span> </label>
                        </li>
                        <li>
                            <label className='contentDetails'>Type : <span>{type}</span> </label>
                        </li>

                        {(previewData?.title && previewData?.title !== null) && <li>
                            <label className='contentDetails'>Item Name : <span>{previewData?.title}</span> </label>
                        </li>}
                        

                        {(previewData?.description !== null && previewData?.description !== "") && <li>
                            <label className='contentDetails'>Description : <span>{previewData?.description} </span> </label>
                        </li> }

                        {(previewData?.tagsSelected && previewData?.tagsSelected.length !== 0 ) && <li>
                            <label className='contentDetails'><div className='tagHeading'>Tags :</div> <div className='previewtaghs'> {previewData?.tagsSelected.map((item, index) => {
                                return <span keys={index} className='tagBatch'>{item.label ? item.label : item}</span>
                            })} </div> </label>
                        </li>}

                    </ul>
                </div>
            </Col>

        </Fragment>
    )
}

export default PreviewSeriesCard