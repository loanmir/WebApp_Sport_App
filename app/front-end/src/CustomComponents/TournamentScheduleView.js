import { Component } from "react";
import axios from "axios";

class TournamentScheduleView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matches: [],
            loading: true
        };
    }

    componentDidMount() {
        this.fetchMatches();
    }

    fetchMatches = () => {
        const id = this.props.tournamentID;
        axios.get("http://localhost:8080/tournaments/" + id + "/matches")
            .then(res => {
                this.setState({ matches: res.data, loading: false });
            })
            .catch(err => {
                console.error("Error loading schedule:", err);
                this.setState({ loading: false });
            });
    }


// Organizing the matches by rounds -> Storing them into an organized dictionary
    groupMatchesByRound = () => {
        const groups = {};
        this.state.matches.forEach(match => {
            if (!groups[match.round]) {
                groups[match.round] = [];
            }
            groups[match.round].push(match);
        });
        return groups;
    };




    render() {
        if (this.state.loading) return <div className="text-center p-3">Loading Schedule...</div>;
        if (this.state.matches.length === 0) return <div className="alert alert-warning">No matches generated yet.</div>;

        const rounds = this.groupMatchesByRound();

        return (
            <div className="container mt-4">
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                     <h3>Match Schedule</h3>
                     <button className="btn btn-secondary btn-sm" 
                        onClick={() => this.props.QViewFromChild({ page: "tournaments" })}>
                        Back
                     </button>
                </div>
                
                {Object.keys(rounds).map(roundNum => (
                    <div key={roundNum} className="card mb-4 shadow-sm">
                        <div className="card-header bg-light">
                            <strong>Round {roundNum}</strong>
                        </div>
                        <ul className="list-group list-group-flush">
                            {rounds[roundNum].map(match => {
                                
                                const matchDate = match.date ? new Date(match.date) : null;

                                return (
                                <li key={match._id}  
                                    className="list-group-item d-flex align-items-center list-group-item-action" 
                                    style={{cursor: "pointer"}}
                                    onClick={() => this.props.QViewFromChild({
                                        page: "match",
                                        matchID: match._id
                                    })}>
                                    
                                    {/* DATE COLUMN */}
                                    <div className="text-secondary" style={{ width: "20%", fontSize: "0.85rem", borderRight: "1px solid #eee" }}>
                                        {matchDate ? (
                                            <>
                                                {/* Date: e.g. 22/01/2026 */}
                                                <div className="fw-bold">{matchDate.toLocaleDateString()}</div>
                                                {/* Time: e.g. 14:30 */}
                                                <div className="small">{matchDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                            </>
                                        ) : (
                                            <span className="fst-italic">Date TBD</span>
                                        )}
                                    </div>

                                    {/*  HOME TEAM  */}
                                    <div className="text-end pe-3" style={{ width: "30%" }}>
                                        <span className="fw-bold">{match.teamA.name}</span>
                                    </div>

                                    {/*  SCORE  */}
                                    <div className="text-center" style={{ width: "10%" }}>
                                        {match.played ? (
                                            <span className="badge bg-dark">{match.scoreA} - {match.scoreB}</span>
                                        ) : (
                                            <small className="text-muted">vs</small>
                                        )}
                                    </div>

                                    {/* AWAY TEAM */}
                                    <div className="text-start ps-3" style={{ width: "30%" }}>
                                        <span className="fw-bold">{match.teamB.name}</span>
                                    </div>
                                    
                                </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        );
    }
}

export default TournamentScheduleView;