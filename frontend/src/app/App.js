import HomePage from "../features/HomePage"
import Login from "../features/LoginPage"
import ProfilePage from "../features/ProfilePage";
import CoursesPage from "../features/CoursesPage"
import CreateUser from "../features/CreateUserPage";
import AdminCreateUser from "../features/AdminCreateUserPage"
import { useState, useEffect } from "react";
import { 
  Route, 
  RouterProvider, 
  createBrowserRouter, 
  createRoutesFromElements,
  Outlet,
  useNavigate
} from 'react-router-dom';


const HandleLogout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  alert("Logged out");
};



function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/users/profile/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrentUser();
  }, []);

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
            console.log(user);
            console.log(user?.role);
            navigate(
              user?.role === "admin"
                ? "/create-user"
                : "/signup"
            )
          }}
        >
          <p>Create User Account</p>
        </button>
      </div>
    </div>
  );
}

function Layout() {
  const navigate = useNavigate();
  
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
  </Route>
  ),
  //required to use for github pages 
  //{ basename: process.env.NODE_ENV === "test" ? "/" : "/quiz" } 
);


function App() {
  return (
    <RouterProvider router={appRouter}></RouterProvider>
  );
}

export default App;
