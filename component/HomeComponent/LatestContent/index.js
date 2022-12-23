import React, {useState, Fragment} from "react";

//components
import Card from "../../Card";
 //redux
import { getYoumaylikeData } from "../../../redux/homeReducer";
import { useSelector, useDispatch } from "react-redux";

const LatestContent = () => {

  const dispatch = useDispatch();
  const { data, load_more, loading } = useSelector(
    (state) => state.homeReducer.like_content
  );

  const [page, setPage] = useState(1);

  const handleLoad_more = () => {
    setPage((prev) => prev + 1);
    dispatch(
      getYoumaylikeData({
        page: page + 1,
      })
    );
  };

 
  return (
    <Fragment>
      <section className="tf-section today-pick">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="">
                <h2 className="tf-title pb-11">Latest Content</h2>
                <div className="heading-line s1"></div>
              </div>
            </div>
            {data.map((item, index) => (
                <Card classes={"fl-item col-xl-3 col-lg-4 col-md-6 col-sm-6 col-6 card_style"} item={item} index={index} />
            ))}
            {load_more && (
              <div className="col-md-12 wrap-inner load-more text-center mg-t-9">
                <div
                  id="load-more"
                  className="sc-button loadmore fl-button pri-3 cursorPointer"
                  onClick={handleLoad_more}
                >
                  <span>Load More</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default LatestContent;
