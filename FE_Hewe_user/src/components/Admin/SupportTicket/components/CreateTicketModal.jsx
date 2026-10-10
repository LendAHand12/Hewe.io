import { Input } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "../../..";
import { createTicketAPI } from "../../../../services/ticketService";
import { TicketImagePicker } from "./TicketImagePicker";

const { TextArea } = Input;

export const CreateTicketModal = ({ isOpen, onClose, onCreated }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisabled = subject.trim() === "" || message.trim() === "";

  const handleReset = () => {
    setSubject("");
    setMessage("");
    setImages([]);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    handleReset();
    onClose();
  };

  const handleSubmit = async () => {
    if (isDisabled || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await createTicketAPI({
        subject: subject.trim(),
        message: message.trim(),
        images,
      });

      toast.success(res.data.message);
      const newTicketId = res.data.data?._id;
      handleReset();
      setIsSubmitting(false);
      onCreated(newTicketId);
    } catch (error) {
      setIsSubmitting(false);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Create support ticket"
      onConfirm={handleSubmit}
      onCancel={handleClose}
      confirmLoading={isSubmitting}
      isDisabledBtn={isDisabled}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <div style={{ marginBottom: "6px" }}>Subject</div>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="What do you need help with?"
            maxLength={150}
          />
        </div>
        <div>
          <div style={{ marginBottom: "6px" }}>Message</div>
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your issue in detail..."
            rows={5}
            maxLength={2000}
          />
        </div>
        <div>
          <div style={{ marginBottom: "6px" }}>Images (optional)</div>
          <TicketImagePicker
            files={images}
            onChange={setImages}
            maxFiles={5}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </Modal>
  );
};
