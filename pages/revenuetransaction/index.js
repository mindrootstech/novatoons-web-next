import React, { Fragment, useEffect } from 'react'
// import { useNavigate, useParams } from 'react-router-dom';

//component
import RevenueCard from '../../component/RevenueCard'
import RejectionHandler from '../../component/ErrorHandler/RejectionHandler'

//third party
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
//redux
import {
    getRevenueTransation,
    resetRevenueTransaction,
    setRevenueTransactionPage,
    setTransactionSortby,
    setRevenueTransactionFilter,
    setTransactionSort_Show,
    setRevenueTransactionFiltersShow
} from '../../redux/userReducer'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router';

// import '../mytransaction/transaction.css'

//fakedata

const RevenueTransaction = () => {
const Tick = '/images/contentImages/tick.svg'
   
    // const navigate = useNavigate()
    const dispatch = useDispatch()
    const router = useRouter()

    const { userData,
        error,
        error_message,
        revenueTransaction,
        loading,
         sortbyShow, 
        filter_show } = useSelector(state => state.userReducer)

    const loadMoreHandle = () => {
        dispatch(
            setRevenueTransactionPage({
                page: revenueTransaction.filter.page + 1
            })
        )
    }

    useEffect(() => {
        dispatch(resetRevenueTransaction())
    }, [dispatch])

    useEffect(() => {
        dispatch(
            getRevenueTransation({
                page: revenueTransaction.filter.page,
                type: revenueTransaction.filter.type,
                sortby: revenueTransaction.filter.sortby
            })
        )
    }, [revenueTransaction.filter, dispatch])



    const handleCategoryFilter = (e) => {
        dispatch(
            setRevenueTransactionFilter({
                type: e.target.value,
                page: 1
            })
        )
    }

    // const handleSort = (e, type) => {
    //     let sortby = e.target.checked && type === "byName" ? "1" : !e.target.checked && type === "byName" ? "2" : e.target.checked && type === "bySize" ? "3" : !e.target.checked && type === "bySize" && "4"
    //     dispatch(
    //         setTransactionSortby({
    //             sortby
    //         })
    //     )
    // }

    if (error && Object.keys(userData).length === 0) {
        return <RejectionHandler data={error_message} />
    } else {
        return (
            <Fragment>
                <div className='item-details'>
                    <div className='allTransaction'>
                        <div className="themesflat-container pt-80">
                            <div className='sortFilterButton'>
                            <button className='btn goBackBtnRevenue' onClick={()=> router.back()}><span className='mobile-None'>Go Back</span>
                                <span className='desktop-None'><i className='fa fa-angle-left'></i><i className='fa fa-angle-left'></i></span>
                            </button>
                                <Dropdown className='categorybutton' isOpen={filter_show} toggle={() => {
                                    dispatch(
                                        setRevenueTransactionFiltersShow(!filter_show)
                                    )
                                }}>
                                    <DropdownToggle>
                                        Filter <i className='fa fa-angle-down'></i>
                                    </DropdownToggle>
                                    <DropdownMenu className={revenueTransaction.filter.type !== "" && 'activeDropdown'} onClick={(e) => handleCategoryFilter(e)}>

                                        <DropdownItem className={revenueTransaction.filter.type === "1" && "selectedItem"} value='1'> {revenueTransaction.filter.type === "1" && <img src={Tick} alt="selected" />}Donated</DropdownItem>

                                        <DropdownItem className={revenueTransaction.filter.type === "2" && "selectedItem"} value='2'> {revenueTransaction.filter.type === "2" && <img src={Tick} alt="selected" />}Purchased</DropdownItem>

                                        <DropdownItem className={revenueTransaction.filter.type === "3" && "selectedItem"} value='3'> {revenueTransaction.filter.type === "3" && <img src={Tick} alt="selected" />}Unique View</DropdownItem>

                                    </DropdownMenu>
                                </Dropdown>
                                {/* //sort by  */}
                                {/* <Dropdown className='categorybutton' isOpen={sortbyShow} toggle={() => {
                                    dispatch(
                                        setTransactionSort_Show(!sortbyShow)
                                    )
                                }}>
                                    <DropdownToggle>
                                        Sort By <i className='fa fa-angle-down'></i>
                                    </DropdownToggle>
                                    <DropdownMenu className={( transaction.filter.sortby !== "") && 'activeSortDropdown'}>
                                        
                                        <DropdownItem className={(transaction.filter.sortby === "1" || transaction.filter.sortby === "2") && "activeLi" }>

                                            {transaction.filter.sortby === "1" && <i className='fa fa-arrow-down'></i>}
                                            {transaction.filter.sortby === "2" && <i className='fa fa-arrow-up'></i>}

                                            <input type="checkbox" onClick={(e) => handleSort(e, "byName")} name="sortbyName" defaultChecked={transaction.filter.sortby === "1"} />
                                            
                                            Name
                                        </DropdownItem>

                                        <DropdownItem className={(transaction.filter.sortby === "3" || transaction.filter.sortby === "4") && "activeLi" }>
                                            {transaction.filter.sortby === "3" && <i className='fa fa-arrow-down'></i>}
                                            {transaction.filter.sortby === "4" && <i className='fa fa-arrow-up'></i>}
                                            <input type="checkbox" onClick={(e) => handleSort(e, "bySize")} name="sortbySize" defaultChecked={transaction.filter.sortby === '3'} />
                                            Size
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown> */}
                            </div>
                            <div className='transactionCardSection'>
                                <RevenueCard loadmore={loadMoreHandle} transaction={revenueTransaction} loading={loading} />
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default RevenueTransaction