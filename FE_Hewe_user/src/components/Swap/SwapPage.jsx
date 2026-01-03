import React, { useEffect, useState } from "react";
import Footer from "../HomePage/Footer";
import Header from "../HomePage/Header";
import TokenComponent from "./SwapComponent";

export default function SwapPage() {
  const [showButton, setShowButton] = useState(false);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollTop();

    window.onscroll = () => {
      if (
        document.body.scrollTop > 200 ||
        document.documentElement.scrollTop > 200
      )
        setShowButton(true);
      else setShowButton(false);
    };

    const containerElement = document.querySelector(
      ".token-component-container"
    );

    let containerHeight;
    if (containerElement !== null) {
      containerHeight = containerElement.offsetHeight;
      // Now you can use containerHeight safely
    } else {
      console.error(
        "Element with class 'token-component-container' not found."
      );
    }
    const screenVH = window.innerHeight;
    const headerHeight = window.innerWidth <= 992 ? 120 : 150;
    const x = containerHeight - (screenVH - headerHeight) + 120;
    if (x > 0) {
      document.querySelector(".overlay-bottom").style.height = x + "px";
    }
  }, []);

  return (
    <div className="token-page">
      {/* <Header titleComponent={<TokenComponent />} /> */}
      <div className="overlay-bottom"></div>
      {/* <Footer /> */}

      {showButton && (
        <div className="home-totop" onClick={scrollTop}>
          <i className="fa-solid fa-up-long"></i>
        </div>
      )}
    </div>
  );
}
