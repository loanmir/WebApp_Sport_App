import { Component } from "react";
import axios from "axios";

class AddTournamentView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tournament: {
        name: "",
        sport: "Football", // Default
        startDate: "",
        maxTeams: ""
      }
    };
  }

  // Generic handler for inputs
  QGetTextFromField = (e) => {
    this.setState(prevState => ({
      tournament: { 
        ...prevState.tournament, 
        [e.target.name]: e.target.value 
      },
    }));
  };

  QPostTournament = () => {
    // Validation
    if (!this.state.tournament.name || !this.state.tournament.startDate || !this.state.tournament.maxTeams) {
        alert("Please fill in all fields.");
        return;
    }

    axios.post("http://localhost:8080/tournaments", {
      name: this.state.tournament.name,
      sport: this.state.tournament.sport,
      startDate: this.state.tournament.startDate,
      maxTeams: parseInt(this.state.tournament.maxTeams),
    }, {withCredentials: true})
    .then(res => {
      alert("Tournament created successfully!");
      this.props.QViewFromChild({ page: "tournaments" });
    })
    .catch(err => {
      console.log("Error creating tournament:", err);
      alert("Error creating tournament. Check console for details.");
    });
  }

  render() {
    return (
      <div className="container mt-4" style={{ maxWidth: "600px" }}>
        
        {/* Main container - card */}
        <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
            
            {/* Header */}
            <div className="mb-4 text-center border-bottom pb-3">
                <h2 className="fw-bold text-primary">
                    <i className="bi bi-trophy-fill me-2"></i> Create Tournament
                </h2>
                <p className="text-muted mb-0">Set up a new competition</p>
            </div>

            <div className="card-body p-0">
                
                {/* Tournament name */}
                <div className="mb-3">
                    <label className="form-label fw-bold small text-muted text-uppercase">Tournament Name</label>
                    <input 
                        onChange={this.QGetTextFromField} 
                        name="name" 
                        type="text" 
                        className="form-control bg-light border-0 py-2" 
                        placeholder="e.g. Summer Champions Cup" 
                    />
                </div>

                {/* Select sport */}
                <div className="mb-3">
                    <label className="form-label fw-bold small text-muted text-uppercase">Sport</label>
                    <select 
                        onChange={this.QGetTextFromField} 
                        name="sport" 
                        className="form-select bg-light border-0 py-2"
                        value={this.state.tournament.sport}
                    >
                        <option value="Football">Football</option>
                        <option value="Volleyball">Volleyball</option>
                        <option value="Basketball">Basketball</option>
                    </select>
                </div>

                {/* Start date */}
                <div className="mb-3">
                    <label className="form-label fw-bold small text-muted text-uppercase">Start Date</label>
                    <input 
                        onChange={this.QGetTextFromField} 
                        name="startDate" 
                        type="date" 
                        className="form-control bg-light border-0 py-2" 
                    />
                </div>

                {/* Max teams */}
                <div className="mb-4">
                    <label className="form-label fw-bold small text-muted text-uppercase">Max Teams</label>
                    <input 
                        onChange={this.QGetTextFromField} 
                        name="maxTeams" 
                        type="number" 
                        className="form-control bg-light border-0 py-2" 
                        placeholder="e.g. 16" 
                    />
                </div>

                {/* Footer with buttons */}
                <div className="d-flex justify-content-between border-top pt-4 mt-4">
                    <button 
                        onClick={() => this.props.QViewFromChild({ page: "tournaments" })} 
                        className="btn btn-outline-secondary rounded-pill px-4 fw-bold"
                    >
                        Cancel
                    </button>
                    
                    <button 
                        onClick={this.QPostTournament} 
                        className="btn btn-success rounded-pill px-5 fw-bold shadow-sm"
                    >
                        <i className="bi bi-check-lg me-2"></i> Create Tournament
                    </button>
                </div>

            </div>
        </div>
      </div>
    );
  }
}

export default AddTournamentView;