import React, { useEffect, useState } from 'react'
import { Accordion } from "react-bootstrap-accordion";

import { isWindow } from '../../utils/window';
import { getGenre } from '../../redux/tagReducer'
import { useDispatch, useSelector } from 'react-redux'
import { page_name } from '../../redux/headerReducer';
import { mutureModelToggle } from "../../redux/modelReducer";
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
import { filteration } from "../../helpers/filteration";

const data = [
  {
    id: 2,
    title: "Free/Paid",
    filterQ: "Free/Paid",
    content: [
      {
        field: "Free",
        value: 0,
      },
      {
        field: "Paid",
        value: 1,
      },
    ],
  },
  {
    id: 3,
    title: "Content Type",
    filterQ: "Audience",
    content: [
      {
        field: "Fit for All",
        value: 0,
      },
      {
        field: "18+",
        value: 1,
      },
    ],
  },
];

const Filters = () => {
  // const [clearAll, setClearAll] = useState(false);
  const [show, setShow] = useState(false)
const dispatch = useDispatch()
 

  // const handleFilter = (e, type) => {
  //   if (
  //     type.filterType === "Audience" &&
  //     type.filterKey === 0 &&
  //     type.append &&
  //     userData.is_mature !== "1"
  //   ) {
  //     dispatch(mutureModelToggle(true));
  //   }
  //   filteration(dispatch, type);
  //   setClearAll(true);
  // };

  useEffect(() => {
    if(isWindow()){
      setShow(true)
    }

  }, [])



  // const handleResetFilter = () => {
  //   dispatch(resetFilter());
  //   setClearAll(false);
  // };
//

 const [clearAll, setClearAll] = useState(false);
 
//  const [searchParams] = useSearchParams();

 const { genres } = useSelector((state) => state.tagReducer);
 const { userData } = useSelector((state) => state.userReducer);
 const { filterData, categoriesShow, sortShow } = useSelector(
   (state) => state.allDataReducer
 );
 const { mutureModel } = useSelector((state) => state.modelReducer);
 const { is_paid, is_mature, page, category, genre_id, sortby } = filterData;

 useEffect(() => {
   dispatch(
     getAllData({
       is_paid,
       is_mature,
       page,
       category,
       genre_id,
       sortby,
       content_type:'1'
    //      searchParams.get("datatype") === "5"
    //        ? "1"
    //        : searchParams.get("datatype"),
     })
   );
 }, [filterData]);
const value = 0
 const handleFilter = (e, type) => {
   if (
     type.filterType === "Audience" &&
     type.filterKey === 1 &&
     type.append &&
     userData.is_mature !== "1"
   ) {
     dispatch(mutureModelToggle(true));
   }
   filteration(dispatch, type);
   
   setClearAll(true);
 };

 const handleCategoryFilter = (e) => {
   dispatch(
     filterCategory({
       category: e.target.value,
     })
   );
 };

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

 const handleResetFilter = () => {
   dispatch(resetFilter());
   setClearAll(false)
 };
    return ( show &&
      <div className="col-xl-3 col-lg-3 col-md-12">
        {clearAll && (
          <div className="clrBtn cursorPointer" onClick={handleResetFilter}>
            <span>Clear all</span>
          </div>
        )}
        <div id="side-bar" className="side-bar style-3">
          <div className="widget widget-category mgbt-24 boder-bt">
            <div className="content-wg-category">
              <Accordion title={"grene"} show={window.innerWidth < 768 ? false : true} >
                <form>
                  {genres.map((item, index) => {
                    return (
                      <div key={index}>
                        <label>
                          {item.label}
                          <input
                            type="checkbox"
                            value={item.value}
                            onClick={(e) =>
                              handleFilter(e, {
                                filterType: "genre",
                                filterKey: item.id,
                                append: e.target.checked,
                              })
                            }
                          checked={
                            !clearAll && genre_id === ""
                              ? false
                              : genre_id
                                  .split(",")
                                  .includes(item.id.toString())
                          }
                          defaultChecked={genre_id
                            .split(",")
                            .includes(item.id.toString())}
                          />
                          <span className="btn-checkbox"></span>
                        </label>
                        <br />
                      </div>
                    );
                  })}
                </form>
              </Accordion>
            </div>
          </div>

          {data.map((item, index) => {
            return (
              <div
                className="widget widget-category mgbt-24 boder-bt"
                key={index}
              >
                <div className="content-wg-category">
                  <Accordion title={item.title} show={window.innerWidth < 768 ? false : true}>
                    <form>
                      {item.content.map((itemm, index) => {
                        return (
                          <div key={index}>
                            <label>
                              {itemm.field}
                              <input
                                type="checkbox"
                                onClick={(e) =>
                                  handleFilter(e, {
                                    filterType: item.filterQ,
                                    filterKey: itemm.value,
                                    append: e.target.checked,
                                  })
                                }
                                checked={
                                  (((is_paid === "" && !clearAll) || (is_mature === "" && !clearAll)) ? false : item.filterQ === "Free/Paid")
                                    ? is_paid.includes(`${itemm.value}`)
                                    : (item.filterQ === "Audience") &&
                                    is_mature.includes(`${itemm.value}`)
                                }

                                defaultChecked={
                                  (item.filterQ === "Free/Paid")
                                    ? is_paid.includes(`${itemm.value}`)
                                    : item.filterQ === "Audience" &&
                                    is_mature.includes(`${itemm.value}`)
                                }
                              />
                              <span className="btn-checkbox"></span>
                            </label>
                            <br />
                          </div>
                        );
                      })}
                    </form>
                  </Accordion>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  }


export default Filters