import { Navigate } from "react-router-dom";

const studentsRoutes = [
  {
    path: "transfer-students",
    element: <Navigate to="/manage-classes?tab=transfer" replace />,
    permission: "manage_students",
  },
];

export default studentsRoutes;
