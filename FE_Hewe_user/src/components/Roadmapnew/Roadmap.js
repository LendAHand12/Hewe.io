import React, { useEffect, useState } from "react";
import "./style.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { RoadmapArrow } from "../svg";
import side1 from "../../assets/images/img/sided.png";

const Journey = () => {
  return (
    <>
      <section className="journey">
        <div className="headingcont">
          <h2>roadmap</h2>
        </div>
        <div className="mt-5">
          <Journeylist />
        </div>
        {/* <div className="side1">
          <img src={side1} className="side1" />
        </div> */}
      </section>
    </>
  );
};

export default Journey;

const Journeylist = () => {
  var settings = {
    dots: false,
    infinite: false,
    autoplay: false,
    speed: 500,
    dots: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1008,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 705,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const list = [
    {
      date: "April 2020",
      name: "Research Commencement",
      details:
        "Our journey began with extensive research into developing our blockchain network, setting the stage for innovation.",
    },
    {
      date: "February 2021",
      name: "Development Initiation:",
      details:
        "With a solid foundation established, we commenced development, laying the groundwork for our vision to come to fruition.",
    },
    {
      date: "December 2023",
      name: "AmChain Completion",
      details:
        "After years of dedicated effort and refinement, we achieved a significant milestone - the completion of our groundbreaking blockchain network, AmChain.",
    },
    {
      date: "March 2024",
      name: "Official Launch",
      details:
        "A monumental moment as we unveiled AmChain to the world, accompanied by the introduction of our native token, HEWE, ushering in a new era of decentralized possibilities.",
    },
    {
      date: "April 2024",
      name: "First Presales",
      details:
        "Building on the excitement of our launch, we initiated our first presales, inviting early supporters to join us on our journey",
    },
    {
      date: "May 2024",
      name: "Second Presales",
      details:
        "Continuing to expand our community, we launched our second round of presales, offering more individuals the opportunity to participate in our ecosystem.",
    },
    {
      date: "May 2024",
      name: "Exchange Listing",
      details:
        "We listed HEWE on exchanges, enhancing accessibility and liquidity for our growing community.",
    },
    {
      date: "June 2024",
      name: "Event in India",
      details:
        "As part of our global outreach, we hosted an event in India, fostering partnerships and expanding our presence in key markets.",
    },
    {
      date: "July 2024",
      name: "Visa and Master Crypto Card Launch",
      details:
        "In a significant move towards mainstream adoption, we launched our Visa and Master Crypto Card, enabling seamless integration of digital assets into everyday transactions.",
    },
    {
      date: "August 2024",
      name: "Native Wallet Launch",
      details:
        "We introduced our native wallet, offering enhanced security and usability for managing digital assets within the AmChain ecosystem.",
    },
    {
      date: "August 2024",
      name: "Event in Dubai",
      details:
        "Continuing our global expansion, we hosted an event in Dubai, showcasing our vision and engaging with stakeholders in the region.",
    },
    {
      date: "February 2025",
      name: "HEWE Walking App Launch",
      details:
        "Closing out the year with a major milestone, we launched the HEWE Walking App, revolutionizing the way users earn and interact with HEWE tokens through physical activity.",
    },
  ];
  return (
    <>
      <Slider {...settings}>
        {list?.map((item, index) => {
          return (
            <>
              <div className="slidecont" key={index}>
                <div className="d-flex justify-content-center">
                  <h3 className="date">{item?.date}</h3>
                </div>
                <div className="line text-center">
                  <RoadmapArrow />
                </div>
                <div className="px-3">
                  <div className="contboxouter">
                    <div className="middelcont">
                      <div className="contboxinside">
                        {/* <img src={lines} alt="" className="img-fluid lines" /> */}
                        <h3>{item?.name}</h3>
                        <p>{item?.details}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </Slider>
    </>
  );
};
