import {PropsWithChildren} from "react";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


interface Prop extends PropsWithChildren {
}

const ToastProvider = ({children}: Prop) => {
  return <>{children}
    <ToastContainer position={"bottom-right"} theme={"dark"} className={"--animate"}/>
  </>
}

export default ToastProvider