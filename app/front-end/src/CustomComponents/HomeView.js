import { Component } from "react";

class HomeView extends Component {

  QSetViewInParent = (obj) => {
    this.props.QViewFromChild(obj); 
  };

  render() {
    const { logged, user } = this.props.userStatus || {};

    return (
      // 'container' centers it, 'mt-4' adds space between this and your blue Navbar
      <div className="container mt-4">
        
        {/* 1. HERO SECTION */}
        {/* We use bg-light (light grey) to contrast with your Blue Navbar */}
        <div className="p-5 mb-4 bg-light rounded-3 shadow-sm border">
          <div className="container-fluid py-2">
            <h1 className="display-5 fw-bold text-primary">
              {logged ? `Welcome back, ${user.user_username}!` : "Welcome to SportManager"}
            </h1>
            <p className="col-md-8 fs-5 text-muted">
              Manage your local tournaments, organize teams, and book sports fields 
              all in one place.
            </p>
            {!logged && (
              <button 
                className="btn btn-primary btn-lg mt-3" 
                onClick={() => this.QSetViewInParent({ page: "login" })}
              >
                Login / Register
              </button>
            )}
          </div>
        </div>

        {/* 2. DASHBOARD CARDS */}
        <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
          
          {/* TOURNAMENTS CARD */}
          <div className="col">
            <div className="card h-100 shadow-sm border-0 h-100">
              <div className="card-body text-center p-4">
                <div className="mb-3 text-primary" style={{ fontSize: "3rem" }}>
                  <i className="bi bi-trophy-fill"></i>
                </div>
                <h3 className="card-title">Tournaments</h3>
                <p className="card-text text-muted">
                  Check live standings, view schedules, and create new leagues.
                </p>
                <button 
                  className="btn btn-outline-primary w-100"
                  onClick={() => this.QSetViewInParent({ page: "tournaments" })}
                >
                  Go to Tournaments
                </button>
              </div>
            </div>
          </div>

          {/* TEAMS CARD */}
          <div className="col">
            <div className="card h-100 shadow-sm border-0 h-100">
              <div className="card-body text-center p-4">
                <div className="mb-3 text-success" style={{ fontSize: "3rem" }}>
                  <i className="bi bi-people-fill"></i>
                </div>
                <h3 className="card-title">Teams</h3>
                <p className="card-text text-muted">
                  Manage rosters, find opponents, and register for cups.
                </p>
                <button 
                  className="btn btn-outline-success w-100"
                  onClick={() => this.QSetViewInParent({ page: "teams" })}
                >
                  Manage Teams
                </button>
              </div>
            </div>
          </div>

          {/* FIELDS CARD */}
          <div className="col">
            <div className="card h-100 shadow-sm border-0 h-100">
              <div className="card-body text-center p-4">
                <div className="mb-3 text-info" style={{ fontSize: "3rem" }}>
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <h3 className="card-title">Fields</h3>
                <p className="card-text text-muted">
                  Find local sports facilities and book a slot instantly.
                </p>
                <button 
                  className="btn btn-outline-info w-100"
                  onClick={() => this.QSetViewInParent({ page: "fields" })}
                >
                  Book a Field
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* 3. FOOTER INFO (Optional - Fills space nicely) */}
        <div className="row mb-4">
            <div className="col-12">
                <div className="alert alert-info d-flex align-items-center" role="alert">
                    <i className="bi bi-info-circle-fill me-3 fs-4"></i>
                    <div>
                        <strong>Did you know?</strong> You can create your own tournament in seconds 
                        using the "Create Tournament" button in the Tournaments tab!
                    </div>
                </div>
            </div>
        </div>

      </div>
    );
  }
}

export default HomeView;