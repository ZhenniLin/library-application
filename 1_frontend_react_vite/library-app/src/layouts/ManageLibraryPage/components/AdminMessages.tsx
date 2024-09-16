import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "src/layouts/Utils/SpinnerLoading";
import MessageModel from "src/models/MessageModel";
import { Pagination } from "./../../Utils/Pagination";
import { AdminMessage } from "./AdminMessage";
import AdminMessageRequest from "src/models/AdminMessageRequest";

export const AdminMessages = () => {
  const { authState } = useOktaAuth();

  // normal loading pieces

  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [httpError, setHttpError] = useState<any>(null);

  // messages endpoint state
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [messagesPerPage] = useState(5);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // recall useEffect
  const [btnSubmit, setBtnSubmit] = useState(false);

  useEffect(() => {
    const fetchUserMessages = async () => {
      try {
        const url = `${import.meta.env.VITE_REACT_APP_API}/messages/search/findByClosed/?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const messageResponse = await fetch(url, requestOptions);

        if (!messageResponse.ok) {
          throw new Error(`HTTP error! status: ${messageResponse.status}`);
        }

        const messagesResponseJson = await messageResponse.json();
        setMessages(messagesResponseJson._embedded.messages);
        setTotalPages(messagesResponseJson.page.totalPages);
      } catch (err) {
        setHttpError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoadingMessages(false);
      }
    };
    fetchUserMessages();
  }, [authState, currentPage, btnSubmit]);

  // if pending
  if (isLoadingMessages) {
    return <SpinnerLoading />;
  }

  // if error
  if (httpError) {
    return (
      <div className="m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  async function submitResponseToQuestion(id: number, response: string) {
    const url = `${import.meta.env.VITE_REACT_APP_API}/messages/secure/admin/message`;
    if (
      authState &&
      authState?.isAuthenticated &&
      id != null &&
      response !== ""
    ) {
      const messageAdminRequestModel: AdminMessageRequest =
        new AdminMessageRequest(id, response);

      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authState.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageAdminRequestModel),
      };

      const messageAdminRequestModelResponse = await fetch(url, requestOptions);
      if (!messageAdminRequestModelResponse.ok) {
        throw new Error(
          `HTTP error! status: ${messageAdminRequestModelResponse.status}`,
        );
      }
      setBtnSubmit(!btnSubmit);
    }
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      {messages.length > 0 ? (
        <div>
          <div className="mb-3">Pending Q/A:</div>
          {messages.map((message) => (
            <AdminMessage
              message={message}
              key={message.id}
              submitResponseToQuestion={submitResponseToQuestion}
            />
          ))}
        </div>
      ) : (
        <h5>No pending Q/A</h5>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
};
