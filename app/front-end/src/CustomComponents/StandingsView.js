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
        if (this.state.loading) return <div>Loading Standings...</div>;

        return (
            <div className="card shadow-sm mt-4">
                <div className="card-header bg-dark text-white">
                    <h5 className="mb-0">Tournament Standings</h5>
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
                                <th className="text-center fw-bold">Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.standings.map((team, index) => (
                                <tr key={team._id}>
                                    <td>{index + 1}</td>
                                    <td className="fw-bold">{team.name}</td>
                                    <td className="text-center">{team.matchesPlayed}</td>
                                    <td className="text-center">{team.matchesWon}</td>
                                    <td className="text-center">{team.matchesDrawn}</td>
                                    <td className="text-center">{team.matchesLost}</td>
                                    <td className="text-center fw-bold bg-light">{team.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default StandingsView;