import React from "react";
import "./style.scss";
import NewsData from "../newsData/NewsData";

function HomeNews() {
  return (
    <>
      <section className="blogs">
        <div className="headingcont">
          <h2>Updates From the Hewe</h2>
        </div>
        <NewsData />
      </section>
    </>
  );
}

export default HomeNews;
