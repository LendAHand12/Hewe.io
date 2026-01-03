import React from "react";
import Header from "../HomePage/Header";
import "./style.scss";
const Team = () => {
  const images = [
    {
      id: 1,
      img: require("../../assets/teams/Pierre_Nguyen.png"),
      name: "Pierre Nguyen",
      details: "CEO",
    },
    {
      id: 2,
      img: require("../../assets/teams/Sonya_Dang.png"),
      name: "Sonya Dang",
      details: "Director",
    },
    {
      id: 3,
      img: require("../../assets/teams/Sakshi_Aggarwal.png"),
      name: "Sakshi Aggarwal",
      details: "Vice President Technology",
    },
    {
      id: 11,
      img: require("../../assets/teams/An_Khang_Do.png"),
      name: "An Khang Đỗ",
      details: "General Director",
    },
    {
      id: 5,
      img: require("../../assets/teams/Bob_Joyce.png"),
      name: "Bob Joyce",
      details: "USA & Canada Chief Advisor",
    },
    {
      id: 6,
      img: require("../../assets/teams/Krishna_Swarup.png"),
      name: "Krishna Swarup",
      details: "Chief Advisor of South India",
    },
    {
      id: 7,
      img: require("../../assets/teams/Mr_kay.png"),
      name: "Mr. Kay Leak",
      details: "Chief Advisor of Cambodia",
    },
    {
      id: 8,
      img: require("../../assets/teams/Ruchin_Singhal.png"),
      name: "Ruchin Singhal",
      details: "Chief Technical Officer",
    },
    {
      id: 9,
      img: require("../../assets/teams/Himanshu_Singh.png"),
      name: "Himanshu Singh",
      details: "Project Manager",
    },
    {
      id: 10,
      img: require("../../assets/teams/Vijendra_Pratap_Singh.png"),
      name: "Vijendra Pratap Singh",
      details: "AI engineer",
    },
    {
      id: 4,
      img: require("../../assets/teams/Mrs_jyoti.png"),
      name: "Mrs. Jyoti Swarup",
      details: "North India Chief Advisor",
    },

    {
      id: 12,
      img: require("../../assets/teams/Diep_Vinh_Kien.png"),
      name: "Diệp Vĩnh Kiên",
      details: "Chief Technology Officer",
    },
  ];
  return (
    <>
      <Header />
      <section className="team">
        <div className="row align-items-center justify-content-center">
          {images.map((item, index) => (
            <div
              key={index}
              className="col-xl-3 col-md-4 col-sm-6 membercont h-100"
            >
              <div className="memberteam">
                <div>
                  <img src={item?.img} alt="" className="img-fluid" />
                </div>
                <div className="details">
                  <h3 style={{ color: "#b19a43" }}>{item?.name}</h3>
                  <p>{item?.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Team;
