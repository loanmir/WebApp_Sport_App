import { Component } from "react";
import axios from "axios";

class SearchView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: { fields: [], teams: [], tournaments: [], users: [] },
            loading: true
        };
    }

    componentDidMount() {
        this.QPerformSearch(this.props.searchQuery);
    }

    // Re-run search if the query changes (e.g., user types a new word while on this page)
    componentDidUpdate(prevProps) {
        if (prevProps.searchQuery !== this.props.searchQuery) {
            this.QPerformSearch(this.props.searchQuery);
        }
    }

    QPerformSearch = (query) => {
        this.setState({ loading: true });
        axios.get("http://localhost:8080/search?q="+query)
            .then(res => {
                this.setState({ results: res.data, loading: false });
            })
            .catch(err => {
                console.error(err);
                this.setState({ loading: false });
            });
    }

    renderSection = (title, items, type) => {
        if (!items || items.length === 0) return null;
        
        return (
            <div className="mb-4">
                <h4 className="border-bottom pb-2 mb-3">{title}</h4>
                <div className="list-group">
                    {items.map(item => (
                        <button 
                            key={item._id} 
                            className="list-group-item list-group-item-action"
                            onClick={() => {
                                // Navigate to the specific detail page based on type
                                if(type === "field") this.props.QViewFromChild({ page: "bookfield", fieldID: item._id }); 
                                if(type === "team") this.props.QViewFromChild({ page: "team", teamID: item._id });
                                if(type === "tournament") this.props.QViewFromChild({ page: "tournaments"}); 
                                if(type === "user") this.props.QViewFromChild({ page: "singleUser", userID: item._id });
                            }}
                        >
                            {type === "user" ? (
                                <strong>
                                    {item.user_firstName} {item.user_surname} <span className="text-muted">({item.user_username})</span>
                                </strong>
                            ) : (
                                <>
                                    <strong>{item.name}</strong>
                                    {item.sport ? <span className="text-muted"> - {item.sport}</span> : ""}
                                </>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    render() {
        if (this.state.loading) return <div className="p-5 text-center">Searching...</div>;

        const { fields, teams, tournaments, users } = this.state.results;
        const isEmpty = !fields.length && !teams.length && !tournaments.length && !users.length;

        return (
            <div className="container mt-4">
                <h2>Search Results for "{this.props.searchQuery}"</h2>
                <hr />
                
                {isEmpty ? (
                    <div className="alert alert-warning">No results found.</div>
                ) : (
                    <div>
                        {this.renderSection("Fields", fields, "field")}
                        {this.renderSection("Teams", teams, "team")}
                        {this.renderSection("Tournaments", tournaments, "tournament")}
                        {this.renderSection("Users", users, "user")}
                    </div>
                )}
            </div>
        );
    }
}

export default SearchView;