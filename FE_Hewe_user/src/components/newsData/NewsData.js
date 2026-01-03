import React, { useEffect, useState } from "react";
import "./style.scss";
import { Blogeye, Bloglogo } from "../svg";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { axiosService, DOMAIN3 } from "../../util/service";

export default function NewsData() {
  const [newsData, setNewsData] = useState();
  const history = useHistory();

  const getData = async () => {
    try {
      const data = await axiosService.get("/getAllBlogs");
      setNewsData(data?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getData();
  }, []);

  console.log(newsData);

  return (
    <>
      <section className="newsdatacont">
        <div className="row">
          {newsData?.map((item, index) => {
            return (
              <div className="col-md-4 col-sm-6 maincont" key={index}>
                <div className="uppercont">
                  <div className="cont">
                    <div>
                      <img src={`${DOMAIN3}/${item?.bannerImage}`} alt="img" />
                    </div>
                    <div className="contents">
                      <h3>{item?.title}</h3>
                      <p>{item?.shortDescription}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex">
                          <div>
                            <Bloglogo />
                          </div>
                          <DateConverter items={item} />
                        </div>
                        <div className="d-flex align-items-center">
                          <div>
                            <Blogeye />
                          </div>
                          <h5 className="ps-2">{item.view}</h5>
                        </div>
                      </div>
                      <div className="btnrep">
                        <button
                          onClick={() =>
                            history.push(`/news-details/${item?._id}`, {
                              state: item,
                            })
                          }
                        >
                          see more
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="col-4"></div>
        </div>
      </section>
    </>
  );
}

export function NewsDataHome() {
  const [newsData, setNewsData] = useState();
  const history = useHistory();

  const getData = async () => {
    try {
      const data = await axiosService.get("/getAllBlogs");
      setNewsData(data?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <section className="newsdatacont newsdatacontHome">
        <div className="row">
          {newsData?.slice(0, 3)?.map((item, index) => {
            return (
              <div className="col-md-4 col-sm-6 maincont" key={index}>
                <div className="uppercont">
                  <div className="cont">
                    <div>
                      <img src={`${DOMAIN3}/${item?.bannerImage}`} alt="img" />
                    </div>
                    <div className="contents h-100">
                      <h3>{item?.title}</h3>
                      <p>{item?.shortDescription}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex">
                          <div>
                            <Bloglogo />
                          </div>
                          <DateConverter items={item} />
                        </div>
                        <div className="d-flex align-items-center">
                          <div>
                            <Blogeye />
                          </div>
                          <h5 className="ps-2">{item.view}</h5>
                        </div>
                      </div>
                      <div className="btnrep">
                        <button
                          onClick={() =>
                            history.push(`/news-details/${item?._id}`, {
                              state: item,
                            })
                          }
                        >
                          see more
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <button className="viewall" onClick={() => history.push("/news")}>
            View All
          </button>
        </div>
      </section>
    </>
  );
}

export function NewsDataSuggest() {
  const [newsData, setNewsData] = useState();
  const history = useHistory();

  const getData = async () => {
    try {
      const data = await axiosService.get("/getAllBlogs");
      setNewsData(data?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getData();
  }, []);

  return (
    <>
      <section className="newsdatacont">
        <div className="row">
          {newsData?.slice(0, 3)?.map((item, index) => {
            return (
              <div className="col-md-4 col-sm-6 maincont" key={index}>
                <div className="uppercont">
                  <div className="cont">
                    <div>
                      <img src={`${DOMAIN3}/${item?.bannerImage}`} alt="img" />
                    </div>
                    <div className="contents h-100">
                      <h3>{item?.title}</h3>
                      <p>{item?.shortDescription}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex">
                          <div>
                            <Bloglogo />
                          </div>
                          <DateConverter items={item} />
                        </div>
                        <div className="d-flex align-items-center">
                          <div>
                            <Blogeye />
                          </div>
                          <h5 className="ps-2">{item.view}</h5>
                        </div>
                      </div>
                      <div className="btnrep">
                        <button
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            history.push(`/news-details/${item?._id}`, {
                              state: item,
                            });
                          }}
                        >
                          see more
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

const DateConverter = (items) => {
  let dateString = items?.items?.createdAt;
  const dateObject = new Date(dateString);
  const day = dateObject.getDate();
  const month = dateObject.toLocaleString("default", { month: "long" });
  const year = dateObject.getFullYear();

  const formattedDate = `${day} ${month}, ${year}`;
  return (
    <>
      <h4>
        AMCHAIN{" "}
        <span>
          <em className="mx-xl-3 mx-1">•</em>
          {formattedDate}
        </span>{" "}
      </h4>
    </>
  );
};
