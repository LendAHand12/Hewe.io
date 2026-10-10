import { Button, Drawer, Input, Popconfirm, Tag } from "antd";
import { useEffect, useRef, useState } from "react";
import { convertTimeCreateAt } from "../../utils/format";

const { TextArea } = Input;

export const TicketThreadDrawer = ({
  isOpen,
  onClose,
  ticket,
  messages,
  isLoading,
  isSending,
  isClosing,
  onSendMessage,
  onCloseTicket,
}) => {
  const [messageText, setMessageText] = useState("");
  const messageListRef = useRef(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const isClosed = ticket?.status === "closed";

  const handleSend = () => {
    if (messageText.trim() === "") return;
    onSendMessage(messageText);
    setMessageText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Drawer
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>{ticket?.subject}</span>
          {ticket && (
            <Tag color={isClosed ? "default" : "blue"}>{isClosed ? "Closed" : "Open"}</Tag>
          )}
        </div>
      }
      placement="right"
      width={520}
      open={isOpen}
      onClose={onClose}
      extra={
        !isClosed && (
          <Popconfirm
            title="Close this ticket?"
            description="User will no longer be able to send messages after this."
            onConfirm={onCloseTicket}
            okText="Close ticket"
            cancelText="Cancel"
          >
            <Button danger loading={isClosing}>
              Close ticket
            </Button>
          </Popconfirm>
        )
      }
    >
      <div style={{ marginBottom: "8px", opacity: 0.7 }}>
        {ticket?.userName} · {ticket?.userEmail}
      </div>

      <div
        ref={messageListRef}
        style={{
          height: "60vh",
          overflowY: "auto",
          border: "1px solid #f0f0f0",
          borderRadius: "8px",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : messages.length === 0 ? (
          <div>No messages yet.</div>
        ) : (
          messages.map((msg) => {
            const isAdminMsg = msg.senderType === "admin";
            return (
              <div
                key={msg._id}
                style={{ alignSelf: isAdminMsg ? "flex-end" : "flex-start", maxWidth: "75%" }}
              >
                <div style={{ fontSize: "12px", opacity: 0.6, marginBottom: "4px" }}>
                  {isAdminMsg ? "You (admin)" : msg.senderName || "User"} ·{" "}
                  {convertTimeCreateAt(msg.createdAt)}
                </div>
                <div
                  style={{
                    background: isAdminMsg ? "#1677ff" : "#f0f0f0",
                    color: isAdminMsg ? "#fff" : "#000",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.message}
                  {msg.images?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                      {msg.images.map((path) => {
                        const src = `${process.env.REACT_APP_API_URL}${path}`;
                        return (
                          <a key={path} href={src} target="_blank" rel="noopener noreferrer">
                            <img
                              src={src}
                              alt="attachment"
                              style={{ maxWidth: "160px", maxHeight: "160px", borderRadius: "6px", objectFit: "cover", display: "block" }}
                            />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ marginTop: "12px" }}>
        {isClosed ? (
          <div style={{ textAlign: "center", padding: "8px", opacity: 0.7 }}>
            This ticket is closed.
          </div>
        ) : (
          <div style={{ display: "flex", gap: "8px" }}>
            <TextArea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Reply to user..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={isSending}
            />
            <Button type="primary" onClick={handleSend} loading={isSending}>
              Send
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
};
