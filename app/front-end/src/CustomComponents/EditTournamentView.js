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
      loading: true
    };
  }

  componentDidMount() {
    // Fetch the existing data for this tournament
    const id = this.props.tournamentID;
    axios.get("http://localhost:8080/tournaments/"+id)
      .then(res => {
        const t = res.data;
        // 2. Pre-fill the state
        this.setState({
          name: t.name,
          sport: t.sport,
          maxTeams: t.maxTeams,
          status: t.status,
          loading: false
        });
      })
      .catch(err => {
        console.error("Error loading tournament:", err);
        alert("Could not load tournament data.");
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

  render() {
    if (this.state.loading) return <div className="p-5 text-center">Loading Data...</div>;

    return (
      <div className="container mt-4">
        <div className="card shadow p-4">
            <h2 className="mb-4">Edit Tournament</h2>
            
            <div className="mb-3">
                <label className="form-label">Tournament Name</label>
                <input type="text" className="form-control" name="name" 
                    value={this.state.name} onChange={this.QHandleInputChange} />
            </div>

            <div className="row">
                <div className="col-md-4 mb-3">
                    <label className="form-label">Sport</label>
                    <select className="form-select" name="sport" 
                        value={this.state.sport} onChange={this.QHandleInputChange}>
                        <option value="Soccer">Soccer</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Volleyball">Volleyball</option>
                        <option value="Tennis">Tennis</option>
                    </select>
                </div>

                <div className="col-md-4 mb-3">
                    <label className="form-label">Max Teams</label>
                    <input type="number" className="form-control" name="maxTeams" 
                        value={this.state.maxTeams} onChange={this.QHandleInputChange} />
                </div>

                <div className="col-md-4 mb-3">
                    <label className="form-label">Status</label>
                    <select className="form-select" name="status" 
                        value={this.state.status} onChange={this.QHandleInputChange}>
                        <option value="Open">Open</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
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
        </div>
      </div>
    );
  }
}

export default EditTournamentView;