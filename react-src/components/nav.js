import React from 'react';
import {LinkContainer} from 'react-router-bootstrap'
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from 'reactstrap';

class Navigation extends React.Component {

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.collapseNavbar = this.collapseNavbar.bind(this);
        this.state = {
            collapsed: true
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    collapseNavbar() {
        if (!this.state.collapsed) {
            this.toggleNavbar();
        }
    }

    render() {
        return (
            <div>
                <Navbar color="faded" expand="lg" light>
                    <LinkContainer to="/">
                        <NavbarBrand id="nav-brand" className="brand-text" onClick={this.collapseNavbar}>
                            Sample Nav
                        </NavbarBrand>
                    </LinkContainer>
                    <NavbarToggler onClick={this.toggleNavbar} className="mr-2"/>
                    <Collapse isOpen={!this.state.collapsed} navbar>
                        <Nav navbar>
                            <NavItem>
                                <LinkContainer to="/dynamic" onClick={this.collapseNavbar}>
                                    <NavLink>
                                        Dynamic
                                    </NavLink>
                                </LinkContainer>
                            </NavItem>
                            <NavItem>
                                <LinkContainer to="/static" onClick={this.collapseNavbar}>
                                    <NavLink>
                                        Static
                                    </NavLink>
                                </LinkContainer>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }

}

export default Navigation
