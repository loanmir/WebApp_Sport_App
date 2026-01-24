import { Component } from "react";
import axios from "axios";

class AddFieldView extends Component {

  constructor(props) {
    super(props),
      (this.state = {
        field: {}
      });
  }

  QGetTextFromField = (e) => {
    this.setState(prevState => ({
      field: { ...prevState.field, [e.target.name]: e.target.value },
    }));
  };

  // Sending POST request to the server -> to novice.js route where the API is present
  QPostField = () => {
    let slotsToSend = [];
    const inputSlots = this.state.field.bookableSlots;
    // If User has typed its own timeSlots -> "Did not leave empty for default values"
    if (inputSlots && inputSlots.trim().length > 0) {
      slotsToSend = inputSlots.split(",").map(slot => ({
        time: slot.trim(),
      }));
    } else {
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
      console.log("Sent to server..")
      alert("Field added successfully!")
      this.props.QViewFromChild({ page: "fields" });
    })
    .catch(err => {
      console.log("Error:", err);
    })

    
  }

  render() {
    console.log(this.state.field);
    return (
  <div className="card" style={{ margin: "10px" }}>
    <h3 style={{ margin: "10px" }}>Add New Field</h3>

    {/* FIELD NAME */}
    <div className="mb-3" style={{ margin: "10px" }}>
      <label className="form-label">Field Name</label>
      <input 
        onChange={(e) => this.QGetTextFromField(e)} 
        name="name" 
        type="text" 
        className="form-control" 
        placeholder="e.g. San Siro Fives" 
      />
    </div>

    {/* SPORT SELECTOR (Matches your Enum) */}
    <div className="mb-3" style={{ margin: "10px" }}>
      <label className="form-label">Sport</label>
      <select 
        onChange={(e) => this.QGetTextFromField(e)} 
        name="sport" 
        className="form-control"
        defaultValue="" // Sets default to empty so user is forced to choose
      >
        <option value="" disabled>Select a sport...</option>
        <option value="Football">Football</option>
        <option value="Volleyball">Volleyball</option>
        <option value="Basketball">Basketball</option>
      </select>
    </div>

    {/* ADDRESS */}
    <div className="mb-3" style={{ margin: "10px" }}>
      <label className="form-label">Address</label>
      <input 
        onChange={(e) => this.QGetTextFromField(e)} 
        name="address" 
        type="text" 
        className="form-control" 
        placeholder="e.g. Via Roma 10" 
      />
    </div>

    {/* BOOKABLE SLOTS  */}
    <div className="mb-3" style={{ margin: "10px" }}>
        <label className="form-label">Bookable Slots (Optional)</label>
        <small className="text-muted d-block">Separate time with commas (e.g. 09:00-10:00, 10:00-11:00)</small>
        <input 
          onChange={(e) => this.QGetTextFromField(e)} 
          name="bookableSlots" 
          type="text" 
          className="form-control" 
          placeholder="Leave empty for default (09:00 - 21:00)" 
        />
    </div>

    <button 
      onClick={() => { this.QPostField() }} 
      className="btn btn-primary bt" 
      style={{ margin: "10px" }}
    >
      Add Field
    </button>
  </div>
);
  }
}

export default AddFieldView;
