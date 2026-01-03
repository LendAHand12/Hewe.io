import { Button, Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ROW_PER_TABLE } from "../../constant/constant";
import { axiosService, DOMAIN } from "../../util/service";
import Header from "../HomePage/Header";
import Footer from "../HomePage/Footer";

export default function NewsPage() {
  const [postsArray, setPostsArray] = useState([]);

  // top button
  const [showButton, setShowButton] = useState(false);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  const getPosts = async (limit, page) => {
    try {
      let response = await axiosService.post("api/news/getPosts", {
        limit,
        page,
      });
      setPostsArray(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scrollTop();
    setCurrent(1);
    getPosts(ROW_PER_TABLE, 1);

    window.onscroll = () => {
      if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
  }, []);

  const onPaginationChange = (page) => {
    setCurrent(page);
    getPosts(ROW_PER_TABLE, page);
  };

  useEffect(() => {
    if (postsArray.length != 0) {
      const containerHeight = document.querySelector(".news-container").offsetHeight;
      const screenVH = window.innerHeight;
      const headerHeight = window.innerWidth <= 992 ? 120 : 150;
      const x = containerHeight - (screenVH - headerHeight) + 100;
      if (x > 0) {
        document.querySelector(".overlay-bottom").style.height = x + "px";
      }
    }
  }, [postsArray]);

  const newsComponent = (
    <div className="news-container">
      <div className="news-title">
        <h2 className="title">News</h2>
      </div>

      <div className="news-list">
        {postsArray.map((item, index) => {
          return (
            <NavLink key={index} to={"/news/" + item.id + "/" + item.url}>
              <div className="news-item">
                <div className="post-image">
                  <img src={DOMAIN + item.image} alt={item.title} />
                </div>
                <div className="post-main">
                  <div className="post-title">{item.title}</div>
                  <div className="post-time">{item.created_at}</div>
                  <div className="post-content">{item.title}</div>
                </div>
              </div>
            </NavLink>
          );
        })}
      </div>

      <Pagination
        defaultCurrent={1}
        total={totalRecord}
        current={current}
        onChange={onPaginationChange}
        showSizeChanger={false}
        showQuickJumper={false}
        className="pagination-box"
        hideOnSinglePage
        itemRender={(_, type, originalElement) => {
          if (type === "prev" && window.innerWidth > 768) {
            return <Button>Previous</Button>;
          }
          if (type === "next" && window.innerWidth > 768) {
            return <Button>Next</Button>;
          }
          return originalElement;
        }}
      />
    </div>
  );

  return (
    <div className="news-page">
      <Header titleComponent={newsComponent} />

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
