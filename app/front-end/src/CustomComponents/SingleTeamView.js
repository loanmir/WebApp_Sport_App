import { Component } from "react";
import axios from "axios";

class SingleTeamView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      team: {}
    }
  }

  QSetViewInParent = (obj) => {
    this.props.QViewFromChild(obj);
  };

  componentDidMount() {
    axios.get("http://localhost:8080/teams/"+this.props.data)
    .then(res=>{
      this.setState({
        team: res.data
      })
    })
  }

  render() {
    let team = this.state.team;
    let isEmpty = Object.keys(team).length === 0;
    const sourceID = this.props.fromTournamentID;
    
    // Get first letter for Avatar
    const initial = team.name ? team.name.charAt(0).toUpperCase() : "T";

    return (
      <div className="container mt-4">
        
        {!isEmpty ? 
        <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
            
            {/* Header*/}
            <div className="d-flex align-items-center mb-4 pb-3 border-bottom">

                <div>
                    <h5 className="text-muted text-uppercase fw-bold mb-1" style={{fontSize: "0.8rem"}}>Team Profile</h5>
                    <h1 className="fw-bold text-dark mb-0">
                        {team.name}
                    </h1>
                    <span className="badge bg-light text-primary mt-2 border">
                        {team.sport || "Sports Team"}
                    </span>
                </div>
            </div>

            {/* Current status - tournaments */}
            <div className="alert alert-light border d-flex align-items-center mb-4 rounded-3">
                <i className="bi bi-trophy-fill text-warning fs-4 me-3"></i>
                <div>
                    <small className="text-muted d-block text-uppercase fw-bold" style={{fontSize: "0.7rem"}}>Current Status</small>
                    {team.tournament ? (
                         <span className="fs-5 text-dark">Playing in <strong>{team.tournament.name}</strong></span>
                    ):(
                         <span className="fs-5 text-success">Free Agent (Available for sign up)</span>
                    )}
                </div>
            </div>

            {/* Players' table */}
            <div className="row">
                <div className="col-12">
                    <h4 className="fw-bold mb-3">
                        <i className="bi bi-people-fill me-2 text-primary"></i> Player Roster
                    </h4>
                    
                    {team.players && team.players.length > 0 ? (
                      <div className="table-responsive shadow-sm" style={{borderRadius: "12px", overflow: "hidden"}}>
                        <table className="table table-hover align-middle mb-0">
                          <thead className="bg-light">
                            <tr>
                              <th className="py-3 ps-4 text-uppercase text-muted small fw-bold" scope="col">#</th>
                              <th className="py-3 text-uppercase text-muted small fw-bold" scope="col">Player Name</th>
                              <th className="py-3 text-uppercase text-muted small fw-bold" scope="col">Surname</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white border-top-0">
                            {team.players.map((player, index) => (
                              <tr key={player._id || index}>
                                {/* Number */}
                                <td className="ps-4 fw-bold text-primary">
                                  {player.number ? player.number : <span className="text-muted opacity-50">-</span>}
                                </td>
                                {/* Name */}
                                <td className="fw-bold text-dark">
                                    <i className="bi bi-person-circle me-2 text-secondary opacity-50"></i>
                                    {player.name}
                                </td>
                                {/* Surname */}
                                <td className="text-secondary">{player.surname}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center p-5 bg-light rounded-3 border border-dashed">
                        <i className="bi bi-person-x fs-1 text-muted opacity-50"></i>
                        <p className="text-muted mt-2">No players added to this roster yet.</p>
                      </div>
                    )}
                </div>
            </div>

            {/* Footer*/}
            <div className="mt-5 d-flex justify-content-between">
                <button 
                    className="btn btn-outline-secondary rounded-pill px-4 fw-bold"
                    onClick={() => {
                        if (sourceID) {
                            this.props.QViewFromChild({ page: "teams", tournamentID: sourceID });
                        } else {
                            this.props.QViewFromChild({ page: "teams" });
                        }
                    }}
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    {sourceID ? "Back to Tournament" : "Back to All Teams"}
                </button>

                
            </div>

        </div>
        : 
        
        <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 text-muted">Loading team details...</p>
        </div>
        }
      </div>
    );
  }
}

export default SingleTeamView;