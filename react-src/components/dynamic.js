import React from 'react';
import Search from "./search";
import Postcode from "../api/postcode"

class Dynamic extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            postcodeQuery: this.props.postcodeQuery,
            postcodes: this.props.postcodes
        };

        this.handlePostcodeQueryChange = this.handlePostcodeQueryChange.bind(this);
    }

    render() {
        return (
            <div>
                <section className="jumbotron home text-center">
                    <div className="container brand-text">
                        <h1 className="jumbotron-heading">Some Dynamic Content</h1>
                    </div>
                </section>
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-xs-3 mx-auto">
                            <Search initialValue={this.state.postcodeQuery}
                                    onValueSubmitted={this.handlePostcodeQueryChange}/>
                        </div>
                    </div>
                    <div className="row">
                        {Dynamic.hasPostcodes(this.state.postcodes) && Dynamic.renderPostcodes(this.state.postcodes)}
                    </div>
                </div>
            </div>
        )
    }

    static hasPostcodes(postcodes) {
        return typeof postcodes !== "undefined" && postcodes !== null && postcodes.length > 0
    }

    static renderPostcodes(postcodes) {
        return (
            <div className="table-responsive">
                <table className="table ">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Postcode</th>
                        <th>Country</th>
                        <th>Region</th>
                        <th>Longitude</th>
                        <th>Latitude</th>
                    </tr>
                    </thead>
                    <tbody>
                    {postcodes.map(function (postcodeDetails, index) {
                        return <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{postcodeDetails.postcode}</td>
                            <td>{postcodeDetails.country}</td>
                            <td>{postcodeDetails.region}</td>
                            <td>{postcodeDetails.longitude}</td>
                            <td>{postcodeDetails.latitude}</td>
                        </tr>
                    })}
                    </tbody>
                </table>
            </div>
        )
    }

    handlePostcodeQueryChange(postcodeQuery) {

        if (postcodeQuery !== this.state.postcodeQuery) {
            Postcode(postcodeQuery).then(
                res => {
                    this.setState({
                        postcodeQuery: postcodeQuery,
                        postcodes: res.data,
                    });
                }, err => {
                    console.log(`Error fetching postcodes: [${err.message}]`)
                });
        }
    }

}

export default Dynamic
