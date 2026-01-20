import { Component } from "react";
import axios from "axios";

class TournamentsView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tournaments: [],
      searchQuery:"", // Tracks the search text
      selectedStatus:"", // Tracks the status filter
      viewMode: "all"
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

  QDeleteTournament = (tournamentId) => {
    if (!window.confirm("Are you sure you want to delete this tournament? This cannot be undone.")) {
      return;
    }
    axios.delete("http://localhost:8080/tournaments/" + tournamentId, { withCredentials: true })
    .then(res => {
        this.setState((prevState) => ({
          tournaments: prevState.tournaments.filter(t => t._id !== tournamentId) // Recreating the tournaments list without the deleted one
        }));
        alert("Tournament deleted successfully.");
        this.props.QIDFromChild({ page: "tournaments"});
    })
    .catch(err => {
        console.error("Delete error:", err);
        alert(err.response?.data?.error || "Could not delete tournament.");
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
      case "Completed": return "bg-secondary"; // Grey
      default: return "bg-dark";
    }
  }

  render() {
    const { logged, user } = this.props.data || {}; 
    const currentUserId = user && user._id ? user._id : null;
    let filteredData = this.state.tournaments.filter(d => {
      
      // FILTER BY TOURNAMENT OWNER
      if (this.state.viewMode === "mine") {
        const creatorId = d.creator && (d.creator._id || d.creator);
        if (creatorId !== currentUserId) return false; // Hiding the tournament if ID do not match
      }
      // FILTER BY STATUS
      const matchesStatus = this.state.selectedStatus === "" || d.status === this.state.selectedStatus;
      // FILTER BY NAME
      const query = this.state.searchQuery.toLowerCase();
      const matchesSearch = d.name.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });

return (
      <div>
        {logged && (
            <div className="container mt-3 mb-0">
                <div className="d-flex justify-content-end">
                    <div className="btn-group" role="group">
                        <input 
                            type="radio" 
                            className="btn-check" 
                            name="viewMode" 
                            id="viewAll" 
                            value="all"
                            checked={this.state.viewMode === "all"}
                            onChange={this.QHandleInputChange}
                        />
                        <label className="btn btn-outline-primary" htmlFor="viewAll">All Tournaments</label>

                        <input 
                            type="radio" 
                            className="btn-check" 
                            name="viewMode" 
                            id="viewMine" 
                            value="mine"
                            checked={this.state.viewMode === "mine"}
                            onChange={this.QHandleInputChange}
                        />
                        <label className="btn btn-outline-primary" htmlFor="viewMine">My Tournaments</label>
                    </div>
                </div>
            </div>
        )}
        
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
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                
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
        <div className="row row-cols-1 row-cols-md-3 g-4" style={{ margin: "10px" }}>
          {filteredData.length > 0 ? 
          filteredData.map(d => {
        
        // CHECK IF CURRENT USER IS THE CREATOR
        // Handle if creator is populated object or just ID string
          const creatorId = d.creator && (d.creator._id || d.creator);
          const isCreator = logged && currentUserId === creatorId;

          return(
            <div className="col" key={d._id}>
              <div className="card h-100">
            
              {/* Header */}
              <div className="card-header d-flex justify-content-between align-items-center">
                <strong>{d.sport}</strong>
                <span className={`badge ${this.getStatusBadgeColor(d.status)}`}>
                {d.status}
                </span>
              </div>

              {/* Body */}
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
            
              {/* Footer with Buttons */}
              <div className="card-footer bg-white border-top-0">

                {/* Match Schedule button */}
                {d.status === "Active" && (
                  <button 
                    className="btn btn-success w-100 mb-2"
                    onClick={() => this.props.QViewFromChild({ 
                      page: "schedule", 
                      tournamentID: d._id 
                    })}
                  >
                    <i className="bi bi-calendar-check me-2"></i>
                    View Schedule
                  </button>
                )} 
                
                {/* Standard View Button */}
                <button
                    onClick={() => this.QSetViewInParent({ page: "teams", tournamentID: d._id })}
                    className="btn btn-primary w-100 mb-2"
                >
                View Participating Teams
                </button>

                {/* CREATOR ONLY BUTTONS */}
                {isCreator && (
                    <div className="d-flex gap-2">
                          <button
                            // You will need to create this 'edittournament' view later!
                            onClick={() => this.QSetViewInParent({ page: "edittournament", tournamentID: d._id })}
                            className="btn btn-outline-warning w-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => this.QDeleteTournament(d._id)}
                            className="btn btn-outline-danger w-50"
                          >
                            Delete
                          </button>
                      </div>
                  )}
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