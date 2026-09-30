import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { CreateTicketModal } from "./components/CreateTicketModal";
import { TicketList } from "./components/TicketList";
import { TicketThread } from "./components/TicketThread";

const SupportTicketPage = () => {
  const history = useHistory();
  const location = useLocation();
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReloadList, setIsReloadList] = useState(false);

  useEffect(() => {
    if (location.state?.openCreate) {
      setIsCreateModalOpen(true);
      history.replace(location.pathname, {});
    }
  }, []);

  const handleCreated = (newTicketId) => {
    setIsCreateModalOpen(false);
    setIsReloadList(true);
    if (newTicketId) {
      setSelectedTicketId(newTicketId);
    }
  };

  const handleBackToList = () => {
    setSelectedTicketId(null);
    setIsReloadList(true);
  };

  return (
    <div>
      {selectedTicketId ? (
        <TicketThread ticketId={selectedTicketId} onBack={handleBackToList} />
      ) : (
        <TicketList
          isReloadData={isReloadList}
          setIsReloadData={setIsReloadList}
          onSelectTicket={setSelectedTicketId}
          onClickCreate={() => setIsCreateModalOpen(true)}
        />
      )}

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
};

export default SupportTicketPage;
