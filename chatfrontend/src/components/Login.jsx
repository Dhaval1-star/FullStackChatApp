import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/login.css'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post('http://localhost:8080/api/auth/login', {
            email : email,
            password : password
      });
    
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/chat');
    } catch (error) {
      var errMsg = null;
      if (error.response && error.response.data) {
        errMsg = error.response.data;
      } else {
        errMsg = "Unable to connect to server. Please try again later.";
      }
      toast.error(errMsg, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="container h-100 d-flex justify-content-center align-items-center">
      <ToastContainer />
      <div className="loginDiv">
        <h2 className="text-center">Welcome back</h2>
        <form>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" className="form-control" required value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <button className="btn w-100 login-btn" onClick={(e) => loginUser(e)}>
            <span className="pe-2">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/>
              </svg>
            </span>
            Login
          </button>
        </form>
        <div className="mt-3 register-link">
          <Link to="/register">Don't have an account? Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
