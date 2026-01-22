import { Component } from "react";
import axios from "axios";

class AddTeamView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      
      // List of players added so far
      players: [], 
      
      currentPlayer: {
        name: "",
        surname: "",
        number: ""
      }
    };
  }

  QHandleTeamName = (e) => {
    this.setState({ name: e.target.value });
  }

  
  QHandlePlayerInput = (e) => {
    this.setState(prevState => ({
      currentPlayer: {
        ...prevState.currentPlayer,
        [e.target.name]: e.target.value
      }
    }));
  }

  // Add the current player to the list
  QAddPlayerToList = () => {
    const { name, surname, number } = this.state.currentPlayer;

    // Basic Validation
    if (!name || !surname) {
      alert("Player Name and Surname are required!");
      return;
    }

    // Add to array and clear inputs
    this.setState(prevState => ({
      players: [...prevState.players, { name, surname, number }],
      currentPlayer: { name: "", surname: "", number: "" } // Reset inputs
    }));
  }

  // Remove a player from the list (optional but helpful)
  QRemovePlayer = (indexToRemove) => {
    this.setState(prevState => ({
      players: prevState.players.filter((_, index) => index !== indexToRemove)
    }));
  }

  // Send everything to the server
  QPostTeam = () => {
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
      // We do NOT send a tournament ID yet
    }, { withCredentials: true })
    .then(res => {
      alert("Team created successfully!");
      // Go back to the general teams view (or wherever you want)
      this.props.QViewFromChild({ page: "teams", tournamentID: null }); 
    })
    .catch(err => {
      console.log("Error:", err);
      alert("Error creating team.");
    });
  }

  render() {
    return (
      <div className="card shadow" style={{ margin: "20px", padding: "20px" }}>
        <h3>Create New Team</h3>
        
        {/* 1. TEAM NAME */}
        <div className="mb-4 mt-3">
          <label className="form-label fw-bold">Team Name</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="e.g. The Lions" 
            value={this.state.name}
            onChange={this.QHandleTeamName}
          />
        </div>

        <hr />

        {/* 2. PLAYER ENTRY SECTION */}
        <h5 className="mb-3">Add Players</h5>
        <div className="row g-2 align-items-end mb-3">
            <div className="col-md-4">
                <label className="form-label">Name</label>
                <input 
                    type="text" name="name" className="form-control" placeholder="John"
                    value={this.state.currentPlayer.name} onChange={this.QHandlePlayerInput} 
                />
            </div>
            <div className="col-md-4">
                <label className="form-label">Surname</label>
                <input 
                    type="text" name="surname" className="form-control" placeholder="Doe"
                    value={this.state.currentPlayer.surname} onChange={this.QHandlePlayerInput} 
                />
            </div>
            <div className="col-md-2">
                <label className="form-label">Number</label>
                <input 
                    type="number" name="number" className="form-control" placeholder="#"
                    value={this.state.currentPlayer.number} onChange={this.QHandlePlayerInput} 
                />
            </div>
            <div className="col-md-2">
                <button className="btn btn-outline-primary w-100" onClick={this.QAddPlayerToList}>
                    + Add
                </button>
            </div>
        </div>

        {/* 3. ROSTER DISPLAY (List of added players) */}
        {this.state.players.length > 0 && (
            <div className="mb-4">
                <label className="form-label fw-bold">Current Roster ({this.state.players.length})</label>
                <ul className="list-group">
                    {this.state.players.map((p, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>
                                <strong>#{p.number}</strong> {p.name} {p.surname}
                            </span>
                            <button 
                                className="btn btn-sm btn-danger" 
                                onClick={() => this.QRemovePlayer(index)}
                            >
                                X
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {/* 4. FINAL SUBMIT */}
        <div className="d-flex justify-content-end mt-3 border-top pt-3">
            <button 
                onClick={() => this.props.QViewFromChild({ page: "teams" })}
                className="btn btn-secondary me-2"
            >
                Cancel
            </button>
            <button 
                onClick={this.QPostTeam} 
                className="btn btn-success"
            >
                Create Team
            </button>
        </div>
      </div>
    );
  }
}

export default AddTeamView;