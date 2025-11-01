import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout";
import AdminLogin1 from "./admin/adminLogin-1";
import Dashboard1 from "./admin/admin1Dashboard";
import AddUser from "./admin/addUser";
import UserDetails from "./admin/userDetails";
import UserLogin from "./pages/userLogin";
import UserDash from "./pages/userdash";
import MyTask from "./pages/myTask";
import './App.css'
import TaskDetails from "./admin/taskDetails";
import EditDetails from "./admin/EditUser";
import "react-toastify/dist/ReactToastify.css";

import EditTask from "./admin/EditTask";
// import NormalAdmin from "./admin/normalAdmin";
// import AdminLogin2 from "./admin/admin2-login";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
         <Route path="adminlogin" element={<AdminLogin1/>}/>
         <Route path="Dashboard-1" element={<Dashboard1/>}>
           <Route path="adduser" element={<AddUser/>}/>
           <Route path="taskdetails" element={<TaskDetails/>}/>
           <Route path="edituser" element={<EditDetails/>}/>
           <Route path="edittask" element={<EditTask/>}/>
           <Route path="userDetails" element={<UserDetails/>}/>
           {/* <Route path="normalregister" element={<NormalAdmin/>}/> */}
         </Route>
         {/* <Route path="normaladmin" element={<AdminLogin2/>}></Route> */}
         <Route path="userLogin" element={<UserLogin/>}/>
         <Route path="userdash" element={<UserDash/>}>
         <Route path="mytask" element={<MyTask/>}/>
         
         
         </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
