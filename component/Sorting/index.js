import React, {useEffect, useState} from "react";

//third party
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

//images
// import { getGenre } from '../../redux/tagReducer'
import { useDispatch, useSelector } from 'react-redux'
// import { page_name } from '../redux/headerReducer';
// import { mutureModelToggle } from "../redux/modelReducer";
// import MaturePopup from "../../components/model/maturePopup";

//redux
import {
  categoriesShowDrop,
  sortShowDrop,
  filterCategory,
  filterSortby,
  resetFilter,
  getAllData,
} from "../../redux/allDataReducer";

const Sorting = () => {
const Tick = "/images/contentImages/tick.svg";

  const [show, setShow] =  useState(false)
  const dispatch = useDispatch()
//  const [sortShow, setSortShow] = useState(false)
  // const [categoriesShow, setCategoriesShow] = useState(false);
  const { filterData, categoriesShow, sortShow } = useSelector(
    (state) => state.allDataReducer
  );

  const handleCategoryFilters = (e) => {

    dispatch(
      filterCategory({
        category: e.target.value,
      })
    );
  };

useEffect(()=>{
  setShow(true)
})
  const handleSort = (e, type) => {
    let sortby =
      e.target.checked && type === "byName"
        ? "1"
        : !e.target.checked && type === "byName"
        ? "2"
        : e.target.checked && type === "bySize"
        ? "3"
        : !e.target.checked && type === "bySize" && "4";
    dispatch(
      filterSortby({
        sortby,
      })
    );
  };

  return (show &&
    <>
      <div className="sortFilterButton">
        <Dropdown
          className="categorybutton"
          isOpen={categoriesShow}
          toggle={() => {
            dispatch(categoriesShowDrop(!categoriesShow));
          }}
        >
          <DropdownToggle>
            Category <i className="fa fa-angle-down"></i>
          </DropdownToggle>
          <DropdownMenu >
            <DropdownItem
              className={filterData.category === "single" && "activeDropdown"}
              value="single"
              onClick={(e) => handleCategoryFilters(e)}
            >
              {filterData.category === "single" && (
                <img className="selectedTick" src={Tick} alt="selected" />
              )}{" "}
              Single
            </DropdownItem>
            <DropdownItem
              className={filterData.category === "multiple" && "activeDropdown"}
              value="multiple"
              onClick={(e) => handleCategoryFilters(e)}
            >
              {filterData.category === "multiple" && (
                <img className="selectedTick" src={Tick} alt="selected" />
              )}{" "}
              Series
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        {/* //sort by  */}
        <Dropdown
          className="categorybutton"
          isOpen={sortShow}
          toggle={() => {
            dispatch(sortShowDrop(!sortShow));
          }}
        >
          <DropdownToggle>
            Sort By <i className="fa fa-angle-down"></i>
          </DropdownToggle>
          <DropdownMenu
            className={
              (filterData.sortby === "1" ||
                filterData.sortby === "2" ||
                filterData.sortby === "3" ||
                filterData.sortby === "4") &&
              "activeSortDropdown"
            }
          >
            <DropdownItem
              className={
                (filterData.sortby === "1" || filterData.sortby === "2") &&
                "activeLi"
              }
            >
              {filterData.sortby === "1" && (
                <i className="fa fa-arrow-down"></i>
              )}
              {filterData.sortby === "2" && <i className="fa fa-arrow-up"></i>}
              <input
                type="checkbox"
                onClick={(e) => handleSort(e, "byName")}
                name="sortbyName"
                defaultChecked={filterData.sortby === "1"}
              />
              Name
            </DropdownItem>

            <DropdownItem
              className={
                (filterData.sortby === "3" || filterData.sortby === "4") &&
                "activeLi"
              }
            >
              {filterData.sortby === "3" && (
                <i className="fa fa-arrow-down"></i>
              )}
              {filterData.sortby === "4" && <i className="fa fa-arrow-up"></i>}
              <input
                type="checkbox"
                onClick={(e) => handleSort(e, "bySize")}
                name="sortbySize"
                defaultChecked={filterData.sortby === "3"}
              />
              Size
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
};

export default Sorting;
