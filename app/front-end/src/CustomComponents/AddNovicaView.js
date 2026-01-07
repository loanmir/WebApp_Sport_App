import { Component } from "react";
import axios from "axios";

class AddNovicaView extends Component {

  constructor(props) {
    super(props),
      (this.state = {
        novica: {}
      });
  }

  QGetTextFromField = (e) => {
    this.setState(prevState => ({
      novica: { ...prevState.novica, [e.target.name]: e.target.value },
    }));
  };

  // Sending POST request to the server -> to novice.js route where the API is present
  QPostNovica = () => {
    axios.post("http://localhost:8080/novice",{
      title: this.state.novica.title,
      slug: this.state.novica.slug,
      text: this.state.novica.text
    }).then(res => {
      console.log("Sent to server..")
    })
    .catch(err => {
      console.log("Error:", err);
    })

    this.props.QViewFromChild({ page: "novice" });
  }

  render() {
    console.log(this.state.novica);
    return (
      <div className="card" style={{ margin: "10px" }}>
        <h3 style={{ margin: "10px" }}>Welcome user</h3>
        <div className="mb-3" style={{ margin: "10px" }}>
          <label className="form-label">Title</label>
          <input onChange={(e)=>this.QGetTextFromField(e)} name="title" type="text" className="form-control" placeholder="Title..." />
        </div>
        <div className="mb-3" style={{ margin: "10px" }}>
          <label className="form-label">Slug</label>
          <input onChange={(e)=>this.QGetTextFromField(e)} name="slug" type="text" className="form-control" placeholder="Slug..." />
        </div>
        <div className="mb-3" style={{ margin: "10px" }}>
          <label className="form-label">Text</label>
          <textarea onChange={(e)=>this.QGetTextFromField(e)} name="text" className="form-control" rows="3"></textarea>
        </div>
        <button onClick={()=>{this.QPostNovica()}} className="btn btn-primary bt" style={{ margin: "10px" }}>
          Send
        </button>
      </div>
    );
  }
}

export default AddNovicaView;
