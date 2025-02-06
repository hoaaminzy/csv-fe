import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("userInfo");

  return isAuthenticated ? children : <Navigate to="/sinh-vien-dang-nhap" />;
};

export default PrivateRoute;
