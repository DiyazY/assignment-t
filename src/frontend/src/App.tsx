import "./App.css";
import Entries from "./components/Entries";
import { Container } from "@mui/material";
import { createContext, useEffect, useState } from "react";
import { RestContextType } from "./models/restContextType";
import Login from "./components/Login";
import { RestApiManager } from "./utils/restApiManager";
import { ProfileModel } from "./models/profileModel";
import AdminView from "./components/AdminView";

export const RestContext = createContext<RestContextType>({
  apiManager: null,
  profile: null, // for such a small use-case/app, I decided to use the same context
});

function App() {
  const [token, setToken] = useState<string>("");

  const [profile, setProfile] = useState<ProfileModel | null>(null);

  const [apiManager, setApiManager] = useState<RestApiManager | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    if (token) {
      const api = new RestApiManager(token);

      setApiManager(api);
      api
        .get<ProfileModel>("profile/my", controller.signal)
        .then((profile) => setProfile(profile))
        .catch((err) => {
          console.log(err);
        });
    }
    return () => {
      controller.abort();
    };
  }, [token]);

  const isLoggedIn = !!token;

  return (
    <div className="App">
      <RestContext.Provider value={{ apiManager, profile }}>
        {!isLoggedIn && <Login setToken={setToken} />}
        {isLoggedIn && profile && (
          <Container maxWidth="sm">
            {profile.role === "Admin" ? (
              <AdminView />
            ) : (
              <Entries threshold={profile.threshold || 0} />
            )}
          </Container>
        )}
      </RestContext.Provider>
    </div>
  );
}

export default App;
