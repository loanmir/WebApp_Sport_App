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
        .catch(err => console.error("Error fetching team:", err));
    }
  }

  QHandleInputChange = (e) => {
    this.setState({ 
        [e.target.name]: e.target.value 
    });
  };

  QAddPlayer = () => {
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

    // POST request
    axios.post("http://localhost:8080/teams/" + this.props.teamID + "/players", newPlayer, { withCredentials: true })
      .then(res => {
        alert("Player added successfully!");
        // Clear form
        this.setState({ name: "", surname: "", number: "" });
      })
      .catch(err => {
        console.error("Error adding player:", err);
        alert("Could not add player. Check console.");
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
                    onChange={this.QHandleInputChange}
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
                    onChange={this.QHandleInputChange}
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
                    onChange={this.QHandleInputChange}
                  />
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-between mt-5">
                   
                   <button 
                      type="button"
                      className="btn btn-outline-secondary rounded-pill px-4 fw-bold"
                      onClick={() => this.props.QViewFromChild({ page: "teams" })}
                   >
                      <i className="bi bi-arrow-left me-2"></i> Back
                   </button>

                   <button 
                      type="button"
                      className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
                      onClick={this.QAddPlayer}
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