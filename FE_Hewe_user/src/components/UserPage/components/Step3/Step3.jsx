import { useRef, useState } from "react";
import { PurchasedPackage } from "../PurchasedPackage/PurchasedPackage";
import { Button, Image, message } from "antd";
import "./Step3.scss";
import { axiosService } from "../../../../util/service";
import { useSelector } from "react-redux";

export const Step3 = ({ onNextStep, dataTransaction }) => {
  const inputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isPendingUploadBill, setIsPendingUploadBill] = useState(false);
  const { user } = useSelector((root) => root.userReducer);

  const isDisabledBtnSubmit = image === null;

  const onInputChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleResetField = () => {
    setImage(null);
    setPreview(null);

    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  const handleRequestUploadBill = async () => {
    setIsPendingUploadBill(true);

    try {
      const formData = new FormData();

      formData.append("idTransaction", dataTransaction.id);
      formData.append("userid", user.id);
      formData.append("image", image);

      const res = await axiosService.post(
        "api/depositVND/uploadImageDeposiVND",
        formData
      );
      message.success(res.data.message);
      setIsPendingUploadBill(false);
      handleResetField();
      onNextStep();
    } catch (error) {
      message.error(error.response.data.message);
      setIsPendingUploadBill(false);
    }
  };

  return (
    <div className="step3Container">
      {/* <div className="header">
        <h2 className="titleContainer">Upload bill</h2>
      </div> */}

      <PurchasedPackage dataTransaction={dataTransaction} />

      <div className="uploadBill">
        <input
          type="file"
          style={{ display: "none" }}
          ref={inputRef}
          onChange={onInputChange}
          accept="image/*"
        />
        <Button
          style={{
            width: "100%",
            marginBottom: "12px",
          }}
          onClick={() => {
            inputRef.current.click();
          }}
          disabled={isPendingUploadBill}
        >
          Choose image
        </Button>

        <Button
          style={{
            width: "100%",
            marginBottom: "12px",
          }}
          disabled={isDisabledBtnSubmit}
          loading={isPendingUploadBill}
          onClick={handleRequestUploadBill}
        >
          Upload bill to system
        </Button>

        {image && preview && <Image width={"100%"} src={preview} alt="" />}
      </div>
    </div>
  );
};
