import { Component } from "react";
import axios from "axios";

class SingleNovicaView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      novica: {}
    }
  }

  QSetViewInParent = (obj) => {
    this.props.QViewFromChild(obj);
  };

  componentDidMount() {
    axios.get("http://localhost:8080/novice/"+this.props.data)
    .then(res=>{
      this.setState({
        novica: res.data
      })
    })
  }

  render() {
    let novica = this.state.novica;
    let isEmpty = Object.keys(novica).length === 0; // Check if novica object is empty (if the data hasn't arrived yet)
    // Object.keys() returns an array of all the keys in novica!
    // Checkinf if the number of elements in the array is 0
    return (
      <div className="card" style={{ margin: "10px" }}>
        {!isEmpty ? 
        <div>
          <h5 className="card-header">{novica.title}</h5>
          <div className="card-body">
            <h5 className="card-title">{novica.slug}</h5>
            <p className="card-text">{novica.text}</p>
            <button
              onClick={() => this.QSetViewInParent({ page: "novice" })}
              className="btn btn-primary"
            >
              Return news
            </button>
          </div>
        </div>
        : "Loading..."}
      </div>
    );
  }
}

export default SingleNovicaView;
