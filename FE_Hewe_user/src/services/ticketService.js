import { axiosService } from "../util/service";

export const createTicketAPI = ({ subject, message }) => {
  return axiosService.post("createTicket", { subject, message });
};

export const getMyTicketsAPI = ({ limit, page }) => {
  return axiosService.get(`getMyTickets?limit=${limit}&page=${page}`);
};

export const getTicketMessagesAPI = ({ ticketId, limit, page }) => {
  return axiosService.get(
    `getTicketMessages?ticketId=${ticketId}&limit=${limit}&page=${page}`
  );
};

export const sendTicketMessageAPI = ({ ticketId, message }) => {
  return axiosService.post("sendTicketMessage", { ticketId, message });
};
