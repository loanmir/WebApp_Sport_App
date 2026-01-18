import { Component } from "react";
import axios from "axios";

class BookFieldView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: null,           // The field details (name, address, master slots)
      takenSlots: [],        // List of time strings already booked for this date
      selectedDate: new Date().toISOString().split('T')[0], // Default: Today "YYYY-MM-DD"
      selectedSlot: null,    // The slot object the user clicked
      loading: true
    };
  }

  componentDidMount() {
    this.QLoadData(this.state.selectedDate);
  }

  // Fetch both Field info and Bookings for the specific date
  QLoadData = (date) => {
    const fieldID = this.props.fieldID;
    this.setState({ loading: true });

    Promise.all([                           // Parallel requests
        // Getting details of the field
        axios.get("http://localhost:8080/fields/"+fieldID),

        // Get existing bookings for specific field and date
        axios.get("http://localhost:8080/bookings?field="+fieldID+"&date="+date)
    ])
    .then(([resField, resBookings]) => {
        const bookedTimes = resBookings.data.map(b => b.timeSlot);
        
        this.setState({
            field: resField.data,
            takenSlots: bookedTimes,
            loading: false
        });
    })
    .catch(err => {
        console.error("Error loading data:", err);
        // Fallback: If bookings fail (e.g. no bookings yet), just load the field
        //if (err.response && err.response.status === 404) {
             // If 404 on bookings, it might just mean "no bookings found"
        //}
        alert("Could not load booking data. Please try again.");
        this.props.QViewFromChild({ page: "fields" });
    });
  }

  // When user changes the date picker
  QHandleDateChange = (e) => {
    const newDate = e.target.value;
    this.setState({ 
        selectedDate: newDate, 
        selectedSlot: null // Reset selection because availability changes by date
    });
    this.QLoadData(newDate); // Loading data for every date change
  }

  QConfirmBooking = () => {
    if (!this.state.selectedSlot) return;

    // Send the booking to the backend
    axios.post("http://localhost:8080/bookings", {
        field: this.props.fieldID,
        date: this.state.selectedDate,
        slotTime: this.state.selectedSlot.time 
    }, { withCredentials: true }) // for user session
    .then(res => {
        alert("Booking Successful!");
        this.props.QViewFromChild({ page: "fields" });
    })
    .catch(err => {
        console.error(err);
        alert(err.response?.data?.error || "Error booking field.");
    });
  }

  render() {
    if (this.state.loading || !this.state.field) {
        return <div className="p-5 text-center">Loading Schedule...</div>;
    }

    const { field, takenSlots, selectedSlot, selectedDate } = this.state;

    return (
      <div className="container mt-4">
        <div className="card shadow p-4">
            
            {/* --- HEADER --- */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="mb-0">Book: {field.name}</h3>
                    <small className="text-muted">{field.address} ({field.sport})</small>
                </div>
                <button 
                    className="btn btn-outline-secondary" 
                    onClick={() => this.props.QViewFromChild({ page: "fields" })}
                >
                    Back
                </button>
            </div>

            {/* --- DATE SELECTION --- */}
            <div className="mb-4 p-3 bg-light rounded">
                <label className="fw-bold me-3">Select Date:</label>
                <input 
                    type="date" 
                    className="form-control d-inline-block w-auto" 
                    value={selectedDate} 
                    onChange={this.QHandleDateChange} 
                />
            </div>

            {/* --- SLOTS GRID --- */}
            <h5 className="mb-3">Available Times</h5>
            
            {field.bookableSlots && field.bookableSlots.length > 0 ? (
                <div className="d-flex flex-wrap gap-3">
                    {field.bookableSlots.map((slot) => {
                        
                        // Checking whether slot is taken
                        const isTaken = takenSlots.includes(slot.time);
                        
                        // Checking if slot is currently selected
                        const isSelected = selectedSlot && selectedSlot.id === slot.id;

                        // £ different colors for each state -> taken, selected, available
                        let btnClass = "btn-outline-success"; 
                        if (isTaken) btnClass = "btn-secondary disabled"; 
                        else if (isSelected) btnClass = "btn-success text-white"; 

                        return (
                            <button 
                                key={slot.id} 
                                disabled={isTaken}
                                className={`btn ${btnClass} py-3 px-4 shadow-sm`}
                                style={{ minWidth: "140px" }}
                                onClick={() => this.setState({ selectedSlot: slot })}
                            >
                                <div className="fw-bold">{slot.time}</div>
                                {isTaken ? (
                                    <small className="d-block text-white-50">Booked</small>
                                ) : (
                                    <small className="d-block">Available</small>
                                )}
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="alert alert-warning">No slots defined for this field.</div>
            )}

            {/* --- FOOTER / CONFIRM --- */}
            <div className="mt-5 pt-3 border-top text-end">
                {selectedSlot && (
                    <span className="me-3 text-muted">
                        Booking for: <strong>{selectedSlot.time}</strong> on {selectedDate}
                    </span>
                )}
                <button 
                    className="btn btn-primary btn-lg" 
                    disabled={!selectedSlot} // Disable if nothing selected
                    onClick={this.QConfirmBooking}
                >
                    Confirm Booking
                </button>
            </div>
            
        </div>
      </div>
    );
  }
}

export default BookFieldView;