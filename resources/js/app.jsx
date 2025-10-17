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
            <Route path="/" element={<Login/>}></Route>
        </Route>
        <Route element = {<AppLayout/>}>
            <Route path="/admin/homepage" element={<ProtectedRoute role = "admin"><AdminHome/></ProtectedRoute>}/>
            <Route path="/homepage" element={<ProtectedRoute role = "student"><NonAdminHome/></ProtectedRoute>}/>
            <Route path="/homepage" element={<ProtectedRoute role="lecturer"><NonAdminHome/></ProtectedRoute>}/> 
            <Route path="/profile" element={<Profile/>}></Route>  
            <Route path ="/create-acc" element ={<CreateAcc/>}></Route>  
            <Route path='/transport' element={<DisplayBusSchedule/>}></Route>
            <Route path ="/transport-management" element={<TransportManagement/>}></Route>  
            <Route path="/announcement" element={<ManageAnnouncement/>}></Route>
            <Route path="/notifications" element={<Notification/>}></Route>
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