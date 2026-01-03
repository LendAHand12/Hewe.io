import { useEffect, useState } from "react";
import axios from "../../axios";
import { message } from "antd";

export const usePool = () => {
  const [poolHewe, setPoolHewe] = useState(0);
  const [poolUsdt, setPoolUsdt] = useState(0);

  const getPool = async () => {
    try {
      let res = await axios.get(`/getPool?pool=hewe`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setPoolHewe(res.data.data.poolValue);

      let res2 = await axios.get(`/getPool?pool=usdt`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setPoolUsdt(res2.data.data.poolValue);
    } catch (error) {
      console.log(error);
    }
  };

  const hdChange = (token, num) => {
    if (token === "hewe") {
      setPoolHewe(num);
    } else if (token === "usdt") {
      setPoolUsdt(num);
    }
  };

  const hdUpdate = async (token) => {
    try {
      await axios.post(
        `/updatePool`,
        {
          pool: token,
          amount: token == "hewe" ? poolHewe : poolUsdt,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      await getPool(); // TODO nhớ mở lại
      message.destroy();
      message.success("Updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPool();
  }, []);

  // generate data
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const randomOperation = Math.random();
  //     const randomUSDT =
  //       randomOperation > 0.5
  //         ? Math.round(poolUsdt + Math.random() * 50000000)
  //         : Math.round(
  //             poolUsdt - Math.random() * 50000000 <= 0
  //               ? 0
  //               : poolUsdt - Math.random() * 50000000
  //           );

  //     hdChange("usdt", randomUSDT);

  //     const helper = async () => {
  //       await hdUpdate("usdt");
  //     };

  //     helper();
  //   }, 2000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [poolHewe, poolUsdt]);

  return { poolHewe, poolUsdt, hdChange, hdUpdate };
};
