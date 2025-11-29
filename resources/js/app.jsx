import { BrowserRouter,Routes,Route,Outlet } from "react-router-dom";
import ReactDOM from "react-dom/client";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { UserProvider } from "../context/UserContext.jsx";
import { NotificationProvider } from "../context/NotificationContext.jsx";


import '../css/app.css';

import Navbar from "./Navbar.jsx";
import Login from "./Login.jsx"
import Profile from "./Profile.jsx";
import Notification from './Notification.jsx';
import NotFoundPage from './NotFoundPage.jsx'

import NonAdminHome from "./NonAdminHomePage.jsx";
import DisplayBusSchedule from "./DisplayBusSchedule.jsx";

import AdminHome from "./AdminHomePage.jsx";
import CreateAcc from "./CreateAcc.jsx"
import TransportManagement from "./TransportManagement.jsx"
import ManageAnnouncement from "./AnnouncementManagement.jsx"
import CourseManagement from "./CourseManagement.jsx"
import SubjectManagement from "./SubjectManagement.jsx";
import IntakeManagement from "./IntakeManagement.jsx";
import RoomManagement from "./RoomManagement.jsx"



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
          <Route path ="/course-management" element={<ProtectedRoute role="admin"><CourseManagement/></ProtectedRoute>}></Route>
          <Route path = "/subject-management" element = {<ProtectedRoute role = "admin"><SubjectManagement/></ProtectedRoute>}></Route>
          <Route path = "/intake-management" element ={<ProtectedRoute role = "admin"><IntakeManagement/></ProtectedRoute>}></Route>
          <Route path = "/room-management" element={<ProtectedRoute role = "admin"><RoomManagement/></ProtectedRoute>}></Route>
          <Route path ="*" element={<ProtectedRoute><NotFoundPage/></ProtectedRoute>}></Route>
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