import "./BuyToken.scss";
import { Step1, Step2, Step3, Step4 } from "..";
import { useEffect, useState } from "react";
import { axiosService } from "../../../../util/service";
import { Step5 } from "../Step5/Step5";

export const BuyToken = ({ amount, onCloseModalWhenCancel, namePackage }) => {
  const [step, setStep] = useState(0);
  const [dataTransaction, setDataTransaction] = useState(null);

  const handleCheckTransaction = async () => {
    await axiosService
      .post("api/depositVND/checkTransactionDepositVnd")
      .then((res) => {
        const { type_admin, type_user, images } = res.data.data;
        setDataTransaction(res.data.data);

        if (type_admin === 0 && type_user === 0) {
          setStep(2);
        } else if (type_admin === 2 && type_user === 0 && images === null) {
          setStep(3);
        } else if (type_admin === 2 && type_user === 0 && images !== null) {
          setStep(4);
        } else {
          // nothing
        }
      })
      .catch((error) => {
        if (error.response.data.message === "User is not transaction") {
          setStep(1);
        } else {
          setStep(-1); // -1 when api error
        }
      });
  };

  useEffect(() => {
    handleCheckTransaction();
  }, []);

  switch (step) {
    case 1:
      return (
        <Step1
          onNextStep={handleCheckTransaction}
          amount={amount}
          namePackage={namePackage}
        />
      );

    case 2:
      return (
        <Step2
          dataTransaction={dataTransaction}
          onNextStep={handleCheckTransaction}
          onCloseModalWhenCancel={onCloseModalWhenCancel}
        />
      );

    case 3:
      return (
        <Step3
          dataTransaction={dataTransaction}
          onNextStep={handleCheckTransaction}
        />
      );

    case 4:
      return <Step4 dataTransaction={dataTransaction} />;

    case -1:
      return <div className="centerMessageContainer">Try again!</div>;

    default:
      return <div className="centerMessageContainer">Checking ...</div>;
  }
};
