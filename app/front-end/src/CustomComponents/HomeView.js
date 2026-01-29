import { Component } from "react";

class HomeView extends Component {

  setViewInParent = (obj) => {
    this.props.viewFromChild(obj); 
  };

  render() {
    
    const { logged, user } = this.props.userStatus || {};

    return (
      <div className="container mt-4">
        <div className="hero-section p-5 mb-5 d-flex flex-column flex-md-row align-items-center justify-content-between">
          
          <div style={{ maxWidth: "600px" }}>
            <h1 className="fw-bold display-5 mb-3">
               {logged ? `Welcome back, ${user.user_username}!` : "Welcome to SportManager"}
            </h1>
            <p className="lead opacity-90 mb-4">
              Manage your local tournaments, organize teams, and book sports fields all in one place.
            </p>
            
            {/* Show Login Button only if NOT logged in */}
            {!logged && (
                <button 
                className="btn btn-light btn-lg px-4 fw-bold shadow-sm"
                style={{ color: "#0d6efd" }} // Text matches the blue theme
                onClick={() => this.setViewInParent({ page: "login" })}
                >
                Login / Register
                </button>
            )}
          </div>
          
          {/*Trophy icon in background */}
          <div className="d-none d-md-block">
             <i className="bi bi-trophy-fill text-white-50" style={{fontSize: "8rem", opacity: 0.2}}></i>
          </div>
        </div>


        {/* Main Container */}
        <div className="row g-4 mb-5">
          
          {/* Tournament card */}
          <div className="col-md-4">
            <div className="card feature-card h-100 p-4 text-center">
              <div className="card-body">
                <div className="icon-circle mb-3">
                  <i className="bi bi-trophy-fill fs-2"></i>
                </div>
                <h4 className="card-title fw-bold">Tournaments</h4>
                <p className="card-text text-muted small mb-4">
                  Check live standings, view schedules, and create new leagues.
                </p>
                <button 
                  className="btn btn-outline-primary w-100 rounded-pill"
                  onClick={() => this.setViewInParent({ page: "tournaments" })}
                >
                  Go to Tournaments
                </button>
              </div>
            </div>
          </div>

          {/* Teams card */}
          <div className="col-md-4">
            <div className="card feature-card h-100 p-4 text-center">
              <div className="card-body">
                <div className="icon-circle mb-3">
                  <i className="bi bi-people-fill fs-2"></i>
                </div>
                <h4 className="card-title fw-bold">Teams</h4>
                <p className="card-text text-muted small mb-4">
                  Manage rosters, find opponents, and register for cups.
                </p>
                <button 
                  className="btn btn-outline-primary w-100 rounded-pill"
                  onClick={() => this.setViewInParent({ page: "teams" })}
                >
                  Manage Teams
                </button>
              </div>
            </div>
          </div>

          {/* Fields card */}
          <div className="col-md-4">
            <div className="card feature-card h-100 p-4 text-center">
              <div className="card-body">
                <div className="icon-circle mb-3" style={{backgroundColor: "#fff3cd", color: "#ffc107"}}> 
                  <i className="bi bi-geo-alt-fill fs-2"></i>
                </div>
                <h4 className="card-title fw-bold">Fields</h4>
                <p className="card-text text-muted small mb-4">
                  Find local sports facilities and book a slot instantly.
                </p>
                <button 
                  className="btn btn-outline-warning w-100 rounded-pill"
                  onClick={() => this.setViewInParent({ page: "fields" })}
                >
                  Book a Field
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="alert alert-light border-0 shadow-sm mt-5 d-flex align-items-center rounded-3" role="alert">
           <i className="bi bi-info-circle-fill text-primary me-3 fs-4"></i>
           <div>
              <strong>Did you know?</strong> You can create your own tournament in seconds using the "Create Tournament" button.
           </div>
        </div>

      </div>
    );
  }
}

export default HomeView;