import React, { useState, useEffect, useRef, useMemo, Fragment } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import classnames from 'classnames'
import { Col, Row, FormFeedback } from 'reactstrap'
import Loader from '../../component/loader/loader.js'
// import { addBalancePopoup } from "../../redux/creditReducer.js";
// import { makeDirectDonation, donateModelShow } from "../../redux/modelReducer.js"; 

// import { selectPromotion_id } from '../user/userReducer'

import { loadStripe } from '@stripe/stripe-js';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

import { toast } from 'react-toastify'
import { useRouter } from "next/router";

//redux
// import { useDispatch, useSelector } from "react-redux";
// import { cardData, purchagePlan, selectForm, selectingCard } from "./payoutReducer";
// import {getUser} from '../user/userReducer'

// import useResponsiveFontSize from "./useResponsiveFontSize";
// import "./style.css"
// import { postRequest } from "../../commonApi";
// import { axiosRequest } from "../../http/index.js";
//fake data
import {card, toggleForm} from '../../assets/fake-data/fake-user'
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


const useOptions = () => {
//   const fontSize = useResponsiveFontSize();
const fontSize = ""
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: "#fff",
          letterSpacing: "0.025em",
          "::placeholder": {
            color: "#79798A",
            fontSize:"12px"
          }
        },
        invalid: {
          color: "#9e2146"
        }
      }
    }),
    [fontSize]
  );

  return options;
};

