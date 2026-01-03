import { Button, InputNumber, Radio } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useProfile } from "../../../hooks";
import { axiosService } from "../../../util/service";
import socket from "../../../util/socket";
import HistoryTable from "./HistoryTable";
import HistoryTableF1 from "./HistoryTableF1";
import ModalConfirm from "./ModalConfirm";

export default function HeweDBMain() {
  const [v, setV] = useState({
    amountHEWE: undefined,
    amountUSDT: undefined,
    amountAMC: undefined,
    percent: 10,
    year: 1,
  });
  const { profile } = useSelector((state) => state.userReducer);
  const { handleGetProfile } = useProfile();
  const [open, setOpen] = useState(false);
  const [k, setK] = useState(0);
  const totalHewe = profile ? profile.heweBalance + profile.heweDeposit : 0;

  let [HEWE_RATE, setHEWE_RATE] = useState(0);
  let [AMC_RATE, setAMC_RATE] = useState(0);

  const round = (num) => {
    try {
      if (isNaN(num)) return 0;
      return Math.floor(num * 100) / 100;
    } catch (error) {
      return 0;
    }
  };
  const roundDown = (num) => Math.floor(num * 100) / 100;
  const roundDisplay = (value) => {
    if (Number.isInteger(value)) {
      return Number(value).toLocaleString("en-US").replaceAll(",", " ");
    } else
      return Number(roundDown(value))
        .toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })
        .replaceAll(",", " ");
  };

  const hdChangeHEWE = (num) => {
    let hewe = num;
    let usdt = round(hewe * HEWE_RATE);
    let amc = round(usdt / AMC_RATE);

    setV({
      ...v,
      amountHEWE: hewe,
      amountUSDT: usdt,
      amountAMC: amc,
    });
  };

  const hdChangeAMC = (num) => {
    let amc = num;
    let usdt = round(amc * AMC_RATE);
    let hewe = round(usdt / HEWE_RATE);

    setV({ ...v, amountHEWE: hewe, amountUSDT: usdt, amountAMC: amc });
  };

  const hdChangeUSDT = (num) => {
    let usdt = num;
    let hewe = round(usdt / HEWE_RATE);
    let amc = round(usdt / AMC_RATE);

    setV({
      ...v,
      amountHEWE: hewe,
      amountUSDT: usdt,
      amountAMC: amc,
    });
  };

  const isUSDTError = () => {
    if (v.amountUSDT != undefined && v.amountUSDT < 500) return true;
    else return false;
  };

  const renderUSDTError = () => {
    if (isUSDTError())
      return <p className="p-error">Minimum amount 500 USDT</p>;
    else return <></>;
  };

  const isHEWEError = () => {
    if (v.amountHEWE != undefined && v.amountHEWE > totalHewe) return true;
    else return false;
  };

  const renderHEWEError = () => {
    if (isHEWEError())
      return <p className="p-error">Insufficient balance on HEWE</p>;
    else return <></>;
  };

  const isAMCError = () => {
    if (v.amountAMC != undefined && v.amountAMC > profile?.amcBalance)
      return true;
    else return false;
  };

  const renderAMCError = () => {
    if (isAMCError())
      return <p className="p-error">Insufficient balance on AMC</p>;
    else return <></>;
  };

  const getPrice = async () => {
    try {
      let res1 = await axiosService.get(`/v2/getConfigPrice?token=hewe`);
      let res2 = await axiosService.get(`/v2/getConfigPrice?token=amc`);
      setHEWE_RATE(Number(res1.data.data));
      setAMC_RATE(Number(res2.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetProfile();
    getPrice();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      socket.on("newPrice", (data) => {
        let percent = 10;

        if (
          Number(data.priceAMC) !== AMC_RATE ||
          Number(data.priceHEWE) !== HEWE_RATE
        ) {
          // trường hợp tỉ giá thay đổi
          setAMC_RATE(Number(data.priceAMC));
          setHEWE_RATE(Number(data.priceHEWE));

          if (v.amountUSDT * 2 >= 2000) {
            percent = v.year === 1 ? 20 : 30; // 20% cho 1 năm, 30% cho 2 năm
          } else {
            percent = v.year === 1 ? 10 : 20; // 10% cho 1 năm, 20% cho 2 năm
          }

          let usdt = v.amountUSDT;
          let hewe = round(usdt / Number(data.priceHEWE));
          let amc = round(usdt / Number(data.priceAMC));

          setV({
            ...v,
            amountHEWE: hewe,
            amountUSDT: usdt,
            amountAMC: amc,
            percent: percent,
          });
        } else {
          // trường hợp tỉ giá không đổi
          if (v.amountUSDT * 2 >= 2000) {
            percent = v.year === 1 ? 20 : 30; // 20% cho 1 năm, 30% cho 2 năm
          } else {
            percent = v.year === 1 ? 10 : 20; // 10% cho 1 năm, 20% cho 2 năm
          }

          setV({ ...v, percent: percent });
        }
      });
    }, 100);
    return () => {
      socket.off("newPrice");
      clearTimeout(timeout);
    };
  }, [v.amountUSDT, AMC_RATE, HEWE_RATE, v.amountHEWE, v.amountAMC, v.year]);

  let inputStyle = {
    width: "100%",
    backgroundColor: "transparent",
    border: "1px solid #2e2e2e",
    outline: "none",
    fontSize: "1.2rem",
    padding: "5px 10px",
    fontWeight: "bold",
    borderRadius: "5px",
    marginTop: "2px",
  };

  return (
    <div className="HeweDBMainJ24">
      <h3 className="title">HEWE DB</h3>

      <div className="ipfWrap">
        <div className="ipf">
          <div className="labelWrap">
            <label htmlFor="">Amount HEWE</label>
            <p>
              <span style={{ color: "grey", fontWeight: "normal" }}>
                Available:
              </span>{" "}
              <span>{roundDisplay(totalHewe)}</span>
            </p>
          </div>

          <input
            type="text"
            style={inputStyle}
            value={v.amountHEWE}
            onChange={(e) => hdChangeHEWE(e.target.value)}
            min={0}
          />
          {renderHEWEError()}
        </div>

        <div className="ipf">
          <div className="labelWrap">
            <label htmlFor="">Amount USDT</label>
            <p>
              <span style={{ color: "grey", fontWeight: "normal" }}>
                Price:
              </span>{" "}
              <span>1 HEWE = {HEWE_RATE} USDT</span>
            </p>
          </div>

          <input
            type="text"
            style={inputStyle}
            value={v.amountUSDT}
            onChange={(e) => hdChangeUSDT(e.target.value)}
            min={0}
          />
          {renderUSDTError()}
        </div>

        <div className="ipf">
          <div className="labelWrap">
            <label htmlFor="">Amount AMC</label>
            <p>
              <span style={{ color: "grey", fontWeight: "normal" }}>
                Available:
              </span>{" "}
              <span>{roundDisplay(profile?.amcBalance)}</span>
            </p>
          </div>

          <input
            type="text"
            style={inputStyle}
            value={v.amountAMC}
            onChange={(e) => hdChangeAMC(e.target.value)}
            min={0}
          />
          {renderAMCError()}
        </div>

        <div className="ipf">
          <div className="labelWrap">
            <label htmlFor="">Amount USDT</label>
            <p>
              <span style={{ color: "grey", fontWeight: "normal" }}>
                Price:
              </span>{" "}
              <span>1 AMC = {AMC_RATE} USDT</span>
            </p>
          </div>

          <input
            type="text"
            style={inputStyle}
            value={v.amountUSDT}
            onChange={(e) => hdChangeUSDT(e.target.value)}
            min={0}
          />
          {renderUSDTError()}
        </div>

        <div
          className="ipf"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="labelWrap">
            <label htmlFor="">Duration Terms</label>
          </div>
          <Radio.Group
            options={[
              {
                label: "1 year",
                value: 1,
              },
              {
                label: "2 years",
                value: 2,
              },
            ]}
            value={v.year}
            onChange={({ target: { value } }) => {
              setV({ ...v, year: value });
            }}
            optionType="button"
            buttonStyle="solid"
            size="large"
          />
        </div>

        <div className="ipf">
          <div className="labelWrap">
            <label htmlFor="">Loan Acceptance</label>
          </div>
          <InputNumber
            controls={false}
            size="large"
            style={{ width: "100%" }}
            value={v.percent + "%"}
            min={10}
            max={30}
            readOnly
            disabled
          />
        </div>

        <div className="ipf btn">
          <Button
            type="primary"
            size="large"
            style={{ color: "black", fontWeight: 600, width: 200 }}
            disabled={
              isHEWEError() ||
              isUSDTError() ||
              isAMCError() ||
              v.amountHEWE == undefined ||
              v.amountUSDT == undefined ||
              v.amountAMC == undefined
            }
            onClick={() => setOpen(true)}
          >
            Continue
          </Button>
        </div>
      </div>

      <HistoryTable
        {...{ roundDisplay, handleGetProfile, round, HEWE_RATE, AMC_RATE }}
        key={k}
      />
      <HistoryTableF1 {...{ roundDisplay }} key={k} />

      <ModalConfirm
        {...{
          open,
          setOpen,
          v,
          round,
          roundDisplay,
          setV,
          handleGetProfile,
          setK,
        }}
      />
    </div>
  );
}
