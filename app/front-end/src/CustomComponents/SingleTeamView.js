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

    return (
      <div className="card" style={{ margin: "10px" }}>
        {!isEmpty ? 
        <div>
          {/* HEADER: Team Name */}
          <h3 className="card-header bg-primary text-white">
            {team.name}
          </h3>

          <div className="card-body">
            
            {/* OPTIONAL: Show Tournament ID */}
            <p className="text-muted">Participating in Tournament ID: {team.tournament}</p>

            <h5 className="mt-4 mb-3">Player Roster</h5>

            {/* PLAYERS LIST (Table Format) */}
            {team.players && team.players.length > 0 ? (
              <table className="table table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Number</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Surname</th>
                  </tr>
                </thead>
                <tbody>
                  {team.players.map((player, index) => (
                    <tr key={player._id || index}>
                      {/* Check if number exists, otherwise show a dash */}
                      <td>
                        <strong>{player.number ? player.number : "-"}</strong>
                      </td>
                      <td>{player.name}</td>
                      <td>{player.surname}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="alert alert-warning" role="alert">
                No players added to this team yet.
              </div>
            )}

            {/* RETURN BUTTON */}
            <div className="mt-4">
              <button
                onClick={() => this.QSetViewInParent({ page: "teams" , tournamentID: team.tournament})}
                className="btn btn-outline-primary"
              >
                &larr; Return to Tournaments' Teams 
              </button>
            </div>

          </div>
        </div>
        : 
        <div className="card-body text-center p-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Loading team details...</p>
        </div>
        }
      </div>
    );
  }
}

export default SingleTeamView;