const CheckoutForm = ({isBalanceLow}) => {
    const Tick = "/images/contentImages/tick.svg";
    const Card = "/images/contentImages/card.svg";
//   const navigate = useNavigate()
//   const dispatch = useDispatch();
//
const directDonation = {show:false}
const loading = false
const cards = card
const processing = false
//
  const options = useOptions();
  const router = useRouter()
  const searchParams = router.query
//   const [searchParams] = useSearchParams()
  const onError = (errors, e) => console.log(errors, e);
  const [error, setError] = useState(null);
  const [manualError, setManualError] = useState(null)
  const [paymentType, setPaymentType] = useState(null)

//   useEffect(() => {
//     dispatch(cardData());

//     dispatch(selectPromotion_id({
//       show: false
//     }))


//   }, [dispatch]);

//   const { cards, processing, toggleForm, loading } = useSelector((state) => state.payoutReducer);
//   const {directDonation, donateModel} = useSelector(state => state.modelReducer)

  const stripe = useStripe();
  const elements = useElements();

  const form = useRef();

  const registerUser = yup.object().shape({
    name: yup.string().min(3).required()
  })
  const { register, formState: { errors }, reset, handleSubmit } = useForm({ mode: 'onChange', resolver: yupResolver(registerUser) })

  useEffect(()=>{
      if(searchParams.paymenttype === "1") {
        setPaymentType("subscribe")
      } else if(searchParams.paymenttype === "2") {
        setPaymentType("credits")
      }else if(searchParams.paymenttype === "4") {
        setPaymentType("promotion")
      }else if(searchParams.paymenttype === "5") {
        setPaymentType("purchase")
      }
  }, [])

  useEffect(()=>{
    if(isBalanceLow && directDonation.show) {
      setPaymentType("donate")
    }
  }, [directDonation])

  const onSubmit = async (data) => {
    
    dispatch(purchagePlan(true))
    const cardElement = elements.getElement(CardNumberElement, CardCvcElement, CardExpiryElement);
    const result = await stripe.createToken(cardElement);
    if (result.error) {
      setManualError(result.error)
      dispatch(purchagePlan(false))
      return toast.warning(<SuccessToast message={result?.error?.message} />, { hideProgressBar: true,  autoClose:  8000, })
    }

    if ((searchParams.get('planid') === null && paymentType === "subscribe") || (searchParams.get('planid') === "" && paymentType === "subscribe")) {
      return toast.success(<SuccessToast message={"Please select a plan"} />, { hideProgressBar: true,  autoClose:  8000, })
    }

    if((searchParams.get('package') === null && paymentType === "credits") || (searchParams.get('package') === "" && paymentType === "credits")) {
      dispatch(
        addBalancePopoup({
            showHide: true
        })
      )
      return toast.success(<SuccessToast message={"Please select how much credits you want?"} />, { hideProgressBar: true,  autoClose:  8000, })
    }


    if(((searchParams.get('package') === null) && (paymentType === "promotion") && (searchParams.get('content') === null || searchParams.get('content') === "")) || ((searchParams.get('package') === "") && (paymentType === "promotion") && (searchParams.get('content') === null || searchParams.get('content') === ""))) {
      return toast.success(<SuccessToast message={"Please select content for promotion?"} />, { hideProgressBar: true,  autoClose:  8000, })
    }

    if((searchParams.get('content') === null && paymentType === "purchase") || (searchParams.get('content') === "" && paymentType === "purchase")) {
      return toast.success(<SuccessToast message={"Please select how much donatation you want?"} />, { hideProgressBar: true,  autoClose:  8000, })
    }

    if (elements == null) {
      return;
    }
    if (result.token) {
      setManualError(null)
      let dataMain = {
        stripe_token: result.token.id,
        user_name: data?.name
      }

      const seriesContent = searchParams.get('type') === "0" ? "content" : "series"
      
      paymentType === "subscribe" && (dataMain = {...dataMain, plan_id: searchParams.get('planid')})
      paymentType === "credits" && (dataMain = {...dataMain, package_id: searchParams.get('package')})
      paymentType === "donate" && (dataMain = {...dataMain, credits: directDonation.amount})
      paymentType === "donate" && (dataMain = {...dataMain, user_id: directDonation.user_id})
      paymentType === "promotion" && (dataMain = {...dataMain, package_id: parseInt(searchParams.get('package'))})
      paymentType === "promotion" && (dataMain = {...dataMain, content_id: parseInt(searchParams.get('content'))})
      paymentType === "promotion" && (dataMain = {...dataMain, type: seriesContent})
      paymentType === "purchase" && (dataMain = {...dataMain, content_id: parseInt(searchParams.get('content'))})
      paymentType === "purchase" && (dataMain = {...dataMain, type: seriesContent})

      let url = paymentType === "subscribe" ? '/purchasesubscription' : paymentType === "credits" ? '/purchasecredit' : paymentType === "donate" ? '/purchasecredit' : paymentType === "promotion" ? '/promotecontent' : paymentType === "purchase" ? '/buycontent' : 'createcard'
     
      if(url === 'createcard'){
        dispatch(purchagePlan(false))
        return toast.success(<SuccessToast message='Please select any type of payment' />, { hideProgressBar: true,  autoClose:  8000, })
      }
      try {
        const response = await axiosRequest({ sub_url: url, dataMain })

        if (response.status === 200) {
          toast.success(<SuccessToast message={response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
          dispatch(cardData())
          dispatch(purchagePlan(false))
          dispatch(getUser())
          if( paymentType !== "donate") {
            navigate(-1)
          }

          if(isBalanceLow) {
            dispatch(
              donateModelShow({
                donateFor: null,
                show: false,
                briefShow: true,
                message: donateModel.briefModel.message
            })
            )
          }

          
          dispatch(
            makeDirectDonation({
                show: false,
                amount: null,
                user_id: null
            })
        )
        dispatch(
          donateModelShow({
            show: false,
            donateFor: null
          })
        )
        }

      } catch (err) {
         toast.warning(<SuccessToast message={err.response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
         return dispatch(purchagePlan(false))
      }
    }
  }

  const handleCardSubmit = async () => {

    dispatch(purchagePlan(true))
    
    let dataMain = {
      card_id: toggleForm.card_id
    }
    if((searchParams.get('content') === null && paymentType === "purchase") || (searchParams.get('content') === "" && paymentType === "purchase")) {
      return toast.success(<SuccessToast message={"Please select how much donatation you want?"} />, { hideProgressBar: true,  autoClose:  8000, })
    }
    const seriesContent = searchParams.get('type') === "0" ? "content" : "series"

    paymentType === "subscribe" && (dataMain = {...dataMain, plan_id: searchParams.get('planid')})
    paymentType === "credits" && (dataMain = {...dataMain, package_id: searchParams.get('package')})
    paymentType === "donate" && (dataMain = {...dataMain, credits: directDonation.amount})
    paymentType === "donate" && (dataMain = {...dataMain, user_id: directDonation.user_id})
    paymentType === "promotion" && (dataMain = {...dataMain, package_id: searchParams.get('package')})
    paymentType === "promotion" && (dataMain = {...dataMain, content_id: searchParams.get('content')})
    paymentType === "promotion" && (dataMain = {...dataMain, type: seriesContent})
    paymentType === "purchase" && (dataMain = {...dataMain, content_id: parseInt(searchParams.get('content'))})
    paymentType === "purchase" && (dataMain = {...dataMain, type: seriesContent})

    let url = paymentType === "subscribe" ? '/purchasesubscription' : paymentType === "credits" ? '/purchasecredit' : paymentType === "donate" ? '/purchasecredit' : paymentType === "promotion" ? '/promotecontent' : paymentType === "purchase" ? '/buycontent' : 'createcard'

    if(url === 'createcard'){
      dispatch(purchagePlan(false))
      return toast.success(<SuccessToast message='Please select any type of payment' />, { hideProgressBar: true,  autoClose:  8000, })
    }

    try {
      const response = await axiosRequest({ sub_url: url, dataMain })
      if (response.status === 200) {
        toast.success(<SuccessToast message={response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
        dispatch(purchagePlan(false))
        dispatch(getUser())
        if( paymentType !== "donate") {
          navigate(-1)
        }

        if(isBalanceLow) {
          dispatch(
            donateModelShow({
              donateFor: null,
              show: false,
              briefShow: true,
              message: donateModel.briefModel.message
          })
          )
        }

        dispatch(
          makeDirectDonation({
                show: false,
                amount: null,
                user_id: null
            })
        )
        dispatch(
          donateModelShow({
            show: false,
            donateFor: null
          })
        )
      } 

    } catch (err) {
      toast.success(<SuccessToast message={err.response.data.message} />, { hideProgressBar: true,  autoClose:  8000, })
      dispatch(purchagePlan(false))
    }
  }

  const CardsHandle = (id) => {
    reset()
    elements.getElement(CardNumberElement).clear()
    elements.getElement(CardCvcElement).clear()
    elements.getElement(CardExpiryElement).clear()
    dispatch(
      selectingCard({
        form: false,
        id
      })
    )
  }

  if(loading) {
    return <Loader/>
  } else {

  return (
    <>
      <form className={isBalanceLow ? "mb-3 AddEventF isBalanceLow" : "mb-3 AddEventF"} ref={form} onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="row">
          <Col md={isBalanceLow ? 12 : 6}>
            <div className="AddpaymentDetails">
              <h3>Add Payment Details</h3>
            </div>

            <Row>
              <Col sm={12} className='mb-2'>
                <label className="PaymentFieldTitle">Credit or Debit Card Number</label>
                <div
                  className={classnames('paymentFormField', { 'is-invalid': (manualError && manualError?.code === "incomplete_number") || (manualError && manualError?.code === "invalid_number") })}
                >
                  <CardNumberElement
                    onChange={() => {
                      if (toggleForm.reset === null) {
                        dispatch(
                          selectForm({
                            form: true,
                            id: null
                          })
                        )
                      }
                    }
                    }
                    options={options}
                  />
                </div>
                {(manualError?.code === "incomplete_number") || (manualError && manualError?.code === "invalid_number") ? <div className='isInvalidError'>{manualError?.message}</div> : null}
              </Col>
              <Col sm={12} className='mb-2'>
                <label className="PaymentFieldTitle">Name on Card</label>
                <input id="name" defaultValue=""
                  {...register('name', {
                    required: true,
                    onChange: () => {
                      dispatch(
                        selectForm({
                          form: true,
                          id: null
                        })
                      )
                    }
                  })}
                  type="text"
                  placeholder="Enter Name"
                  className={classnames('input form-control paymentFormField', { 'is-invalid': errors && errors?.name })}
                  on
                />
                {errors && errors?.name && <FormFeedback>Please type Name</FormFeedback>}
              </Col>

              <Col sm={6} className='mb-2'>
                <label className="PaymentFieldTitle">3-digit CVV</label>
                <div
                  className={classnames('paymentFormField', { 'is-invalid': (manualError && manualError?.code === "incomplete_cvc") || (manualError && manualError?.code === "incomplete_cvc") })}
                >
                  <CardCvcElement
                    onChange={() => {
                      if (toggleForm.reset === null) {
                        dispatch(
                          selectForm({
                            form: true,
                            id: null
                          })
                        )
                      }
                    }
                    }
                    options={options}
                  />
                </div>
                {manualError?.code === "incomplete_cvc" && <div className='isInvalidError'>{manualError?.message} </div>}

              </Col>
              <Col sm={6} className='mb-2'>
                <label className="PaymentFieldTitle">Valid until</label>
                <div
                  className={classnames('paymentFormField', { 'is-invalid': (manualError && manualError?.code === "incomplete_expiry") || (manualError?.code === "invalid_expiry_year_past" && manualError) || (manualError?.code === "invalid_expiry_month_past" && manualError) })}
                >
                  <CardExpiryElement
                    onChange={() => {
                      if (toggleForm.reset === null) {
                        dispatch(
                          selectForm({
                            form: true,
                            id: null
                          })
                        )
                      }
                    }
                    }
                    options={options}
                  />
                </div>
                {((manualError?.code === "incomplete_expiry") || (manualError?.code === "invalid_expiry_year_past") || (manualError?.code === "invalid_expiry_month_past")) && <div className='isInvalidError'>{manualError?.message} </div>}
              </Col>
            </Row>

          </Col>


          <Col md={isBalanceLow ? 12 : 6}>
            {cards.length !== 0 && <div className="PrepaymentDetails">
              <h3>Choose Card</h3>
              <p>Pay With</p>
              <Row>
              {cards.map((card, index) => (
                <Col lg={isBalanceLow ? 12 : 6}>
                <div
                  keys={index}
                  className="cardBox0"
                  type="button"
                  onClick={() => CardsHandle(card.card_id)}
                >
                  <div className="detailsAndImage d-flex">
                    <div className='cardMainImage'>
                      <img src={Card} alt="card" />
                    </div>
                    <div className='cardDetails'>
                      <p>**** **** **** {card.card_last4}</p>
                      <p>{card.card_brand}  {(card.exp_month !== 0 && card.exp_month !== 0) && <span className="ml-4">{card.exp_month !== 0 && `${card.exp_month} / `}{card.exp_year !== 0 && card.exp_year}</span> }</p>
                    </div>
                  </div>
                  <div className='cardCheckImage'>
                    {((toggleForm.card_id === card.card_id || `${toggleForm.card_id}` === card.card_id) && toggleForm.reset === "form") && <img src={Tick} alt="card" />}
                  </div>
                </div>
                </Col>
              ))}
              </Row>
            </div>}

          </Col>
        </div>

        <div className={isBalanceLow ? "row isBalanceLowSubmit" : "row PaymentBtn"}>
          <div className="paymentbycard">
            {toggleForm.reset === "card" || toggleForm.reset === null ?
              <button
                className={`SubmitButton ${error ? "SubmitButton--error" : ""}`}
                type="submit"
                disabled={processing}
              >
                {processing ? "Processing..." : "Submit"}
              </button>
              : <button
                className={`SubmitButton ${error ? "SubmitButton--error" : ""}`}
                type="button"
                onClick={handleCardSubmit}
                disabled={processing}
              >
                {processing ? "Processing..." : "Submit"}
              </button>}
          </div>
          <div className="paymentcardcancel">
            <button onClick={() => {
              if(directDonation.show) {
                dispatch(
                  makeDirectDonation({
                      show: false,
                      amount: directDonation.amount,
                      user_id: directDonation.user_id
                  })
              )
              } else {
                navigate(-1)
              }
              }}>Cancel</button>
          </div>
        </div>
      </form>
    </>
  ); 
}
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const CheckoutFormMain = ({isBalanceLow}) => {
  return (
    <div className="AppWrapper">
      <Elements stripe={stripePromise}>
        <CheckoutForm isBalanceLow={isBalanceLow} />
      </Elements>
    </div>
  );
};

export default CheckoutFormMain;
