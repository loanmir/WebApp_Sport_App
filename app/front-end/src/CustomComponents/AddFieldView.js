import { Component } from "react";
import axios from "axios";

class AddFieldView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      field: {
        name: "",
        sport: "",
        address: "",
      },
      addedSlots: [],
      tempStart: "",
      tempEnd: ""
    };
  }

  getTextFromField = (e) => {
    this.setState(prevState => ({
      field: { ...prevState.field, [e.target.name]: e.target.value },
    }));
  };


  getTempTime = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  addSlotToList = () => {
    const { tempStart, tempEnd } = this.state;
    // Validation
    if (!tempStart || !tempEnd) {
        alert("Please select both a Start Time and an End Time.");
        return;
    }
    // Ensuring end is after start
    if (tempStart >= tempEnd) {
        alert("End time must be after Start time.");
        return;
    }
    
    const formattedSlot = `${tempStart}-${tempEnd}`;
    // Checking for duplicates
    if (this.state.addedSlots.includes(formattedSlot)) {
        alert("This slot is already added.");
        return;
    }

    // Adding to list and clear inputs
    this.setState(prevState => ({
        addedSlots: [...prevState.addedSlots, formattedSlot].sort(), 
        tempStart: "",
        tempEnd: ""
    }));
  }


  removeSlot = (slotToRemove) => {
    this.setState(prevState => ({
        addedSlots: prevState.addedSlots.filter(s => s !== slotToRemove)
    }));
  }


  
  postField = () => {
    // Validation
    if (!this.state.field.name || !this.state.field.sport || !this.state.field.address) {
        alert("Please fill in Name, Sport, and Address.");
        return;
    }

    let slotsToSend = [];

    // Checking if user added custom slots
    if (this.state.addedSlots.length > 0) {
      slotsToSend = this.state.addedSlots.map(s => ({ time: s }));
    } else {
      // If list is empty, confirm if they want defaults
      if(window.confirm("No custom slots added. Use default slots (09:00 - 21:00)?")) {
          const defaultTimes = [
            "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00",
            "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00", "18:00-19:00",
            "19:00-20:00", "20:00-21:00"
          ];
          slotsToSend = defaultTimes.map(t => ({ time: t}))
      } else {
          return; // Stopping submission if user cancels
      }
    }

    axios.post("http://localhost:8080/fields",{
      name: this.state.field.name,
      sport: this.state.field.sport,
      address: this.state.field.address,
      bookableSlots: slotsToSend
    }).then(res => {
      alert("Field added successfully!")
      this.props.viewFromChild({ page: "fields" });
    })
    .catch(err => {
      console.log("Error:", err);
      alert(err.response?.data?.error || "Error adding field");
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
                        onChange={(e) => this.getTextFromField(e)} 
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
                        onChange={(e) => this.getTextFromField(e)} 
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
                        onChange={(e) => this.getTextFromField(e)} 
                        name="address" 
                        type="text" 
                        className="form-control bg-light border-0 py-2" 
                        placeholder="e.g. Via Roma 10" 
                    />
                </div>

                {/* Time slots section */}
                <div className="bg-light p-3 rounded-3 mb-4">
                    <label className="form-label fw-bold small text-dark text-uppercase mb-3">
                        <i className="bi bi-clock me-1"></i> Configure Available Slots
                    </label>
                    
                    {/* Inputs  */}
                    <div className="row g-2 align-items-end mb-3">
                        <div className="col-5">
                            <label className="small text-muted">Start</label>
                            <input 
                                type="time" 
                                name="tempStart"
                                className="form-control border-0 bg-white"
                                value={this.state.tempStart}
                                onChange={this.getTempTime}
                            />
                        </div>
                        <div className="col-5">
                            <label className="small text-muted">End</label>
                            <input 
                                type="time" 
                                name="tempEnd"
                                className="form-control border-0 bg-white"
                                value={this.state.tempEnd}
                                onChange={this.getTempTime}
                            />
                        </div>
                        <div className="col-2">
                            <button 
                                className="btn btn-primary w-100 fw-bold" 
                                onClick={this.addSlotToList}
                                title="Add Slot"
                            >
                                <i className="bi bi-plus-lg"></i>
                            </button>
                        </div>
                    </div>

                    {/* Added slots*/}
                    {this.state.addedSlots.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                            {this.state.addedSlots.map((slot, index) => (
                                <span key={index} className="badge bg-white text-dark border shadow-sm p-2 d-flex align-items-center">
                                    {slot}
                                    <i 
                                        className="bi bi-x-circle-fill ms-2 text-danger" 
                                        style={{cursor: "pointer"}}
                                        onClick={() => this.removeSlot(slot)}
                                    ></i>
                                </span>
                            ))}
                        </div>
                    ) : (
                        <small className="text-muted fst-italic">
                            No custom slots added. (Defaults will be used if left empty).
                        </small>
                    )}
                </div>

                {/* Footer */}
                <div className="d-flex justify-content-between border-top pt-4 mt-4">
                    <button 
                        onClick={() => this.props.viewFromChild({ page: "fields" })}
                        className="btn btn-outline-secondary rounded-pill px-4 fw-bold"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={this.postField} 
                        className="btn btn-success rounded-pill px-5 fw-bold shadow-sm"
                    >
                        <i className="bi bi-check-lg me-2"></i> Add Field
                    </button>
                </div>

            </div>
        </div>
      </div>
    );
  }
}

export default AddFieldView;