import { Component } from "react";
import axios from "axios";

class TournamentsView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tournaments: [],
      searchQuery:"", 
      selectedStatus:"", 
      viewMode: "all"
    }
  }

  setViewInParent = (obj) => {
    this.props.viewFromChild(obj);
  };

  fetchTournaments = () => {
    const {searchQuery, selectedStatus} = this.state;
    axios.get("http://localhost:8080/tournaments?q="+searchQuery+"&status="+selectedStatus)
      .then(res => {
        this.setState({ 
          tournaments: res.data 
        }); 
      }) 
      .catch(err => {
        console.log("Error:", err);
      });
  }

  componentDidMount() {
    this.fetchTournaments();
  }

  deleteTournament = (tournamentId) => {
    if (!window.confirm("Are you sure you want to delete this tournament? This cannot be undone.")) {
      return;
    }
    axios.delete("http://localhost:8080/tournaments/" + tournamentId, { withCredentials: true })
    .then(res => {
        this.fetchTournaments();
        alert("Tournament deleted successfully.");
        this.props.viewFromChild({ page: "tournaments"});
    })
    .catch(err => {
        console.error("Delete error:", err);
        alert(err.response?.data?.error || "Could not delete tournament.");
    });
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    }, () => {
      this.fetchTournaments(); 
    });
  }

  // Helper to choose badge color
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
      if (this.state.viewMode === "mine") {
        const creatorId = d.creator && (d.creator._id || d.creator);
        if (creatorId !== currentUserId) return false; 
      }
      return true;
    });

    return (
      <div className="container mt-4">
        
        {/* Header */}
        <div className="row align-items-center mb-4">
            <div className="col-md-6">
                <h2 className="fw-bold text-primary mb-0">
                    <i className="bi bi-trophy-fill me-2"></i> Tournaments
                </h2>
            </div>
            <div className="col-md-6 text-md-end">
              {/* Toggle for view mode */}
                {logged && (
                    <div className="btn-group shadow-sm" role="group">
                        <input 
                            type="radio" className="btn-check" name="viewMode" id="viewAll" value="all"
                            checked={this.state.viewMode === "all"}
                            onChange={this.handleInputChange}
                        />
                        <label className="btn btn-outline-primary rounded-start-pill px-3 fw-bold" htmlFor="viewAll">All</label>

                        <input 
                            type="radio" className="btn-check" name="viewMode" id="viewMine" value="mine"
                            checked={this.state.viewMode === "mine"}
                            onChange={this.handleInputChange}
                        />
                        <label className="btn btn-outline-primary rounded-end-pill px-3 fw-bold" htmlFor="viewMine">My Tournaments</label>
                    </div>
                )}
            </div>
        </div>

        {/* Search bar + Create button */}
        <div className="card border-0 shadow-sm p-4 mb-4 bg-white rounded-3">
            <div className="row g-3 align-items-center">
                
                {/* Search */}
                <div className="col-md-5">
                    <div className="input-group">
                        <span className="input-group-text bg-light border-0"><i className="bi bi-search text-muted"></i></span>
                        <input 
                            type="text" 
                            name="searchQuery"
                            className="form-control bg-light border-0 py-2" 
                            placeholder="Search tournaments..." 
                            onChange={this.handleInputChange}
                        />
                    </div>
                </div>

                {/* Status filter */}
                <div className="col-md-3">
                    <select 
                        name="selectedStatus" 
                        className="form-select bg-light border-0 py-2" 
                        onChange={this.handleInputChange}
                    >
                        <option value="">All Statuses</option>
                        <option value="Open">Open (Sign-ups)</option>
                        <option value="Active">Active (Playing)</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                
                {/* Create button */}
                <div className="col-md-4 text-end">
                    {logged ? (
                        <button 
                            className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm"
                            onClick={() => this.setViewInParent({ page: "addtournament" })}
                        >
                            <i className="bi bi-plus-lg me-2"></i> Create Tournament
                        </button>
                    ) : (
                        <span className="text-muted small fst-italic">Login to create a tournament</span>
                    )}
                </div>
            </div>
        </div>

        {/* Grid */}
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {filteredData.length > 0 ? 
          filteredData.map(d => {
            const creatorId = d.creator && (d.creator._id || d.creator);
            const isCreator = logged && currentUserId === creatorId;

            return(
              <div className="col" key={d._id}>
                <div className="card feature-card h-100 border-0 shadow-sm position-relative">
                  
                  <div className="card-body p-4 d-flex flex-column">
                    
                    {/* Top badges */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge bg-light text-dark border rounded-pill px-3">{d.sport}</span>
                        <span className={`badge rounded-pill px-3 ${this.getStatusBadgeColor(d.status)}`}>
                            {d.status}
                        </span>
                    </div>

                    {/* Title */}
                    <h4 className="card-title fw-bold text-dark mb-3">
                        {d.name}
                    </h4>

                    {/* Details */}
                    <div className="mb-4">
                        <p className="card-text text-muted small mb-1">
                            <i className="bi bi-people-fill me-2 text-primary"></i>
                            <strong>Max Teams: </strong> {d.maxTeams}
                        </p>
                        <p className="card-text text-muted small">
                            <i className="bi bi-calendar-event me-2 text-primary"></i>
                            <strong>Start: </strong> {new Date(d.startDate).toLocaleDateString()}
                        </p>
                    </div>
                    
                    {/* Footer buttons */}
                    <div className="mt-auto">
                        
                        {/* Schedule */}
                        {(d.status === "Active" || d.status === "Completed") && (
                          <button 
                            className="btn btn-success w-100 mb-2 rounded-pill fw-bold"
                            onClick={() => this.setViewInParent({ page: "schedule", tournamentID: d._id })}
                          >
                            <i className="bi bi-calendar-check me-2"></i> View Schedule
                          </button>
                        )} 
                        
                        {/* View teams */}
                        <button
                            onClick={() => this.setViewInParent({ page: "teams", tournamentID: d._id })}
                            className="btn btn-outline-primary w-100 mb-3 rounded-pill fw-bold"
                        >
                            View Teams
                        </button>

                        {/* Edit - Delete */}
                        {isCreator && (
                            <div className="d-flex gap-2 border-top pt-3">
                                  <button
                                    onClick={() => this.setViewInParent({ page: "edittournament", tournamentID: d._id })}
                                    className="btn btn-sm btn-light text-warning border w-50 rounded-pill fw-bold"
                                  >
                                    <i className="bi bi-pencil-fill me-1"></i> Edit
                                  </button>
                                  <button
                                    onClick={() => this.deleteTournament(d._id)}
                                    className="btn btn-sm btn-light text-danger border w-50 rounded-pill fw-bold"
                                  >
                                    <i className="bi bi-trash-fill me-1"></i> Delete
                                  </button>
                            </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
          :
          <div className="col-12 p-5 text-center text-muted">
             {this.state.tournaments.length === 0 ? (
                 <div className="spinner-border text-primary" role="status"></div>
             ) : (
                 <div>
                    <i className="bi bi-trophy fs-1 opacity-25 mb-3 d-block"></i>
                    <h5>No tournaments found matching your filters.</h5>
                 </div>
             )}
          </div>
          }
        </div>
      </div>
    );
  }
}

export default TournamentsView;