import React from 'react';

class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.initialValue
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.onValueSubmitted(this.state.value);
    }

    render() {
        return (
            <div className="input-group">
                <form className="form-inline" onSubmit={this.handleSubmit}>
                    <input type="text" className="form-control"
                           placeholder={this.props.placeholder || "Enter a search term"}
                           value={this.state.value}
                           onChange={this.handleChange}/>
                    <span className="input-group-btn">
                        <input className="btn btn-primary" type="submit" value="Search"/>
                    </span>
                </form>
            </div>
        );
    }
}

export default Search;
