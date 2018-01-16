import React from 'react';
import {LinkContainer} from 'react-router-bootstrap'
import {Button} from 'reactstrap';

class Home extends React.Component {

    render() {
        return (
            <div>
                <section className="jumbotron home text-center">
                    <div className="container brand-text">
                        <h1 className="jumbotron-heading">Sample App</h1>
                    </div>
                </section>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-3 mx-auto">
                            <div className="btn-group">
                                <LinkContainer to="/dynamic">
                                    <Button className="stacked" color="primary">
                                        Dynamic Content
                                    </Button>
                                </LinkContainer>
                                <LinkContainer to="/static">
                                    <Button className="stacked" color="primary">
                                        Static Content
                                    </Button>
                                </LinkContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home
