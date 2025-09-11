import { useReducer, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "./components/layout/Header";
import Home from "./components/Home";
import CreateArticle from "./components/CreateArticle";
import Profile from "./components/Profile";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PostDetail from "./components/posts/PostDetail";
import { UserContext } from "./components/context/MyContext";
import { MyUserReducer } from "./components/reducer/MyUserReducer";
import { authApis, endpoints } from "./configs/Apis";
import cookies from "react-cookies";
import EditPost from "./components/user/EditPost";
import MyPost from "./components/user/MyPost";
import CreatePost from "./components/user/CreatePost";

function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  const getUserFromToken = async () => {
    const token = cookies.load("token");

    if (token) {
      try {
        let user = await authApis(token).get(endpoints.user);
        dispatch({ type: "login", payload: user.data });
      } catch (error) {
        console.error("Failed to fetch user profile with stored token:", error);
        dispatch({ type: "logout" });
      }
    }
  };
  useEffect(() => {
    getUserFromToken();
  }, []);

  return (
    <UserContext.Provider value={[user, dispatch]}>
      <Router>
        <Header />
        <Container className='mt-4'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/post/:postId' element={<PostDetail />} />
            <Route path='/create-article' element={<CreateArticle />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/my-articles' element={<MyPost />} />
            <Route path='/my-articles/:postId' element={<EditPost />} />
            <Route path='/create-post' element={<CreatePost />} />
          </Routes>
        </Container>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
