import { Component } from "react";
import axios from "axios";

class TournamentsView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tournaments: [],
      searchQuery:"", // Tracks the search text
      selectedStatus:"" // Tracks the status filter
    }
  }

  QSetViewInParent = (obj) => {
    this.props.QIDFromChild(obj);
  };

  componentDidMount() {
    axios.get("http://localhost:8080/tournaments")
      .then(res => {
        this.setState({
          tournaments: res.data
        }); 
      }) 
      .catch(err => {
        console.log("Error:", err);
      });
  }

  // Input handler
  QHandleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  // Helper to choose badge color based on status
  getStatusBadgeColor = (status) => {
    switch(status) {
      case "Open": return "bg-success";   // Green
      case "Active": return "bg-primary"; // Blue
      case "Finished": return "bg-secondary"; // Grey
      default: return "bg-dark";
    }
  }

  render() {
    let filteredData = this.state.tournaments.filter(d => {
      
      // Filter by Status
      const matchesStatus = this.state.selectedStatus === "" || d.status === this.state.selectedStatus;

      // Filter by Name (Search)
      const query = this.state.searchQuery.toLowerCase();
      const matchesSearch = d.name.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });

return (
      <div>
        
        {/* 2. SEARCH TOOLBAR */}
        <div className="card" style={{ margin: "10px", padding: "15px" }}>
            <div className="row g-3 align-items-center">
                
                {/* Search Bar */}
                <div className="col-md-4">
                    <input 
                        type="text" 
                        name="searchQuery"
                        className="form-control" 
                        placeholder="Search tournaments by name..." 
                        onChange={this.QHandleInputChange}
                    />
                </div>

                {/* Status Filter */}
                <div className="col-md-3">
                    <select 
                        name="selectedStatus" 
                        className="form-select" 
                        onChange={this.QHandleInputChange}
                    >
                        <option value="">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="Active">Active</option>
                        <option value="Finished">Completed</option>
                    </select>
                </div>

                {/* Create Button (Optional, if you have a "Create Tournament" view) */}
                <div className="col-md-2 text-end">
                     <button 
                        className="btn btn-success w-100"
                        onClick={() => this.QSetViewInParent({ page: "addtournament" })} 
                    >
                    Create New Tournament
                    </button>
                </div>
            </div>
        </div>

        {/* 3. GRID DISPLAY (Using filteredData) */}
        <div
            className="row row-cols-1 row-cols-md-3 g-4"
            style={{ margin: "10px" }}
        >
            {filteredData.length > 0 ? 
            filteredData.map(d => {
                return(
                <div className="col" key={d._id}>
                    <div className="card h-100">
                    
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <strong>{d.sport}</strong>
                        <span className={`badge ${this.getStatusBadgeColor(d.status)}`}>
                        {d.status}
                        </span>
                    </div>

                    <div className="card-body">
                        <h5 className="card-title">{d.name}</h5>
                        <p className="card-text mt-3">
                        <small className="text-muted d-block">
                            <strong>Max Teams: </strong> {d.maxTeams}
                        </small>
                        <small className="text-muted d-block">
                            <strong>Start Date: </strong> 
                            {new Date(d.startDate).toLocaleDateString()}
                        </small>
                        </p>
                    </div>
                    
                    <div className="card-footer bg-white border-top-0">
                        <button
                        onClick={() => this.QSetViewInParent({ page: "teams", tournamentID: d._id })}
                        className="btn btn-primary w-100"
                        >
                        View Participating Teams
                        </button>
                    </div>
                    </div>
                </div>
                )
            })
            :
            <div className="col-12 p-5 text-center">
                {this.state.tournaments.length === 0 ? "Loading tournaments..." : "No tournaments found matching your filters."}
            </div>
            }
        </div>
      </div>
    );
  }
}

export default TournamentsView;