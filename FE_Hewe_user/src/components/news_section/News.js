import React from "react";
import "./style.scss";
import Header from "../HomePage/Header";
import NewsData from "../newsData/NewsData";
// import Footer1 from "../HomePage/Footer1";
import Footer from "../HomePage/Footer";

function News() {
  return (
    <>
      <Header />
      <section className="news mb-5">
        <div className="headingcont">
          <h2>Updates From the Hewe</h2>
        </div>
        {/* <p className="text-center">
          Lorem ipsum dolor sit amet consectetur enim et cursus dictum ipsum non
          donec. <br /> Elementum mi mauris non libero quam non.
        </p> */}
        <NewsData />
      </section>
      <Footer />
    </>
  );
}

export default News;
