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
                this.setState({ 
                    matches: res.data, 
                    loading: false 
                });
            })
            .catch(err => {
                console.error("Error loading schedule:", err);
                this.setState({ loading: false });
            });
    }

    // Organizing the matches by rounds
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
        if (this.state.loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;
        if (this.state.matches.length === 0) return (
            <div className="container mt-4">
                <div className="alert alert-warning shadow-sm border-0 rounded-3 text-center p-4">
                    <i className="bi bi-exclamation-circle fs-4 d-block mb-2"></i>
                    No matches generated yet. Start the tournament in settings to generate a schedule.
                    <div className="mt-3">
                        <button className="btn btn-outline-secondary rounded-pill fw-bold" onClick={() => this.props.viewFromChild({ page: "tournaments" })}>Back</button>
                    </div>
                </div>
            </div>
        );

        const rounds = this.groupMatchesByRound();

        return (
            <div className="container mt-4">
                
                {/* Header - buttons*/}
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                      <div>
                          <h2 className="fw-bold text-primary mb-0">
                            <i className="bi bi-calendar-week-fill me-2"></i> Match Schedule
                          </h2>
                      </div>

                      <div className="d-flex gap-2">
                         <button 
                            className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-bold" 
                            onClick={() => this.props.viewFromChild({ page: "tournaments" })}
                        >
                            <i className="bi bi-arrow-left me-1"></i> Back
                        </button>
                        <button
                            className="btn btn-success btn-sm rounded-pill px-3 fw-bold shadow-sm" 
                            onClick={() => this.props.viewFromChild({
                                page: "standings",
                                tournamentID: this.props.tournamentID
                            })}
                        >
                            <i className="bi bi-table me-1"></i> Standings
                        </button>
                      </div>
                </div>
                
                {/* Rounds tables - loop */}
                {Object.keys(rounds).map(roundNum => (
                    <div key={roundNum} className="card border-0 shadow-sm mb-4 rounded-3 overflow-hidden">
                        
                        {/* Round header */}
                        <div className="card-header bg-primary bg-opacity-10 py-2">
                            <strong className="text-primary text-uppercase small fw-bold" style={{ letterSpacing: "1px" }}>
                                Round {roundNum}
                            </strong>
                        </div>

                        <ul className="list-group list-group-flush">
                            {rounds[roundNum].map(match => {
                                
                                const matchDate = match.date ? new Date(match.date) : null;

                                return (
                                <li key={match._id}  
                                    className="list-group-item d-flex align-items-center list-group-item-action py-3 border-bottom" 
                                    style={{cursor: "pointer"}}
                                    onClick={() => this.props.viewFromChild({
                                        page: "match",
                                        matchID: match._id
                                    })}>
                                    
                                    {/* Date column */}
                                    <div className="text-secondary ps-2" style={{ width: "20%" }}>
                                        {matchDate ? (
                                            <div className="d-flex flex-column">
                                                <span className="fw-bold text-dark" style={{fontSize: "0.9rem"}}>
                                                    {matchDate.toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                                                </span>
                                                <small className="text-muted" style={{fontSize: "0.75rem"}}>
                                                    {matchDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </small>
                                            </div>
                                        ) : (
                                            <span className="badge bg-light text-muted border fw-normal">Date TBD</span>
                                        )}
                                    </div>

                                    {/* Home team */}
                                    <div className="text-end pe-3" style={{ width: "30%" }}>
                                        <span className="fw-bold text-dark">{match.teamA.name}</span>
                                    </div>

                                    {/* Score */}
                                    <div className="text-center" style={{ width: "10%" }}>
                                        {match.played ? (
                                            <span className="badge bg-dark rounded-pill px-3 py-2 shadow-sm" style={{fontSize: "0.9rem"}}>
                                                {match.scoreA} - {match.scoreB}
                                            </span>
                                        ) : (
                                            <span className="badge bg-light text-muted border rounded-pill px-2">vs</span>
                                        )}
                                    </div>

                                    {/* Away team */}
                                    <div className="text-start ps-3" style={{ width: "30%" }}>
                                        <span className="fw-bold text-dark">{match.teamB.name}</span>
                                    </div>
                                    
                                    
                                    <div className="ms-auto text-muted opacity-50">
                                        <i className="bi bi-chevron-right"></i>
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