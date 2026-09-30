import { Input, Tag } from "antd";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../../..";
import {
  getTicketMessagesAPI,
  sendTicketMessageAPI,
} from "../../../../services/ticketService";
import { convertTimeCreateAt } from "../../../../util/adminBizpointUtils";

const { TextArea } = Input;
const POLL_INTERVAL_MS = 6000;

export const TicketThread = ({ ticketId, onBack }) => {
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messageListRef = useRef(null);
  const intervalRef = useRef(null);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  const fetchMessages = async ({ silent } = {}) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await getTicketMessagesAPI({ ticketId, limit: 200, page: 1 });
      setMessages(res.data.data.array || []);
      setTicket(res.data.data.ticket);
      if (!silent) setIsLoading(false);
      setTimeout(scrollToBottom, 0);
    } catch (error) {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    intervalRef.current = setInterval(() => {
      fetchMessages({ silent: true });
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, [ticketId]);

  const handleSend = async () => {
    if (messageText.trim() === "" || isSending) return;

    setIsSending(true);
    try {
      await sendTicketMessageAPI({ ticketId, message: messageText.trim() });
      setMessageText("");
      await fetchMessages({ silent: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isClosed = ticket?.status === "closed";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "75vh" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "12px",
          justifyContent: 'space-between'
        }}
      >
        <Button style={{ width: 'fit-content', padding: '0 24px' }} onClick={onBack}>{"< Back"}</Button>
        <div style={{ fontSize: "18px", fontWeight: 600 }}>
          {ticket?.subject || "..."}
        </div>
        {ticket && (
          <Tag color={isClosed ? "default" : "blue"}>
            {isClosed ? "Closed" : "Open"}
          </Tag>
        )}
      </div>

      <div
        ref={messageListRef}
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "8px",
          padding: "16px",
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
            const isMine = msg.senderType === "user";
            return (
              <div
                key={msg._id}
                style={{
                  alignSelf: isMine ? "flex-end" : "flex-start",
                  maxWidth: "70%",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    opacity: 0.7,
                    marginBottom: "4px",
                    textAlign: isMine ? "right" : "left",
                  }}
                >
                  {isMine ? "You" : "Support"} ·{" "}
                  {convertTimeCreateAt(msg.createdAt)}
                </div>
                <div
                  style={{
                    background: isMine ? "#1f6feb" : "rgba(255,255,255,0.08)",
                    color: "#fff",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ marginTop: "12px" }}>
        {isClosed ? (
          <div style={{ textAlign: "center", padding: "8px", opacity: 0.8 }}>
            This ticket has been closed by admin.
          </div>
        ) : (
          <div style={{ }}>
            <TextArea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              autoSize={{ minRows: 4, maxRows: 4 }}
              disabled={isSending}
              style={{ marginBottom: '20px' }}
            />
            <Button
              className="prcolor"
              onClick={handleSend}
              isDisabled={messageText.trim() === "" || isSending}
            >
              Send
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
