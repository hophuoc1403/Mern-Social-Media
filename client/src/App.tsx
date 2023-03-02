import { lazy, Suspense, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ProfilePage from "./scenes/profilePage";
import LoginPage from "./scenes/loginPage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { useAppDispatch, useAppSelector } from "./index";

import ToastProvider from "./components/ToastProvider";
import { io } from "socket.io-client";
import useAppStore from "hooks/stateApp";
import LoadingPage from "components/LoadingPage";

const HomePage = lazy(() => import("./scenes/homePage"));

function App() {
  const dispatch = useAppDispatch();
 
  const user = useAppSelector(state => state.user)

  const { setSocket } = useAppStore();
  useEffect(() => {
    setSocket(io("http://localhost:3001"));
  }, [user._id]);



  // @ts-ignore
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = localStorage.getItem("accessToken");
  const { isAppLoading } = useAppStore();

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path={"/"} element={!isAuth ? <LoginPage /> : <Navigate to={"/home"}/>} />
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
              <Route path={"/login"} element={<LoginPage />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
