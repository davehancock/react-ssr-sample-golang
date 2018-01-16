import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom'

import Navigation from './nav'
import Home from './home'
import Dynamic from './dynamic'
import Static from './static'
import Footer from "./footer";

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            postcodes: this.props.store ? this.props.store.postcodes : [],
            postcodeQuery: this.props.store ? this.props.store.postcodeQuery : []
        };
    }

    render() {
        return (
            <div>
                <Navigation/>

                <div id="body">
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/dynamic" render={(props) =>
                            <Dynamic {...props}
                                     postcodes={this.state.postcodes}
                                     postcodeQuery={this.state.postcodeQuery}/>
                        }/>
                        <Route path="/static" component={Static}/>
                        <Redirect to="/"/>
                    </Switch>
                </div>

                <Footer/>
            </div>
        )
    }
}

export default App;
