import { createContext, useContext, useState } from "react";

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [ticketCounts, setTicketCounts] = useState({
    pending: 0,
    inReview: 0,
    resolved: 0
  });

  return (
    <TicketContext.Provider value={{ ticketCounts, setTicketCounts }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTicket = () => useContext(TicketContext);
