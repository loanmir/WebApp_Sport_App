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

  QHandleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value // Remember the name for each input and select -> They have specific names in order to easily update the state
    });
  }

  render() {
    let filteredData = this.state.fields.filter(d => {
      
      // Check Sport
      const matchesSport = this.state.selectedSport === "" || d.sport === this.state.selectedSport;
      
      // Check Search Text (Name OR Address)
      const query = this.state.searchQuery.toLowerCase();
      const matchesSearch = d.name.toLowerCase().includes(query) || 
                            d.address.toLowerCase().includes(query);

      return matchesSport && matchesSearch;
    });

    return (
      <div>
        <div className="card" style={{ margin: "10px", padding: "15px" }}>
            <div className="row g-3 align-items-center">
                
                
                <div className="col-md-5">
                    <input 
                        type="text" 
                        name="searchQuery"
                        className="form-control" 
                        placeholder="Search fields by name or address..." 
                        onChange={this.QHandleInputChange}
                    />
                </div>

                
                <div className="col-md-4">
                    <select 
                        name="selectedSport" 
                        className="form-select" 
                        onChange={this.QHandleInputChange}
                    >
                        <option value="">All Sports</option>
                        <option value="Football">Football</option>
                        <option value="Volleyball">Volleyball</option>
                        <option value="Basketball">Basketball</option>
                    </select>
                </div>

                
                <div className="col-md-3 text-end">
                    <button 
                        className="btn btn-success w-100"
                        onClick={() => this.QSetViewInParent({ page: "addfield" })} 
                    >
                      Add New Field
                    </button>
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
                <div className="card h-100 shadow-sm">
                  <div className="card-header fw-bold text-uppercase text-secondary">
                    {d.sport}
                  </div>

                  <div className="card-body">
                    <h5 className="card-title fw-bold">{d.name}</h5>
                    <p className="card-text text-muted mb-3">
                       <i className="bi bi-geo-alt-fill me-1"></i> {d.address}
                    </p>
                    
                    
                    <div>
                      <small className="text-muted d-block mb-1">Available Schedule:</small>
                      <div className="d-flex flex-wrap gap-1">
                        {/* Check if slots exist and is an array */}
                        {d.bookableSlots && d.bookableSlots.length > 0 ? (
                          d.bookableSlots.map((slot, index) => (
                              // CRITICAL FIX: We access 'slot.time' because 'slot' is now an object {id, time}
                              <span key={index} className="badge bg-light text-dark border">
                                  {slot.time}
                              </span>
                          ))
                        ) : (
                            <span className="text-muted small fst-italic">No schedule defined</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="card-footer bg-white border-top-0 pt-0 pb-3">
                    <button
                      onClick={() => this.QSetViewInParent({ page: "bookfield", fieldID: d._id })}
                      className="btn btn-primary w-100 mt-2"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            )
        })
          :
          // Fallback if search finds nothing
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
