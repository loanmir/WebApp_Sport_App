import { Component } from "react";
import axios from "axios";
import "./App.css";
// Imported routes for different view Components
import HomeView from "./CustomComponents/HomeView";
import FieldsView from "./CustomComponents/FieldsView";
import AddFieldView from "./CustomComponents/AddFieldView";
import AddTeamView from "./CustomComponents/AddTeamView";
import LoginView from "./CustomComponents/LoginView";
import TeamsView from "./CustomComponents/TeamsView";
import SignUpView from "./CustomComponents/SignUpView";
import SingleTeamView from "./CustomComponents/SingleTeamView";
import SingleFieldView from "./CustomComponents/SingleFieldView";
import TournamentsView from "./CustomComponents/TournamentsView";
import AddTournamentView from "./CustomComponents/AddTournamentView";
import UsersView from "./CustomComponents/UsersView";
import EditTournamentView from "./CustomComponents/EditTournamentView";
import BookFieldView from "./CustomComponents/BookFieldView";
import BookingsView from "./CustomComponents/BookingsView";
import SearchView from "./CustomComponents/SearchView";
import TournamentScheduleView from "./CustomComponents/TournamentScheduleView";
import SingleMatchView from "./CustomComponents/SingleMatchView";
import StandingsView from "./CustomComponents/StandingsView";
import SingleUserView from "./CustomComponents/SingleUserView";
import AddPlayerView from "./CustomComponents/AddPlayerView";


