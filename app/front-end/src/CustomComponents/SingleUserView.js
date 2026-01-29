import { Component } from "react";
import axios from "axios";

class SingleUserView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      userTournaments: [],
      loading: true
    };
  }

  componentDidMount() {
    const userId = this.props.userID;

    this.setState({ loading: true });

    // Parallel Fetch: Get Specific User Details AND All Tournaments (to filter)
    Promise.all([
        axios.get("/users/"+userId),        // http://localhost:8080
        axios.get("/tournaments")
    ])
    .then(([userRes, tournamentsRes]) => {
        // Filter tournaments created by this user
        const myTournaments = tournamentsRes.data.filter(t => {
            const creatorId = t.creator && (t.creator._id || t.creator);
            return creatorId === userId;
        });

        this.setState({
            user: userRes.data,
            userTournaments: myTournaments,
            loading: false
        });
    })
    .catch(err => {
        console.error("Error loading user details:", err);
        alert("Could not load user data.");
        this.props.viewFromChild({ page: "users" }); // Go back on error
    });
  }

  render() {
    if (this.state.loading) return <div className="p-5 text-center text-muted"><div className="spinner-border text-primary"></div></div>;
    
    const { user, userTournaments } = this.state;
    const initial = user.user_username ? user.user_username.charAt(0).toUpperCase() : "?";

    return (
      <div className="container mt-5">
        
        {/* Main container - Profile card */}
        <div className="card border-0 shadow-sm p-4 mb-5 bg-white rounded-3 position-relative overflow-hidden">
            
            {/* Back button */}
            <div className="position-absolute top-0 end-0 p-4">
                <button 
                    className="btn btn-outline-secondary rounded-pill fw-bold btn-sm"
                    onClick={() => this.props.viewFromChild({ page: "users" })}
                >
                    <i className="bi bi-arrow-left me-1"></i> Back to List
                </button>
            </div>

            <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start">
                
                {/* Avatar circle */}
                <div 
                    className="d-flex align-items-center justify-content-center shadow-sm mb-3 mb-md-0 me-md-4"
                    style={{
                        width: "120px", 
                        height: "120px", 
                        borderRadius: "50%", 
                        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", // Same Dark Blue Gradient as UsersView
                        color: "white",
                        fontSize: "3rem",
                        fontWeight: "bold",
                    }}
                >
                    {initial}
                </div>

                {/* User Info */}
                <div>
                    <h5 className="text-uppercase text-muted fw-bold small mb-1">User Profile</h5>
                    <h1 className="fw-bold text-dark display-5 mb-1">
                        {user.user_username}
                    </h1>
                    <p className="text-muted fs-5 mb-2">
                        {user.user_firstName} {user.user_surname}
                    </p>
                    
                    {/* Stats Pill */}
                    <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2">
                        <i className="bi bi-trophy-fill me-2"></i>
                        {userTournaments.length} Tournaments Created
                    </span>
                </div>
            </div>
        </div>

        {/* Tournaments section */}
        <div className="mb-4 d-flex align-items-center">
             <h3 className="fw-bold mb-0">
                Created Tournaments
             </h3>
             <span className="ms-2 badge bg-light text-dark rounded-pill border">
                {userTournaments.length}
             </span>
        </div>
        
        <div className="row row-cols-1 row-cols-md-3 g-4">
            {userTournaments.length > 0 ? (
                userTournaments.map(t => (
                    <div className="col" key={t._id}>
                        <div className="card feature-card h-100 border-0 shadow-sm">
                            <div className="card-body p-4 d-flex flex-column">
                                
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="badge bg-light text-dark border rounded-pill">{t.sport}</span>
                                    <span className={`badge rounded-pill ${t.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                        {t.status}
                                    </span>
                                </div>

                                <h5 className="card-title fw-bold mb-3">
                                    {t.name}
                                </h5>

                                <p className="card-text text-muted small mb-4">
                                    <i className="bi bi-people-fill me-2 text-primary"></i>
                                    Max Teams: {t.maxTeams}
                                </p>

                                <button 
                                    className="btn btn-outline-primary w-100 mt-auto rounded-pill fw-bold"
                                    onClick={() => this.props.viewFromChild({ page: "teams", tournamentID: t._id })}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-12">
                    <div className="text-center p-5 bg-light rounded-3 border border-dashed">
                        <i className="bi bi-trophy fs-1 text-muted opacity-25"></i>
                        <p className="text-muted mt-2 mb-0">This user hasn't created any tournaments yet.</p>
                    </div>
                </div>
            )}
        </div>

      </div>
    );
  }
}

export default SingleUserView;