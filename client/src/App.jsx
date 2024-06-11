import { BrowserRouter, Route, Routes } from "react-router-dom";
import NewChat from "./pages/index.jsx";
// import Chat from "./pages/Chat.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import {
  ForgotPasswordPath,
  MainPath,
  SignInPath,
  SignUpPath,
} from "./routes_path.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={MainPath} element={<NewChat />} />
        <Route path={SignInPath} element={<SignIn />} />
        <Route path={SignUpPath} element={<SignUp />} />
        <Route path={ForgotPasswordPath} element={<ForgotPassword />} />
        {/* <Route path="/new_chat_box" element={<NewChat />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
