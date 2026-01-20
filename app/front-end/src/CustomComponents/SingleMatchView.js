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
            matchDate: ""
        };
    }

    componentDidMount() {
        const id = this.props.matchID;
        axios.get("http://localhost:8080/matches/"+id)
            .then(res => {
                const m = res.data;
                this.setState({
                    match: m,
                    loading: false,
                    // Pre-fill form inputs
                    homeScore: m.homeScore,
                    awayScore: m.awayScore,
                    isPlayed: m.isPlayed,
                    // Format date (YYYY-MM-DDTHH:mm)
                    matchDate: m.date ? new Date(m.date).toISOString().slice(0, 16) : ""
                });
            })
            .catch(err => {
                console.error(err);
                alert("Error loading match.");
            });
    }

    QSaveMatch = () => {
        const id = this.props.matchID;
        axios.put("http://localhost:8080/matches/"+id+"/result", {
            homeScore: this.state.homeScore,
            awayScore: this.state.awayScore,
            isPlayed: this.state.isPlayed,
            date: this.state.matchDate
        })
        .then(res => {
            alert("Match Updated Successfully!");
            // Update local main object to reflect changes immediately
            this.setState({ match: res.data });
        })
        .catch(err => alert("Error updating match"));
    }

    render() {
        if (this.state.loading) return <div className="p-5 text-center">Loading Match Details...</div>;

        const { match, homeScore, awayScore, isPlayed, matchDate } = this.state;
        const tournamentID = match.tournament?._id || match.tournament; // Handle populated vs unpopulated

        return (
            <div className="container mt-5">
                
                {/* BACK BUTTON */}
                <button 
                    className="btn btn-outline-secondary mb-4"
                    onClick={() => this.props.QViewFromChild({ page: "schedule", tournamentID: tournamentID })}
                >
                    Back to Schedule
                </button>

                <div className="card shadow text-center">
                    <div className="card-header bg-dark text-white">
                        Match Details - Round {match.round}
                    </div>
                    
                    <div className="card-body p-5">
                        
                        {/* SCOREBOARD ROW */}
                        <div className="row align-items-center mb-5">
                            {/* HOME TEAM */}
                            <div className="col-md-4">
                                <h2 className="fw-bold text-primary">{match.teamA.name}</h2>
                                <p className="text-muted">Home</p>
                            </div>

                            {/* VS / SCORE INPUTS */}
                            <div className="col-md-4">
                                <div className="d-flex justify-content-center align-items-center gap-3">
                                    <input 
                                        type="number" 
                                        className="form-control form-control-lg text-center fw-bold" 
                                        style={{ width: "80px", fontSize: "2rem" }}
                                        value={homeScore}
                                        onChange={(e) => this.setState({ homeScore: e.target.value })}
                                    />
                                    <span className="h2 text-muted">-</span>
                                    <input 
                                        type="number" 
                                        className="form-control form-control-lg text-center fw-bold" 
                                        style={{ width: "80px", fontSize: "2rem" }}
                                        value={awayScore}
                                        onChange={(e) => this.setState({ awayScore: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* AWAY TEAM */}
                            <div className="col-md-4">
                                <h2 className="fw-bold text-danger">{match.teamB.name}</h2>
                                <p className="text-muted">Away</p>
                            </div>
                        </div>

                        <hr />

                        {/* EDIT DETAILS ROW */}
                        <div className="row mt-4 text-start">
                            <div className="col-md-6 offset-md-3">
                                
                                {/* Date Input */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Match Date & Time</label>
                                    <input 
                                        type="datetime-local" 
                                        className="form-control"
                                        value={matchDate}
                                        readOnly
                                        onChange={(e) => this.setState({ matchDate: e.target.value })}
                                    />
                                </div>

                                {/* Status Checkbox */}
                                <div className="form-check form-switch mb-4">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        id="playedSwitch"
                                        checked={isPlayed}
                                        onChange={(e) => this.setState({ isPlayed: e.target.checked })}
                                    />
                                    <label className="form-check-label" htmlFor="playedSwitch">
                                        Mark as <strong>Played</strong> (Finalizes the score)
                                    </label>
                                </div>

                                <button 
                                    className="btn btn-success w-100 py-2 fw-bold"
                                    onClick={this.QSaveMatch}
                                >
                                    <i className="bi bi-save me-2"></i> Save Results
                                </button>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default SingleMatchView;