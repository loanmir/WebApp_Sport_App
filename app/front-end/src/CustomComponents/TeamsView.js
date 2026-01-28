import { Component } from "react";
import axios from "axios";

class TeamsView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      teams: [],      
      viewMode: "all",  //all or mine
      loading: true
    }
  }

  setViewInParent = (obj) => {
    this.props.viewFromChild(obj); 
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


  handleInputChange = (e) => {
    this.setState({ 
        [e.target.name]: e.target.value
    });
  }


  render() {
    const { logged, user } = this.props.userStatus || {};
    const currentUserId = user && user._id ? user._id : null;
    const filterId = this.props.tournamentID; // Existing prop from parent

    
    let filteredData = this.state.teams;

    // Filtering by tournament
    if (filterId) {
        filteredData = filteredData.filter(team => team.tournament && team.tournament._id === filterId);
    }


    // Filtering personal teams
    if (this.state.viewMode === "mine") {
        filteredData = filteredData.filter(t => {
            const creatorId = t.creator && (t.creator._id || t.creator);
            return creatorId === currentUserId;
        });
    }

    return (
      <div className="container mt-4">
        
        {/* Control bar */}
        <div className="card border-0 shadow-sm p-4 mb-4 bg-white rounded-3">
            <div className="row align-items-center g-3">
                
                {/* Title */}
                <div className="col-md-4">
                    <h2 className="fw-bold text-primary mb-0">
                        <i className="bi bi-people-fill me-2"></i> 
                        {filterId ? "Tournament Teams" : "All Teams"}
                    </h2>
                </div>

                {/* Toggle for All vs Mine */}
                <div className="col-md-4 text-center">
                    {logged && !filterId && (
                        <div className="btn-group shadow-sm" role="group">
                            <input 
                                type="radio" 
                                className="btn-check" 
                                name="viewMode" 
                                id="viewAll" 
                                value="all"
                                checked={this.state.viewMode === "all"}
                                onChange={this.handleInputChange}
                            />
                            <label className="btn btn-outline-primary fw-bold px-4" htmlFor="viewAll">All</label>

                            <input 
                                type="radio" 
                                className="btn-check" 
                                name="viewMode" 
                                id="viewMine" 
                                value="mine"
                                checked={this.state.viewMode === "mine"}
                                onChange={this.handleInputChange}
                            />
                            <label className="btn btn-outline-primary fw-bold px-4" htmlFor="viewMine">My Teams</label>
                        </div>
                    )}
                </div>
                
                {/* Create button */}
                <div className="col-md-4 text-end">
                    {logged ? (
                        <button 
                            className="btn btn-primary rounded-pill fw-bold shadow-sm px-4"
                            onClick={() => this.setViewInParent({ page: "addteam" })}
                        >
                            <i className="bi bi-plus-lg me-2"></i> Create Team
                        </button>
                    ) : (
                        <span className="text-muted small">Login to create a team</span>
                    )}
                </div>
            </div>
        </div>

        {/* Header for tournament view */}
        {filterId !== 0 && filterId !== undefined && (
            <div className="alert alert-light border shadow-sm d-flex justify-content-between align-items-center mb-4 rounded-3">
                <span>
                    <i className="bi bi-info-circle-fill text-primary me-2"></i>
                    Showing teams for: 
                    <strong> {filteredData.length > 0 && filteredData[0].tournament ? filteredData[0].tournament.name : "Selected Tournament"}</strong>
                </span>
                <button
                    className="btn btn-sm btn-outline-secondary rounded-pill"
                    onClick={() => this.setViewInParent({ page: "tournaments" })}>
                      <i className="bi bi-arrow-left me-1"></i> Back
                </button>
            </div>
        )}

        {/* Grid */}
        <div className="row row-cols-1 row-cols-md-3 g-4">
            {filteredData.length > 0 ? 
            filteredData.map(d => {
                
                // Check ownership
                const creatorId = d.creator && (d.creator._id || d.creator);
                const isMyTeam = logged && creatorId === currentUserId;

                return(
                <div className="col" key={d._id}>
                    {/* Card container */}
                    <div className="card feature-card h-100 border-0 shadow-sm position-relative">
                        <div className="card-body p-4">
                            
                            <div className="d-flex justify-content-between mb-3">
                                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
                                    {d.sport || "Team Sport"}
                                </span>
                                {isMyTeam && <span className="badge bg-success rounded-pill">My Team</span>}
                            </div>

                            {/* Title */}
                            <h5 className="card-title fw-bold text-dark mb-3" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.5px" }}>
                                {d.name}
                            </h5>
                            
                            {/* Info block */}
                            <div className="mb-4">
                                <p className="card-text text-muted mb-2 small">
                                    <i className="bi bi-people-fill me-2 text-primary"></i>
                                    <strong>Roster: </strong> {d.players ? d.players.length : 0} Players
                                </p>
                                <p className="card-text small">
                                    <i className="bi bi-trophy-fill me-2 text-warning"></i>
                                    {d.tournament ? (
                                        <span className="text-dark">Playing in <strong>{d.tournament.name}</strong></span>
                                    ) : (
                                        <span className="text-muted fst-italic">Free Agent Team</span>
                                    )}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="mt-auto">
                                <button
                                    onClick={() => this.setViewInParent({ page: "team", teamID: d._id, fromTournamentID: filterId })}
                                    className="btn btn-outline-primary w-100 rounded-pill fw-bold"
                                >
                                    View Details
                                </button>

                                {isMyTeam && (
                                    <button
                                        onClick={() => this.setViewInParent({ page: "addplayer", teamID: d._id })}
                                        className="btn btn-light text-primary border w-100 rounded-pill mt-2 fw-bold"
                                    >
                                        <i className="bi bi-person-plus-fill me-1"></i> Add Players
                                    </button>
                                )}
                            </div>

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
                    <div>
                         <i className="bi bi-people fs-1 opacity-25 mb-3 d-block"></i>
                         <h5>No teams found matching your criteria.</h5>
                    </div>
                }
            </div>
            }
        </div>
      </div>
    );
  }
}

export default TeamsView;