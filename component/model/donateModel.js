import React, { Fragment, useState, useEffect } from 'react'
import { Col, Row, Modal, ModalBody, ModalHeader } from 'reactstrap';
// import { useDispatch, useSelector } from 'react-redux'
//third-party
import { toast } from 'react-toastify'
import { useRouter } from 'next/router';
//redux
// import { getUser } from '../../pages/user/userReducer';
// import { donateModelShow, makeDirectDonation } from '../../redux/modelReducer'
// //api
// import { postRequest } from '../../commonApi'
// import { useParams } from 'react-router-dom';

//fake data
import {series as seriesd,user} from '../../assets/fake-data/fake-user'
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

const DonateModel = ({ data }) => {
    const dummyuser ='/images/avatar/dummyuser.png'

    // const dispatch = useDispatch()
    // const params = useParams()
    const router = useRouter()
    const params = router.query
    const [credits, setCredits] = useState("")
    // const { donateModel } = useSelector(state => state.modelReducer)
    // const { userData } = useSelector(state => state.userReducer)
    // const { isSeries, content, series } = useSelector(state => state.editSeriesReducer)
    // const { authordata } = useSelector(state => state.authorReducer)

//
const donateModel ={show: false}
const isSeries = true   
const series = {seriesdata: seriesd}
const content = {contentData: seriesd}
const userData = user
    useEffect(() => {
        if(donateModel.show) {
            document.body.style.overflowX = 'hidden';
            document.body.style.overflowY = 'hidden';
            document.body.style.height = '100vh';
            return ()=> {
                document.body.style.height = 'auto'; 
                document.body.style.overflowY = 'unset'; 
            }
        }
     }, [donateModel.show]);

    const donateHandle = async () => {
        const receiver_name =  (donateModel.donateFor === 'author') ? 
        (authordata.is_creator === 1 && authordata.user_name !== "") ? authordata.user_name : authordata.first_name +' '+ authordata.last_name
        : (donateModel.donateFor === 'content') &&
        isSeries ? (series.seriesdata.user_name !== "" && series.seriesdata.is_creator === 1) ? series.seriesdata.user_name : `${series.seriesdata.first_name} ${series.seriesdata.last_name}` : (content.contentData.user_name !== "" && content.contentData.is_creator === 1) ? content.contentData.user_name : `${content.contentData.first_name} ${content.contentData.last_name}`

        const user_id = donateModel.donateFor === 'author' ? params.id : isSeries ? series.seriesdata.user_id : content.contentData.user_id

        if (parseInt(userData.total_amount) < parseInt(credits)) {
            dispatch(
                donateModelShow({
                    donateFor: null,
                    show: false,
                    briefShow: false,
                    message: `Thank you for supporting awesome art! Donation of ${(credits - ((credits / 100) * userData.owner_fee))} USD / ${((credits / userData.credit_cost) - (((credits / userData.credit_cost) / 100) * userData.owner_fee))} CR will be received by ${receiver_name} less platform fees and fees paid to the payment company. A copy of the invoice will be sent to your registered email`
                })
            )
            return dispatch(
                makeDirectDonation({
                    show: true,
                    amount: (credits / userData.credit_cost),
                    user_id
                })
            )
            
        }

        if (credits === "" || credits === "0") {
            toast.success(<SuccessToast message={"Please enter a valid donation amount"} />, { hideProgressBar: true,  autoClose:  8000, })
        } else {
            const resposne = await postRequest({ sub_url: '/donatecredit', dataMain: { user_id, credits: (credits / userData.credit_cost) } })
            if (resposne.status === true) {
                dispatch(
                    getUser()
                )
                dispatch(
                    donateModelShow({
                        donateFor: null,
                        show: false,
                        briefShow: true,
                        message: `Thank you for supporting awesome art! Donation of ${(credits - ((credits / 100) * userData.owner_fee))} USD / ${((credits / userData.credit_cost) - (((credits / userData.credit_cost) / 100) * userData.owner_fee))} CR will be received by ${receiver_name} less platform fees and fees paid to the payment company. A copy of the invoice will be sent to your registered email`
                    })
                )
                return toast.success(<SuccessToast message={resposne.message} />, { hideProgressBar: true,  autoClose:  8000, })
            } else {
                return toast.success(<SuccessToast message={resposne.message} />, { hideProgressBar: true,  autoClose:  8000, })
            }

        }
    }

    return (
        <Fragment>
            <Modal
                fullscreen="xl"
                isOpen={donateModel.show}
                toggle={() =>
                    dispatch(
                        donateModelShow({
                            donateFor: null,
                            show: false
                        })
                    )
                }
                className='modal-dialog-centered'>
                <ModalHeader
                    toggle={() =>
                        dispatch(
                            donateModelShow({
                                donateFor: null,
                                show: false
                            })
                        )
                    }
                >
                </ModalHeader>
                <ModalBody className='ContentTypeModel'>
                    <Row>
                        <Col sm={12} className='m-auto'>
                            <h2 className='text-center my-3 mainHeading modelHeading'>Make Donation</h2>
                        </Col>
                        <Col sm={12} className='m-auto' >
                            <div className='LightCard'>
                                <Row className='HeaderLightCard'>
                                    <Col xs={5}>
                                        <div className='authorDetails'>
                                            <div className='authorAvatar author_img'>
                                                <img src={
                                                    (donateModel.donateFor === 'author') ? 
                                                    authordata.profile_img !== "" ? authordata.profile_img : dummyuser
                                                    : (donateModel.donateFor === 'content') &&
                                                        (isSeries && series.seriesdata.profile_img !== "") ? 
                                                            series.seriesdata.profile_img : 
                                                            (!isSeries && content.contentData.profile_img !== "") ? 
                                                                content.contentData.profile_img
                                                                    : dummyuser 
                                                    } alt="novatoons user" />
                                            </div>
                                            <div className='about_author'>
                                                <div className='authorHeading'>Donating to Author</div>
                                                <div className='authorName autherName_detail'>{ (donateModel.donateFor === 'author') ? 
                                                    (authordata.is_creator === 1 && authordata.user_name !== "") ? authordata.user_name : authordata.first_name +' '+ authordata.last_name
                                                    : (donateModel.donateFor === 'content') &&
                                                    isSeries ? (series.seriesdata.user_name !== "" && series.seriesdata.is_creator === 1) ? series.seriesdata.user_name : `${series.seriesdata.first_name} ${series.seriesdata.last_name}` : (content.contentData.user_name !== "" && content.contentData.is_creator === 1) ? content.contentData.user_name : `${content.contentData.first_name} ${content.contentData.last_name}`}</div>


                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={7}>
                                        <div className='headingDonation'>
                                            <span className='balanceFirst autherName_detail'>Your Available Balance </span> 
                                        </div>
                                        
                                        <div className='balanceRemain autherName_detail'>
                                            <span className='balanceRemainInCr'>{Math.abs(parseFloat(userData.total_credits))} <span className='prefixAmount'>CR /</span></span>
                                            <span className='balanceRemainInUsd'>{userData.total_amount}<span className='prefixAmount'> USD</span></span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='bodyLightCard'>
                                    <Col sm={12} className='donateHeading'>
                                        <h3 className='text-center'> Enter the amount (in USD) you want to donate </h3>
                                    </Col>
                                    <Col sm={12}>
                                        <Row>
                                            <Col md={12} className='d-flex justify-content-center'>
                                                <div className='donateBalance'>
                                                    <div className='inputBalance donationBalanceInput'>
                                                        <input type='number' value={credits} placeholder="Enter Amount" onChange={(e) => setCredits(e.target.value)} />
                                                        {credits !== "" && <span className="afterDonationInput">USD</span>}
                                                    </div>
                                                </div>
                                                <div className='ml-4 amountInUsd'>
                                                    {credits !== "" && <Fragment>
                                                        <div className='amountHeading'>Credits </div>
                                                        <div className='amountInUsdBottom'>{credits / userData.credit_cost} CR </div>
                                                    </Fragment>
                                                    }
                                                </div>
                                            </Col>
                                            {credits !== "" && 
                                            <Col sm={12}>
                                                <p className='text-center mt-4'>You are about to donate {credits / userData.credit_cost} Cr which are equal to  {credits} USD</p>
                                            </Col> 
                                            }
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} md={12} className='m-auto'>
                            <div onClick={donateHandle} className='cursorPointer addBalanceDone'> Done </div>
                        </Col>
                    </Row>

                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default DonateModel