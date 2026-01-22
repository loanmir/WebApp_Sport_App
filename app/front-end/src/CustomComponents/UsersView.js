import { Component } from "react";
import axios from "axios";

class UsersView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],          // List of all users
      tournaments: [],    // List of all tournaments (to match with creators)
      search: "",         // Search filter
      loading: true
    };
  }

  componentDidMount() {
    // Fetch Users and Tournaments in parallel -> Using Promise.all so that user waits "less" - Parallel req. execution
    Promise.all([
      axios.get("http://localhost:8080/users"),
      axios.get("http://localhost:8080/tournaments")
    ])
    .then(([usersRes, tournamentsRes]) => {
      this.setState({
        users: usersRes.data,
        tournaments: tournamentsRes.data,
        loading: false
      });
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

  QHandleInputChange = (e) => {
    this.setState({
        [e.target.name]: e.target.value
    })
  }

  render() {
    // FILTER: Filter users by username, name, or surname
    const filteredUsers = this.state.users.filter(user => 
      user.user_username.toLowerCase().includes(this.state.search.toLowerCase()) ||
      (user.user_firstName && user.user_firstName.toLowerCase().includes(this.state.search.toLowerCase())) ||
      (user.user_surname && user.user_surname.toLowerCase().includes(this.state.search.toLowerCase()))
    );

    return (
      <div className="container mt-4">
        
        {/* HEADER & SEARCH BAR */}
        <div className="row mb-4 align-items-center">
            <div className="col-md-6">
                <h2>Users Directory</h2>
            </div>
            <div className="col-md-6">
                <input 
                    type="text"
                    name="search"
                    className="form-control" 
                    placeholder="Search users..." 
                    value={this.state.search}
                    onChange={(e) => this.QHandleInputChange(e)}
                />
            </div>
        </div>

        {/* LOADING */}
        {this.state.loading && <div className="text-center">Loading...</div>}

        {/* USERS GRID */}
        <div className="row">
          {filteredUsers.map(user => {
            const userTournaments = this.getTournamentsForUser(user._id);

            return (
              <div key={user._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                  
                  {/* Card Header: Username & Badge */}
                  <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{user.user_username}</h5>
                    <span className="badge bg-light text-dark">{userTournaments.length} Tournaments</span>
                  </div>
                  
                  <div className="card-body">
                    <h6 className="text-muted mb-3">
                        {user.user_firstName} {user.user_surname}
                    </h6>
                    
                    <h6 className="card-subtitle mb-2 text-primary border-bottom pb-1">
                        Created Tournaments:
                    </h6>
                    
                    {/* List of Tournaments */}
                    {userTournaments.length > 0 ? (
                        <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                            <ul className="list-group list-group-flush">
                                {userTournaments.map(t => (
                                    <li key={t._id} className="list-group-item px-0 py-1 d-flex justify-content-between" 
                                    onClick={() => this.props.QViewFromChild({page:"teams", tournamentID: t._id})}
                                    >
                                        <small className="fw-bold">{t.name}</small>
                                        <small className="badge bg-secondary text-wrap" style={{width: "60px"}}>{t.sport}</small>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-muted small">No tournaments created.</p>
                    )}
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