import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ROLE_INFO } from "../shared/constants/roles";

export default function RoleRedirect() {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user) return <Navigate to="/login" replace />;

  const info = ROLE_INFO[user.role];
  const path = info?.dashboardPath || "/";
  return <Navigate to={path} replace />;
}
