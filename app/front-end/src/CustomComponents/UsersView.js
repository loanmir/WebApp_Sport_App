import { Component } from "react";
import axios from "axios";

class UsersView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],          
      tournaments: [],    
      search: "",         
      loading: true
    };
  }

  fetchUsers = () => {
    const search = this.state.search;
    axios.get("http://localhost:8080/users?q="+search)
    .then(res => {
      this.setState({ users: res.data, loading: false });
    })
    .catch(err => {
      console.error("Error fetching users:", err);
      this.setState({ loading: false });
    })
  }

  componentDidMount() {
    this.setState({ loading: true });
    axios.get("http://localhost:8080/tournaments")
    .then(res => {
      this.setState({ tournaments: res.data });
      this.fetchUsers();
    })
    .catch(err => {
      console.error("Error fetching data:", err);
      this.setState({ loading: false });
    });
  }
  
  getTournamentsForUser = (userId) => {
    return this.state.tournaments.filter(t => {
      const creatorId = t.creator._id || t.creator;
      return creatorId === userId;
    });
  };

  handleInputChange = (e) => {
    this.setState({
        [e.target.name]: e.target.value
    }, () =>{
      this.fetchUsers();
    });
  }

  render() {
    let filteredUsers = this.state.users;

    return (
      <div className="container mt-4">
        
        {/* Search Bar */}
        <div className="card border-0 shadow-sm p-4 mb-5 bg-white rounded-3">
            <div className="row align-items-center">
                <div className="col-md-6">
                    <h2 className="fw-bold text-primary mb-0">
                        <i className="bi bi-people-fill me-2"></i> Users
                    </h2>
                </div>
                <div className="col-md-6">
                    <div className="input-group">
                        <span className="input-group-text bg-light border-0"><i className="bi bi-search text-muted"></i></span>
                        <input 
                            type="text"
                            name="search"
                            className="form-control bg-light border-0 py-2" 
                            placeholder="Search..." 
                            value={this.state.search}
                            onChange={(e) => this.handleInputChange(e)}
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Loading - spinner */}
        {this.state.loading && (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        )}

        {/* Users Grid */}
        <div className="row g-4">
          {filteredUsers.map(user => {
            const userTournaments = this.getTournamentsForUser(user._id);
            
            // Get first letter of the username
            const initial = user.user_username ? user.user_username.charAt(0).toUpperCase() : "?";

            return (
              <div key={user._id} className="col-md-6 col-lg-4">
                <div className="card feature-card h-100 border-0 shadow-sm text-center position-relative">
                  <div className="card-body p-4 d-flex flex-column">
                    
                    {/* Avatar circle */}
                    <div 
                        className="mx-auto mb-3 d-flex align-items-center justify-content-center shadow-sm"
                        style={{
                            width: "80px", 
                            height: "80px", 
                            borderRadius: "50%", 
                            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", // Cool purple-blue gradient
                            color: "white",
                            fontSize: "2rem",
                            fontWeight: "bold",
                        }}
                    >
                        {initial}
                    </div>

                    {/* User info */}
                    <h4 
                        className="card-title fw-bold text-dark mb-1" 
                    >
                        {user.user_username}
                    </h4>
                    <p className="text-muted small mb-3">
                        {user.user_firstName} {user.user_surname}
                    </p>

                    {/* Stats badge */}
                    <div className="mb-4">
                        <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2">
                             <i className="bi bi-trophy-fill me-1"></i> 
                             {userTournaments.length} {userTournaments.length === 1 ? 'Tournament' : 'Tournaments'}
                        </span>
                    </div>

                    {/* Tournament */}
                    <div className="mt-auto">
                        {userTournaments.length > 0 ? (
                            <div className="d-flex flex-wrap justify-content-center gap-2">
                                {userTournaments.slice(0, 3).map(t => (
                                    <span 
                                        key={t._id} 
                                        className="badge bg-light text-dark border fw-normal p-2 cursor-pointer"
                                        style={{cursor: "pointer"}}
                                        onClick={() => this.props.viewFromChild({page:"teams", tournamentID: t._id})}
                                        title={`View ${t.name}`}
                                    >
                                        {t.name}
                                    </span>
                                ))}
                                
                                {userTournaments.length > 3 && (
                                    <span className="badge bg-light text-muted border p-2">+{userTournaments.length - 3} more</span>
                                )}
                            </div>
                        ) : (
                            <p className="small text-muted fst-italic">No tournaments yet.</p>
                        )}
                    </div>
                    <button 
                        className="btn btn-outline-primary w-100 rounded-pill mt-4 fw-bold"
                        onClick={() => this.props.viewFromChild({page: "singleUser", userID: user._id})}
                    >
                        View Profile
                    </button>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default UsersView;