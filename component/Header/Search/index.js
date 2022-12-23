import React, { useState, useRef } from "react";
import Link from 'next/link'
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";

//third-party
import InfiniteScroll from "react-infinite-scroll-component";
//redux
import {
  resettypes,
  modelShow,
  page_name,
  toggleMenus,
  idupdate,
  notificationBar,
  searchBarAction
} from "../../../redux/headerReducer";
import { searchData, resetFilterd } from "../../../redux/commonReducer";
import Loader from "../../loader/loader";
// const filteredData = [
//   {
//     id: 8,
//     genre_id: 4,
//     created_at: "2022-11-16T12:31:49.000Z",
//     type: "series",
//     series_id: 0,
//     status: 1,
//     file_uploaded: "1",
//     is_mature: 0,
//     total_comments: 0,
//     file_size: "76.92",
//     genre_name: "Comedy",
//     price: "0.00",
//     is_paid: 0,
//     title: "Take Away Products",
//     viewcount: 1,
//     user_id: 13,
//     content_type: 1,
//     cover_image:
//       "https://novatoons.sfo3.digitaloceanspaces.com/dev/cover/cover-img-20221116T123149192Z263654.png",
//     total_rating: "0.00",
//     favourite_count: 0,
//     slug: "take-away-products-1668601909",
//     first_name: "Cooper",
//     last_name: "Mullins",
//     user_name: "",
//     is_creator: 1,
//     profile_img: "",
//     rating: "0.00",
//     start_time: null,
//     end_time: null,
//     is_banner: 0,
//     tag: "ghost",
//   },
//   {
//     id: 7,
//     genre_id: 4,
//     created_at: "2022-11-16T12:21:03.000Z",
//     type: "series",
//     series_id: 0,
//     status: 1,
//     file_uploaded: "1",
//     is_mature: 0,
//     total_comments: 0,
//     file_size: "65.31",
//     genre_name: "Comedy",
//     price: "0.00",
//     is_paid: 0,
//     title: "God of War",
//     viewcount: 1,
//     user_id: 13,
//     content_type: 1,
//     cover_image:
//       "https://novatoons.sfo3.digitaloceanspaces.com/dev/cover/cover-img-20221116T122102625Z156603.jpeg",
//     total_rating: "0.00",
//     favourite_count: 0,
//     slug: "god-of-war-1668601262",
//     first_name: "Cooper",
//     last_name: "Mullins",
//     user_name: "",
//     is_creator: 1,
//     profile_img: "",
//     rating: "0.00",
//     start_time: null,
//     end_time: null,
//     is_banner: 0,
//     tag: "dc",
//   },
// ];

const Search = () => {
  const dispatch = useDispatch() 
  // const [searching, setSearching] = useState(false);
  const [searchingInput, setSearchingInput] = useState(false);
  // const [loading, setLoading] = useState(false);
  const headerReducer = useSelector((state) => state.headerReducer);

  const { filteredData, loading, searching, load_more, page } = useSelector(
    (state) => state.commonReducer
  );
  
  const menuLeft = useRef(null);
  const btnToggle = useRef(null);
  const btnSearch = useRef(null);

  const menuToggle = () => {
    setMenuState((prev) => !prev);
  };

  const handleToggleSearch = () => {
    dispatch(
      searchBarAction(!headerReducer.searchBar)
    )
    if (!headerReducer.searchBar) {
      dispatch(resetFilterd());
    }
  }

  const fetchMoreData = () => {
    dispatch(
      searchData({
        page: page + 1,
      })
    );
  };
  const handeSerachBar = (e) => {
    if (e.target.value === "") {
      dispatch(resetFilterd());
    } else {
      dispatch(
        searchData({
          page: 1,
          keyword: e.target.value,
        })
      );
    }
  };

  return (
    <>
        <div className="header-search flat-show-search" id="s1">
          <div
            className="show-search header-search-trigger cursorPointer"
            onClick={handleToggleSearch}
          >
            <i className="far fa-search"></i>
          </div>
          {headerReducer.searchBar && (
            <div className="top-search active">
              <input
                type="search"
                id="s"
                className={
                  filteredData.length !== 0 ||
                  (searching && filteredData.length === 0)
                    ? "search-field notRedius"
                    : "search-field"
                }
                placeholder="Search..."
                title="Search for"
                required=""
                onChange={handeSerachBar}
                // autoFocus={searchingInput}
                // onBlur={() => setSearchingInput(false)}
              />

              {loading && page === 0 ? (
                <div className="searchResults LoaderScrolling">
                  <div className="ResultDetails">
                    <Loader />
                  </div>
                </div>
              ) : filteredData.length === 0 && searching ? (
                <div className="NotFoundData searchResults">
                  <div className="ResultDetails">
                    <p> Data Not Found </p>
                  </div>
                </div>
              ) : (
                filteredData.length !== 0 && (
                  <div className="searchResults">
                    <ul id="searchResulsCont" className="searchResulsContW">
                      <InfiniteScroll
                        scrollableTarget="searchResulsCont"
                        endMessage={
                          <div className="text-center endListMessage pb-0 mt-4">
                            {filteredData.length === 0 ? (
                              <p> Data Not Found </p>
                            ) : (
                              <p> No more results</p>
                            )}
                          </div>
                        }
                        dataLength={filteredData.length}
                        next={fetchMoreData}
                        hasMore={load_more}
                        loader={
                          <div className="spinner-border pColor" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        }
                      >
                        {filteredData.map((item, index) => {
                          return (
                            <li
                              key={`filteredData${index}`}
                              className="cursorPointer"
                              // onClick={(e) => searchBtn(e, item)}
                            >
                              <Link href={`/${item.type}/detail/${item.slug}`}>
                                <div className="SearchResult">
                                  <div className="leftPart d-flex align-items-center">
                                    <div className="AvatarResult">
                                      <Image
                                        loading="lazy"
                                        className="w100"
                                        height={44}
                                        width={44}
                                        src={item.cover_image}
                                        alt={item.title}
                                      />
                                    </div>
                                    <div className="ResultDetails">
                                      <p>{item.title}</p>
                                    </div>
                                  </div>
                                  <span className="batch searchBatch">
                                    {item.content_type === 1 ? "Comic" : "Art"}
                                  </span>
                                </div>
                              </Link>
                            </li>
                          );
                        })}
                      </InfiniteScroll>
                    </ul>
                  </div>
                )
              )}
            </div>
          )}
        </div>
    </>
  );
};

export default Search;
