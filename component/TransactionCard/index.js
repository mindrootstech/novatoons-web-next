import React, { Fragment } from 'react'
import { Row, Col } from 'reactstrap'
import moment from 'moment'

const TransactionCard = ({ loadmore, transaction, loading }) => {
const PlaceholderImage = '/images/contentImages/placeholder.png'

  if (transaction.data.length === 0 && !loading) {
    return (<div className='NotFound'>
      <h2>Data Not Found</h2>
    </div>)
  } else {
    return (
      <Fragment>
        <Row className='mobileBlock'>
          {transaction.data.map((item, index) => {
            return <Col sm={6} md={12}>
              <div key={index} className='transactionCard'>
                <Row>
                  <Col md={2}>
                    <img className='avatarImageTransaction' src={item.image === "" ? PlaceholderImage : item.image} alt={item.image} />
                  </Col>
                  <Col md={6}>
                    <div className='cardDetails'>
                      <h5>{item.type === "Credit added" ? `${item.total_credits} ${item.type}` : item.type === "Donated" ? item.user_name !== "" && item.is_creator === "1" ? `Donated to ${item.user_name}` : `Donated to ${item.name}` : item.type === "Subscription" ? `${item.name} subscription purchased` : item.type === "Series Amount Paid" ? `${item.name} Purchased` : item.name}</h5>
                      <div className='dateCard'>Date: {moment(item.created_at).format('DD-MM-YYYY')}</div>
                      <div className='cardTime'>Time: {moment(item.created_at).format('h:mm a')}</div>
                    </div>
                  </Col>
                  <Col md={4} className='amountPaidSection'>
                    <div className='paidAmount'> Amount Paid: <span>{item.total_credits.toFixed(2)} CR
                    {/* / {parseInt(item.total_cost).toFixed(2)} USD */}
                    </span></div>
                  </Col>
                </Row>
              </div>
            </Col>
          })}
          {transaction.load_more &&
            <Col sm={12} className='text-center mt-5'>
              <div id="load-more" onClick={loadmore} className="sc-button cursorPointer fl-button pri-3"><span>Load More</span></div>
            </Col>}
        </Row>
      </Fragment>
    )
  }
}

export default TransactionCard