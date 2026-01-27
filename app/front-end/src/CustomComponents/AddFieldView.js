import { Component } from "react";
import axios from "axios";

class AddFieldView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      field: {}
    };
  }

  QGetTextFromField = (e) => {
    this.setState(prevState => ({
      field: { ...prevState.field, [e.target.name]: e.target.value },
    }));
  };

  // Sending POST request to the server
  QPostField = () => {
    let slotsToSend = [];
    const inputSlots = this.state.field.bookableSlots;
    
    // If User has typed their own timeSlots
    if (inputSlots && inputSlots.trim().length > 0) {
      slotsToSend = inputSlots.split(",").map(slot => ({
        time: slot.trim(),
      }));
    } else {
      // Default values
      const defaultTimes = [
        "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00",
        "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00", "18:00-19:00",
        "19:00-20:00", "20:00-21:00"
      ];
      slotsToSend = defaultTimes.map(t => ({ time: t}))
    }

    axios.post("http://localhost:8080/fields",{
      name: this.state.field.name,
      sport: this.state.field.sport,
      address: this.state.field.address,
      bookableSlots: slotsToSend
    }).then(res => {
      alert("Field added successfully!")
      this.props.QViewFromChild({ page: "fields" });
    })
    .catch(err => {
      console.log("Error:", err);
      alert("Error adding field");
    })
  }

  render() {
    return (
      <div className="container mt-4" style={{ maxWidth: "600px" }}>
        
        {/* Main container */}
        <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
            
            {/* Header */}
            <div className="mb-4 text-center border-bottom pb-3">
                <h2 className="fw-bold text-primary">
                    <i className="bi bi-geo-alt-fill me-2"></i> Add New Field
                </h2>
                <p className="text-muted mb-0">Register a new sports facility for booking</p>
            </div>

            <div className="card-body p-0">
                
                {/* Field Name */}
                <div className="mb-3">
                    <label className="form-label fw-bold small text-muted text-uppercase">Field Name</label>
                    <input 
                        onChange={(e) => this.QGetTextFromField(e)} 
                        name="name" 
                        type="text" 
                        className="form-control bg-light border-0 py-2" 
                        placeholder="e.g. San Siro Fives" 
                    />
                </div>

                {/* Sport */}
                <div className="mb-3">
                    <label className="form-label fw-bold small text-muted text-uppercase">Sport</label>
                    <select 
                        onChange={(e) => this.QGetTextFromField(e)} 
                        name="sport" 
                        className="form-select bg-light border-0 py-2"
                        defaultValue="" 
                    >
                        <option value="" disabled>Select a sport...</option>
                        <option value="Football">Football</option>
                        <option value="Volleyball">Volleyball</option>
                        <option value="Basketball">Basketball</option>
                    </select>
                </div>

                {/* Address */}
                <div className="mb-3">
                    <label className="form-label fw-bold small text-muted text-uppercase">Address</label>
                    <input 
                        onChange={(e) => this.QGetTextFromField(e)} 
                        name="address" 
                        type="text" 
                        className="form-control bg-light border-0 py-2" 
                        placeholder="e.g. Via Roma 10" 
                    />
                </div>

                {/* Bookable slots */}
                <div className="mb-4">
                    <label className="form-label fw-bold small text-muted text-uppercase">
                        Bookable Slots <span className="fw-normal text-secondary text-lowercase">(Optional)</span>
                    </label>
                    <input 
                        onChange={(e) => this.QGetTextFromField(e)} 
                        name="bookableSlots" 
                        type="text" 
                        className="form-control bg-light border-0 py-2" 
                        placeholder="Leave empty for default (09:00 - 21:00)" 
                    />
                    <small className="text-muted mt-2 d-block fst-italic">
                        <i className="bi bi-info-circle me-1"></i>
                        Separate times with commas (e.g. 09:00-10:00, 10:00-11:00)
                    </small>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="d-flex justify-content-between border-top pt-4 mt-4">
                    <button 
                        onClick={() => this.props.QViewFromChild({ page: "fields" })}
                        className="btn btn-outline-secondary rounded-pill px-4 fw-bold"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={this.QPostField} 
                        className="btn btn-primary rounded-pill px-5 fw-bold shadow-sm"
                    >
                        <i className="bi bi-plus-lg me-2"></i> Add Field
                    </button>
                </div>

            </div>
        </div>
      </div>
    );
  }
}

export default AddFieldView;