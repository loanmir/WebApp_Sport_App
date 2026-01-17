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
      });
  }

  QGetTextFromField = (e) => {
    this.setState((prevState) => ({
      user: { ...prevState.user, [e.target.name]: e.target.value },
    }));
  };

  // CHANGE THIS FUNCTION SO THAT IT CHECKS WHETER ALL THE FIELDS ARE NOT EMPTY. IF SOME ARE EMPTY THEN DON'T SEND TO PARENT (HOME)!!
  // EXAMPLE: TOOLTIP on Bootstrap!
  QSendUserToParent = (state) => {
    this.props.QUserFromChild(state.user);
  };

  QPostSignUp = () => {
    let user = this.state.user;
    axios.post("http://localhost:8080/users/register",{
      username: user.username,           // remember to check also the email format!! If it is valid, like @, domain etc.
      password: user.password,
      name: user.name,
      surname: user.surname
    })
    .then(res => {
      console.log("Sent to server...") // HERE then check whether user already exists in database!!
      alert("Registration successful! You can now log in.")
      this.props.QViewFromChild({ page: "login" })
    }).catch(err => {
      console.log(err)
    })
  }

  render() {
    return (
      <div
        className="card"
        style={{
          width: "400px",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <form style={{ margin: "20px" }}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="username"
              type="text"
              className="form-control"
              id="inputUsername"
              aria-describedby="emailHelp"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="password"
              type="password"
              className="form-control"
              id="inputPassword"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="name"
              type="text"
              className="form-control"
              id="inputName"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Surname</label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="surname"
              type="text"
              className="form-control"
              id="inputSurname"
            />
          </div>
        </form>
        <button
          onClick={() => this.QPostSignUp()}
          style={{ margin: "10px" }}
          className="btn btn-primary bt"
        >
          Submit
        </button>
      </div>
    );
  }
}

export default SignUpView;
