import { Component } from "react";
import axios from "axios";

class StandingsView extends Component {
    state = { 
        standings: [], 
        loading: true 
    };

    componentDidMount() {
        axios.get("/tournaments/" + this.props.tournamentID + "/standings")     // http://localhost:8080
            .then(res => {
                this.setState({ 
                    standings: res.data, // REMEMBER THAT res.data is an ARRAY which is sorted in the back-end
                    loading: false 
                });
            })
            .catch(err => {
                console.error(err)
            });
    }

    render() {
        if (this.state.loading) return <div>Loading Standings...</div>;

        
        if (this.state.standings.length === 0){
            return (
                <div className="container mt-4">
                    <div className="alert alert-light border shadow-sm text-center p-5 rounded-3">
                        <i className="bi bi-people fs-1 text-muted opacity-25 mb-3 d-block"></i>
                        <h5 className="text-muted">No teams found in this tournament.</h5>
                        <button 
                            className="btn btn-outline-primary rounded-pill mt-3 px-4 fw-bold"
                            onClick={() => this.props.viewFromChild({ page: "tournaments" })}
                        >
                            Back to Tournaments
                        </button>
                    </div>
                </div>
            );
        }

        const sport = this.state.standings[0].sport; // Array!
        let labelScored, labelConceded, labelDifference;

        if (sport === "Football") {
            labelScored = "Goals Scored"; // Goals For
            labelConceded = "Goals Conceded"; // Goals Against
            labelDifference = "Goal Difference"; // Goal Difference
        } else if(sport === "Volleyball") {
            labelScored = "Sets Won"; 
            labelConceded = "Sets Lost"; 
            labelDifference = "Set Difference"; 
        } else {
            labelScored = "Points Scored"; 
            labelConceded = "Points Conceded"; 
            labelDifference = "Point Difference"; 
        }

        return (
            <div className="container mt-4">
                
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center">
                        <h2 className="fw-bold text-primary mb-0 me-3">
                            <i className="bi bi-list-ol me-2"></i> Standings
                        </h2>
                        <span className="badge bg-light text-dark border rounded-pill px-3">{sport}</span>
                    </div>

                    <button
                        className="btn btn-outline-secondary rounded-pill px-3 fw-bold btn-sm"
                        onClick={() => this.props.viewFromChild({
                            page: "schedule",
                            tournamentID: this.props.tournamentID
                        })}
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Schedule
                    </button>
                </div>

                {/* Table */}
                <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light border-bottom">
                                <tr>
                                    <th className="py-3 ps-4 text-uppercase small text-muted fw-bold">Pos</th>
                                    <th className="py-3 text-uppercase small text-muted fw-bold" style={{minWidth: "200px"}}>Team</th>
                                    
                                    <th className="py-3 text-center text-uppercase small text-muted fw-bold" title="Played">P</th>
                                    <th className="py-3 text-center text-uppercase small text-muted fw-bold" title="Won">W</th>
                                    <th className="py-3 text-center text-uppercase small text-muted fw-bold" title="Drawn">D</th>
                                    <th className="py-3 text-center text-uppercase small text-muted fw-bold" title="Lost">L</th>

                                    <th className="py-3 text-center text-uppercase small text-muted fw-bold border-start">{labelScored}</th>
                                    <th className="py-3 text-center text-uppercase small text-muted fw-bold">{labelConceded}</th>
                                    <th className="py-3 text-center text-uppercase small text-muted fw-bold">{labelDifference}</th>

                                    <th className="py-3 text-center text-uppercase small text-primary fw-bold bg-primary bg-opacity-10" style={{width: "80px"}}>Pts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.standings.map((team, index) => {
                                    const difference = team.goalsFor - team.goalsAgainst; // goalsFor and goalsAgainst are just variable names - same logic for all sports
                                    
                                    // Visual color for Goal Difference
                                    const differenceColor = difference > 0 ? "text-success" : difference < 0 ? "text-danger" : "text-muted";
                                    
                                    

                                    return(
                                        <tr key={team._id}>
                                            {/* Rank */}
                                            <td className="ps-4">
                                                <div 
                                                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold small bg-light border"
                                                    style={{width: "28px", height: "28px"}}
                                                >
                                                    {index + 1}
                                                </div>
                                            </td>

                                            {/* Team name */}
                                            <td className="fw-bold text-dark">{team.name}</td>
                                            
                                            {/* Statistics */}
                                            <td className="text-center text-secondary">{team.matchesPlayed}</td>
                                            <td className="text-center text-secondary">{team.matchesWon}</td>
                                            <td className="text-center text-secondary">{team.matchesDrawn}</td>
                                            <td className="text-center text-secondary">{team.matchesLost}</td>

                                            <td className="text-center text-secondary border-start">{team.goalsFor}</td>
                                            <td className="text-center text-secondary">{team.goalsAgainst}</td>
                                            
                                            <td className={`text-center fw-bold ${differenceColor}`}>
                                                {difference > 0 ? `+${difference}` : difference}
                                            </td>

                                            {/* Team points */}
                                            <td className="text-center fw-bold text-primary bg-primary bg-opacity-10 fs-5">
                                                {team.points}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default StandingsView;