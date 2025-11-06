import { Navigate } from "react-router-dom";

export default function ProtectedRoute({children,role}){
    const token = localStorage.getItem("auth-token");
    const userRole = localStorage.getItem("user-role");

    if (!token){
        return <Navigate to='/login' replace/>
    }

    if(role && role!==userRole){
        return <Navigate to="/login" replace/>
    }

    return children;
}