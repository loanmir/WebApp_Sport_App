import { Component } from "react";
import axios from "axios";

class EditTournamentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      sport: "",
      maxTeams: 0,
      status: "Open",
      originalStatus: "Open",
      allTeams: [],
      loading: true
    };
  }

  componentDidMount() {
    // Fetch the existing data for this tournament
    const id = this.props.tournamentID;
    
    Promise.all([
        axios.get("http://localhost:8080/tournaments/"+id), // Get tournament
        axios.get("http://localhost:8080/teams")            // Get ALL teams
    ])
    .then(([tournamentRes, teamsRes]) => {
        const t = tournamentRes.data;
        this.setState({
          name: t.name,
          sport: t.sport,
          maxTeams: t.maxTeams,
          status: t.status,
          originalStatus: t.status,
          allTeams: teamsRes.data,
          loading: false
        });
      })
      .catch(err => {
        console.error("Error loading tournament:", err);
        alert("Could not load data.");
        this.props.viewFromChild({ page: "tournaments" }); // If error, then go back
      });
  }

  saveEdit = () => {
    const id = this.props.tournamentID;
    axios.put("http://localhost:8080/tournaments/"+id, {
      name: this.state.name,
      sport: this.state.sport,
      maxTeams: this.state.maxTeams,
      status: this.state.status
    }, { withCredentials: true })
    .then(res => {
        alert("Tournament updated!");
        this.props.viewFromChild({ page: "tournaments" }); // After update, go back to tournaments list
    })
    .catch(err => {
        alert(err.response?.data?.error || "Update failed");
    });
  }

  handleInputChange = (e) => {
    this.setState({ 
        [e.target.name]: e.target.value 
    });
  }
  
  addTeamToTournament = (teamId) => {
      const tournamentId = this.props.tournamentID;
      const maxTeams = this.state.maxTeams;
      
      const currentCount = this.state.allTeams.filter(t => {
          if (!t.tournament) return false;
          // If tournament id is an object, then compare _id
          if (typeof t.tournament === 'object') {
              return t.tournament._id === tournamentId;                 // Problems with the tournament Id types -> IF added manually in Compass then STRING - if added through app then OBJECT
          }
          // Else compare directly 
          return t.tournament === tournamentId;
      }).length;

      // Checking if reached max number of teams
      if (currentCount >= maxTeams) {
        alert("Maximum number of teams reached!");
        return;
      }
      
      axios.put("http://localhost:8080/teams/"+teamId, {
          tournament: tournamentId
      }, { withCredentials: true })
      .then(res => {
        // Update local state
          this.setState(prevState => ({
              allTeams: prevState.allTeams.map(t => 
                  t._id === teamId ? { ...t, tournament: tournamentId } : t
              )
          }));
      })
      .catch(err => alert("Could not add team."));
  }

  removeTeamFromTournament = (teamId) => {
      axios.put("http://localhost:8080/teams/"+teamId, {
          tournament: null 
      }, { withCredentials: true })
      .then(res => {
          this.setState(prevState => ({
              allTeams: prevState.allTeams.map(t => 
                  t._id === teamId ? { ...t, tournament: null } : t
              )
          }));
      })
      .catch(err => alert("Could not remove team."));
  }

  startTournament = () => {
    if (!window.confirm("Are you sure you want to start the tournament? This will lock the teams.")) {
        return;
    }

    const id = this.props.tournamentID;

    axios.post("http://localhost:8080/tournaments/"+id+"/matches/generate", {}, { withCredentials: true })
    .then(res =>{
        return axios.put("http://localhost:8080/tournaments/"+id, {
            name: this.state.name,
            sport: this.state.sport,
            maxTeams: this.state.maxTeams,
            status: "Active" // Forcing status update to "Active"
        }, { withCredentials: true });
    })
    .then(res => {
        alert("Tournament started and matches generated!");
        this.props.viewFromChild({ page: "tournaments" });
    })
    .catch(err =>{
        console.error(err);
        alert("Could not start the tournament")
    })
  }

  render() {
    if (this.state.loading) return <div className="p-5 text-center text-muted"><div className="spinner-border text-primary"></div></div>;

    const isActive_Completed = this.state.status === "Active" || this.state.status === "Completed";
    const currentTournamentID = this.props.tournamentID;

    // Teams already present in the tournament
    const myTeams = this.state.allTeams.filter(t => {
        if (!t.tournament) return false;
        if (typeof t.tournament === 'object') {
            return t.tournament._id === currentTournamentID;
        }
        return t.tournament === currentTournamentID;
    });
    
    // Teams available to add
    const availableTeams = this.state.allTeams.filter(t => !t.tournament);
    const isFull = myTeams.length >= this.state.maxTeams;

    return (
      <div className="container mt-4">
        
        {/* Header */}
        <div className="mb-4">
            <h2 className="fw-bold text-primary">
                <i className="bi bi-pencil-square me-2"></i> Manage Tournament
            </h2>
        </div>

        <div className="row g-4">
            
            {/* Left column */}
            <div className="col-lg-5">
                <div className="card border-0 shadow-sm p-4 bg-white rounded-3 h-100">
                    <h5 className="fw-bold mb-4 border-bottom pb-2">Tournament Settings</h5>
                    
                    <div className="mb-3">
                        <label className="form-label small text-muted text-uppercase fw-bold">Tournament Name</label>
                        <input type="text" className="form-control bg-light border-0 py-2" name="name" 
                            value={this.state.name} onChange={this.handleInputChange} />
                    </div>

                    <div className="mb-4">
                        <label className="form-label small text-muted text-uppercase fw-bold">Status</label>
                        <select className="form-select bg-light border-0 py-2" name="status" 
                            value={this.state.status} onChange={this.handleInputChange}>

                            {this.state.originalStatus === "Open" && (
                                <>
                                    <option value="Open">Open (Sign-ups)</option>
                                    {/*<option value="Completed">Completed</option>*/}
                                    {/* In this case, "Active" is hidden */}
                                </>
                            )}

                            {this.state.originalStatus === "Active" && (
                                <>
                                    <option value="Active">Active (In Progress)</option>
                                    <option value="Completed">Completed</option>
                                </>
                            )}

                            {this.state.originalStatus === "Completed" && (
                                <option value="Completed">Completed</option>
                            )}

                        </select>
                    </div>

                    <div className="d-grid gap-2 d-md-flex justify-content-between mt-auto pt-3">
                        <button className="btn btn-outline-secondary rounded-pill px-4 fw-bold" 
                            onClick={() => this.props.viewFromChild({ page: "tournaments" })}>
                            Cancel
                        </button>
                        <button className="btn btn-warning rounded-pill px-4 fw-bold shadow-sm" onClick={this.saveEdit}>
                            Save Changes
                        </button>
                    </div>

                    {/* Start tournament */}
                    {this.state.status === "Open" && (
                        <div className="mt-5 p-3 bg-light rounded-3 border border-dashed text-center">
                            <h6 className="fw-bold text-dark mb-2">Ready to Start?</h6>
                            <p className="text-muted small mb-3">
                                Starting the tournament will lock the roster and generate matches automatically.
                            </p>
                            <button
                                className="btn btn-success w-100 rounded-pill fw-bold shadow-sm"
                                onClick={this.startTournament}
                                disabled={myTeams.length < 2}
                            >
                                <i className="bi bi-play-circle-fill me-2"></i> Start Tournament
                            </button>
                            {myTeams.length < 2 && <small className="text-danger d-block mt-2 fst-italic">Need at least 2 teams to start.</small>}
                        </div>
                    )}
                </div>
            </div>

            {/* Right column */}
            <div className="col-lg-7">
                
                {/* Participating teams */}
                <div className="card border-0 shadow-sm p-4 bg-white rounded-3 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                        <h5 className="fw-bold mb-0">Participating Teams</h5>
                        <span className={`badge rounded-pill ${isFull ? 'bg-danger' : 'bg-success'}`}>
                            {myTeams.length} / {this.state.maxTeams}
                        </span>
                    </div>
                    
                    <div className="list-group">
                        {myTeams.length > 0 ? myTeams.map(t => (
                            <div key={t._id} className="list-group-item border-0 bg-light mb-2 rounded-3 d-flex justify-content-between align-items-center px-3 py-2">
                                <span className="fw-bold text-dark">{t.name}</span>
                                <button className="btn btn-sm btn-outline-danger border-0 rounded-circle" 
                                    onClick={() => this.removeTeamFromTournament(t._id)}
                                    disabled={isActive_Completed}
                                    title="Remove Team"
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                        )) : <div className="text-center py-4 text-muted fst-italic">No teams have joined yet.</div>}
                    </div>
                </div>

                {/* Available teams */}
                <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
                    <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                         <h5 className="fw-bold mb-0">
                            {isActive_Completed ? "Tournament Locked" : (isFull ? "Tournament Full" : "Available Free Agents")}
                         </h5>
                         {!isActive_Completed && !isFull && <span className="badge bg-success rounded-pill">Open Slots</span>}
                    </div>

                    <div style={{ maxHeight: "300px", overflowY: "auto" }} className="pe-2">
                        {availableTeams.length > 0 ? availableTeams.map(t => (
                             <div key={t._id} className="list-group-item border-0 mb-2 rounded-3 d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
                                 <span className="text-secondary">{t.name}</span>
                                 <button 
                                     className="btn btn-sm btn-success rounded-pill px-3 fw-bold" 
                                     onClick={() => this.addTeamToTournament(t._id)}
                                     disabled={isFull || isActive_Completed} 
                                 >
                                     <i className="bi bi-plus-lg me-1"></i> Add
                                 </button>
                             </div>
                        )) : <div className="text-center py-4 text-muted fst-italic">No free agent teams available.</div>}
                    </div>
                </div>

            </div>

        </div>
      </div>
    );
  }
}

export default EditTournamentView;