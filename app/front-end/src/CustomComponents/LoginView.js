import { Component } from "react";
import axios from "axios";

class LoginView extends Component {
  constructor(props) {
    super(props),
    this.state = {
      user: {
        username: "",
        password: ""
      },
      // Same attributes as in SignUpView.js
      errors: {},           
      errorMessage: "",     
      loading: false,       
      showPassword: false   
    };
  }

  QGetTextFromField = (e) => {
    this.setState((prevState) => ({
      user: { ...prevState.user, [e.target.name]: e.target.value },
      errors: { ...prevState.errors, [e.target.name]: "" }, 
      errorMessage: ""
    }));
  };


  QTogglePassword = () => {
    this.setState(prev => ({ showPassword: !prev.showPassword }));
  }


  QValidateFields = () => {
    const { username, password } = this.state.user;
    let errors = {};
    let isValid = true;

    if (!username.trim()) { errors.username = "Username is required"; isValid = false; }
    if (!password) { errors.password = "Password is required"; isValid = false; }

    this.setState({ errors });
    return isValid;
  }



  QSendUserToParent = (obj) => {
    this.props.QUserFromChild(obj);
  };



  QPostLogin = () =>{
    if (!this.QValidateFields()) {
      return; // Stop if validation fails
    }

    // set loading state
    this.setState({ loading: true, errorMessage: "" });

    let user = this.state.user;
    axios.post("http://localhost:8080/users/signin", {
      username: user.username,
      password: user.password
    },{withCredentials:true})
    .then(res => {
        console.log("Login successful!");
        console.log(res.data)
        this.QSendUserToParent(res.data);
        this.props.QViewFromChild({ page: "home" })
    })
    .catch(err => {
      console.log("Error:", err)
      let message = "Login failed. Please try again.";

      if (err.response) {

        if (err.response.status === 401) {
          message = "Incorrect password. Please try again.";
        } else if (err.response.status === 404) {
          message = "User not registered. Please sign up first.";
        } else {
          message = err.response.data.error || message;
        }
      }

      this.setState({ errorMessage: message, loading: false });
    });
  }

  render() {

    const { user, errors, errorMessage, loading, showPassword } = this.state;
    return (
      <div className="card shadow-sm p-0 overflow-hidden" style={{ maxWidth: "400px", margin: "40px auto" }}>
        
        {/* Header */}
        <div className="card-header bg-primary text-white text-center py-3">
            <h4 className="mb-0">Login</h4>
        </div>

        <div className="card-body p-4">
          
          {/* Server Error Alert */}
          {errorMessage && (
            <div className="alert alert-danger text-center" role="alert">
                {errorMessage}
            </div>
          )}

          <form>
            {/* USERNAME */}
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                onChange={this.QGetTextFromField}
                name="username"
                type="text"
                value={user.username}
                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                placeholder="Enter your username"
              />
              <div className="invalid-feedback">{errors.username}</div>
            </div>

            {/* PASSWORD */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group has-validation">
                <input
                    onChange={this.QGetTextFromField}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={user.password}
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    placeholder="Enter your password"
                />
                <button 
                    className="btn btn-outline-secondary" 
                    type="button" 
                    onClick={this.QTogglePassword}
                    style={{ zIndex: 0 }}
                >
                    <i className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
                </button>
                <div className="invalid-feedback">{errors.password}</div>
              </div>
            </div>
          </form>

          {/* LOGIN BUTTON */}
          <button
            onClick={this.QPostLogin}
            disabled={loading}
            className="btn btn-primary w-100 mt-3 fw-bold"
          >
            {loading ? (
                <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                </>
            ) : "Log In"}
          </button>

          <hr className="my-4" />

          {/* SIGN UP SECTION */}
          <div className="text-center">
            <p className="text-muted small mb-2">Don't have an account?</p>
            <button
              onClick={() => this.props.QViewFromChild({ page: "signup" })}
              className="btn btn-outline-secondary btn-sm"
            >
              Create Account
            </button>
          </div>

        </div>
      </div>
    );
  }
}

export default LoginView;
