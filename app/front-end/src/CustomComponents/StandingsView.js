import { Component } from "react";
import axios from "axios";

class StandingsView extends Component {
    state = { 
        standings: [], 
        loading: true 
    };

    componentDidMount() {
        // Fetch from the new route we just made
        axios.get("http://localhost:8080/tournaments/" + this.props.tournamentID + "/standings")
            .then(res => {
                this.setState({ 
                    standings: res.data, 
                    loading: false 
                });
            })
            .catch(err => {
                console.error(err)
            });
    }

    render() {
        console.log(this.state.standings);
        if (this.state.loading) return <div>Loading Standings...</div>;

        const isFootball = this.state.standings.sport === "Football";

        const labelScored = isFootball ? "Goals Scored" : "Pts Scored";
        const labelConceded = isFootball ? "Goals Conceded" : "Pts Conceded";
        const labelDifference = isFootball ? "Goal Difference" : "Pts Difference";

        return (
            <div className="card shadow-sm mt-4">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <h5 className="mb-0 me-3">Tournament Standings</h5>
                        <span className="badge bg-secondary">{this.state.standings.sport}</span>
                    </div>

                    <div>
                        <button
                            className="btn btn-sm btn-outline-dark fw-bold"
                            onClick={() => this.props.QViewFromChild({
                                page: "schedule",
                                tournamentID: this.props.tournamentID
                            })}
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Back to Schedule
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover table-striped mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Pos</th>
                                <th>Team</th>
                                <th className="text-center">P</th>{/* Played */}
                                <th className="text-center">W</th>
                                <th className="text-center">D</th>
                                <th className="text-center">L</th>

                                <th className="text-center">{labelScored}</th>
                                <th className="text-center">{labelConceded}</th>
                                <th className="text-center">{labelDifference}</th>

                                <th className="text-center fw-bold">Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.standings.map((team, index) => {
                                const difference = team.goalsFor - team.goalsAgainst; // goalsFor and goalsAgainst are just variable names, logic is same for all three sports
                                const differenceColor = difference > 0 ? "text-success" : difference < 0 ? "text-danger" : "text-muted";
                                return(
                                    <tr key={team._id}>
                                        <td>{index + 1}</td>
                                        <td className="fw-bold">{team.name}</td>
                                        <td className="text-center">{team.matchesPlayed}</td>
                                        <td className="text-center">{team.matchesWon}</td>
                                        <td className="text-center">{team.matchesDrawn}</td>
                                        <td className="text-center">{team.matchesLost}</td>

                                        <td className="text-center">{team.goalsFor}</td>
                                        <td className="text-center">{team.goalsAgainst}</td>
                                        
                                        <td className={`text-center fw-bold ${differenceColor}`}>
                                            {difference > 0 ? `+${difference}` : difference}
                                        </td>

                                        <td className="text-center fw-bold bg-light">{team.points}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default StandingsView;