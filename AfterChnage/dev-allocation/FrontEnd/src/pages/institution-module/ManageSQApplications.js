import React, { Component, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faCheck, faMinus, faEye } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { Table, Card } from '@themesberg/react-bootstrap';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import RemoveIcon from '@material-ui/icons/Remove';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { FormControl, InputLabel, Select, MenuItem, Fab, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, IconButton, TextField, Checkbox, Tooltip, Paper, Input } from '@material-ui/core';
import Draggable from 'react-draggable';
import '../../styles/Rashed.css';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Loader from './../../components/Loader';

import { institutionModuleRootAddress } from '../../data/constants';


import {
    Audio,
    BallTriangle,
    Bars,
    Circles,
    Grid,
    Hearts,
    Oval,
    Puff,
    Rings,
    SpinningCircles,
    TailSpin,
    ThreeDots,
} from '@agney/react-loading';

import { LoaderProvider, useLoading } from '@agney/react-loading';


import { TablePagination } from '@material-ui/core';

//import MuiDataTable from "react-mui-datatables";
import MUIDataTable from "mui-datatables";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { faLess } from "@fortawesome/free-brands-svg-icons";




class ManageSQApplications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allSQApplications: null,
            grantedSQApplications: [],
            rejectedSQApplications: [],
            selectedApplications: [],
            SQStatusUpdateSuccess: false,
            updateStatus: '',
            updatedApplicant: null,
            width: window.innerWidth,
            collegeeiin: 107858,
            collegeName: "B. A. F. Shaheen College, Tejgaon",
            tableColumns: [
                {
                    name: "id",
                    label: "#",
                    options: {
                        filter: false,
                        sort: true,
                    }
                },
                {
                    name: "crvsId",
                    label: "CRVS ID",
                    options: {
                        filter: true,
                        sort: true,
                    }
                },
                {
                    name: "studentName",
                    label: "APPLICANT NAME",
                    options: {
                        filter: false,
                        sort: true,
                    }
                },
                {
                    name: "shift",
                    label: "SHIFT",
                    options: {
                        filter: true,
                        sort: true,
                    }
                },
                {
                    name: "version",
                    label: "VERSION",
                    options: {
                        filter: true,
                        sort: true,
                    }
                },
                {
                    name: "group",
                    label: "GROUP",
                    options: {
                        filter: true,
                        sort: true,
                    }
                },
                {
                    name: "sqStatus",
                    label: "SQ STATUS",
                    options: {
                        filter: true,
                        sort: true,
                    }
                },
                {
                    name: "action",
                    label: "ACTION",
                    options: {
                        filter: false,
                        sort: false,
                    }
                }
            ]
        }
        this.fetchSQApplicantions = this.fetchSQApplicantions.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleViewDetailsButtonPressed = this.handleViewDetailsButtonPressed.bind(this);
        this.handleGrantedButtonPressed = this.handleGrantedButtonPressed.bind(this);
        this.handleRejectedButtonPressed = this.handleRejectedButtonPressed.bind(this);
        this.SQStatusUpdateSuccessAck = this.SQStatusUpdateSuccessAck.bind(this);
    }

    fetchSQApplicantions() {
        fetch(institutionModuleRootAddress+'/getSpecialQuotaRequestList/', {
            headers: {
                'Authorization': `bearer ${this.props.keycloak.token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                var lst = [];
                if (data.status === 200) {
                    data.result.map(
                        application => lst.push(application)
                    );
                    const actionButton = <Button onClick={this.handleClick}>Action</Button>;
                    lst.forEach((element, index) => {
                        element.action = <Button onClick={() => this.handleClick(index)}>Action</Button>;
                        element.id = index + 1;
                        if (element.isSQGranted === 0) element.sqStatus = 'Applied';
                        else if (element.isSQGranted === 1) element.sqStatus = 'Granted';
                        else if (element.isSQGranted === 2) element.sqStatus = 'Rejected';
                        element.action =
                            <div>
                                {/*<Tooltip title="View Detais">
                                    <IconButton aria-label="add" color="" style={{ marginTop: "-4px", width: "32px", height: "32px", minHeight: "32px" }} onClick={() => this.handleViewDetailsButtonPressed(index)}>
                                        <VisibilityIcon />
                                    </IconButton>
                    </Tooltip>*/}
                                <Tooltip title="Grant">
                                    <IconButton aria-label="add" color="" style={{ marginTop: "-4px", width: "32px", height: "32px", minHeight: "32px" }} onClick={() => this.handleGrantedButtonPressed(index)}>
                                        <CheckIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject">
                                    <IconButton aria-label="add" color="" style={{ marginTop: "-4px", width: "32px", height: "32px", minHeight: "32px" }} onClick={() => this.handleRejectedButtonPressed(index)}>
                                        <RemoveIcon />
                                    </IconButton>
                                </Tooltip>

                            </div>

                    });
                    console.log(lst);
                    this.setState({
                        allSQApplications: lst,
                        selectedApplications: lst
                    })
                }
                else this.setState({
                    allSQApplications: [],
                })
            })
    }

    handleResize = (e) => {
        this.setState({ width: window.innerWidth });
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        this.fetchSQApplicantions();
    }

    handleClick(e) {
        /* Your code is here.alert is the example */
        console.log(e);
        //alert("parent td#id: " + e.target.parentNode.id);
    }

    handleViewDetailsButtonPressed(index) {

    }
    handleGrantedButtonPressed(index) {
        var SQChoice = {
            "SQChoice":
            {
                "choiceID": this.state.allSQApplications[index].choiceId,
                "approval": 1
            }
        }
        console.log(SQChoice);
        fetch(institutionModuleRootAddress+'/updateSQApprovalStatus/', {
            method: 'POST',
            headers: {
                'Authorization': `bearer ${this.props.keycloak.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                SQChoice
            )
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200 && data.message === 'SQ status updated to 1') {
                    this.setState({
                        updateStatus: 'Accepted',
                        updatedApplicant: this.state.allSQApplications[index],
                        SQStatusUpdateSuccess: true,
                    });
                }
            })
        this.state.allSQApplications[index].sqStatus = 'Granted';
        this.state.allSQApplications[index].isSQGranted = 1;
    }
    handleRejectedButtonPressed(index) {
        var SQChoice = {
            "SQChoice":
            {
                "choiceID": this.state.allSQApplications[index].choiceId,
                "approval": 2
            }
        }
        console.log(SQChoice);
        fetch(institutionModuleRootAddress+'/updateSQApprovalStatus/', {
            method: 'POST',
            headers: {
                'Authorization': `bearer ${this.props.keycloak.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                SQChoice
            )
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200 && data.message === 'SQ status updated to 2') {
                    this.setState({
                        updateStatus: 'Rejected',
                        updatedApplicant: this.state.allSQApplications[index],
                        SQStatusUpdateSuccess: true,
                    });
                }
            })
        this.state.allSQApplications[index].sqStatus = 'Rejected';
        this.state.allSQApplications[index].isSQGranted = 2;
    }

    SQStatusUpdateSuccessAck() {
        this.setState({ SQStatusUpdateSuccess: false });
    }

    getMuiTheme = () => createMuiTheme({
        overrides: {
            MuiTableCell: {
                head: {
                    backgroundColor: "#f5f8fb !important"
                }
            }
        }
    })

    render() {
        const options = {
            filter: true,
            filterType: "dropdown",
            print: false,
            selectableRows: false,
        };
        return (
            <>
                {this.state.width}
                <Dialog
                    open={this.state.SQStatusUpdateSuccess}
                    onClose={this.SQStatusUpdateSuccessAck}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" style={{ textAlign: "center" }}>{"Successfully Saved"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            You have successfully {this.state.updateStatus} the SQ Applicantion of {this.state.updatedApplicant && this.state.updatedApplicant.studentName} (CRVSID: {this.state.updatedApplicant && this.state.updatedApplicant.crvsId}).
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.SQStatusUpdateSuccessAck} color="primary" autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>

                <div className="flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4 update-svg">
                    <div className="d-block mb-4 mb-xl-0">
                        <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                            <Breadcrumb.Item active>Manage SQ Applications</Breadcrumb.Item>
                        </Breadcrumb>
                        <h4 class="update-svg-h4">SQ Applications</h4>
                        <div class="col d-flex justify-content-center">
                            <Card>
                                <Card.Header>
                                    <h5>{this.props.institute.eiin + ' - ' + this.props.institute.name}</h5>
                                </Card.Header>
                                <Card.Body>
                                    {
                                        !this.state.allSQApplications &&
                                        <div style={{ textAlign: "center" }}>
                                            <LoaderProvider indicator={<Bars width="50" />}>
                                                <Loader />
                                            </LoaderProvider>
                                        </div>
                                    }
                                    {
                                        this.state.allSQApplications &&
                                        <div class="muidatatable-update-sq">
                                            <MuiThemeProvider theme={this.getMuiTheme()}>
                                                <MUIDataTable
                                                    data={this.state.allSQApplications}
                                                    columns={this.state.tableColumns}
                                                    options={options}
                                                />
                                            </MuiThemeProvider>
                                        </div>
                                    }
                                </Card.Body>
                            </Card>
                        </div>

                    </div>
                </div>
            </>
        );
    }
}

export default ManageSQApplications;