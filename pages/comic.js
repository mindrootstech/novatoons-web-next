import React, { useState, useEffect } from "react";

//component
import Filters from "../component/Filters";
import Sorting from "../component/Sorting";
import Card from "../component/Card";
//redux
import { getGenre } from '../redux/tagReducer'
import { useDispatch, useSelector } from 'react-redux'
import { page_name } from '../redux/headerReducer';
import { mutureModelToggle } from "../redux/modelReducer";
// import MaturePopup from "../../components/model/maturePopup";

//redux
import {
  categoriesShowDrop,
  sortShowDrop,
  filterCategory,
  filterSortby,
  resetFilter,
  getAllData,
} from "../redux/allDataReducer";
import { isWindow } from "../utils/window";

//
//redux

// const data = [
 
//   {
//       "id": 7,
//       "genre_id": 4,
//       "created_at": "2022-11-16T12:21:03.000Z",
//       "type": "series",
//       "series_id": 0,
//       "status": 1,
//       "file_uploaded": "1",
//       "is_mature": 0,
//       "total_comments": 0,
//       "file_size": "65.31",
//       "genre_name": "Comedy",
//       "price": "0.00",
//       "is_paid": 0,
//       "title": "God of Wars",
//       "viewcount": 3,
//       "user_id": 13,
//       "content_type": 1,
//       "cover_image": "https://novatoons.sfo3.digitaloceanspaces.com/dev/cover/cover-img-20221116T122102625Z156603.jpeg",
//       "total_rating": "0.00",
//       "favourite_count": 0,
//       "slug": "god-of-war-1668601262",
//       "first_name": "Cooper",
//       "last_name": "Mullins",
//       "user_name": "",
//       "is_creator": 1,
//       "profile_img": "",
//       "rating": "0.00",
//       "start_time": null,
//       "end_time": null,
//       "is_banner": 0,
//       "tag": "christian,dc"
// },

// {
//   "id": 7,
//   "genre_id": 4,
//   "created_at": "2022-11-16T12:21:03.000Z",
//   "type": "series",
//   "series_id": 0,
//   "status": 1,
//   "file_uploaded": "1",
//   "is_mature": 0,
//   "total_comments": 0,
//   "file_size": "65.31",
//   "genre_name": "Comedy",
//   "price": "0.00",
//   "is_paid": 0,
//   "title": "God of Wars",
//   "viewcount": 3,
//   "user_id": 13,
//   "content_type": 1,
//   "cover_image": "https://novatoons.sfo3.digitaloceanspaces.com/dev/cover/cover-img-20221116T122102625Z156603.jpeg",
//   "total_rating": "0.00",
//   "favourite_count": 0,
//   "slug": "god-of-war-1668601262",
//   "first_name": "Cooper",
//   "last_name": "Mullins",
//   "user_name": "",
//   "is_creator": 1,
//   "profile_img": "",
//   "rating": "0.00",
//   "start_time": null,
//   "end_time": null,
//   "is_banner": 0,
//   "tag": "christian,dc"
// },
// {
//   "id": 7,
//   "genre_id": 4,
//   "created_at": "2022-11-16T12:21:03.000Z",
//   "type": "series",
//   "series_id": 0,
//   "status": 1,
//   "file_uploaded": "1",
//   "is_mature": 0,
//   "total_comments": 0,
//   "file_size": "65.31",
//   "genre_name": "Comedy",
//   "price": "0.00",
//   "is_paid": 0,
//   "title": "God of Wars",
//   "viewcount": 3,
//   "user_id": 13,
//   "content_type": 1,
//   "cover_image": "https://novatoons.sfo3.digitaloceanspaces.com/dev/cover/cover-img-20221116T122102625Z156603.jpeg",
//   "total_rating": "0.00",
//   "favourite_count": 0,
//   "slug": "god-of-war-1668601262",
//   "first_name": "Cooper",
//   "last_name": "Mullins",
//   "user_name": "",
//   "is_creator": 1,
//   "profile_img": "",
//   "rating": "0.00",
//   "start_time": null,
//   "end_time": null,
//   "is_banner": 0,
//   "tag": "christian,dc"
// },

// ]

const Comic = () => {
  const [show, setShow] = useState(false)
  // const [clearAll, setClearAll] = useState(false);
  // const userData = {};
  // const filterData = {
  //   is_paid: "",
  //   is_mature: "",
  //   page: "",
  //   category: "",
  //   genre_id: "",
  //   sortby: "",
  // };

  // useEffect(() => {
    // dispatch(
    //   getAllData({
    //     is_paid,
    //     is_mature,
    //     page,
    //     category,
    //     genre_id,
    //     sortby,
    //     content_type:
    //       searchParams.get("datatype") === "5"
    //         ? ""
    //         : searchParams.get("datatype"),
    //   })
    // );
  // }, [filterData]);

  // const [params] = useSearchParams()
  const pageName = useSelector(state => state.headerReducer.pageName)
  const {err, err_message} = useSelector(state => state.allDataReducer)
  const dispatch = useDispatch()

  // useEffect(() => {
  //     let page
  //     if (params.get("datatype") === "1") {
  //         page = "Comic"
  //     } else if (params.get("datatype") === "2") {
  //         page = "Art"
  //     } else if (params.get("datatype") === "3") {
  //         page = "E-book"
  //     } else if (params.get("datatype") === "4") {
  //         page = "NFT"
  //     } else if (params.get("datatype") === "5") {
  //         page = "Explore"
  //     }

  //     dispatch(page_name(page))
      
  // }, [pageName])

  useEffect(() => {
      dispatch(
          getGenre()
      )
      setShow(true)
  }, [dispatch])

 //




 //
 const [newpage, setNewPage] = useState(1)
 const [adSlots, setAdSlots] = useState([])
 const { all_data, loading, filterData, load_more } = useSelector(state => state.allDataReducer)

 const {
     is_paid,
     is_mature,
     page,
     category,
     genre_id,
     sortby
 } = filterData

 const showMoreItems = () => {
     setNewPage((prevValue) => prevValue + 1);
     dispatch(
         getAllData({
             is_paid,
             is_mature,
             page: newpage + 1,
             category,
             genre_id,
             sortby,
             content_type: 
            //  searchParams.get('datatype') !== "5" ? searchParams.get('datatype') :
              "1",
         })
     )
 }
   
       return (isWindow() && show &&
    <section className="tf-explore tf-section">
      <div className="themesflat-container pt-80">
        <div className="row">
          <Filters />
          <div className="col-xl-9 col-lg-9 col-md-12">
            <div className="col-sm-12 mb-5 text-right mobilePaddingRemove">
              <Sorting/>
            </div>
            <div className="row">
              {all_data.map((item, index) => (
                <Card classes={"fl-item col-lg-4 col-md-6 col-sm-6 col-6 card_style"} item={item} index={index} />
              ))}
                {load_more && (
              <div className="col-md-12 wrap-inner load-more text-center mg-t-9">
                <div
                  id="load-more"
                  className="sc-button loadmore fl-button pri-3 cursorPointer"
                  onClick={showMoreItems}
                >
                  <span>Load More</span>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comic;
