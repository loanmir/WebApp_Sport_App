import { Component } from "react";
import axios from "axios";

// REMEMBER to implement the team reset! -> If tournament gets deleted, all the teams related to it must NOT relate to that tournament


class TeamsView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      teams: [],
    }
  }

  QSetViewInParent = (obj) => {
    this.props.QIDFromChild(obj);
  };

  componentDidMount() {
    axios.get("http://localhost:8080/teams")
      .then(res => {
        this.setState({
          teams: res.data
        }); 
      }) 
      .catch(err => {
        console.log("Error:", err);
      });
  }

  render() {

    const {logged} = this.props.userStatus || {};
    let data = this.state.teams;
    
    // We only show teams where team.tournament matches that ID.
    const filterId = this.props.tournamentID;
    
    if (filterId) {
      data = data.filter(team => team.tournament === filterId);
    }

    return (
      <div style={{ margin: "10px" }}>
        
        {/* HEADER: Show a special header if we are filtering by tournament */}
        {filterId ? (
            <div className="alert alert-info d-flex justify-content-between align-items-center">
                <span>Showing teams for Tournament ID: <strong>{filterId}</strong></span>
                <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => this.QSetViewInParent({ page: "tournaments" })}>
                      Back to Tournaments
                </button>
            </div>
        ) : null}

        {/* CREATE TEAM BUTTON*/}
        {logged && (
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-success"
              onClick={() => this.QSetViewInParent({page: "addteam"})}
            >
                Create your own team!
            </button>
          </div>
        )}

        <div className="row row-cols-1 row-cols-md-3 g-4">
            {data.length > 0 ? 
            data.map(d => {
                return(
                <div className="col" key={d._id}>
                    <div className="card">
                    
                    <div className="card-header text-muted">
                        <small>Tournament ID: {d.tournament}</small>
                    </div>

                    <div className="card-body">
                        <h5 className="card-title">{d.name}</h5>
                        <p className="card-text">
                        <strong>Roster Size: </strong> 
                        {d.players ? d.players.length : 0} Players
                        </p>
                    </div>
                    
                    <button
                        onClick={() => this.QSetViewInParent({ page: "team", teamID: d._id })}
                        style={{ margin: "10px" }}
                        className="btn btn-primary bt"
                    >
                        View Team Details
                    </button>
                    </div>
                </div>
                )
            })
            :
            <div className="col-12 p-5 text-center">
                {this.state.teams.length === 0 ? "Loading teams..." : "No teams found for this tournament."}
            </div>
            }
        </div>
      </div>
    );
  }
}

export default TeamsView;
