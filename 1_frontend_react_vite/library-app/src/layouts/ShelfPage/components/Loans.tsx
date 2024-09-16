import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "src/components/ui/card";
import { SpinnerLoading } from "src/layouts/Utils/SpinnerLoading";
import ShelfCurrentLoans from "src/models/ShelfCurrentLoans";
import { LoansModal } from "./LoansModal";

export const Loans = () => {
  const { authState } = useOktaAuth();
  const [httpError, setHttpError] = useState<any>(null);

  // current loans
  const [shelfCurrentLoans, setShelfCurrentLoans] = useState<
    ShelfCurrentLoans[]
  >([]);
  const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);
  const [checkout, setCheckout] = useState(false);

  // fetch loans data
  useEffect(() => {
    const fetchUserLoans = async () => {
      try {
        if (authState && authState.isAuthenticated) {
          const url = `${import.meta.env.VITE_REACT_APP_API}/books/secure/currentloans`;
          const requestOptions = {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authState.accessToken?.accessToken}`,
              "Content-Type": "application/json",
            },
          };

          const shelfCurrentLoansResponse = await fetch(url, requestOptions);

          if (!shelfCurrentLoansResponse.ok) {
            throw new Error(
              `HTTP error! status: ${shelfCurrentLoansResponse.status}`,
            );
          }

          const shelfCurrentLoansResponseJson =
            await shelfCurrentLoansResponse.json();

          setShelfCurrentLoans(shelfCurrentLoansResponseJson);
        }
      } catch (err) {
        setHttpError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoadingUserLoans(false);
      }
    };
    fetchUserLoans();
    window.scrollTo(0, 0);
  }, [authState, checkout]);

  // if pending
  if (isLoadingUserLoans) {
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

  // function
  async function returnBook(bookId: number) {
    const url = `${import.meta.env.VITE_REACT_APP_API}/books/secure/return/?bookId=${bookId}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const returnResponse = await fetch(url, requestOptions);

    if (!returnResponse.ok) {
      throw new Error(`HTTP error! status: ${returnResponse.status}`);
    }

    setCheckout(!checkout);
  }

  async function renewLoan(bookId: number) {
    const url = `${import.meta.env.VITE_REACT_APP_API}/books/secure/renew/loan/?bookId=${bookId}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const renewResponse = await fetch(url, requestOptions);

    if (!renewResponse.ok) {
      throw new Error(`HTTP error! status: ${renewResponse.status}`);
    }

    setCheckout(!checkout);
  }

  return (
    <div>
      {shelfCurrentLoans.length > 0 ? (
        <>
          <p className="font-bold">Current Loans:</p>
          {shelfCurrentLoans.map((shelfCurrentLoan) => (
            <div key={shelfCurrentLoan.book.id}>
              <Card className="m-5 flex flex-col p-5 pt-7 shadow-lg sm:flex-row sm:items-center sm:justify-center">
                <CardContent className="ml-5 flex-shrink-0">
                  {shelfCurrentLoan.book?.img ? (
                    <img
                      src={shelfCurrentLoan.book?.img}
                      // width="226"
                      // height="349"
                      className="h-60 w-40 rounded-md object-cover"
                      // className="h-auto w-1/2 rounded-md object-cover"
                      alt="Book"
                    />
                  ) : (
                    <img
                      src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                      // width="226"
                      // height="349"
                      className="h-60 w-40 rounded-md object-cover"
                      alt="Book"
                    />
                  )}
                </CardContent>

                <CardContent>
                  <Card className="p-1 pt-[1rem] shadow-md">
                    {/* <CardHeader>
                      <CardTitle>Loan Options</CardTitle>
                      <CardDescription>Card Description</CardDescription>
                    </CardHeader> */}
                    <CardContent className="space-y-3">
                      <p className="text-[0.8rem] font-bold">Loan Options</p>
                      {shelfCurrentLoan.daysLeft > 0 && (
                        <p className="text-[0.7rem] text-gray-700">
                          Due in {shelfCurrentLoan.daysLeft} days.
                        </p>
                      )}
                      {shelfCurrentLoan.daysLeft === 0 && (
                        <p className="text-[0.7rem]">Due Today</p>
                      )}
                      {shelfCurrentLoan.daysLeft < 0 && (
                        <p className="text-[0.7rem] text-red-700">
                          Pass due by {shelfCurrentLoan.daysLeft} days.
                        </p>
                      )}
                    </CardContent>
                    <CardContent className="flex flex-col space-y-2">
                      <div>
                        <button className="rounded-lg border-2 border-cyan-700 bg-cyan-700 px-2 text-xs text-white">
                          {/* Manage Loan */}
                          <LoansModal
                            shelfCurrentLoan={shelfCurrentLoan}
                            returnBook={returnBook}
                            renewLoan={renewLoan}
                          />
                        </button>
                      </div>
                      <div>
                        <button className="rounded-lg border-2 border-cyan-700 bg-cyan-700 px-2 text-xs text-white">
                          <Link to={`search`}>Search more books</Link>
                        </button>
                      </div>
                      <hr />
                    </CardContent>
                    <CardContent className="space-y-2">
                      <p className="text-[0.8rem]">
                        Help other find their adventure by reviewing your loan.
                      </p>
                      <button className="rounded-md border-2 border-cyan-700 bg-cyan-700 px-3 py-1 text-xs text-white">
                        <Link to={`/checkout/${shelfCurrentLoan.book.id}`}>
                          Leave a review
                        </Link>
                      </button>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          ))}
        </>
      ) : (
        <>
          <h3>Currently no loans</h3>
          <Link to={`search`}>Search for a new book</Link>
        </>
      )}
    </div>
  );
};
