import { Component } from "react";
import axios from "axios";

class FieldsView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      searchQuery:"",
      selectedSport:""
    }
  }

  setViewInParent = (obj) => {
    this.props.viewFromChild(obj);
  };


  fetchFields = () => {
    const {searchQuery, selectedSport} = this.state;

    axios.get("/fields?q="+searchQuery+"&sport="+selectedSport) // http://localhost:8080
      .then(res => {
        this.setState({
          fields: res.data
        }); 
      }) 
      .catch(err => {
        console.log("Error:", err);
      });
  }



  componentDidMount() {
    this.fetchFields();
  }



  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value // Remember the name for each input and select -> They have specific names in order to easily update the state
    }, () => {
      this.fetchFields(); // Fetch again after state update
    });
  }

  

  render() {
    let filteredData = this.state.fields;
    const {logged, user} = this.props.userStatus || {};
    
    return (
      <div className="container mt-4">
        <div className="card border-0 shadow-sm p-4 mb-4 bg-white rounded-3" style={{ margin: "10px", padding: "15px" }}>
            <div className="row g-3 align-items-center">
                
                
                <div className="col-md-5">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><i className="bi bi-search text-muted"></i></span>
                    <input 
                        type="text" 
                        name="searchQuery"
                        className="form-control border-0 bg-light" 
                        placeholder="Search fields by name or address..." 
                        onChange={this.handleInputChange}
                    />
                  </div>
                </div>

                
                <div className="col-md-3">
                    <select 
                        name="selectedSport" 
                        className="form-select border-0 bg-light" 
                        onChange={this.handleInputChange}
                    >
                        <option value="">All Sports</option>
                        <option value="Football">Football</option>
                        <option value="Volleyball">Volleyball</option>
                        <option value="Basketball">Basketball</option>
                    </select>
                </div>

                
                <div className="col-md-4 text-end">
                    {logged ? (
                        <button 
                            className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm"
                            onClick={() => this.setViewInParent({ page: "addfield" })} 
                        >
                            <i className="bi bi-plus-lg me-2"></i> Add New Field
                        </button>
                    ) : (
                        <span className="text-muted small">Login to add fields</span>
                    )}
                </div>
            </div>
        </div>
        <div
          className="row row-cols-1 row-cols-md-3 g-4"
          style={{ margin: "10px" }}
        >
        {filteredData.length > 0 ? 
          filteredData.map(d => {
            return (
              <div className="col" key={d._id}>
                <div className="card feature-card h-100 shadow-sm">
                  <div className="card-header fw-bold text-uppercase text-secondary">
                    {d.sport}
                  </div>

                  <div className="card-body">
                    <h5 className="card-title fw-bold">{d.name}</h5>
                    <p className="card-text text-muted mb-3">
                       <i className="bi bi-geo-alt-fill me-1"></i> {d.address}
                    </p>
                    
                    
                    <div>
                      <small className="text-muted d-block mb-1">Available Slots:</small>
                      <div className="d-flex flex-wrap gap-1">
                        {/* Check if slots exist and is an array */}
                        {d.bookableSlots && d.bookableSlots.length > 0 ? (
                          d.bookableSlots.slice(0, 4).map((slot, index) => (
                              
                              <span key={index} className="badge bg-light text-dark border">
                                  {slot.time}
                              </span>
                          ))
                        ) : (
                            <span className="text-muted small fst-italic">No schedule defined</span>
                        )}
                        {d.bookableSlots && d.bookableSlots.length > 4 && (
                          <span className="badge bg-light text-muted border fw-normal">+{d.bookableSlots.length - 4} more</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="card-footer bg-white border-top-0 pt-0 pb-3">
                    <button
                      onClick={() => this.setViewInParent({ page: "bookfield", fieldID: d._id })}
                      className="btn btn-outline-primary w-100 rounded-pill mt-4 fw-bold"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            )
        })
          :
          <div className="col-12 text-center p-5">
             {this.state.fields.length === 0 ? "Loading..." : "No fields found matching your search."}
          </div>
        }
        </div>
      </div>
    );
  }
}

export default FieldsView;
