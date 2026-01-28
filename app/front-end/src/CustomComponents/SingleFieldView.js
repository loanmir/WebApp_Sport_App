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

  setViewInParent = (obj) => {
    this.props.viewFromChild(obj);
  };

  
  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  
  bookField = () => {
    // Validation
    if (!this.state.selectedDate || !this.state.selectedSlot) {
      alert("Please select both a date and a time slot.");
      return;
    }

    
    const bookingData = {
      date: this.state.selectedDate,
      timeSlot: this.state.selectedSlot,
      fieldId: this.state.field._id
    };

    console.log("Sending booking:", bookingData);

    axios.post("http://localhost:8080/fields/" + this.state.field._id + "/bookings", bookingData, { withCredentials: true })
      .then(res => {
        alert("Booking Successful!");
        this.setViewInParent({ page: "fields" }); // Go back to list after success
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

            {/* Main container */}
            <div className="row g-3 align-items-center">
                
                {/* Date */}
                <div className="col-md-6">
                    <label className="form-label">Select Date:</label>
                    <input 
                        type="date" 
                        name="selectedDate"
                        className="form-control"
                        onChange={this.handleInputChange}
                    />
                </div>

                {/* Slot dropdown */}
                <div className="col-md-6">
                    <label className="form-label">Select Time Slot:</label>
                    <select 
                        name="selectedSlot" 
                        className="form-select" 
                        onChange={this.handleInputChange}
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

            {/* Button */}
            <div className="mt-4 d-grid gap-2">
                <button
                    onClick={this.bookField}
                    className="btn btn-success btn-lg"
                >
                    Book Field
                </button>
                
                {/* Small link to go back if they change their mind */}
                <button 
                    onClick={() => this.setViewInParent({ page: "fields" })}
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