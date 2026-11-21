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
import UserPage from "../features/UserPage"
import { useState, useContext, useEffect } from "react";
import { 
  Route, 
  RouterProvider, 
  createBrowserRouter, 
  createRoutesFromElements,
  Outlet,
  useNavigate,
  Navigate
} from 'react-router-dom';

export function ProtectedRoute({
    children,
    roles = []
  }) {
    const { user } = useContext(AuthContext);
    console.log("ProtectedRoute user:", user);
    if (!user) {
      return <Navigate to="/" replace />;
    }

    if (roles.length && !roles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
    
    return children;
}

export function Sidebar() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  console.log("Sidebar user:", user);
  return (
    <div className="sidebar-menu">
      <div>
        <button className="sidebar-btn" onClick={() => {navigate("/")}}>
          Home
        </button>
      </div>
      <div>
        <button className="sidebar-btn" onClick={() => {navigate("courses")}}>
          Courses
        </button>
      </div>
      {user && 
        <div>
          
            <button className="sidebar-btn" onClick={() => {navigate("profile")}}>
              Profile
            </button>
          
        </div>
      }
      {["admin", "teacher"].includes(user?.role) && (
        <div>
          <button className="sidebar-btn" onClick={() => navigate("/users")}>
            {user.role === "admin" ? "Manage Users" : "Users"}
          </button>
        </div>
      )}
      <div>
        {!user && (
          <button className="sidebar-btn" onClick={() => {navigate("/signup");}}>
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
    console.log("Logout clicked");
    setUser(null);
    alert("Logged out");
    navigate("/")
  };

  return (
    <div className="page">
      <div className="header">
        <div className="header-title">
          <h1>JvB Courses</h1>
          <span>Learn new skills and boost your career</span>
        </div>
        <div className="headerIcons">
          {user 
            ?(
            <button className="login-btn" onClick={HandleLogout}>
              Log out
            </button>)
            :(<button className="login-btn" onClick={() => {navigate("login")}}>
              Log in
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
      <div className="footer">
        <p>Get more out of life with JvB courses</p>
      </div>
    </div>
  );
}



const appRouter = createBrowserRouter( 
  createRoutesFromElements(
  <Route path="/" element={ <Layout /> }>
    <Route index element={ <HomePage/> } />
    <Route path='login' element={ <Login/>} />
    <Route path='profile' element={ 
      <ProtectedRoute roles={["admin", "teacher", "student"]}>
        <ProfilePage/>
      </ProtectedRoute>
      } 
    />
    <Route path='courses' element={ <CoursesPage/>} />
    <Route path='users' element={
      <ProtectedRoute roles={["admin", "teacher"]}>
        <UsersPage/>
      </ProtectedRoute>
    }/> 

    <Route path='user/:id' element={ 
      <ProtectedRoute roles={["admin", "teacher", "student"]}>
        <UserPage/>
      </ProtectedRoute>
    }/>

    <Route path='signup' element={ <CreateUser/>} />
    <Route path='create-user' element={ 
      <ProtectedRoute roles={["admin"]}>
        <AdminCreateUser />
      </ProtectedRoute>
      }
    />
    <Route path='admin-update-user/:id' element={
      <ProtectedRoute roles={["admin"]}>
        <AdminUpdateUser />
      </ProtectedRoute>
      }
    />
    <Route path='update-user/:id' element={
      <ProtectedRoute roles={["admin", "teacher", "student"]}>
        <UpdateUser/>
      </ProtectedRoute>
      } 
    />
    <Route path='create-course' element={ 
      <ProtectedRoute roles={["admin", "teacher"]}>
        <CreateCourse/>
      </ProtectedRoute>
      } 
    />
    <Route path='update-course/:id' element={ 
      <ProtectedRoute roles={["admin", "teacher"]}>
        <UpdateCourse/>
      </ProtectedRoute>
    } />
  </Route>
  ),
  //required to use for github pages 
  //{ basename: process.env.NODE_ENV === "test" ? "/" : "/quiz" } 
);


function App() {
  const [user, setUser] = useState(null);
    
  async function getCurrentUser() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/profile",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  useEffect(() => {
    const token = localStorage.getItem("access_token");

      if (token) {
          getCurrentUser();
      }
  }, []);

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
