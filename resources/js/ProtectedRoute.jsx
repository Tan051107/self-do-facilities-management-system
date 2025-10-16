import { Navigate } from "react-router-dom";

export default function ProtectedRoute({children,role}){
    const token = localStorage.getItem("auth-token");
    const userRole = localStorage.getItem("user-role");

    if(!token||(role && role!=userRole)){
        return <Navigate to="/"/>
    }

    return children;
}