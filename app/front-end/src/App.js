import { Component } from "react";
// Imported routes for different view Components
import HomeView from "./CustomComponents/HomeView";
import AboutView from "./CustomComponents/AboutView";
import AddNovicaView from "./CustomComponents/AddNovicaView";
import LoginView from "./CustomComponents/LoginView";
import NoviceView from "./CustomComponents/NoviceView";
import SignUpView from "./CustomComponents/SignUpView";
import SingleNovicaView from "./CustomComponents/SingleNovicaView";

class App extends Component {
  // In-build function "constructor()"
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "none",
      novicaID: 0,
    };
  }

  // Custom function for setting the View
  QSetView = (obj) => {
    this.setState({
      currentPage: obj.page,
      novicaID: obj.id || 0,
    });
  };

  QGetView = (state) => {
    let page = state.currentPage;
    switch (page) {
      case "about":
        return <AboutView />;
      case "novice":
        return <NoviceView QIDFromChild={this.QSetView} />;
      case "addnovica":
        return <AddNovicaView QViewFromChild={this.QSetView} />;
      case "signup":
        return <SignUpView QUserFromChild={this.QHandleUserLog} />;
      case "login":
        return <LoginView QUserFromChild={this.QHandleUserLog} />;
      case "novica":
        return <SingleNovicaView QViewFromChild={this.QSetView} data={this.state.novicaID} />;
      default:
        return <HomeView />;
    }
  };

  QHandleUserLog = (obj) => {
    this.QSetView({ page: "home" });
  };

  render() {
    return (
      <div id="APP" className="container-fluid">
        <div id="menu" className="row">
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
              <a
                onClick={() => this.QSetView({ page: "home" })}
                className="navbar-brand"
                href="#"
              >
                Home
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <a
                      onClick={() => {
                        this.QSetView({ page: "about" });
                      }}
                      className="nav-link "
                      href="#"
                    >
                      About
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      onClick={() => {
                        this.QSetView({ page: "novice" });
                      }}
                      className="nav-link "
                      href="#"
                    >
                      News
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      onClick={() => {
                        this.QSetView({ page: "addnovica" });
                      }}
                      className="nav-link"
                      href="#"
                    >
                      Add news
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      onClick={() => {
                        this.QSetView({ page: "signup" });
                      }}
                      className="nav-link "
                      href="#"
                    >
                      Sign up
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      onClick={() => {
                        this.QSetView({ page: "login" });
                      }}
                      className="nav-link "
                      href="#"
                    >
                      Login
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
        <div id="viewer" className="row container">
          {this.QGetView(this.state)}
        </div>
      </div>
    );
  }
}

export default App;
