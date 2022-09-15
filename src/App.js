import "./App.css";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Tweet from "./Component/Tweet/Tweet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
      <Tweet />
    </>
  );
}

export default App;
