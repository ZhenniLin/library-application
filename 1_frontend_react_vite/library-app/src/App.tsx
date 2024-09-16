import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import "./App.css";
import { HomePage } from "./layouts/HomePage/HomePage";
import { SearchBooksPage } from "./layouts/SearchBooksPage/SearchBooksPage";
import { AppLayout } from "./layouts/AppLayout";
import { BookCheckoutPage } from "./layouts/BookCheckoutPage/BookCheckoutPage";
import { oktaConfig } from "./lib/oktaConfig";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { LoginCallback, SecureRoute, Security } from "@okta/okta-react";
//@ts-ignore
import LoginWidget from "./Auth/LoginWidget";
import { ReviewListPage } from "./layouts/BookCheckoutPage/ReviewListPage/ReviewListPage";
import { ShelfPage } from "./layouts/ShelfPage/ShelfPage";
import { MessagesPage } from "./layouts/MessagesPage/MessagesPage";
import { ManageLibraryPage } from "./layouts/ManageLibraryPage/ManageLibraryPage";
import { PaymentPage } from "./layouts/PaymentPage/PaymentPage";

const oktaAuth = new OktaAuth(oktaConfig);

export const App = () => {
  const customAuthHandler = () => {
    history.push("/login");
  };

  const history = useHistory();

  const restoreOriginUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || "/", window.location.origin));
  };

  return (
    <Security
      oktaAuth={oktaAuth}
      restoreOriginalUri={restoreOriginUri}
      onAuthRequired={customAuthHandler}
    >
      <AppLayout>
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route path="/home" component={HomePage} />
          <Route path="/search" component={SearchBooksPage} />
          <Route path="/reviewlist/:bookId" component={ReviewListPage} />
          <Route path="/checkout/:bookId" component={BookCheckoutPage} />
          <Route
            path="/login"
            render={() => <LoginWidget config={oktaConfig} />}
          />
          <Route path="/login/callback" component={LoginCallback} />
          <SecureRoute path="/shelf" component={ShelfPage}></SecureRoute>
          <SecureRoute path="/messages" component={MessagesPage}></SecureRoute>
          <SecureRoute
            path="/admin"
            component={ManageLibraryPage}
          ></SecureRoute>
          <SecureRoute path="/fees" component={PaymentPage}></SecureRoute>
        </Switch>
      </AppLayout>
    </Security>
  );
};
