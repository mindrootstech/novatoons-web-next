import React, {Fragment} from 'react'
import Link from 'next/link'

//third party
import { Rating } from "react-simple-star-rating";

//images
import placeholderImage from "../../public/images/avatar/profileimage.png";
import Image from 'next/image';

const Card = ({classes, item, index }) => {
  return (
    <div
    key={index}
    className={classes}
  >
    <div
      className={`sc-card-product style2 mg-bt ${
        item?.feature ? "comingsoon" : ""
      } `}
    >
      <div className="card-media">
        <Link
          href={`${item?.type}/detail/${item?.slug}`}
        >
          <div className="cursorPointer">
            <img
              loading="lazy"
              src={
                item?.cover_image
                  ? item.cover_image
                  : placeholderImage.src
              }
              alt="Novatoons"
            />

            {item?.content_type && (
              <div className="ComicArtBatch">
                <p>
                  {item?.content_type === 1
                    ? "Comic"
                    : item.content_type === 2 && "Art"}
                </p>
              </div>
            )}
          </div>
        </Link>
      </div>
      <div className="card-title">
        <h5>
          <Link
            href={`${item?.type}/detail/${item?.slug}`}
          >
            {item?.title}
          </Link>
        </h5>
      </div>

      <div className="CardGenre mb-3">
        <p>{item?.genre_name}</p>
      </div>

      <div className="meta-info">
        <div className="author">
          <div className="avatar">
            <Link
              href={`/author/${item.user_id}`}
            >
              <Image
                loading="lazy"
                height={50}
                width={50}
                src={
                  item.profile_img
                    ? item.profile_img
                    : placeholderImage.src
                }
                alt="Novatoons"
              />
            </Link>
          </div>
          <div className="info">
            <span>Creator</span>
            <h6>
              <Link
                href={`${process.env.REACT_APP_DEVELOPMENT_PREFIX}/author/${item.user_id}`}
              >
                {item.user_name !== "" && item.is_creator === 1
                  ? item.user_name : item.first_name + " " + item.last_name}
              </Link>
            </h6>
          </div>
        </div>
        <div className="price">
          <h6 className="rating">Rating</h6>

          {1366 < 810 ? (
            <div className="ratingNumber d-flex rating_2">
              <i className="fa fa-star colorYellow"></i>
              <span>{item.total_rating}</span>
            </div>
          ) : (
            <Fragment>
              <Rating
                ratingValue={
                  (parseInt(item.total_rating) * 100) / 5
                }
                allowHalfIcon={true}
                fillColor="#ffd700"
                emptyColor="#808080"
                iconsCount={5}
                size={20}
                readonly={true}
              />
            </Fragment>
          )}
        </div>
      </div>
    </div>
  </div>
  )
}

export default Card