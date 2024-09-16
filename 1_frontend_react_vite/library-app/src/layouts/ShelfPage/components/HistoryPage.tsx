import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "src/components/ui/card";
import { SpinnerLoading } from "src/layouts/Utils/SpinnerLoading";
import HistoryModel from "src/models/HistoryModel";
import { Pagination } from "./../../Utils/Pagination";

export const HistoryPage = () => {
  const { authState } = useOktaAuth();
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [httpError, setHttpError] = useState<any>(null);

  // histories
  const [histories, setHistories] = useState<HistoryModel[]>([]);

  // pageniation
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // fetch histories data
  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        if (authState && authState.isAuthenticated) {
          const url = `${import.meta.env.VITE_REACT_APP_API}/histories/search/findBooksByUserEmail/?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=5`;
          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          const historyResponse = await fetch(url, requestOptions);

          if (!historyResponse.ok) {
            throw new Error(`HTTP error! status: ${historyResponse.status}`);
          }

          const historyResponseJson = await historyResponse.json();

          setHistories(historyResponseJson._embedded.histories);
          setTotalPages(historyResponseJson.page.totalPages);
        }
      } catch (err) {
        setHttpError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchUserHistory();
  }, [authState, currentPage]);

  // if pending
  if (isLoadingHistory) {
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
      {histories.length > 0 ? (
        <>
          <p className="mb-3 font-bold">Current histories:</p>
          {histories.map((history) => (
            <div key={history.id} className="mb-[2rem]">
              <Card className="flex flex-col px-3 pt-[1.4rem] shadow-lg sm:flex-row">
                <CardContent className="flex flex-col items-center sm:flex-shrink-0">
                  {history.img ? (
                    <img
                      src={history.img}
                      className="h-60 w-40 rounded-md object-cover"
                      alt="Book"
                    />
                  ) : (
                    <img
                      src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                      className="h-60 w-40 rounded-md object-cover"
                      alt="Book"
                    />
                  )}
                </CardContent>
                <CardContent className="flex flex-col space-y-3">
                  <div className="flex flex-col space-y-3">
                    <p>{history.author}</p>
                    <p className="font-bold">{history.title}</p>
                    <p className="h-[5rem] overflow-scroll text-sm">
                      {history.description}
                    </p>
                  </div>
                  <hr />
                  <div className="flex flex-col space-y-3">
                    <p className="text-sm">
                      Checked out on: {history.checkoutDate}
                    </p>
                    <p className="text-sm">
                      Returned on: {history.returnedDate}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </>
      ) : (
        <>
          <h3>Currently no histories</h3>
          <Link to={`search`}>Search for a new book</Link>
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
