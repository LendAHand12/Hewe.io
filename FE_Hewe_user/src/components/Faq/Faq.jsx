import React, { useEffect, useState, useRef } from "react";
import arrow from "../../assets/icons/rightarrowfaq.png";
import "./style.scss";
const isSafari = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf("safari") > -1 && ua.indexOf("chrome") < 0;
};
console.log(isSafari);

const Faq = () => {
  const videoParentRef = useRef();
  const [shouldUseImage, setShouldUseImage] = useState(false);

  useEffect(() => {
    const isSafari = () => {
      const ua = navigator.userAgent.toLowerCase();
      return ua.indexOf("safari") !== -1 && ua.indexOf("chrome") === -1;
    };

    if (isSafari() && videoParentRef.current) {
      const player = videoParentRef.current.querySelector("video");

      if (player) {
        player.controls = false;
        player.playsInline = true;
        player.muted = true;
        player.setAttribute("muted", "");
        player.autoplay = true;

        player.addEventListener("loadedmetadata", () => {
          const promise = player.play();
          if (promise !== undefined) {
            promise
              .then(() => {})
              .catch(() => {
                videoParentRef.current.style.display = "none";
                setShouldUseImage(true);
              });
          }
        });
      }
    }
  }, []);
  const data = [
    {
      no: "01",
      heading: "AmChain",
      answer: `Revolutionizing Connectivity with Blockchain Technology AmChain stands at the forefront of the digital revolution, offering a decentralized blockchain platform that redefines connectivity and transparency. Built on the pillars of security, efficiency, and inclusivity, AmChain paves the way for a future where transactions are seamless and trustworthy.<br/><br/> Through its innovative blockchain infrastructure, AmChain enables secure and immutable record-keeping, ensuring the integrity of data across various industries. From finance to supply chain management, AmChain's versatility empowers businesses to streamline operations and enhance trust among stakeholders. <br/><br/> At its core, AmChain prioritizes user autonomy, providing a decentralized network that fosters peer-to-peer interactions without intermediaries. This not only reduces transaction costs but also empowers individuals by giving them control over their digital assets.<br/><br/> With a commitment to technological advancement and community-driven development, AmChain is not just a blockchain—it's a catalyst for change. Join us on our journey to revolutionize connectivity and unlock the full potential of blockchain technology.`,
    },
    {
      no: "02",
      heading: "Revamped Hewe Walking and Game:",
      answer: `Welcome to Hewe Walking and Game, your ultimate destination for next-level fitness and entertainment. Our app has been redesigned from the ground up to offer an immersive experience that blends cutting-edge technology with the joy of physical activity. <br/><br/> Experience the thrill of augmented reality as you explore breathtaking landscapes and tackle exciting challenges right from your own neighborhood. With our AI-powered coaching feature, you'll receive personalized guidance and motivation to help you reach your fitness goals faster than ever before.<br/><br/> But the excitement doesn't stop there – our blockchain-based rewards system lets you earn tokens with every step you take, giving you access to exclusive perks and prizes. Plus, our vibrant community is always there to cheer you on and celebrate your achievements. Sync your favorite fitness wearables with ease and track your progress effortlessly as you move towards a healthier, happier you. And with our gamified features, every walk becomes an adventure as you collect rewards, unlock achievements, and compete with friends on leaderboards. <br/><br/> So why wait? Join us on this exhilarating journey towards a better you. Download Hewe Walking and Game now and let the fun begin!`,
    },
    {
      no: "03",
      heading: "Bridging Blockchain and AI for Next-Generation Solutions",
      answer: `AmChain represents a groundbreaking convergence of blockchain and artificial intelligence (AI), ushering in a new era of technological innovation and efficiency. By seamlessly integrating these two transformative technologies, AmChain offers a dynamic platform that revolutionizes how data is managed, analyzed, and utilized. <br/><br/> At the heart of AmChain lies a powerful synergy between blockchain's decentralized ledger and AI's cognitive capabilities. This unique amalgamation empowers businesses and individuals with unprecedented insights, security, and automation. <br/><br/> Through its blockchain backbone, AmChain ensures the immutability and transparency of data, fostering trust in every transaction and record. Meanwhile, its AI-driven intelligence enhances decision-making processes, optimizes resource allocation, and unlocks new avenues for predictive analytics and personalized experiences. <br/><br/> Whether it's optimizing supply chains, enhancing financial transactions, or revolutionizing healthcare records, AmChain's dual capabilities offer unparalleled solutions across diverse sectors. Its decentralized infrastructure coupled with AI-driven insights not only improves operational efficiency but also fosters innovation and scalability. <br/><br/> AmChain is not just a platform—it's a visionary solution poised to redefine industries and empower users with the full potential of blockchain and AI. Join us as we shape the future of technology, one intelligent transaction at a time.`,
    },
  ];
  const [openIndex, setOpenIndex] = useState(-1);
  const toggleShow = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };
  return (
    <>
      <section className="faq position-relative">
        <div className="breakpoint"></div>
        <div className="position-relative ">
          <div className="contentsbody">
            <div className="heading">
              <h2>Enter HEWE</h2>
            </div>

            <div className="faqcontent">
              {data.map((item, index) => (
                <div className="contbody" key={index}>
                  <div
                    className="flex justify-between"
                    onClick={() => toggleShow(index)}
                  >
                    <div className="flex items-center">
                      <p className="me-4 mb-0">{item?.no}</p>
                      <p className="mb-0">{item?.heading}</p>
                    </div>
                    <div>
                      <img
                        src={openIndex === index ? arrow : arrow}
                        alt=""
                        className={
                          openIndex === index ? "arrow-img" : "arrow-img-open"
                        }
                      />
                    </div>
                  </div>
                  {openIndex === index && (
                    <p
                      className="answer pt-3"
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    ></p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Faq;
