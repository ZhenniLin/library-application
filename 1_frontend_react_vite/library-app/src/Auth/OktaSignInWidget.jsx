import { useEffect, useRef } from "react";
import OktaSignIn from "@okta/okta-signin-widget";
import "@okta/okta-signin-widget/dist/css/okta-sign-in.min.css";
import { oktaConfig } from "src/lib/oktaConfig.ts";

const OktaSignInWidget = ({ onSuccess, onError }) => {
  const widgetRef = useRef();

  useEffect(() => {
    if (!widgetRef.current) {
      return false;
    }

    const widget = new OktaSignIn(oktaConfig);

    widget
      .showSignInToGetTokens({
        el: widgetRef.current,
      })
      .then(onSuccess)
      .catch(onError);

    return () => widget.remove();
  }, [onSuccess]);

  return (
    <div className="mb-5 mt-5">
      <div ref={widgetRef}></div>
    </div>
  );
};

export default OktaSignInWidget;
