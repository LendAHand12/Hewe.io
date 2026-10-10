import { axiosService, DOMAIN } from "../util/service";

// DOMAIN dạng http://host/api/user/ -> ảnh ticket được serve ở http://host/ticket-images/...
export const getTicketImageUrl = (path) =>
  `${(DOMAIN || "").replace(/api\/user\/?$/, "").replace(/\/$/, "")}${path}`;

const multipartConfig = { headers: { "Content-Type": "multipart/form-data" } };

export const createTicketAPI = ({ subject, message, images = [] }) => {
  const formData = new FormData();
  formData.append("subject", subject);
  formData.append("message", message);
  images.forEach((file) => formData.append("images", file));
  return axiosService.post("createTicket", formData, multipartConfig);
};

export const getMyTicketsAPI = ({ limit, page }) => {
  return axiosService.get(`getMyTickets?limit=${limit}&page=${page}`);
};

export const getTicketMessagesAPI = ({ ticketId, limit, page }) => {
  return axiosService.get(
    `getTicketMessages?ticketId=${ticketId}&limit=${limit}&page=${page}`
  );
};

export const sendTicketMessageAPI = ({ ticketId, message, images = [] }) => {
  const formData = new FormData();
  formData.append("ticketId", ticketId);
  formData.append("message", message);
  images.forEach((file) => formData.append("images", file));
  return axiosService.post("sendTicketMessage", formData, multipartConfig);
};
