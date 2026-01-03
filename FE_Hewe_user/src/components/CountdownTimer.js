import { useEffect, useRef, useState } from "react";
import Countdown from "react-countdown";
import { axiosService } from "../util/service.js";

import { toast } from "react-toastify";
import Overlay from "./Overlay.js";
const CountdownTimer = ({ totalSec, otpData }) => {
  console.log("email is ", otpData?.email);
  const countRef = useRef("");
  const [restart, setRestart] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [timee, setTime] = useState(Date.now() + totalSec);
  // console.log(countRef);
  const resendVerificationCode = (e, apiii) => {
    e.preventDefault();
    resendOTP();
    setTime(Date.now() + totalSec);
    // apiii.start();
  };

  const renderer = ({ hours, minutes, seconds, completed, api }) => {
    if (completed) {
      // console.log(api);
      return (
        <div>
          <div
            className="text-white text-center"
            onClick={(e) => resendVerificationCode(e, api)}
          >
            Didn't get the code? <span> Resend</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-white">
          Resend in&nbsp;
          <span>{minutes > 9 ? minutes : `0${minutes}`}</span>
          <span>{" : "}</span>
          <span>{seconds > 9 ? seconds : `0${seconds}`}</span>
        </div>
      );
    }
  };

  const resendOTP = () => {
    let resData = {
      email: otpData.email,
    };
    setIsLoading(true);

    axiosService
      .post("/sendOTP", resData)
      .then((res) => {
        toast.success(`${res.data.message}`);
        setIsLoading(false);
      })

      .catch((error) => {
        setIsLoading(false);
        if (error?.response?.data?.errors) {
          toast.error(`${error.response.data.errors[0].msg}`);
        } else {
          toast.error(`${error?.response?.data?.message}`);
        }
      });
  };

  useEffect(() => {
    if (restart) {
      countRef?.current?.start();
    }
  }, [restart, timee]);

  return (
    <>
      <Countdown
        date={timee}
        renderer={renderer}
        autoStart={false}
        ref={countRef}
      ></Countdown>
      {isLoading && <Overlay />}
    </>
  );
};

export default CountdownTimer;
