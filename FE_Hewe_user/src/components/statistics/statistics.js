import React, { useEffect, useState } from "react";
import { HorizontalLine, VerticalLine } from "../svg";
import "./style.scss";
import axios from "axios";
const Statistics = () => {
  const [value, setValue] = useState();
  const supply = async () => {
    try {
      const data = await axios.get(
        `https://api.amchain.net/api/stats/detail?query=supplies`
      );
      setValue(data?.data?.supplies);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    supply();
  }, []);

  const billion = 1000000000;

  console.log(value);
  return (
    <section className="statistics">
      <HorizontalLine />
      <div className="contsection">
        <div className="cont">
          <p>Total Supply</p>
          <div className="d-flex align-items-end">
            <h3>{(value?.totalSupply / billion).toFixed(1)}</h3>
            <p className="contsp">Billion HEWE</p>
          </div>
        </div>
        <div className="d-sm-block d-none">
          <VerticalLine />
        </div>
        <div className="cont">
          <p>Circulating Supply </p>
          <div className="d-flex align-items-end">
            <h3>{(value?.currentCirculation / billion).toFixed(1)}</h3>
            <p className="contsp">Billion HEWE</p>
          </div>
        </div>
        <div className="d-sm-block d-none">
          <VerticalLine />
        </div>
        <div className="cont">
          <p>Burned Supply</p>
          <div className="d-flex align-items-end">
            <h3>{(value?.burnSupply / billion).toFixed(1)}</h3>
            <p className="contsp">Billion HEWE</p>
          </div>
        </div>
        <div className="d-sm-block d-none">
          <VerticalLine />
        </div>
        <div className="cont">
          <p>Maximum Supply</p>
          <div className="d-flex align-items-end">
            <h3>{(value?.maxCap / billion).toFixed(1)}</h3>
            <p className="contsp">Billion HEWE</p>
          </div>
        </div>
      </div>
      <HorizontalLine />
    </section>
  );
};

export default Statistics;
