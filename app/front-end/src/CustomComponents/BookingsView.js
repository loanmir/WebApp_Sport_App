import { Component } from "react";
import axios from "axios";

class BookingsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookings: [],
            loading: true
        };
    }

    componentDidMount() {
        // Fetch the specific route we just created
        axios.get("http://localhost:8080/bookings/user", { withCredentials: true })
            .then(res => {
                this.setState({
                    bookings: res.data,
                    loading: false
                });
            })
            .catch(err => {
                console.error("Error fetching bookings", err);
                this.setState({ loading: false });
                if(err.response && err.response.status === 401) {
                    alert("Please log in to view your bookings.");
                }
            });
    }



    QCancelBooking = (bookingID) => {
        if(!window.confirm("Are you sure you want to cancel this booking?")) {
            return;
        }
         axios.delete("http://localhost:8080/bookings/"+bookingID, { withCredentials: true })
         .then(res => {
            // If everything goes right, then show again the list of bookings except the one we have just deleted -> Update the state -> auto render refresh
            const updatedList = this.state.bookings.filter(b => b._id !== bookingID);
            this.setState({ bookings: updatedList });
            alert("Booking cancelled successfully.");
         })
         .catch(err => {
            console.error("Error cancelling booking:", err);
            alert("Error cancelling booking")
         })
    }




    formatDate = (isoString) => {
        // Converts "2023-10-25T14:00:00.000Z" to readable format
        if (!isoString) return "";
        return new Date(isoString).toLocaleDateString();
    }

    render() {
        if (this.state.loading) return <div className="p-5 text-center">Loading your bookings...</div>;

        return (
            <div className="container mt-4">
                <h2 className="mb-4">My Bookings</h2>

                {this.state.bookings.length > 0 ? (
                    <div className="row row-cols-1 row-cols-md-2 g-4">
                        {this.state.bookings.map(booking => (
                            <div className="col" key={booking._id}>
                                <div className="card shadow-sm border-start border-4 border-primary">
                                    <div className="card-body">
                                        
                                        {/* Getting the Field name, sport and address with Populate in mongoDB - because of the reference*/}
                                        <h5 className="card-title fw-bold text-primary">
                                            {booking.field ? booking.field.name : "Unknown Field"}
                                        </h5>
                                        
                                        <h6 className="card-subtitle mb-3 text-muted">
                                            {booking.field ? booking.field.sport + " - " + booking.field.address : ""}
                                        </h6>

                                        <hr />

                                        <div className="row">
                                            <div className="col-6">
                                                <small className="text-muted d-block">Scheduled Date</small>
                                                <strong>{this.formatDate(booking.date)}</strong>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted d-block">Time Slot</small>
                                                <span className="badge bg-success fs-6">{booking.timeSlot}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                                            <small className="text-muted fst-italic" style={{ fontSize: "0.8rem" }}>
                                                Booked on: {this.formatDate(booking.createdAt)}
                                            </small>

                                            <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => this.QCancelBooking(booking._id)}
                                            >
                                                Cancel Booking
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="alert alert-info text-center">
                        You haven't made any bookings yet. 
                        <br/>
                        <button 
                            className="btn btn-link" 
                            onClick={() => this.props.QViewFromChild({ page: "fields" })}
                        >
                            Browse Fields
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default BookingsView;