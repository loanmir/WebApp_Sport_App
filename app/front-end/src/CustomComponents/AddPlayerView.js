import { Component } from "react";
import axios from "axios";

class AddPlayerView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      teamName: "Loading...", 
      name: "",
      surname: "",
      number: ""
    };
  }

  componentDidMount() {
    if (this.props.teamID) {
      axios.get("http://localhost:8080/teams/" + this.props.teamID)
        .then(res => {
          this.setState({ teamName: res.data.name });
        })
        .catch(err => {
          console.error("Error fetching team:", err)
          alert(err.response?.data?.error || "Could not fetch team data. Check console.");
        });
    }
  }

  handleInputChange = (e) => {
    this.setState({ 
        [e.target.name]: e.target.value 
    });
  };

  addPlayer = () => {
    // Basic Validation
    if (!this.state.name || !this.state.surname || !this.state.number) {
        alert("Please fill in all fields.");
        return;
    }

    const newPlayer = {
        name: this.state.name,
        surname: this.state.surname,
        number: parseInt(this.state.number)
    };

    // POST request - Not PUT since we are adding to a collection and not updating it
    axios.post("http://localhost:8080/teams/" + this.props.teamID + "/players", newPlayer, { withCredentials: true })
      .then(res => {
        alert("Player added successfully!");
        // Clear form
        this.setState({ name: "", surname: "", number: "" });
      })
      .catch(err => {
        console.error("Error adding player:", err);
        alert(err.response?.data?.error || "Could not add player.");
      });
  };

  render() {
    return (
      <div className="container mt-4" style={{ maxWidth: "600px" }}>
        <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
          
          {/* Header */}
          <div className="mb-4 text-center border-bottom pb-3">
            <h2 className="fw-bold text-primary">
                <i className="bi bi-person-plus-fill me-2"></i> Add New Player
            </h2>
            <p className="text-muted mb-0">
                Adding to Team: <strong className="text-dark">{this.state.teamName}</strong>
            </p>
          </div>

          <div className="card-body p-0">
            
            <form>
                {/* Name*/}
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">First Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="form-control bg-light border-0 py-2" //Soft input style
                    placeholder="e.g. Mario"
                    value={this.state.name}
                    onChange={this.handleInputChange}
                  />
                </div>

                {/* Surname*/}
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Surname</label>
                  <input 
                    type="text" 
                    name="surname" 
                    className="form-control bg-light border-0 py-2" 
                    placeholder="e.g. Rossi"
                    value={this.state.surname}
                    onChange={this.handleInputChange}
                  />
                </div>

                {/* Number*/}
                <div className="mb-4">
                  <label className="form-label fw-bold small text-muted text-uppercase">Jersey Number</label>
                  <input 
                    type="number" 
                    name="number" 
                    className="form-control bg-light border-0 py-2" 
                    placeholder="e.g. 10"
                    value={this.state.number}
                    onChange={this.handleInputChange}
                  />
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-between mt-5">
                   
                   <button 
                      type="button"
                      className="btn btn-outline-secondary rounded-pill px-4 fw-bold"
                      onClick={() => this.props.viewFromChild({ page: "teams" })}
                   >
                      <i className="bi bi-arrow-left me-2"></i> Back
                   </button>

                   <button 
                      type="button"
                      className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
                      onClick={this.addPlayer}
                   >
                      <i className="bi bi-plus-lg me-2"></i> Add Player
                   </button>
                </div>
            </form>

          </div>
        </div>
      </div>
    );
  }
}

export default AddPlayerView;