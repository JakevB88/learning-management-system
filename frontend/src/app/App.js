import HomePage from "../features/HomePage"
import Login from "../features/LoginPage"
import ProfilePage from "../features/ProfilePage";
import CoursesPage from "../features/CoursesPage"
import CreateUser from "../features/CreateUserPage";
import AdminCreateUser from "../features/AdminCreateUserPage";
import AdminUpdateUser from "../features/AdminUpdateUserPage";
import CreateCourse from "../features/CreateCoursePage";
import UpdateCourse from "../features/UpdateCoursePage";
import AuthContext from "./AuthContext";
import { useState, useContext } from "react";
import { 
  Route, 
  RouterProvider, 
  createBrowserRouter, 
  createRoutesFromElements,
  Outlet,
  useNavigate
} from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  console.log("Sidebar user:", user);
  return (
    <div>
      <div>
        <button onClick={() => {navigate("/")}}>
          <p>Home</p>
        </button>
      </div>
      <div>
        <button onClick={() => {navigate("courses")}}>
          <p>Courses</p>
        </button>
      </div>
      <div>
        <button onClick={() => {navigate("profile")}}>
          <p>Profile</p>
        </button>
      </div>
      <div>
        <button
          onClick={() =>{
            navigate(
              user?.role === "admin"
                ? "/create-user"
                : "/signup"
            )
          }}
        >
          {user?.role === "admin"
            ?<p>Create/update/delete User Account</p>
            :<p>Sign Up</p>
          }
        </button>
        <div>
          {user?.role === "admin"
            ?<button onClick={() =>{
              navigate("/update-user")}}
            >
                Update Users
            </button>
            :<br></br>
          }
        </div>
        <div>
          {(user?.role === "admin"|| user?.role === "teacher")
            ?<button onClick={() =>{
              navigate("/create-course")}}
            >
                create course
            </button>
            :<br></br>
          }
        </div>
      </div>
    </div>
  );
}

function Layout() {
  const navigate = useNavigate();

  const { setUser } = useContext(AuthContext);
  const HandleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    
    setUser(null);
    alert("Logged out");
  };

  return (
    <div className="appheader">
      <div className="header">
        <h1>JvB Courses</h1>
        <div className="headerIcons">
          <button onClick={HandleLogout}>
            <p>Log out</p>
          </button>
          <button onClick={() => {navigate("login")}}>
            <p>Log in</p>
          </button>
        </div>
      </div>
      <hr className="header-line" />
      <div className="body">
        <div className="sideBar">
          <Sidebar />
        </div>
        <div className="pageContent">
          <Outlet />
        </div>
      </div>
    </div>
  );
}



const appRouter = createBrowserRouter( 
  createRoutesFromElements(
  <Route path="/" element={ <Layout /> }>
    <Route index element={ <HomePage/> } />
    <Route path='login' element={ <Login/>} />
    <Route path='profile' element={ <ProfilePage/>} />
    <Route path='courses' element={ <CoursesPage/>} />
    <Route path='signup' element={ <CreateUser/>} />
    <Route path='create-user' element={ <AdminCreateUser/>} />
    <Route path='update-user' element={ <AdminUpdateUser/>} />
    <Route path='create-course' element={ <CreateCourse/>} />
    <Route path='update-course/:id' element={ <UpdateCourse/>} />
  </Route>
  ),
  //required to use for github pages 
  //{ basename: process.env.NODE_ENV === "test" ? "/" : "/quiz" } 
);


function App() {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      <RouterProvider router={appRouter} />
    </AuthContext.Provider>
  );
}

export default App;
