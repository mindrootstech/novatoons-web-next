import React from "react";
import RejectionHandler from "../component/ErrorHandler/RejectionHandler";
// import "./style.css";
//Redux
// import { useSelector } from "react-redux";

import CheckoutForm from "../component/CheckoutForm";
const PaymentMethod = () => {

//   const { err, error_message } = useSelector((state) => state.pay    outReducer);
  const err = false
//   const error_message = "hello"
  if(err) {
    return <RejectionHandler data={error_message} />
  } else {
  return (
    <div className="SubscriptionPlans">
      <section className="tf-section authors">
        <div className="themesflat-container pt-80">
          <CheckoutForm />
        </div>
      </section>
    </div>
  );
}
};
export default PaymentMethod;
