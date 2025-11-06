import { BrowserRouter,Routes,Route,Outlet } from "react-router-dom";
import ReactDOM from "react-dom/client";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { UserProvider, UserContext } from "../context/UserContext.jsx";


import '../css/app.css';

import Navbar from "./Navbar.jsx";
import Login from "./Login.jsx"
import Profile from "./Profile.jsx";
import Notification from './Notification.jsx';

import NonAdminHome from "./NonAdminHomePage.jsx";
import DisplayBusSchedule from "./DisplayBusSchedule.jsx";

import AdminHome from "./AdminHomePage.jsx";
import CreateAcc from "./CreateAcc.jsx"
import TransportManagement from "./TransportManagement.jsx"
import ManageAnnouncement from "./AnnouncementManagement.jsx"
import { NotificationProvider } from "../context/NotificationContext.jsx";


function AuthLayout (){
    return <Outlet/>
  }

function AppLayout (){
    return(
      <>
        <Navbar/>
        <Outlet/>
      </>
    )
  }

function AppRoutes (){

  return(
    <>
      <Routes>
        <Route element = {<AuthLayout/>}>
            <Route path="/login" element={<Login/>}></Route>
        </Route>
        <Route element = {
          <NotificationProvider>
            <AppLayout/>
          </NotificationProvider>
        }>
          <Route path="/admin" element={<ProtectedRoute role = "admin"><AdminHome/></ProtectedRoute>}/>
          <Route path="/" element={<ProtectedRoute><NonAdminHome/></ProtectedRoute>}/>
          <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}></Route>  
          <Route path ="/create-acc" element ={<ProtectedRoute role="admin"><CreateAcc/></ProtectedRoute>}></Route>  
          <Route path='/transport' element={<ProtectedRoute><DisplayBusSchedule/></ProtectedRoute>}></Route>
          <Route path ="/transport-management" element={<ProtectedRoute role="admin"><TransportManagement/></ProtectedRoute>}></Route>  
          <Route path="/announcement" element={<ProtectedRoute role="admin"><ManageAnnouncement/></ProtectedRoute>}></Route>
          <Route path="/notifications" element={<ProtectedRoute><Notification/></ProtectedRoute>}></Route>
        </Route>  
      </Routes>
    </>
  )
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);