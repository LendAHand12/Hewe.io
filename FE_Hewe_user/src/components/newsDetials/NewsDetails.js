import React, { useEffect } from "react";
import "./style.scss";
import Footer1 from "../HomePage/Footer1.js";
import Header from "../HomePage/Header.jsx";
import link from "../../assets/images/img/Link.svg";
import logo from "../../assets/images/img/logo.svg";
import { NewsDataSuggest } from "../newsData/NewsData.js";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min.js";
import { axiosService, DOMAIN3 } from "../../util/service.js";

function NewsDetails() {
  const location = useLocation();

  // const GetData = async () => {
  //   try {
  //     const data = await axiosService.get(`/`);
  //   } catch (error) {}
  // };

  const { state } = location;
  const data = state?.state;

  let dateString = data?.createdAt;
  const dateObject = new Date(dateString);
  const day = dateObject.getDate();
  const month = dateObject.toLocaleString("default", { month: "long" });
  const year = dateObject.getFullYear();

  const formattedDate = `${day} ${month}, ${year}`;

  let keywords = data?.keywords.toString();
  let arr = new Array();
  arr = keywords?.split(",");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Header />
      <section className="blogDetails">
        <div className="row">
          <div className="col-lg-3 col-md-5">
            <div className="leftside">
              {/* <div className="keycont">
                <div className="flex justify-content-between align-items-center">
                  <h4>Danh mục</h4>
                  <div>
                    <img src={link} alt="" />
                  </div>
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: data?.tableContent }}
                ></div>
              </div> */}
              <div className="keycont">
                <div className="flex justify-content-between align-items-center">
                  <h4>Keyword</h4>
                </div>
                <ul>
                  {arr?.map((item) => {
                    return (
                      <>
                        <li>{item}</li>
                      </>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-9 col-md-7 rightside">
            {/* <p className="dname">Lorem ipsum</p> */}
            <h2>{data?.title}</h2>
            <div className="datas">
              <div>
                <img src={logo} alt="" />
              </div>
              <div className="ms-3">
                <h6>Posted by</h6>
                <h3>{data?.authorName}</h3>
              </div>
              <div className="ms-3">
                <h6>Date created</h6>
                <h3>{formattedDate}</h3>
              </div>
              <div className="ms-3">
                <h6>View</h6>
                <h3>{data?.view}</h3>
              </div>
            </div>
            <div className="my-5">
              <img
                src={`${DOMAIN3}/${data?.bannerImage}`}
                alt="img"
                className="img-fluid"
              />
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: data?.longDescription }}
            ></div>
          </div>
        </div>
        <div className="rel">
          <h2>Related Posts</h2>
        </div>
        <NewsDataSuggest />
      </section>
      <Footer1 />
    </>
  );
}

export default NewsDetails;
