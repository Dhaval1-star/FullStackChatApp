import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/register.css';

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const registerUser = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post('http://localhost:8080/api/auth/register', {
            name : name,
            email : email,
            password : password
      });
      navigate('/login');
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
      <div className="register-div">
        <h2 className="text-center">Register</h2>
        <form onSubmit={registerUser}>
          <div className="mb-3">
            <label>Username</label>
            <input type="text" placeholder="Enter your username" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" placeholder="Enter your passowrd" className="form-control" required value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <button type="submit" className="btn register-btn w-100">Sign up</button>
        </form>
        <div className="mt-3 login-link">
          <Link to="/">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
