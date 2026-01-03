import React, { useEffect, useState } from "react";
import { convertStringToHTML } from "../../function/fn";
import { axiosService } from "../../util/service";
import Footer from "../HomePage/Footer";
import Header from "../HomePage/Header";

export default function DetailPage(props) {
  const POST_ID = props.match.params.id;

  const [postDetail, setPost] = useState(undefined);
  const [contentPost, setContentPost] = useState(undefined);

  // top button
  const [showButton, setShowButton] = useState(false);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const getPostDetail = async (id) => {
    try {
      let response = await axiosService.post("api/news/getDetailPosts", {
        idPost: id,
      });
      setPost(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scrollTop();
    getPostDetail(POST_ID);

    window.onscroll = () => {
      if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
  }, []);

  useEffect(() => {
    if (postDetail) {
      const htmlElement = convertStringToHTML(postDetail.detail);
      const temp = new XMLSerializer().serializeToString(htmlElement);
      setContentPost(temp);
    }
  }, [postDetail]);

  useEffect(() => {
    if (contentPost) {
      const containerHeight = document.querySelector(".postDetail-asd").offsetHeight;
      const screenVH = window.innerHeight;
      const headerHeight = window.innerWidth <= 992 ? 120 : 150;
      const x = containerHeight - (screenVH - headerHeight) + 100;
      if (x > 0) {
        document.querySelector(".overlay-bottom").style.height = x + "px";
      }
    }
  }, [contentPost]);

  const contentComponent = (
    <div className="postDetail-asd">
      <div className="container">
        <div className="p-title">
          <h1 className="title">{postDetail?.title}</h1>

          <div className="time">{postDetail?.created_at}</div>
        </div>

        <div className="p-content">
          {contentPost ? <div dangerouslySetInnerHTML={{ __html: contentPost }}></div> : <></>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="news-detail-page">
      <Header titleComponent={contentComponent} />

      <div className="overlay-bottom"></div>

      <Footer />

      {showButton ? (
        <div className="home-totop" onClick={scrollTop}>
          <i className="fa-solid fa-up-long"></i>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
