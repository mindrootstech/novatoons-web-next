import React, { Fragment, useEffect, useState } from 'react'
import { Col } from 'reactstrap';
import { useSelector } from 'react-redux'

const Previewcard = (previewPopupData) => {
    const placholder = '/images/contentImages/placeholder.png'

    const [content_t, setContent_t] = useState()
    const [type, setType] = useState()
   const seriesreducer = {previewPopup: true}
   const create_content = {content_type: 1} 
    // const seriesreducer = useSelector(state => state.seriesReducer.previewItem)
    // const create_content = useSelector(state => state.headerReducer)

    // const {previewPopupData} = seriesreducer

    useEffect(() => {
        if (create_content.content_type === 1) {
            setContent_t("Comic")
        } else if (create_content.content_type === 2) {
            setContent_t("ART")
        } else if (create_content.content_type === 3) {
            setContent_t("E-Book")
        } else {
            setContent_t("NFT")
        }

        if (create_content.type === "single") {
            setType("Single")
        } else {
            setType("Multiple")
        }
    }, [])


    return (
        <Fragment>
            <Col sm={12} md={12} lg={4}>
                <div className="sc-card-product">
                    <div className="card-media2">
                        <img loading='lazy' src={previewPopupData?.cover_image ? previewPopupData?.cover_image : placholder} alt="novatoons" />
                    </div>
                </div>
            </Col>

            {seriesreducer.previewPopup === true ? <Col sm={12} md={12} lg={8} className='contentPreview'>
                <div className='listOfContent'>
                    <ul>
                        <li>
                            <label className='contentDetails'>Content Type : <span>{content_t}</span> </label>
                        </li>
                        <li>
                            <label className='contentDetails'>Type : <span>{type}</span> </label>
                        </li>

                        {previewPopupData?.title && previewPopupData?.title !== null ? <li>
                            <label className='contentDetails'>Item Name : <span>{previewPopupData?.title}</span> </label>
                        </li> : null}

                        {previewPopupData?.is_paid !== null && previewPopupData?.is_paid !== undefined ? <li>
                            <label className='contentDetails'>Is Paid/Free : <span>{previewPopupData?.is_paid === "0" ? "Free"  : 
                            "Paid"}</span> </label>
                        </li> : null}
                        
                        {(previewPopupData?.is_paid === "1" || previewPopupData?.is_paid === 1) && previewPopupData?.price !== null && previewPopupData?.price !== undefined ? <li>
                            <label className='contentDetails'>Price : <span>$ {previewPopupData?.price}</span> </label>
                        </li> : null}

                        {(previewPopupData?.is_downloadable !== null || previewPopupData?.is_downloadable === 0) ? <li>
                            <label className='contentDetails'>Is Downloadable : <span>{previewPopupData?.is_downloadable === 1 || previewPopupData?.is_downloadable === "1" ? "Yes" : "No" }</span> </label>
                        </li> : null}

                        {(previewPopupData?.is_available !== null || previewPopupData?.is_available === 0) ? <li>
                            <label className='contentDetails'>Available for Subscribed Users : <span>{previewPopupData?.is_available === 1 || previewPopupData?.is_available === "1" ? "Yes" : "No" }</span> </label>
                        </li> : null}

                        
                        {(previewPopupData?.tagsSelected && previewPopupData?.tagsSelected.length !== 0 )? <li>
                            <label className='contentDetails'><div className='tagHeading'>Tags :</div> <div className='previewtaghs'> {previewPopupData?.tagsSelected.map((item, index) => {
                                return <span keys={index} className='tagBatch'>{item}</span>
                            })} </div> </label>
                        </li> : null}

                        {(previewPopupData?.contentDescription !== null && previewPopupData?.contentDescription !== "") ? <li>
                            <label className='contentDetails'>Description : <span>{previewPopupData?.contentDescription} {previewPopupData?.description !== null && previewPopupData.description} </span>  </label>
                        </li> : null }

                    </ul>
                </div>
            </Col> : null}

        </Fragment>
    )
}

export default Previewcard