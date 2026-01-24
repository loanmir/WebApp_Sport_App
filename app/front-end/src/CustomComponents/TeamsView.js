import { Component } from "react";
import axios from "axios";

class TeamsView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      teams: [],      
      viewMode: "all",  // New: "all" or "mine"
      loading: true
    }
  }

  QSetViewInParent = (obj) => {
    this.props.QIDFromChild(obj); 
  };

  componentDidMount() {
    this.fetchTeams();
  }

  fetchTeams = () => {
    axios.get("http://localhost:8080/teams")
      .then(res => {
        this.setState({
          teams: res.data,
          loading: false
        }); 
      }) 
      .catch(err => {
        console.log("Error:", err);
        this.setState({ loading: false });
      });
  }


  QHandleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }


  render() {
    // 1. Get User Data
    // Assuming userStatus contains { logged: true, user: { _id: "..." } }
    const { logged, user } = this.props.userStatus || {};
    const currentUserId = user && user._id ? user._id : null;
    const filterId = this.props.tournamentID; // Existing prop from parent

    
    let filteredData = this.state.teams;

    // Filtering by tournament
    if (filterId) {
        filteredData = filteredData.filter(team => team.tournament && team.tournament._id === filterId);
    }


    // C. Filtering by personal teams
    if (this.state.viewMode === "mine") {
        filteredData = filteredData.filter(t => {
            const creatorId = t.creator && (t.creator._id || t.creator);
            return creatorId === currentUserId;
        });
    }

    return (
      <div className="container mt-4">
        
        {/* HEADER & CONTROLS */}
        <div className="row mb-4 align-items-center">
            <div className="col-md-5">
                <h2>{filterId ? "Tournament Teams" : "All Teams"}</h2>
            </div>
            
            {/* TOGGLE BUTTONS */}
            <div className="col-md-7 text-end">
                {logged && !filterId && (
                    <div className="btn-group" role="group">
                        <input 
                            type="radio" 
                            className="btn-check" 
                            name="viewMode" 
                            id="viewAll" 
                            value="all"
                            checked={this.state.viewMode === "all"}
                            onChange={this.QHandleInputChange}
                        />
                        <label className="btn btn-outline-primary" htmlFor="viewAll">All Teams</label>

                        <input 
                            type="radio" 
                            className="btn-check" 
                            name="viewMode" 
                            id="viewMine" 
                            value="mine"
                            checked={this.state.viewMode === "mine"}
                            onChange={this.QHandleInputChange}
                        />
                        <label className="btn btn-outline-primary" htmlFor="viewMine">My Teams</label>
                    </div>
                )}
            </div>
        </div>

        {/* SEARCH BAR & CREATE BUTTON */}
        <div className="card p-3 mb-4 shadow-sm bg-light border-0">
            <div className="row g-2 align-items-center">
                
                {/* Create Button */}
                <div className="col-md-4 text-end">
                    {logged ? (
                        <button 
                            className="btn btn-success w-100"
                            onClick={() => this.QSetViewInParent({ page: "addteam" })}
                        >
                            Create New Team
                        </button>
                    ) : (
                        <button className="btn btn-secondary w-100" disabled>Login to Create</button>
                    )}
                </div>
            </div>
        </div>

        {/* SPECIAL HEADER FOR TOURNAMENT VIEW */}
        {filterId !==0 && (
            <div className="alert alert-info d-flex justify-content-between align-items-center">
                <span>
                    Showing teams for Tournament: 
                    <strong> {filteredData.length > 0 && filteredData[0].tournament ? filteredData[0].tournament.name : "Selected Tournament"}</strong>
                </span>
                <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => this.QSetViewInParent({ page: "tournaments" })}>
                      Back to Tournaments
                </button>
            </div>
        )}

        {/* GRID DISPLAY */}
        <div className="row row-cols-1 row-cols-md-3 g-4">
            {filteredData.length > 0 ? 
            filteredData.map(d => {
                
                // Check ownership
                const creatorId = d.creator && (d.creator._id || d.creator);
                const isMyTeam = logged && creatorId === currentUserId;

                return(
                <div className="col" key={d._id}>
                    <div className={`card h-100 shadow-sm ${isMyTeam ? "border-primary" : ""}`}>
                    
                    {/* Header: Name + Badge */}
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                        <small className="text-muted text-uppercase fw-bold" style={{fontSize: "0.75rem"}}>
                            {d.sport || "Team"} {/* Assuming you might add sport to teams later */}
                        </small>
                        {isMyTeam && <span className="badge bg-primary">Mine</span>}
                    </div>

                    <div className="card-body">
                        <h5 className="card-title fw-bold text-primary">{d.name}</h5>
                        
                        <div className="mt-3">
                            <p className="card-text mb-1">
                                <i className="bi bi-people-fill me-2 text-secondary"></i>
                                <strong>Roster: </strong> {d.players ? d.players.length : 0} Players
                            </p>
                            <p className="card-text">
                                <i className="bi bi-trophy-fill me-2 text-secondary"></i>
                                {d.tournament ? (
                                    <span className="badge bg-info text-dark">Playing in {d.tournament.name}</span>
                                ) : (
                                    <span className="badge bg-success">Free Agent</span>
                                )}
                            </p>
                        </div>
                    </div>
                    
                    <div className="card-footer bg-white border-top-0 pb-3">
                        <button
                            onClick={() => this.QSetViewInParent({ page: "team", teamID: d._id, fromTournamentID: filterId })}
                            className="btn btn-outline-primary w-100"
                        >
                            View Details
                        </button>

                        {isMyTeam && (
                            <button
                                onClick={() => this.QSetViewInParent({ page: "addplayer", teamID: d._id })}
                                className="btn btn-success w-100 mt-2"
                            >
                                <i className="bi bi-person-plus-fill me-2"></i>
                                Add Players
                            </button>
                        )}
                    </div>
                    </div>
                </div>
                )
            })
            :
            <div className="col-12 p-5 text-center text-muted">
                {this.state.loading ? 
                    <div className="spinner-border text-primary" role="status"></div> 
                    : 
                    "No teams found matching your criteria."
                }
            </div>
            }
        </div>
      </div>
    );
  }
}

export default TeamsView;