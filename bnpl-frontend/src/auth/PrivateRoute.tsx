import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

interface Props {
  children: ReactNode;
}

export const PrivateRoute = ({ children }: Props) => {
  const { accessToken } = useAuth(); // ✅ ensure it matches your AuthContext
  return accessToken ? <>{children}</> : <Navigate to="/login" />;
};
