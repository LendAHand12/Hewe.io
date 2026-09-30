import { Tag } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "../../axios";
import { useListTable, useModal, usePagination, useSearch } from "../../hooks";
import { convertTimeCreateAt } from "../../utils/format";

const LIMIT = 10;
const token = localStorage.getItem("token");

const getAllTicketsAPI = ({ limit, page, keyword }) => {
  return axios.get(`/getAllTickets?limit=${limit}&page=${page}&keyword=${keyword}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

const getTicketMessagesAdminAPI = ({ ticketId, limit, page }) => {
  return axios.get(`/getTicketMessagesAdmin?ticketId=${ticketId}&limit=${limit}&page=${page}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

const sendTicketMessageAdminAPI = ({ ticketId, message }) => {
  return axios.post(
    `sendTicketMessageAdmin`,
    { ticketId, message },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

const closeTicketAPI = ({ ticketId }) => {
  return axios.post(
    `closeTicket`,
    { ticketId },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const useTickets = () => {
  const {
    x,
    y,
    currentPage,
    totalItems,
    limitPerRow,
    handleSetCurrentPage,
    handleSetTotalItems,
    handleSetLimitPerRow,
  } = usePagination({ defaultPage: 1, limit: LIMIT });
  const { data, loading, handleGetData } = useListTable({
    service: getAllTicketsAPI,
    callbackSetTotalItem: handleSetTotalItems,
    defaultParamsPayload: {
      limit: LIMIT,
      page: 1,
      keyword: "",
    },
  });
  const { handleSearch } = useSearch({
    initialValue: "",
    callbackFn: () => handleSetCurrentPage(1),
  });
  const {
    isOpen: isOpenThread,
    handleOpenModal: handleOpenThread,
    handleCloseModal: handleCloseThreadRaw,
  } = useModal();
  const [keyword, setKeyword] = useState("");
  const isSearchMode = useRef(false);
  const [ticketFocus, setTicketFocus] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoadingThread, setIsLoadingThread] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isClosingTicket, setIsClosingTicket] = useState(false);
  const pollRef = useRef(null);

  const handleChangeKeyword = (e) => {
    isSearchMode.current = true;
    setKeyword(e.target.value);
    handleSetCurrentPage(1);
  };

  const handleGetListData = useCallback(({ limit = LIMIT, page, keyword }) => {
    handleGetData({ paramsQuery: { limit, page, keyword } });
  }, []);

  const fetchThreadMessages = useCallback(async (ticketId, { silent } = {}) => {
    if (!silent) setIsLoadingThread(true);
    try {
      const res = await getTicketMessagesAdminAPI({ ticketId, limit: 200, page: 1 });
      setMessages(res.data.data.array || []);
      setTicketFocus(res.data.data.ticket);
    } catch (error) {
      console.log(error);
    } finally {
      if (!silent) setIsLoadingThread(false);
    }
  }, []);

  const handleOpenTicketThread = (ticket) => () => {
    setTicketFocus(ticket);
    setMessages([]);
    handleOpenThread();
    fetchThreadMessages(ticket._id);

    clearInterval(pollRef.current);
    pollRef.current = setInterval(() => {
      fetchThreadMessages(ticket._id, { silent: true });
    }, 6000);
  };

  const handleCloseThread = () => {
    clearInterval(pollRef.current);
    handleCloseThreadRaw();
    setTicketFocus(null);
    setMessages([]);
    handleGetListData({ page: currentPage, keyword });
  };

  const handleSendMessage = async (message) => {
    if (!message || message.trim() === "" || isSendingMessage) return;

    setIsSendingMessage(true);
    try {
      await sendTicketMessageAdminAPI({ ticketId: ticketFocus._id, message: message.trim() });
      await fetchThreadMessages(ticketFocus._id, { silent: true });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleCloseTicket = async () => {
    if (isClosingTicket) return;

    setIsClosingTicket(true);
    try {
      await closeTicketAPI({ ticketId: ticketFocus._id });
      await fetchThreadMessages(ticketFocus._id, { silent: true });
    } catch (error) {
      console.log(error);
    } finally {
      setIsClosingTicket(false);
    }
  };

  const columns = [
    {
      title: "User",
      render: (_, record) => (
        <div>
          <div>{record.userName}</div>
          <div style={{ opacity: 0.7 }}>{record.userEmail}</div>
        </div>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
    },
    {
      title: "Status",
      render: (_, record) =>
        record.status === "open" ? <Tag color="blue">Open</Tag> : <Tag color="default">Closed</Tag>,
    },
    {
      title: "Last activity",
      render: (_, record) => convertTimeCreateAt(record.lastMessageAt),
    },
    {
      title: "",
      render: (_, record) => (
        <button className="btn btn-primary" onClick={handleOpenTicketThread(record)}>
          View
        </button>
      ),
    },
  ];

  useEffect(() => {
    if (isSearchMode.current) return;
    handleGetListData({ page: currentPage, keyword });
  }, [currentPage]);

  useEffect(() => {
    if (!isSearchMode.current) return;

    const timeout = setTimeout(() => {
      handleGetListData({ page: currentPage, keyword });
      isSearchMode.current = false;
    }, 500);

    return () => clearTimeout(timeout);
  }, [keyword]);

  useEffect(() => {
    return () => clearInterval(pollRef.current);
  }, []);

  return {
    x,
    y,
    totalItems,
    currentPage,
    data,
    loading,
    columns,
    limitPerRow,
    keyword,
    handleChangeKeyword,
    handleSearch,
    handleSetCurrentPage,
    handleSetLimitPerRow,
    isOpenThread,
    handleCloseThread,
    ticketFocus,
    messages,
    isLoadingThread,
    isSendingMessage,
    isClosingTicket,
    handleSendMessage,
    handleCloseTicket,
  };
};
