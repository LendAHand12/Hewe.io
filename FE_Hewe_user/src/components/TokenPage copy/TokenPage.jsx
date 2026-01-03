import React, { useEffect, useState } from "react";
import Footer from "../HomePage/Footer";
import Header from "../HomePage/Header";
import TokenComponent from "./TokenComponent";

export default function TokenPage() {
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

    const containerHeight = document.querySelector(
      ".token-component-container"
    ).offsetHeight;
    const screenVH = window.innerHeight;
    const headerHeight = window.innerWidth <= 992 ? 120 : 150;
    const x = containerHeight - (screenVH - headerHeight) + 120;
    if (x > 0) {
      document.querySelector(".overlay-bottom").style.height = x + "px";
    }
  }, []);

  return (
    <div className="token-page">
      <Header titleComponent={<TokenComponent />} />
      <div className="overlay-bottom"></div>
      <Footer />

      {showButton && (
        <div className="home-totop" onClick={scrollTop}>
          <i className="fa-solid fa-up-long"></i>
        </div>
      )}
    </div>
  );
}
