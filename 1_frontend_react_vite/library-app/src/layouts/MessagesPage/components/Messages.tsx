import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { Card } from "src/components/ui/card";
import { SpinnerLoading } from "src/layouts/Utils/SpinnerLoading";
import MessageModel from "src/models/MessageModel";
import { Pagination } from "./../../Utils/Pagination";

export const Messages = () => {
  const { authState } = useOktaAuth();
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [httpError, setHttpError] = useState<any>(null);

  // messages
  const [messages, setMessages] = useState<MessageModel[]>([]);

  // pagination
  const [messagePerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchUserMessage = async () => {
      try {
        if (authState && authState?.isAuthenticated) {
          const url = `${import.meta.env.VITE_REACT_APP_API}/messages/search/findByUserEmail/?userEmail=${authState?.accessToken?.claims.sub}&page=${currentPage - 1}&size=${messagePerPage}`;

          const requestOptions = {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
              "Content-Type": "application/json",
            },
          };

          const messagesResponse = await fetch(url, requestOptions);
          if (!messagesResponse.ok) {
            throw new Error(`HTTP error! status: ${messagesResponse.status}`);
          }

          const messagesResponseJson = await messagesResponse.json();
          setMessages(messagesResponseJson._embedded.messages);
          setTotalPages(messagesResponseJson.page.totalPages);
        }
      } catch (err) {
        setHttpError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoadingMessages(false);
      }
    };
    fetchUserMessage();
    window.scrollTo(0, 0);
  }, [authState, currentPage]);

  // if pending
  if (isLoadingMessages) {
    return <SpinnerLoading />;
  }

  // if error
  if (httpError) {
    return (
      <div className="m-5">
        n<p>{httpError}</p>
      </div>
    );
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      {messages.length > 0 ? (
        <>
          <p className="mb-3 font-bold">Current Q/A:</p>
          {messages.map((message) => (
            <div key={message.id} className="mb-[1.5rem]">
              <Card className="flex flex-col space-y-3 p-3 shadow-md">
                <div>
                  <p className="font-bold">
                    Case #{message.id}: {message.title}
                  </p>
                  <p className="text-sm">{message.userEmail}</p>
                </div>

                <p className="text-sm">{message.question}</p>
                <hr />
                <div>
                  <p className="font-bold">Responses:</p>
                  {message.response && message.adminEmail ? (
                    <div className="space-y-3">
                      <p>{message.adminEmail} (admin)</p>
                      <p className="rounded-md bg-green-200 px-2 py-1 text-green-700">
                        {message.response}
                      </p>
                    </div>
                  ) : (
                    <>
                      <p>
                        <i className="text-xs">
                          Pending response from administration. Please be
                          patient.
                        </i>
                      </p>
                    </>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </>
      ) : (
        <>
          <p>All questions you submit will be shown here</p>
        </>
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
