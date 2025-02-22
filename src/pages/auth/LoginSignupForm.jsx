import { useState, useContext } from "react";
import { auth } from "../../api/auth";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import "./LoginSignup.css";

const LoginSignupForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  // Multi-step registration form
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    CIN: "12345678",
    firstName: "John",
    lastName: "Doe",
    birthDate: "1990-05-15",
    email: "youssefbensaid827@gmail.com",
    gender: "male",
    phone: "12345678",
    password: "Test@1234",
    verificationCode: "",
    project: {
      name: "Project Alpha",
      description: "A sample project",
      startDate: "2024-01-01",
    },
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      project: { ...prev.project, [name]: value },
    }));
  };

  // Proceed to next step
  const handleNext = async () => {
    if (step === 1) {
      console.log("Sending verification code to:", formData.email);
    }
    setStep((prev) => prev + 1);
  };

  // Verify email
  const handleVerifyEmail = async () => {
    console.log("Verifying email with code:", formData.verificationCode);
    if (formData.verificationCode === "123456") {
      setStep(3);
    } else {
      alert("Invalid verification code");
    }
  };

  // Submit registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting registration:", formData);
    alert("Registration successful (Test Data)!");
  };

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    try {
      if (!email || !password) {
        dispatch({ type: "LOGIN_FAILURE", payload: "Please fill all fields" });
        return;
      }

      const res = await auth(email, password);
      dispatch({ 
        type: "LOGIN_SUCCESS", 
        payload: { 
          user: res.data.user, 
          token: res.data.token 
        } 
      });
      
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response?.data || "Login failed" });
    }
  };

  const handleForgotPassword = () => {
    alert("Please check your email for the password reset link");
  };

  return (
    <div className="login-signup">
      <div className={`container ${isSignUp ? "active" : ""}`}>
        {isSignUp ? (
         <div className="form-box register">
         <form onSubmit={handleSubmit}>
           <h1>Registration</h1>
       
           {step === 1 && (
             <>
             <div className="inputs-box flex">
             <div className="input-box">
               <input type="text" name="CIN" placeholder="CIN" value={formData.CIN} onChange={handleChange} required />
                <i className="bx bxs-user"></i>
              </div>
              <div className="input-box">
               <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                <i className="bx bxs-user"></i>
              </div>  
              <div className="input-box">
               <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                <i className="bx bxs-user"></i>
              </div>
              </div>
              <div className="inputs-box flex">
              <div className="input-box">
               <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
                <i className="bx bxs-calendar"></i>
              </div>
              <div className="input-box">
               <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <i className="bx bxs-envelope"></i> 
              </div>
              </div>
              <div className="inputs-box flex">
              <div className="input-box">
               <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} required />
                <i className="bx bxs-user"></i>
              </div>
              <div className="input-box">
               <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
                <i className="bx bxs-phone-call"></i>
              </div>
              </div>

              <div className="input-box">
               <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <i className="bx bxs-lock-alt"></i>
              </div>
               <button type="button" className="btn" onClick={handleNext} style={{ backgroundColor: "#7494ec", width: "50%" }}>Next</button>
             </>
           )}
       
           {step === 2 && (
             <>
             <div className="input-box">
             <input type="text" name="verificationCode" placeholder="Enter Verification Code" value={formData.verificationCode} onChange={handleChange} required />
             </div>
               <button type="button" className="btn" onClick={handleVerifyEmail} style={{ backgroundColor: "#7494ec", width: "50%" }}>Verify Email</button>
             </>
           )}
       
           {step === 3 && (
             <>
             <div className="input-box">
             <input type="text" name="name" placeholder="Project Name" value={formData.project.name} onChange={handleProjectChange} required />
             </div>
               <div className="input-box">
               <input type="text" name="description" placeholder="Project Description" value={formData.project.description} onChange={handleProjectChange} required />
               </div>
               <div className="input-box">
               <input type="date" name="startDate" value={formData.project.startDate} onChange={handleProjectChange} required />
               </div>
               
               <button type="submit" className="btn" style={{ backgroundColor: "#7494ec", width: "50%" }}>Register</button>
             </>
           )}
         </form>
       </div>
       
        ) : (
          <div className="form-box login">
            <form onSubmit={handleLogin}>
              <h1>Login</h1>
              <div className="input-box">
                <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                <i className="bx bxs-user"></i>
              </div>
              <div className="input-box">
                <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                <i className="bx bxs-lock-alt"></i>
              </div>
              <div className="forgot-password">
                <Link 
                  to="/auth/forgot-password"
                  style={{ 
                    cursor: 'pointer',
                    color: '#7494ec',
                    fontSize: '0.9rem',
                    textDecoration: 'underline',
                    marginBottom: '15px',
                    display: 'inline-block'
                  }}
                >
                  Do you forget your password?
                </Link>
              </div>
              <button type="submit" className="btn" disabled={loading} style={{ backgroundColor: "#7494ec", width: "50%" }}>
                {loading ? "Logging in..." : "Login"}
              </button>
              {error && <p className="error">{error}</p>}
            </form>
          </div>
        )}

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button className="btn register-btn" onClick={() => setIsSignUp(true)}>Register</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>hey Back!</h1>
            <p>Already have an account?</p>
            <button className="btn login-btn" onClick={() => setIsSignUp(false)}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupForm;
