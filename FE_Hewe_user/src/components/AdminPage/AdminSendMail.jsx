import { Button, Input } from "antd";
import React, { useState } from "react";
import { showAlert } from "../../function/showAlert";
import { axiosService } from "../../util/service";

export default function AdminSendMail() {
  const [info, setInfo] = useState({
    email: "",
    title: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!info.email || info.email == "") {
      showAlert("error", "Please enter email address");
      return;
    }

    if (!info.title || info.title == "") {
      showAlert("error", "Please enter title");
      return;
    }

    if (!info.message || info.message == "") {
      showAlert("error", "Please enter content of email");
      return;
    }

    sendMail(info);
  };

  const sendMail = async (data) => {
    setLoading(true);
    try {
      const response = await axiosService.post("api/user/sendMailMessageAdmin", data);
      showAlert("success", response.data.message);

      // clear form
      setInfo({
        email: "",
        title: "",
        message: "",
      });
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-send-mail">
      <h2 className="title">Send email</h2>

      <div className="form">
        <div className="field">
          <label htmlFor="email">Email address</label>
          <Input
            id="email"
            size="large"
            value={info.email}
            onChange={(e) => setInfo({ ...info, email: e.target.value })}
          />
        </div>

        <div className="field">
          <label htmlFor="title">Title</label>
          <Input
            id="title"
            size="large"
            value={info.title}
            onChange={(e) => setInfo({ ...info, title: e.target.value })}
          />
        </div>

        <div className="field">
          <label htmlFor="content">Content</label>
          <Input.TextArea
            rows={6}
            id="content"
            size="large"
            value={info.message}
            onChange={(e) => setInfo({ ...info, message: e.target.value })}
          />
        </div>
      </div>

      <Button
        type="primary"
        size="large"
        style={{ marginTop: 25, width: 150 }}
        onClick={() => handleSubmit()}
        loading={loading}
      >
        Send email
      </Button>
    </div>
  );
}
