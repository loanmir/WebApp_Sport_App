import { Component } from "react";
import axios from "axios";

class SingleFieldView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      field: {},
      selectedSlot: "",
      selectedDate: ""
    }
  }

  QSetViewInParent = (obj) => {
    this.props.QViewFromChild(obj);
  };

  // Helper to update state when inputs change
  QHandleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  // The Logic to send the booking to the backend
  QBookField = () => {
    // 1. Validation
    if (!this.state.selectedDate || !this.state.selectedSlot) {
      alert("Please select both a date and a time slot.");
      return;
    }

    // 2. Prepare the data
    // API Route: POST /api/fields/:id/bookings (Based on your requirements)
    const bookingData = {
      date: this.state.selectedDate,
      timeSlot: this.state.selectedSlot,
      fieldId: this.state.field._id
    };

    console.log("Sending booking:", bookingData);

    // 3. Send Request (You need to ensure you are logged in for this to work!)
    axios.post(`http://localhost:8080/fields/${this.state.field._id}/bookings`, bookingData, { withCredentials: true })
      .then(res => {
        alert("Booking Successful!");
        this.QSetViewInParent({ page: "fields" }); // Go back to list after success
      })
      .catch(err => {
        console.log("Booking failed:", err);
        alert("Error: " + (err.response?.data?.message || "Could not book field"));
      });
  };

  componentDidMount() {
    axios.get("http://localhost:8080/fields/" + this.props.data)
      .then(res => {
        this.setState({
          field: res.data
        })
      })
      .catch(err => {
        console.log("Error fetching field:", err);
      });
  }

  render() {
    let field = this.state.field;
    let isEmpty = Object.keys(field).length === 0;

    return (
      <div className="card" style={{ margin: "10px" }}>
        {!isEmpty ? 
        <div>
          <h5 className="card-header">{field.sport}</h5>
          
          <div className="card-body">
            <h3 className="card-title">{field.name}</h3>
            <p className="card-text"><strong>Address: </strong>{field.address}</p>
            <hr/>

            {/* --- NEW BOOKING SECTION --- */}
            <div className="row g-3 align-items-center">
                
                {/* 1. DATE PICKER */}
                <div className="col-md-6">
                    <label className="form-label">Select Date:</label>
                    <input 
                        type="date" 
                        name="selectedDate"
                        className="form-control"
                        onChange={this.QHandleInputChange}
                    />
                </div>

                {/* 2. SLOT DROPDOWN (Requested Feature) */}
                <div className="col-md-6">
                    <label className="form-label">Select Time Slot:</label>
                    <select 
                        name="selectedSlot" 
                        className="form-select" 
                        onChange={this.QHandleInputChange}
                        defaultValue=""
                    >
                        <option value="" disabled>Choose a time...</option>
                        {field.bookableSlots && field.bookableSlots.map((slot, index) => (
                            <option key={index} value={slot}>
                                {slot}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 3. BOOK BUTTON (Replaces Return Button) */}
            <div className="mt-4 d-grid gap-2">
                <button
                    onClick={this.QBookField}
                    className="btn btn-success btn-lg"
                >
                    Book Field
                </button>
                
                {/* Small link to go back if they change their mind */}
                <button 
                    onClick={() => this.QSetViewInParent({ page: "fields" })}
                    className="btn btn-link text-secondary"
                    style={{ textDecoration: "none" }}
                >
                    Cancel and return to list
                </button>
            </div>

          </div>
        </div>
        : 
        <div className="card-body">Loading field details...</div>
        }
      </div>
    );
  }
}

export default SingleFieldView;