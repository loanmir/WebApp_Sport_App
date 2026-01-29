import { Component } from "react";
import axios from "axios";

class SingleMatchView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            match: null,
            loading: true,
            
            homeScore: 0,
            awayScore: 0,
            isPlayed: false,
            matchDate: "",
            canEdit: false
        };
    }

    componentDidMount() {
        const id = this.props.matchID;
        axios.get("/matches/"+id, {withCredentials: true})  // http://localhost:8080
            .then(res => {
                const m = res.data;
                const formattedDate = new Date(m.date).toLocaleString('sv').replace(' ', 'T').slice(0,16);
                // toLocaleString('sv') gives local time in Sweden format (YYYY-MM-DDTHH:mm:ss)
                // Needed for solving the Local Time vs UTC problem. -> In TournamentScheduleView the date is formatted using toLocaleDateString.
                // 'T' instead of space, because the HTML inputs strictly requires this format in order to display it!!
                this.setState({
                    match: m,
                    loading: false,
                    homeScore: m.scoreA ?? 0,
                    awayScore: m.scoreB ?? 0,
                    isPlayed: m.played || false,
                    matchDate: formattedDate,
                    canEdit: m.canEdit
                });
            })
            .catch(err => {
                console.error(err);
                alert("Error loading match.");
            });
    }

    saveMatch = () => {
        console.log("Saving match..."); 
        const id = this.props.matchID;
        axios.put("/matches/"+id+"/result", {
            scoreA: this.state.homeScore,
            scoreB: this.state.awayScore,
            isPlayed: this.state.isPlayed,
            date: this.state.matchDate
        }, {withCredentials: true})
        .then(res => {
            console.log("Update response:", res.data); // Debug log
            alert("Match Updated Successfully!");
            this.setState({ match: res.data });
        })
        .catch(err => {
                if (err.response.status === 400) {
                    alert("Cannot update the match details before the match date");
                } 
                else if (err.response.status === 403) {
                    alert("Unauthorized: You are not the creator of this tournament.");
                }
                else if (err.response.status === 401) {
                    alert("You must be logged in to save changes.");
                }
                else {
                    alert("An error occurred: " + err.response.status);
                }
        });

    }

    render() {
        if (this.state.loading) return <div className="p-5 text-center">Loading Match Details...</div>;

        const { match, homeScore, awayScore, isPlayed, matchDate, canEdit } = this.state;
        const tournamentID = match.tournament?._id || match.tournament; // Handle populated vs unpopulated

        return (
        <div className="container mt-5">
            
            <button 
                className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-bold mb-3"
                onClick={() => this.props.viewFromChild({ page: "schedule", tournamentID: tournamentID })}
            >
                <i className="bi bi-arrow-left me-1"></i>Back to Schedule
            </button>

            {/* Warning banner */}
            {!canEdit && (
                <div className="alert alert-warning text-center shadow-sm">
                    <i className="bi bi-lock-fill me-2"></i>
                    <strong>View Only:</strong> You must be the tournament creator to edit this match.
                </div>
            )}

            <div className="card shadow text-center">
                <div className="card-header fw-bold bg-dark text-white">
                    Match Details - Round {match.round}
                </div>
                
                <div className="card-body p-5">
                    
                    <div className="row align-items-center mb-5">
                        <div className="col-md-4">
                            <h2 className="fw-bold text-primary">{match.teamA.name}</h2>
                        </div>

                        <div className="col-md-4">
                            <div className="d-flex justify-content-center align-items-center gap-3">
                                <input 
                                    type="number" 
                                    className="form-control form-control-lg text-center fw-bold" 
                                    style={{ width: "80px", fontSize: "2rem" }}
                                    value={homeScore}
                                    onChange={(e) => this.setState({ homeScore: e.target.value })}
                                    disabled={!canEdit}
                                />
                                <span className="h2 text-muted">-</span>
                                <input 
                                    type="number" 
                                    className="form-control form-control-lg text-center fw-bold" 
                                    style={{ width: "80px", fontSize: "2rem" }}
                                    value={awayScore}
                                    onChange={(e) => this.setState({ awayScore: e.target.value })}
                                    disabled={!canEdit} 
                                />
                            </div>
                        </div>

                        <div className="col-md-4">
                            <h2 className="fw-bold text-danger">{match.teamB.name}</h2>
                        </div>
                    </div>

                    <hr />

                    <div className="row mt-4 text-start">
                        <div className="col-md-6 offset-md-3">
                            
                            <div className="mb-3">
                                <label className="form-label fw-bold">Match Date & Time</label>
                                <input 
                                    type="datetime-local" 
                                    className="form-control"
                                    value={matchDate}
                                    onChange={(e) => this.setState({ matchDate: e.target.value })}
                                    disabled={!canEdit} 
                                />
                            </div>

                            <div className="form-check form-switch mb-4">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    id="playedSwitch"
                                    checked={isPlayed}
                                    onChange={(e) => this.setState({ isPlayed: e.target.checked })}
                                    disabled={!canEdit} 
                                />
                                <label className="form-check-label" htmlFor="playedSwitch">
                                    Mark as <strong>Played</strong>
                                </label>
                            </div>

                            {/* Button */}
                            {canEdit && (
                                <button 
                                    className="btn btn-success w-100 py-2 fw-bold"
                                    onClick={this.saveMatch}
                                >
                                    <i className="bi bi-save me-2"></i> Save Results
                                </button>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
    }
}

export default SingleMatchView;