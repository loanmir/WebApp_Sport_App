import { Component } from "react";
import axios from "axios";

class AddTeamView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      players: [], 
      currentPlayer: {
        name: "",
        surname: "",
        number: ""
      }
    };
  }

  handleTeamName = (e) => {
    this.setState({ name: e.target.value });
  }
  
  handlePlayerInput = (e) => {
    this.setState(prevState => ({
      currentPlayer: {
        ...prevState.currentPlayer,
        [e.target.name]: e.target.value
      }
    }));
  }

  // Add the current player to the list
  addPlayerToList = () => {
    const { name, surname, number } = this.state.currentPlayer;

    if (!name || !surname) {
      alert("Player Name and Surname are required!");
      return;
    }

    this.setState(prevState => ({
      players: [...prevState.players, { name, surname, number }],
      currentPlayer: { name: "", surname: "", number: "" } // Reset inputs
    }));
  }

  removePlayer = (indexToRemove) => {
    this.setState(prevState => ({
      players: prevState.players.filter((_, index) => index !== indexToRemove)
    }));
  }

  postTeam = () => {
    if (!this.state.name) {
        alert("Please enter a Team Name.");
        return;
    }

    if (this.state.players.length === 0) {
        if(!window.confirm("You are creating a team with NO players. Continue?")) return;
    }

    axios.post("http://localhost:8080/teams", {
      name: this.state.name,
      players: this.state.players,
    }, { withCredentials: true })
    .then(res => {
      alert("Team created successfully!");
      this.props.viewFromChild({ page: "teams", tournamentID: null }); 
    })
    .catch(err => {
      console.log("Error:", err);
      alert("Error creating team.");
    });
  }

  render() {
    return (
      <div className="container mt-4" style={{ maxWidth: "800px" }}>
        
        {/* Main container */}
        <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
            
            {/* Header */}
            <div className="mb-4 text-center border-bottom pb-3">
                <h2 className="fw-bold text-primary">
                    <i className="bi bi-people-fill me-2"></i> Create New Team
                </h2>
                <p className="text-muted mb-0">Start by naming your team and adding the roster</p>
            </div>
            
            <div className="card-body p-0">
                
                {/* Team Name input */}
                <div className="mb-5">
                    <label className="form-label fw-bold small text-muted text-uppercase">Team Name</label>
                    <input 
                        type="text" 
                        className="form-control form-control-lg bg-light border-0" 
                        placeholder="e.g. The Lions" 
                        value={this.state.name}
                        onChange={this.handleTeamName}
                    />
                </div>

                {/* Player entry */}
                <div className="bg-light p-4 rounded-3 mb-4">
                    <h5 className="fw-bold mb-3 text-dark">
                        <i className="bi bi-person-plus-fill me-2 text-primary"></i> Add Players
                    </h5>
                    
                    <div className="row g-2 align-items-end">
                        <div className="col-md-5">
                            <label className="form-label small text-muted">First Name</label>
                            <input 
                                type="text" name="name" className="form-control border-0 bg-white" placeholder="John"
                                value={this.state.currentPlayer.name} onChange={this.handlePlayerInput} 
                            />
                        </div>
                        <div className="col-md-5">
                            <label className="form-label small text-muted">Surname</label>
                            <input 
                                type="text" name="surname" className="form-control border-0 bg-white" placeholder="Doe"
                                value={this.state.currentPlayer.surname} onChange={this.handlePlayerInput} 
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label small text-muted">No.</label>
                            <input 
                                type="number" name="number" className="form-control border-0 bg-white" placeholder="#"
                                value={this.state.currentPlayer.number} onChange={this.handlePlayerInput} 
                            />
                        </div>
                    </div>
                    <button 
                        className="btn btn-outline-primary w-100 mt-3 rounded-pill fw-bold bg-white" 
                        onClick={this.addPlayerToList}
                    >
                        <i className="bi bi-plus-lg"></i> Add to Roster
                    </button>
                </div>

                {/* Display team*/}
                {this.state.players.length > 0 && (
                    <div className="mb-5">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                             <label className="fw-bold text-muted small text-uppercase">Current Roster</label>
                             
                        </div>
                        
                        <div className="list-group">
                            {this.state.players.map((p, index) => (
                                <div key={index} className="list-group-item border-0 bg-light mb-2 rounded-3 d-flex justify-content-between align-items-center px-3 py-2">
                                    <div className="d-flex align-items-center">
                                        <span className="badge bg-white text-dark border me-3">#{p.number}</span>
                                        <span className="fw-bold text-dark">{p.name} {p.surname}</span>
                                    </div>
                                    <button 
                                        className="btn btn-sm btn-outline-danger border-0 rounded-circle" 
                                        onClick={() => this.removePlayer(index)}
                                        title="Remove Player"
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer with buttons */}
                <div className="d-flex justify-content-between border-top pt-4 mt-4">
                    <button 
                        onClick={() => this.props.viewFromChild({ page: "teams" })}
                        className="btn btn-outline-secondary rounded-pill px-4 fw-bold"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={this.postTeam} 
                        className="btn btn-success rounded-pill px-5 fw-bold shadow-sm"
                    >
                        <i className="bi bi-check-lg me-2"></i> Create Team
                    </button>
                </div>

            </div>
        </div>
      </div>
    );
  }
}

export default AddTeamView;