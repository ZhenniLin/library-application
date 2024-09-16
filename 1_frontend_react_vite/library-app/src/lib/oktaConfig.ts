export const oktaConfig = {
  clientId: "0oajckaju7JrcOEJ35d7",
  issuer: "https://dev-60475206.okta.com/oauth2/default",
  redirectUri: "https://localhost:5173/login/callback",
  scopes: ["openid", "profile", "email"],
  pkce: true,
  disableHttpsCheck: true,
};
