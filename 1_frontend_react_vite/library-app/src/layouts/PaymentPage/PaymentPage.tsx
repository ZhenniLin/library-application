import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import { Card } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import PaymentInfoRequest from "src/models/PaymentInfoRequest";

export const PaymentPage = () => {
  const { authState } = useOktaAuth();
  const [httpError, setHttpError] = useState<any>(null);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [fees, setFees] = useState(0);
  const [loadingFees, setLoadingFees] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        if (authState && authState.isAuthenticated) {
          const url = `${import.meta.env.VITE_REACT_APP_API}/payments/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          const paymentResponse = await fetch(url, requestOptions);
          if (!paymentResponse.ok) {
            throw new Error(`HTTP error! status: ${paymentResponse.status}`);
          }
          const paymentResponseJson = await paymentResponse.json();
          setFees(paymentResponseJson.amount);
        }
      } catch (err) {
        setHttpError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoadingFees(false);
      }
    };
    fetchFees();
  }, [authState]);

  const elements = useElements();
  const stripe = useStripe();

  async function checkout() {
    if (!stripe || !elements || !elements.getElement(CardElement)) {
      return;
    }

    setSubmitDisabled(true);

    let paymentInfo = new PaymentInfoRequest(
      Math.round(fees * 100),
      "USD",
      authState?.accessToken?.claims.sub,
    );

    const url = `${import.meta.env.VITE_REACT_APP_API}/payment/secure/payment-intent`;
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentInfo),
    };

    const stripeResponse = await fetch(url, requestOptions);
    if (!stripeResponse.ok) {
      setHttpError(true);
      setSubmitDisabled(false);
      throw new Error(`HTTP error! status: ${stripeResponse.status}`);
    }
    const stripeResponseJson = await stripeResponse.json();

    stripe
      .confirmCardPayment(
        stripeResponseJson.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              email: authState?.accessToken?.claims.sub,
            },
          },
        },
        { handleActions: false },
      )
      .then(async function (result: any) {
        if (result.error) {
          setSubmitDisabled(false);
          alert("There was an error");
        } else {
          const url = `${import.meta.env.VITE_REACT_APP_API}/payment/secure/payment-complete`;
          const requestOptions = {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
              "Content-Type": "application/json",
            },
          };
          const stripeResponse = await fetch(url, requestOptions);
          if (!stripeResponse.ok) {
            setHttpError(true);
            setSubmitDisabled(false);
            throw new Error(`HTTP error! status: ${stripeResponse.status}`);
          }
          setFees(0);
          setSubmitDisabled(false);
        }
      });
    setHttpError(false);
  }

  if (loadingFees) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="min-w-screen min-h-screen bg-white text-center text-2xl text-cyan-700">
        <p>{httpError}</p>
      </div>
    );
  }

  return (
    <div>
      {fees > 0 && (
        // <div className="flex justify-center">
        <Card className="m-auto mt-5 w-[30rem]">
          <h5 className="bg-gray-200 px-2 py-1">
            Fees pending:{" "}
            <span className="font-bold text-red-700">${fees}</span>
          </h5>
          <div className="my-4 flex flex-col space-y-3 px-2">
            <h5>Credit Card</h5>
            <CardElement id="card-element" />
            <div>
              <Button
                type="button"
                variant="outline"
                disabled={submitDisabled}
                className="text-xs"
                onClick={checkout}
              >
                Pay fees
              </Button>
            </div>
          </div>
        </Card>
        // </div>
      )}

      {fees === 0 && (
        <div className="mt-5 flex flex-col space-y-5 text-center">
          <h5>You have no fees!</h5>
          <div>
            <Button asChild variant="outline" className="text-sm">
              <Link to="/search">Explore top books</Link>
            </Button>
          </div>
        </div>
      )}

      {submitDisabled && <SpinnerLoading />}
    </div>
  );
};
