import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import { Layout } from "./pages/Layout";
import  Home  from "./pages/Home";
import RegisterPage from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordTest from './pages/ResetPasswordTest'; 

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/reset-test" element={<ResetPasswordTest />} />
      <Route path="/home" element={<Home />} /> 
    </Route>
  )
);