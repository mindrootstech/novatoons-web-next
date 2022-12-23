import React, { useState, useEffect } from "react";

//component
import Filters from "../component/Filters";
import Sorting from "../component/Sorting";
import Card from "../component/Card";
import { isWindow } from "../utils/window";
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
const data = [
  {
      "id": 8,
      "genre_id": 4,
      "created_at": "2022-11-16T12:31:49.000Z",
      "type": "series",
      "series_id": 0,
      "status": 1,
      "file_uploaded": "1",
      "is_mature": 0,
      "total_comments": 0,
      "file_size": "76.92",
      "genre_name": "Comedy",
      "price": "0.00",
      "is_paid": 0,
      "title": "Take Away Products",
      "viewcount": 1,
      "user_id": 13,
      "content_type": 1,
      "cover_image": "https://novatoons.sfo3.digitaloceanspaces.com/dev/cover/cover-img-20221116T123149192Z263654.png",
      "total_rating": "0.00",
      "favourite_count": 0,
      "slug": "take-away-products-1668601909",
      "first_name": "Cooper",
      "last_name": "Mullins",
      "user_name": "",
      "is_creator": 1,
      "profile_img": "",
      "rating": "0.00",
      "start_time": null,
      "end_time": null,
      "is_banner": 0,
      "tag": "ghost"
  },
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
// }
]

const Explore = () => {
  const [show,setShow] = useState(false)
  const [clearAll, setClearAll] = useState(false);
  const pageName = useSelector(state => state.headerReducer.pageName)
  const { all_data, loading, filterData, load_more } = useSelector(state => state.allDataReducer)

 const {
     is_paid,
     is_mature,
     page,
     category,
     genre_id,
     sortby
 } = filterData
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(
        getGenre()
    )
    setShow(true)
}, [dispatch])
 
useEffect(()=>{
setShow(true)
},[])
 
if (isWindow() && show) {
  return (
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
            </div>
          </div>
        </div>
      </div>
    </section>
  ) }
};

export default Explore;
