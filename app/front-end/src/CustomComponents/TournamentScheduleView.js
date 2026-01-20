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
            <div className="mt-4">
                <h3 className="mb-3">Match Schedule</h3>
                
                {Object.keys(rounds).map(roundNum => (
                    <div key={roundNum} className="card mb-4 shadow-sm">
                        <div className="card-header bg-light">
                            <strong>Round {roundNum}</strong>
                        </div>
                        <ul className="list-group list-group-flush">
                            {rounds[roundNum].map(match => (
                                <li key={match._id} className="list-group-item d-flex justify-content-between align-items-center">
                                    
                                    {/* Home Team */}
                                    <div className="text-end" style={{ width: "40%" }}>
                                        <span className="fw-bold">{match.teamA.name}</span>
                                    </div>

                                    {/* Score / VS */}
                                    <div className="text-center text-muted px-2" style={{ width: "20%" }}>
                                        {match.isPlayed ? (
                                            <span className="badge bg-dark">{match.homeScore} - {match.awayScore}</span>
                                        ) : (
                                            <small>vs</small>
                                        )}
                                    </div>

                                    {/* Away Team */}
                                    <div className="text-start" style={{ width: "40%" }}>
                                        <span className="fw-bold">{match.teamB.name}</span>
                                    </div>
                                    
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        );
    }
}

export default TournamentScheduleView;