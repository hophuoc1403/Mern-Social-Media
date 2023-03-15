import { lazy, Suspense, useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import ProfilePage from "./scenes/profilePage";
import LoginPage from "./scenes/loginPage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { useAppSelector } from "./index";

import ToastProvider from "./components/ToastProvider";
import { io } from "socket.io-client";
import useAppStore from "hooks/stateApp";
import LoadingPage from "components/loading/LoadingPage";
import ProgressLoading from "./components/loading/ProgressLoading";
import PostDetails from "./scenes/postDetails";
import AccountLayout from "./components/layouts/AccountLayout";
import ForgetPassword from "./scenes/account/ForgetPassword";
import Oauth from "./scenes/account/Oauth";
import ResetPassword from "scenes/account/ResetPassword";
import ChatExc from "components/chat/ChatExc";

// use lazy load so that route come with <Suspense />
const HomePage = lazy(() => import("./scenes/homePage"));

function App() {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user);

  const { setSocket } = useAppStore();
  useEffect(() => {
    setSocket(io("http://localhost:3001"));
  }, [user._id]);

  useEffect(() => {
    setIsNavigating(true);
    setTimeout(() => setIsNavigating(false), 2000);
  }, [location]);

  // @ts-ignore
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = localStorage.getItem("accessToken");
  const { isAppLoading } = useAppStore();

  return (
    <div className={mode === "dark" ? "App" : "app"}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastProvider>
          {isNavigating && <ProgressLoading />}
          <Routes>
            <Route
              path={"/"}
              element={!isAuth ? <LoginPage /> : <Navigate to={"/home"} />}
            />
            <Route
              path={"/home"}
              element={
                isAuth ? (
                  isAppLoading ? (
                    <LoadingPage />
                  ) : (
                    <Suspense fallback={<LoadingPage />}>
                      <HomePage />
                    </Suspense>
                  )
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />
            <Route
              path={"/profile/:userId"}
              element={
                isAuth ? (
                  isAppLoading ? (
                    <LoadingPage />
                  ) : (
                    <ProfilePage />
                  )
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />
            <Route path={"/account/"} element={<AccountLayout />}>
              <Route index path={"login"} element={<LoginPage />} />
              <Route path={"forget-password"} element={<ForgetPassword />} />
              <Route path={"new-password/:token"} element={<ResetPassword />} />
            </Route>
            <Route path={"/post/:id"} element={<PostDetails />} />
            <Route path={"oauth-verify"} element={<Oauth />} />
          </Routes>
          <ChatExc isShow={true} />
        </ToastProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
