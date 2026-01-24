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

    // POST request -> Because we are adding a new entry & not replacing it!
    axios.post("http://localhost:8080/teams/" + this.props.teamID + "/players", newPlayer, { withCredentials: true })
      .then(res => {
        alert("Player added successfully!");
        // Clearin the inputs from the form
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
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Add Player to: {this.state.teamName}</h4>
          </div>

          <div className="card-body">
            
            {/* NAME INPUT */}
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input 
                type="text" 
                name="name" 
                className="form-control" 
                placeholder="e.g. Mario"
                value={this.state.name}
                onChange={this.QHandleInputChange}
              />
            </div>

            {/* SURNAME INPUT */}
            <div className="mb-3">
              <label className="form-label">Surname</label>
              <input 
                type="text" 
                name="surname" 
                className="form-control" 
                placeholder="e.g. Rossi"
                value={this.state.surname}
                onChange={this.QHandleInputChange}
              />
            </div>

            {/* NUMBER INPUT */}
            <div className="mb-3">
              <label className="form-label">Jersey Number</label>
              <input 
                type="number" 
                name="number" 
                className="form-control" 
                placeholder="e.g. 10"
                value={this.state.number}
                onChange={this.QHandleInputChange}
              />
            </div>

            <div className="d-flex justify-content-between mt-4">
               {/* BACK BUTTON */}
               <button 
                  className="btn btn-outline-secondary"
                  onClick={() => this.props.QViewFromChild({ page: "teams" })}
               >
                  Back to Teams
               </button>

               {/* SUBMIT BUTTON */}
               <button 
                  className="btn btn-success px-4"
                  onClick={this.QAddPlayer}
               >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Player
               </button>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default AddPlayerView;