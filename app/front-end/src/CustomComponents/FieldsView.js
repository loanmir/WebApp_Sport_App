import { Component } from "react";
import axios from "axios";

class FieldsView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fields: [],
    }
  }

  QSetViewInParent = (obj) => {
    this.props.QIDFromChild(obj);
  };

  componentDidMount() {
    axios.get("http://localhost:8080/fields")
      .then(res => {
        this.setState({
          fields: res.data
        }); 
      }) 
      .catch(err => {
        console.log("Error:", err);
      });
  }

  render() {
    let data = this.state.fields;
    return (
      <div>

        <div className="d-flex justify-content-end" style={{ margin: "10px" }}>
          <button 
            className="btn btn-success"
            // Ensure "addfield" matches the case in your App.js switch statement
            onClick={() => this.QSetViewInParent({ page: "addfield" })} 
          >
            Add New Field
          </button>
        </div>


        <div
          className="row row-cols-1 row-cols-md-3 g-4"
          style={{ margin: "10px" }}
        >
        {data.length > 0 ? 
          data.map(d => {
            return (
              <div className="col" key={d._id}>
                <div className="card">
                  <div className="card-header">
                    {d.sport}
                  </div>

                <div className="card-body">
                  <h5 className="card-title">{d.name}</h5>
                  <p className="card-text">
                    <strong>Address:</strong> {d.address}
                  </p>
                  
                  <p className="card-text">
                    <small className="text-muted">
                      <strong>Slots: </strong> 
                      {d.bookableSlots ? d.bookableSlots.join(", ") : "No slots listed"}
                    </small>
                  </p>
                </div>

                <div className="card-footer bg-white border-top-0">
                  <button
                  onClick={() => this.QSetViewInParent({ page: "field", id: d._id })}
                  className="btn btn-primary w-100"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
          )
        })
          :
          "Loading..."}
        </div>
      </div>
    );
  }
}

export default FieldsView;
