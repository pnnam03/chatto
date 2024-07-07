import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main.jsx";
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
        <Route path={MainPath} element={<Main />} />
        <Route path={SignInPath} element={<SignIn />} />
        <Route path={SignUpPath} element={<SignUp />} />
        <Route path={ForgotPasswordPath} element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
