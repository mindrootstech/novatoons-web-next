import React, { Fragment, useEffect } from 'react'

//component
import TransactionCard from '../../component/TransactionCard'
import RejectionHandler from '../../component/ErrorHandler/RejectionHandler'

//third party
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

//redux
import {
    getUserTransation,
    resetTransaction,
    resetFilterTransaction,
    // setTransactionPage,
    // setTransactionSortby,
    setTransactionFilter,
    // setTransactionSort_Show,
    setTransactionFiltersShow
} from '../../redux/userReducer'
import { useDispatch, useSelector } from 'react-redux'

// import './transaction.css'


const MyTransaction = () => {
const Tick = '/images/contentImages/tick.svg'

    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(resetFilterTransaction())
        dispatch(resetTransaction())
        dispatch(
                getUserTransation({
                    page: transaction.filter.page,
                    type: transaction.filter.type,
                    sortby: transaction.filter.sortby
                })
            )
    }, [dispatch])

    const { userData,
         error, 
         error_message, 
         transaction, 
         loading,
         sortbyShow, 
         filter_show } = useSelector(state => state.userReducer)

    const loadMoreHandle = () => {
        dispatch(
            getUserTransation({
                page: transaction.filter.page + 1,
                type: transaction.filter.type,
                sortby: transaction.filter.sortby
            })
        )
    }
console.log(transaction)
    const handleCategoryFilter = (e) => {
        console.log(e,"e")
        dispatch(
            setTransactionFilter({
                type: e.target.value === "0" || e.target.value === undefined ? "" : e.target.value
            })
        )
        dispatch(
            getUserTransation({
                page: 1,
                type: e.target.value === "0" || e.target.value === undefined ? "" : e.target.value,
                sortby: transaction.filter.sortby
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
                                <Dropdown className='categorybutton' isOpen={filter_show} toggle={() => {
                                    dispatch(
                                        setTransactionFiltersShow(!filter_show)
                                    )
                                }}>
                                    <DropdownToggle>
                                        Filter <i className='fa fa-angle-down'></i>
                                    </DropdownToggle>
                                    <DropdownMenu className='activeDropdown'>

                                        <DropdownItem onClick={(e) => handleCategoryFilter(e)}className={transaction.filter.type === "" && "selectedItem"} value='0'> {transaction.filter.type === "" && <img src={Tick} alt="selected" />} All</DropdownItem>

                                        <DropdownItem onClick={(e) => handleCategoryFilter(e)} className={transaction.filter.type === "1" && "selectedItem"} value='1'> {transaction.filter.type === "1" && <img src={Tick} alt="selected" />} Credit Added</DropdownItem>

                                        <DropdownItem onClick={(e) => handleCategoryFilter(e)} className={transaction.filter.type === "2" && "selectedItem"} value='2'> {transaction.filter.type === "2" && <img src={Tick} alt="selected" />}Donated</DropdownItem>

                                        <DropdownItem onClick={(e) => handleCategoryFilter(e)} className={transaction.filter.type === "3" && "selectedItem"} value='3'> {transaction.filter.type === "3" && <img src={Tick} alt="selected" />}Purchased</DropdownItem>

                                        <DropdownItem onClick={(e) => handleCategoryFilter(e)} className={transaction.filter.type === "4" && "selectedItem"} value='4'> {transaction.filter.type === "4" && <img src={Tick} alt="selected" />}Subscription</DropdownItem>

                                        <DropdownItem onClick={(e) => handleCategoryFilter(e)} className={transaction.filter.type === "5" && "selectedItem"} value='5'> {transaction.filter.type === "5" && <img src={Tick} alt="selected" />}Promotion</DropdownItem>
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
                                <TransactionCard loadmore={loadMoreHandle} transaction={transaction} loading={loading} />
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default MyTransaction