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
    let isEmpty = Object.keys(team).length === 0; // Check if team object is empty (if the data hasn't arrived yet)
    // Object.keys() returns an array of all the keys in team!
    // Checkinf if the number of elements in the array is 0
    return (
      <div className="card" style={{ margin: "10px" }}>
        {!isEmpty ? 
        <div>
          <h5 className="card-header">{team.title}</h5>
          <div className="card-body">
            <h5 className="card-title">{team.slug}</h5>
            <p className="card-text">{team.text}</p>
            <button
              onClick={() => this.QSetViewInParent({ page: "teams" })}
              className="btn btn-primary"
            >
              Return to Teams
            </button>
          </div>
        </div>
        : "Loading..."}
      </div>
    );
  }
}

export default SingleTeamView;
