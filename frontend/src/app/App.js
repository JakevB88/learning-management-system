import HomePage from "../features/HomePage"
import Login from "../features/LoginPage"
import ProfilePage from "../features/ProfilePage";
import UsersPage from "../features/UsersPage";
import CoursesPage from "../features/CoursesPage"
import CreateUser from "../features/CreateUserPage";
import AdminCreateUser from "../features/AdminCreateUserPage";
import AdminUpdateUser from "../features/AdminUpdateUserPage";
import CreateCourse from "../features/CreateCoursePage";
import UpdateCourse from "../features/UpdateCoursePage";
import AuthContext from "./AuthContext";
import UpdateUser from "../features/UpdateUserPage";
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
          {user && <p>Profile</p>}
        </button>
      </div>
      <div>
        {["admin", "teacher"].includes(user?.role) && (
          <button onClick={() => navigate("/users")}>
            <p>{user.role === "admin" ? "Manage Users" : "Users"}</p>
          </button>
        )}
      </div>
      <div>
        {!user && (
          <button onClick={() => {navigate("/signup");}}>
            <p>Sign up</p>
          </button>
        )}

      </div>
    </div>
  );
}

function Layout() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const HandleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    
    setUser(null);
    alert("Logged out");
    navigate("/")
  };

  return (
    <div className="appheader">
      <div className="header">
        <h1>JvB Courses</h1>
        <h3>get more out of life</h3>
        <div className="headerIcons">
          {user 
            ?(
            <button onClick={HandleLogout}>
              <p>Log out</p>
            </button>)
            :(<button onClick={() => {navigate("login")}}>
              <p>Log in</p>
            </button>)
          }
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
    <Route path='users' element={ <UsersPage/>} />
    <Route path='signup' element={ <CreateUser/>} />
    <Route path='create-user' element={ <AdminCreateUser/>} />
    <Route path='update-user/:id' element={ <UpdateUser/>} />
    <Route path='admin-update-user/:id' element={ <AdminUpdateUser/>} />
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
