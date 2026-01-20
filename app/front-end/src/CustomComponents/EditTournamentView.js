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

      allTeams: [],
      loading: true
    };
  }

  componentDidMount() {
    // Fetch the existing data for this tournament
    const id = this.props.tournamentID;
    
    Promise.all([
        axios.get("http://localhost:8080/tournaments/"+id), // Get Tournament
        axios.get("http://localhost:8080/teams")            // Get All Teams
    ])
    .then(([tournamentRes, teamsRes]) => {
        const t = tournamentRes.data;
        // 2. Pre-fill the state
        this.setState({
          name: t.name,
          sport: t.sport,
          maxTeams: t.maxTeams,
          status: t.status,
          allTeams: teamsRes.data,
          loading: false
        });
      })
      .catch(err => {
        console.error("Error loading tournament:", err);
        alert("Could not load data.");
        this.props.QViewFromChild({ page: "tournaments" }); // If error, go back
      });
  }

  
  QSaveEdit = () => {
    const id = this.props.tournamentID;
    axios.put("http://localhost:8080/tournaments/"+id, {
      name: this.state.name,
      sport: this.state.sport,
      maxTeams: this.state.maxTeams,
      status: this.state.status
    }, { withCredentials: true })
    .then(res => {
        alert("Tournament updated!");
        this.props.QViewFromChild({ page: "tournaments" }); // Go back to list
    })
    .catch(err => {
        alert(err.response?.data?.error || "Update failed");
    });
  }


  QHandleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  
  QAddTeamToTournament = (teamId) => {
      const tournamentId = this.props.tournamentID;

      const maxTeams = this.state.maxTeams;
      const currentCount = this.state.allTeams.filter(t => t.tournament === tournamentId).length;

      // Checking if we have reached the limit!
      if (currentCount >= maxTeams) {
        alert("Maximum number of teams reached!");
        return;
      }
      
      axios.put("http://localhost:8080/teams/"+teamId, {
          tournament: tournamentId
      }, { withCredentials: true })
      .then(res => {
          // Update the local state so the UI changes instantly
          this.setState(prevState => ({
              allTeams: prevState.allTeams.map(t => 
                  t._id === teamId ? { ...t, tournament: tournamentId } : t
              )
          }));
      })
      .catch(err => alert("Could not add team."));
  }



  QRemoveTeamFromTournament = (teamId) => {
      axios.put("http://localhost:8080/teams/"+teamId, {
          tournament: null // Set tournament to null
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



  QStartTournament = () => {
    if (!window.confirm("Are you sure you want to start the tournament? This will lock the teams.")) {
        return;
    }

    const id = this.props.tournamentID;

    axios.post("http://localhost:8080/tournaments/"+id+"/matches/generate", {}, { withCredentials: true })
    .then(res =>{
        alert("Tournament started and matches generated!");
        //this.componentDidMount();
        this.setState({ status: "Active" });
    })
    .catch(err =>{
        console.error(err);
        alert("Could not start the tournament")
    })
  }



  render() {
    if (this.state.loading) return <div className="p-5 text-center">Loading Data...</div>;

    
    const currentTournamentID = this.props.tournamentID;
    // Teams already present in the tournament
    const myTeams = this.state.allTeams.filter(t => t.tournament === currentTournamentID);
    // Teams available to add
    const availableTeams = this.state.allTeams.filter(t => !t.tournament);
    const isFull = myTeams.length >= this.state.maxTeams;

    return (
      <div className="container mt-4">
        <div className="row">
            
            {/* LEFT COLUMN: Edit Tournament Details */}
            <div className="col-md-6">
                <div className="card shadow p-4 mb-4">
                    <h4 className="mb-4">Edit Details</h4>
                    
                    <div className="mb-3">
                        <label className="form-label">Tournament Name</label>
                        <input type="text" className="form-control" name="name" 
                            value={this.state.name} onChange={this.QHandleInputChange} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select className="form-select" name="status" 
                            value={this.state.status} onChange={this.QHandleInputChange}>
                            <option value="Open">Open</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                        <button className="btn btn-secondary" 
                            onClick={() => this.props.QViewFromChild({ page: "tournaments" })}>
                            Cancel
                        </button>
                        <button className="btn btn-warning" onClick={this.QSaveEdit}>
                            Save Changes
                        </button>
                    </div>

                    {this.state.status === "Open" && (
                        <div className="mt-4 border-top pt-3">
                            <p className="text-muted small mb-2">
                                Ready to start? This will generate the schedule automatically.
                            </p>
                            <button
                                className="btn btn-success w-100"
                                onClick={this.QStartTournament}
                                disabled={myTeams.length < 2}       // If less than 2 teams, button is disabled
                            >
                                Start Tournament
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN: Manage Teams */}
            <div className="col-md-6">
                
                {/* 1. CURRENT TEAMS LIST */}
                <div className="card shadow mb-4">
                    <div className="card-header bg-primary text-white">
                        Participating Teams ({myTeams.length} / {this.state.maxTeams})
                    </div>
                    <ul className="list-group list-group-flush">
                        {myTeams.length > 0 ? myTeams.map(t => (
                            <li key={t._id} className="list-group-item d-flex justify-content-between align-items-center">
                                {t.name}
                                <button className="btn btn-sm btn-outline-danger" 
                                    onClick={() => this.QRemoveTeamFromTournament(t._id)}>
                                    Remove
                                </button>
                            </li>
                        )) : <li className="list-group-item text-muted">No teams joined yet.</li>}
                    </ul>
                </div>

                {/* 2. AVAILABLE TEAMS LIST */}
                <div className="card shadow">
                    <div className={`card-header text-white ${isFull ? "bg-secondary" : "bg-success"}`}>
                        {isFull ? "Tournament Full" : "Available Free Agent Teams"}
                    </div>
                    <div className="card-body p-0" style={{ maxHeight: "300px", overflowY: "auto" }}>
                        <ul className="list-group list-group-flush">
                            {availableTeams.length > 0 ? availableTeams.map(t => (
                                <li key={t._id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {t.name}
                                    <button 
                                        className="btn btn-sm btn-success" 
                                        onClick={() => this.QAddTeamToTournament(t._id)}
                                        disabled={isFull} 
                                        style={isFull ? {cursor: "not-allowed", opacity: 0.6} : {}}
                                    >
                                        Add
                                    </button>
                                </li>
                            )) : <li className="list-group-item p-3 text-muted">No free teams available.</li>}
                        </ul>
                    </div>
                </div>

            </div>

        </div>
      </div>
    );
  }
}

export default EditTournamentView;