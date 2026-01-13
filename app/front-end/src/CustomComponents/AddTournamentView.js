import { Component } from "react";
import axios from "axios";

class AddTournamentView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // Initialize with default values
      tournament: {
        name: "",
        sport: "", // Default selection
        startDate: "",
        maxTeams: ""
      }
    };
  }

  // Generic handler for all inputs
  QGetTextFromField = (e) => {
    this.setState(prevState => ({
      tournament: { 
        ...prevState.tournament, 
        [e.target.name]: e.target.value 
      },
    }));
  };

  QPostTournament = () => {
    
    // 2. Send POST request
    // Note: The backend expects: { name, sport, startDate, maxTeams }
    // The 'creator' ID is usually handled by the backend (req.session) 
    // or you might need to hardcode it temporarily if you aren't logged in.
    
    // For testing without login, you might need to add: creator: "YOUR_USER_ID_HERE" inside this object.
    axios.post("http://localhost:8080/tournaments", {
      name: this.state.tournament.name,
      sport: this.state.tournament.sport,
      startDate: this.state.tournament.startDate,
      maxTeams: parseInt(this.state.tournament.maxTeams), // Ensure it's a number
    })
    .then(res => {
      console.log("Tournament created:", res.data);
      console.log("Sent tournament to server...");
    })
    .catch(err => {
      console.log("Error creating tournament:", err);
      alert("Error creating tournament. Check console for details.");
    });

    this.props.QViewFromChild({ page: "tournaments" });
  }

  render() {
    return (
      <div className="card" style={{ margin: "10px", padding: "20px" }}>
        <h3>Create New Tournament</h3>
        
        {/* 1. NAME */}
        <div className="mb-3">
          <label className="form-label">Tournament Name</label>
          <input 
            onChange={this.QGetTextFromField} 
            name="name" 
            type="text" 
            className="form-control" 
            placeholder="e.g. Summer Champions Cup" 
          />
        </div>

        {/* 2. SPORT (Dropdown) */}
        <div className="mb-3">
          <label className="form-label">Sport</label>
          <select 
            onChange={this.QGetTextFromField} 
            name="sport" 
            className="form-select"
            value={this.state.tournament.sport}
          >
            <option value="Football">Football</option>
            <option value="Volleyball">Volleyball</option>
            <option value="Basketball">Basketball</option>
          </select>
        </div>

        {/* 3. START DATE */}
        <div className="mb-3">
          <label className="form-label">Start Date</label>
          <input 
            onChange={this.QGetTextFromField} 
            name="startDate" 
            type="date" 
            className="form-control" 
          />
        </div>

        {/* 4. MAX TEAMS */}
        <div className="mb-3">
          <label className="form-label">Max Teams</label>
          <input 
            onChange={this.QGetTextFromField} 
            name="maxTeams" 
            type="number" 
            className="form-control" 
            placeholder="e.g. 16" 
          />
        </div>

        {/* BUTTONS */}
        <div className="d-flex gap-2">
            <button 
                onClick={this.QPostTournament} 
                className="btn btn-success"
            >
                Create Tournament
            </button>
            
            <button 
                onClick={() => this.props.QViewFromChild({ page: "tournaments" })} 
                className="btn btn-secondary"
            >
                Cancel
            </button>
        </div>

      </div>
    );
  }
}

export default AddTournamentView;