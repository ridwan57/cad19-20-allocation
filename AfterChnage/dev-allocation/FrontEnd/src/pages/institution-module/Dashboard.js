import React, { Component } from "react";
import { FormControl, InputLabel, Select, MenuItem, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { Col, Row, Nav, Card, Image, Button, Table, Dropdown, ProgressBar, Pagination, ButtonGroup } from '@themesberg/react-bootstrap';
import '../../styles/institute-styling.css';

import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

class Dashboard extends Component{
    render () {
        console.log("Hello"+this.props.institute);
        return(
            <>
            {"this.props.institute"}
                <div className="flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4 card-container">
                    <div className="d-block mb-4 mb-xl-0">
                        <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                            <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
                        </Breadcrumb>
                        <h4 class="card-container-h4">Institution Dashboard</h4>

                        <div class="col d-flex justify-content-center" style={{ paddingTop: "20px" }}>
                            <Card>
                                <Card.Header>
                                    <Image style={{ maxWidth: "200px", paddingBottom: "20px" }} src={process.env.PUBLIC_URL + '/images/'+this.props.keycloak.idTokenParsed.EIIN+'.jpg'} />
                                    <h5 style={{ marginLeft: "-12px" }}>{this.props.institute.eiin && this.props.institute.eiin + ' - ' + this.props.institute.name}</h5>
                                </Card.Header>
                                <Card.Body>
                                    
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>

            </>
        );
    }
}

export default Dashboard;