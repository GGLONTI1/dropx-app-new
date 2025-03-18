import { Client, Account, OAuthProvider } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67d87856000b87d9bd92");

const account = new Account(client);

export const loginWithGoogle = () => {
  account.createOAuth2Session(
    OAuthProvider.Google,
    "http://localhost:3000/success",
    "http://localhost:3000/fail",
    []
  );
};

export { account, client };
