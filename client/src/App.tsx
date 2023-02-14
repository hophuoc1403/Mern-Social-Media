import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import HomePage from "./scenes/homePage";
import ProfilePage from "./scenes/profilePage";
import LoginPage from "./scenes/loginPage";
import {useMemo} from "react";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {createTheme} from "@mui/material/styles"
import {themeSettings} from "./theme";
import {AppDispatch, RootState} from "./index";
import {ToastContainer} from "react-toastify";
import ToastProvider from "./components/ToastProvider";

type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

function App() {

  // @ts-ignore
  const mode = useSelector((state) => state.mode)
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  const isAuth = Boolean(useAppSelector(state => state.token))

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path={"/"} element={<LoginPage/>}/>
            <Route path={"/home"} element={isAuth ? <HomePage/> : <Navigate to={"/"}/>}/>
            <Route path={"/profile/:userId"} element={isAuth ? <ProfilePage/> : <Navigate to={"/"}/>}/>
            <Route path={"/login"} element={<LoginPage/>}/>
          </Routes>
        </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
