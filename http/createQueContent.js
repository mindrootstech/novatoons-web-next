import axios from "axios";
import { isUserLoggedInToken, base_url } from '../config'

//redux
import { contentRequest } from "../redux/commonReducer";
import { setNewSeriesContent } from "../pages/content/editContentSeriesReducer";

const CreateQueContent = async (data, dispatch, static_id, singleContent) => {
    var formdata = new FormData();
    formdata.append("content_type", data.content_type);
    formdata.append("title", data.title);
    formdata.append("is_paid", data.is_paid);
    formdata.append("tag_ids", data.tag_ids);
    formdata.append("is_available", data.is_available);
    formdata.append("is_downloadable", data.is_downloadable);
    formdata.append("series_id", data.series_id);
    formdata.append("file", data.file);
    formdata.append("cover_image", data?.static_id ? data.cover_image : singleContent.cover_image === data.cover_image ? '' : data.cover_image );
    formdata.append("cover_image_name",data?.static_id ? data.cover_image_name : singleContent.cover_image_name === data.cover_image_name ? '' : data.cover_image_name);
    formdata.append("genre_id", data.genre_id);
    formdata.append("description", data.description);
    formdata.append("sub_genres_id", data.sub_genres_id);
    formdata.append("is_agree", data.is_agree);

    if(data.id) {
      formdata.append('content_id', `${data.id}`)
    }

    if (data.price) {
      formdata.append("price", `${data.price}`);
    }
      let config = {
      baseURL: `${base_url}/createcontent`,
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        token: isUserLoggedInToken(),
      },
      data: formdata,
      onUploadProgress(progressEvent) {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        dispatch(
          contentRequest({
            start:false,
            progress: percent,
            nextContent: false
          })
        );
      },
    };

    let admin_token = sessionStorage.getItem("admin_token");
    let loggedinBy = sessionStorage.getItem("loggedinBy");

    if (admin_token && loggedinBy === "admin") {
      config.headers.admin_token = admin_token;
    }

    try {
        const response = await axios(config)
        if(response.status === 200) {
          
          const newData = {
            id: response.data.body.id,
            title: data.title,
            description: data.description,
            cover_image: data.cover_image,
            cover_image_name: data.cover_image_name,
            file: data.file,
            original_file: data.original_file,
            is_paid: data.is_paid,
            is_available: data.is_available,
            is_downloadable: data.is_downloadable,
            is_agree: data.is_agree,
            series_id: data.series_id,
            tag_ids: data.tag_ids,
            content_type: data.content_type,
            sub_genres_id: data.sub_genres_id,
            price: data.price,
            static_id
          }
          
          if(static_id) {
            dispatch(
              setNewSeriesContent({
                data: newData,
                index: static_id
              })
              )
          }

        }
        return response

      } catch (err) {
        return err?.message
      }    
}

export default CreateQueContent