class App extends Component {
  // In-build function "constructor()"
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "none",
      teamID: 0,
      fieldID: 0,
      tournamentID: 0,
      matchID: 0,
      userID: 0,
      userStatus: {logged:false},
      searchQuery: "",
      tempSearch: ""
    };
  }

  // Custom function for setting the View
  QSetView = (obj) => {
    this.setState({
      currentPage: obj.page,
      teamID: obj.teamID || 0,
      fieldID: obj.fieldID || 0,
      tournamentID: obj.tournamentID || obj.fromTournamentID || 0,
      matchID: obj.matchID || 0,
      userID: obj.userID || 0
    });
  };

  QGetView = (state) => {
    let page = state.currentPage;
    switch (page) {
      case "fields":
        return <FieldsView QViewFromChild={this.QSetView} userStatus={this.state.userStatus}/>;
      case "addfield":
        return <AddFieldView QViewFromChild={this.QSetView} />;
      case "field":
        return <SingleFieldView QViewFromChild={this.QSetView} data={this.state.fieldID} />;    // SINGLE FIELD VIEW IS NOT USED!!!!!!
      case "teams":
        return <TeamsView QViewFromChild={this.QSetView} tournamentID={this.state.tournamentID} userStatus={this.state.userStatus}/>;
      case "addteam":
        return state.userStatus.logged ? <AddTeamView QViewFromChild={this.QSetView} /> : <LoginView QUserFromChild={this.QSetUser} QViewFromChild={this.QSetView} />;
      case "tournaments":
        return <TournamentsView QViewFromChild={this.QSetView} data={this.state.userStatus}/>;
      case "addtournament":
        return state.userStatus.logged ? <AddTournamentView QViewFromChild={this.QSetView} /> : <LoginView QUserFromChild={this.QSetUser} QViewFromChild={this.QSetView} />;
      case "edittournament":
        return <EditTournamentView QViewFromChild={this.QSetView} tournamentID={this.state.tournamentID} />;
      case "signup":
        return <SignUpView QViewFromChild={this.QSetView} />;
      case "login":
        return <LoginView QUserFromChild={this.QSetUser} QViewFromChild={this.QSetView}  />;
      case "team":
        return <SingleTeamView QViewFromChild={this.QSetView} data={this.state.teamID} fromTournamentID={this.state.tournamentID} />;
      case "users":
        return <UsersView QViewFromChild={this.QSetView} />;
      case "bookfield":
        return state.userStatus.logged ? <BookFieldView fieldID={this.state.fieldID} QViewFromChild={this.QSetView} /> : <LoginView QUserFromChild={this.QSetUser} QViewFromChild={this.QSetView} />;
      case "bookings":
        return <BookingsView QViewFromChild={this.QSetView} />;
      case "search":
        return <SearchView QViewFromChild={this.QSetView} searchQuery={this.state.searchQuery} />;
      case "schedule":
        return <TournamentScheduleView QViewFromChild={this.QSetView} tournamentID={this.state.tournamentID} />;
      case "match":
        return <SingleMatchView QViewFromChild={this.QSetView} matchID={this.state.matchID} />;
      case "standings":
        return <StandingsView QViewFromChild={this.QSetView} tournamentID={this.state.tournamentID} />;
      case "singleUser":
        return <SingleUserView QViewFromChild={this.QSetView} userID={this.state.userID} />;
      case "addplayer":
        return <AddPlayerView QViewFromChild={this.QSetView} teamID={this.state.teamID} />;
      default:
        return <HomeView QViewFromChild={this.QSetView} userStatus={this.state.userStatus} />;
    }
  };

  QSetUser = (obj) => {
    this.setState({
      userStatus:{logged:true, user: obj.user}
    })
  };




  componentDidMount() {
    axios.get("http://localhost:8080/whoami", {withCredentials:true})
    .then(res => {
        console.log("Session Check", res.data);
        if(res.data.logged) {
            this.setState({
                userStatus: {
                    logged: true,
                    // The GET /login route usually returns the whole user object or just the name. 
                    // Adjust '.username' based on what your backend sends in 'req.session.user'
                    user: res.data.user
                }
            })
        } else {
            this.setState({userStatus: {logged:false}});
        }
      }) 
      .catch(err => { 
        console.log("Error checking session:", err);
      });
  }

  QLogout = () => {
    axios.post("http://localhost:8080/users/logout", {}, {withCredentials:true})
      .then(res => {
        console.log("Logged out successfully");
        this.setState({
          userStatus: { logged: false },
          currentPage: "login"  
        });
      })
      .catch(err => {
        console.log("Error logging out:", err);
      });
  }

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
                {this.state.userStatus.logged ? (
                  <>
                  {/* Circle Avatar Background */}
                    <div 
                      className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center me-2 shadow-sm" 
                      style={{ width: "35px", height: "35px", fontSize: "1.2rem", fontWeight: "bold", border: "2px solid white" }}
                    >
                  
                    {this.state.userStatus.user.user_username.substring(0, 2).toUpperCase()} {/* Taking chars 0 and 1, so first 2 letters and convert them to upper case*/}
                    </div>
       
                  {/* Username Text */}
                    <span className="fw-bold">
                      {this.state.userStatus.user.user_username}
                    </span>
                  </>
                ) : (
                  <span className="fw-bold fst-italic">
                    <i className="bi bi-trophy-fill me-2"></i>
                    SportManager
                  </span>
                )}
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
                        this.QSetView({ page: "fields" });
                      }}
                      className="nav-link "
                      href="#"
                    >
                      Fields 
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      onClick={() => {
                        this.QSetView({ page: "users" });
                      }}
                      className="nav-link "
                      href="#"
                    >
                      Users
                    </a>
                  </li>

                  {/*<li className="nav-item">
                    <a
                      onClick={() => {
                        this.QSetView({ page: "teams" });
                      }}
                      className="nav-link "
                      href="#"
                    >
                      Teams
                    </a>
                  </li>*/}

                  <li className="nav-item">
                    <a
                      onClick={() => {
                        this.QSetView({ page: "teams" });
                      }}
                      className="nav-link"
                      href="#"
                    >
                      Teams
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      onClick={() => {
                        this.QSetView({ page: "tournaments" });
                      }}
                      className="nav-link"
                      href="#"
                    >
                      Tournaments
                    </a>
                  </li>

                  {/*<li className="nav-item">
                    <a
                      onClick={() => {
                        this.QSetView({ page: "signup" });
                      }}
                      className="nav-link "
                      href="#"
                    >
                      Sign up
                    </a>
                  </li>*/}

                  {this.state.userStatus.logged ? (
                    <>  {/*React fragment -> It is actually an invisible wrapper for elements*/}
                      <li className="nav-item">
                        <a
                          onClick={() => {
                          this.QSetView({ page: "bookings" });
                          }}
                          className="nav-link"
                          href="#"
                        >
                        Bookings
                        </a>
                      </li>
                    
                    
                      <li className="nav-item">
                        <a
                        onClick={() => this.QLogout()} // Call the logout function
                        className="nav-link"
                        href="#"
                        >
                        Logout 
                        </a>
                      </li>
                    </>
                  ) : (
                    <li className="nav-item">
                      <a
                      onClick={() => this.QSetView({ page: "login" })}
                      className="nav-link"
                      href="#"
                      >
                        Login
                      </a>
                    </li>
                  )}
                </ul>

                {/* SEARCH BAR FOR QUERY SEARCH */}
                <form 
                    className="d-flex ms-3" 
                    onSubmit={(e) => {
                        e.preventDefault();  // stopping the reload of the page when hitting enter
                        
                        const searchValue = this.state.tempSearch;
                        if(searchValue) {
                            this.setState({ 
                                searchQuery: searchValue, 
                                currentPage: "search" 
                            });
                        }
                    }}
                >
                    <input 
                        className="form-control me-2" 
                        type="search" 
                        placeholder="Search..." 
                        aria-label="Search"
                        // Storing in temp variable to avoid searching on every keystroke
                        onChange={(e) => this.setState({ tempSearch: e.target.value })}
                    />
                    <button className="btn btn-outline-light" type="submit">Search</button>
                </form>

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
