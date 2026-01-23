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

    // Parallel Fetch: Get User Details AND All Tournaments (to filter)
    Promise.all([
        axios.get("http://localhost:8080/users/"+userId),
        axios.get("http://localhost:8080/tournaments")
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
        this.props.QViewFromChild({ page: "users" }); // Go back on error
    });
  }

  render() {
    if (this.state.loading) return <div className="p-5 text-center">Loading Profile...</div>;
    
    const { user, userTournaments } = this.state;

    return (
      <div className="container mt-5">
        
        {/* PROFILE CARD */}
        <div className="card shadow mb-4">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h4 className="mb-0">User Profile</h4>
                <button 
                    className="btn btn-sm btn-light text-primary fw-bold"
                    onClick={() => this.props.QViewFromChild({ page: "users" })}
                >
                    Back to Users List
                </button>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-2 text-center mb-3">
                        {/* Avatar Placeholder */}
                        <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto" 
                             style={{width: "100px", height: "100px", fontSize: "2.5rem"}}>
                            {user.user_firstName.charAt(0)}{user.user_surname.charAt(0)}
                        </div>
                    </div>
                    <div className="col-md-10">
                        <h2 className="fw-bold">{user.user_username}</h2>
                        <h5 className="text-muted">{user.user_firstName} {user.user_surname}</h5>
                        <hr />
                        <div className="row">
                            <div className="col-md-6">
                                <strong>User ID:</strong> <span className="text-muted small">{user._id}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* TOURNAMENTS SECTION */}
        <h4 className="mb-3 border-bottom pb-2">Tournaments Created ({userTournaments.length})</h4>
        
        <div className="row row-cols-1 row-cols-md-2 g-4">
            {userTournaments.length > 0 ? (
                userTournaments.map(t => (
                    <div className="col" key={t._id}>
                        <div className="card h-100 shadow-sm border-start border-4 border-primary">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="card-title fw-bold mb-0">{t.name}</h5>
                                    <span className="badge bg-info text-dark">{t.sport}</span>
                                </div>
                                <p className="card-text text-muted small">
                                    Status: <span className={`fw-bold ${t.status === 'Active' ? 'text-success' : 'text-secondary'}`}>{t.status}</span>
                                    <br/>
                                    Max Teams: {t.maxTeams}
                                </p>
                                <button 
                                    className="btn btn-outline-primary btn-sm w-100"
                                    onClick={() => this.props.QViewFromChild({ page: "teams", tournamentID: t._id })}
                                >
                                    View Tournament
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-12 text-muted">This user has not created any tournaments yet.</div>
            )}
        </div>

      </div>
    );
  }
}

export default SingleUserView;