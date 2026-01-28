import { Component } from "react";
import axios from "axios";

class SignUpView extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        user: {
          username: "",
          password: "",
          name: "",
          surname: ""
        },
        // Variables for tracking empty fields, errors, visibility etc.
        errors: {},
        errorMessage: "",
        loading: false,
        showPassword: false
      });
  }

  getTextFromField = (e) => {
    this.setState((prevState) => ({
      user: { ...prevState.user, [e.target.name]: e.target.value },
      errors: { ...prevState.errors, [e.target.name]: "" } // Clear error for this field
    }));
  };


  togglePassword = () => {
    this.setState(prev => ({
      showPassword: !prev.showPassword
    }));
  }

  validateFields = () => {
    const { username, password, name, surname } = this.state.user;
    let errors = {};
    let isValid = true;

    if (!username.trim()) { errors.username = "Username is required"; isValid = false; }
    if (!password) { errors.password = "Password is required"; isValid = false; }
    if (!name.trim()) { errors.name = "First Name is required"; isValid = false; }
    if (!surname.trim()) { errors.surname = "Surname is required"; isValid = false; }

    this.setState({ errors });
    return isValid;
  }


  postSignUp = () => {
    if (!this.validateFields()) {
      return; // Stop if validation fails
    }

    this.setState({ loading: true, errorMessage: "" });

    let user = this.state.user;
    axios.post("http://localhost:8080/users/signup",{
      username: user.username,           
      password: user.password,
      name: user.name,
      surname: user.surname
    })
    .then(res => {
      console.log("Sent to server...") 
      alert("Registration successful! You can now log in.")
      this.props.viewFromChild({ page: "login" })
    }).catch(err => {
      const serverError = err.response?.data?.error || "Registration failed. Please try again.";
      this.setState({ errorMessage: serverError, loading: false });
    })
  }

  render() {
    const {user, errors, loading, errorMessage, showPassword} = this.state;
    return (
      <div className="card shadow-sm p-0 overflow-hidden" style={{maxWidth: "450px", margin: "40px auto" }}>
        
        {/* Header */}
        <div className="card-header bg-primary text-white text-center py-3">
            <h4 className="mb-0">Create Account</h4>
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
                onChange={this.getTextFromField}
                name="username"
                type="text"
                value={user.username}
                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                placeholder="Choose a username"
              />
              <div className="invalid-feedback">{errors.username}</div>
            </div>

            {/* PASSWORD*/}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input
                    onChange={this.getTextFromField}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={user.password}
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    placeholder="Create a password"
                />
                <button 
                    className="btn btn-outline-secondary" 
                    type="button" 
                    onClick={this.togglePassword}
                    style={{zIndex: 0}}
                >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
                <div className="invalid-feedback">{errors.password}</div>
              </div>
            </div>

            {/* FIRST NAME */}
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input
                onChange={this.getTextFromField}
                name="name"
                type="text"
                value={user.name}
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                placeholder="e.g. Mario"
              />
              <div className="invalid-feedback">{errors.name}</div>
            </div>

            {/* SURNAME */}
            <div className="mb-3">
              <label className="form-label">Surname</label>
              <input
                onChange={this.getTextFromField}
                name="surname"
                type="text"
                value={user.surname}
                className={`form-control ${errors.surname ? "is-invalid" : ""}`}
                placeholder="e.g. Rossi"
              />
              <div className="invalid-feedback">{errors.surname}</div>
            </div>
          </form>

          {/* SUBMIT BUTTON */}
          <button
            onClick={this.postSignUp}
            disabled={loading} // Disable button while loading
            className="btn btn-primary w-100 mt-3"
          >
            {loading ? (
                <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Registering...
                </>
            ) : (
                "Sign Up"
            )}
          </button>
          
          {/* BACK TO LOGIN LINK */}
          <div className="text-center mt-3">
            <small className="text-muted">Already have an account? </small>
            <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); this.props.viewFromChild({ page: "login" }); }}
                className="text-decoration-none"
            >
                Login here
            </a>
          </div>

        </div>
      </div>
    );
  }
}

export default SignUpView;
