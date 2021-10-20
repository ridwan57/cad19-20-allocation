import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { Table, Card } from '@themesberg/react-bootstrap';
import EditIcon from '@material-ui/icons/Edit';
import { FormControl, InputLabel, Select, MenuItem, Fab, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, IconButton, TextField, Checkbox, Tooltip, Paper, Input } from '@material-ui/core';
import Draggable from 'react-draggable';
import '../../styles/Rashed.css';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";

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


class ViewUpdateSVG extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eiin: 107858,
            svgs: [],
            collegeeiin: 107858,
            collegeName: "B. A. F. Shaheen College, Tejgaon",
            showUpdateWindow: false,
            updatingSVGIndex: -1,
            selectedShift: '',
            selectedVersion: '',
            selectedGroup: '',
            selectedGender: '',
            updatedMinGPA: 0,
            updatedOwnMinGPA: 0,
            selectedSQAvailabilty: 'NO',
            updatedSQMinGPA: 0,
            selectedReservedSeats: 0,
            selectedTotalSeats: 0,
            regex: /^\d*(\.?\d*)?$/,
            width: window.innerWidth,
            singleRow: false,
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
                    name: "shiftName",
                    label: "SHIFT",
                    options: {
                        filter: true,
                        sort: true,
                    }
                },
                {
                    name: "versionName",
                    label: "VERSION",
                    options: {
                        filter: true,
                        sort: true,
                    }
                },
                {
                    name: "groupName",
                    label: "GROUP",
                    options: {
                        filter: true,
                        sort: true,
                    }
                },
                {
                    name: "gender",
                    label: "GENDER",
                    options: {
                        filter: true,
                        sort: true,
                    }
                },
                {
                    name: "minimumGPA",
                    label: "MIN GPA",
                    options: {
                        filter: false,
                        sort: true,
                    }
                },
                {
                    name: "ownMinimumGPA",
                    label: "OWN MIN GPA",
                    options: {
                        filter: false,
                        sort: true,
                    }
                },
                {
                    name: "isSQ",
                    label: "SQ AVAILABILITY",
                    options: {
                        filter: true,
                        sort: true,
                    },
                    MuiTableCell: {
                        align: 'center'
                    }
                },
                {
                    name: "sqminGPA",
                    label: "SQ MIN GPA",
                    options: {
                        filter: false,
                        sort: true,
                        isEditable: true
                    }
                },
                {
                    name: "reservedSeats",
                    label: "RESERVED SEATS",
                    options: {
                        filter: false,
                        sort: true,
                    }
                },
                {
                    name: "totalSeats",
                    label: "TOTAL SEATS",
                    options: {
                        filter: false,
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
            ],

            showUpdateSuccessWindow: false,
        }
        this.fetchSVGs = this.fetchSVGs.bind(this);
        this.handleEditSVGButtonPressed = this.handleEditSVGButtonPressed.bind(this);
        this.handleCancelUpdateButtonPressed = this.handleCancelUpdateButtonPressed.bind(this);
        this.handleConfirmUpdateButtonPressed = this.handleConfirmUpdateButtonPressed.bind(this);
        this.PaperComponent = this.PaperComponent.bind(this);
        this.handleUpdatedMinGPAChange = this.handleUpdatedMinGPAChange.bind(this);
        this.handleUpdatedOwnMinGPAChange = this.handleUpdatedOwnMinGPAChange.bind(this);
        this.handleUpdatedSQMinGPAChange = this.handleUpdatedSQMinGPAChange.bind(this);
        this.handleUpdateSuccessAcknowledged = this.handleUpdateSuccessAcknowledged.bind(this);
    }

    fetchSVGs() {
        console.log(this.props.keycloak);
        fetch(institutionModuleRootAddress +'/getSVGData/', {
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
                        svg => lst.push(svg)
                    );
                    console.log(lst);
                    lst.forEach((element, index) => {
                        element.id = index + 1;
                        element.shiftName = element.shift.shiftName;
                        element.versionName = element.version.versionName;
                        element.groupName = element.hscGroup.hscGroupName;
                        element.minimumGPA = (Math.round(element.minimumGPA * 100) / 100).toFixed(2);
                        element.ownMinimumGPA = (Math.round(element.ownMinimumGPA * 100) / 100).toFixed(2);
                        element.sqminGPA = (Math.round(element.sqminGPA * 100) / 100).toFixed(2);
                        element.gender = (element.gender === 'F' && 'Female') || (element.gender === 'M' && 'Male') || (element.gender === 'C' && 'Co-Ed.');
                        if (element.isSQ === 'N') {
                            element.sqminGPA = 'N/A';
                            element.isSQ = 'No'
                        }
                        else
                            element.isSQ = 'Yes'
                        element.action =
                            <Tooltip title="Update">
                                <IconButton aria-label="add" color="primary" style={{ marginTop: "-4px", width: "32px", height: "32px", minHeight: "32px" }} onClick={() => this.handleEditSVGButtonPressed(index)}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>

                    });
                    this.setState({
                        svgs: lst,
                    })
                }
                else this.setState({
                    svgs: [],
                })
            })

    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        if (window.innerWidth < 960) this.setState({ singleRow: true });
        this.fetchSVGs();
    }

    handleResize = (e) => {

        // configure the widths of the dropdown selects based on the screen width
        this.setState({ width: window.innerWidth });
        if (window.innerWidth < 960) this.setState({ singleRow: true });
    }

    handleEditSVGButtonPressed(svgIndex) {
        console.log(this.state.svgs[svgIndex]);
        this.setState({
            selectedShift: this.state.svgs[svgIndex].shift.shiftName,
            selectedVersion: this.state.svgs[svgIndex].version.versionName,
            selectedGroup: this.state.svgs[svgIndex].hscGroup.hscGroupName,
            selectedGender: this.state.svgs[svgIndex].gender,
            updatedMinGPA: this.state.svgs[svgIndex].minimumGPA,
            updatedOwnMinGPA: this.state.svgs[svgIndex].ownMinimumGPA,
            selectedSQAvailabilty: this.state.svgs[svgIndex].isSQ,
            updatedSQMinGPA: this.state.svgs[svgIndex].sqminGPA,
            selectedReservedSeats: this.state.svgs[svgIndex].reservedSeats,
            selectedTotalSeats: this.state.svgs[svgIndex].totalSeats,
            updatingSVGIndex: svgIndex, showUpdateWindow: true
        })
    }

    handleUpdatedMinGPAChange(event) {
        if (this.state.regex.test(event.target.value)) {
            this.setState({ updatedMinGPA: event.target.value });
        }
    }

    handleUpdatedOwnMinGPAChange(event) {
        if (this.state.regex.test(event.target.value)) {
            this.setState({ updatedOwnMinGPA: event.target.value });
        }
    }

    handleUpdatedSQMinGPAChange(event) {
        console.log("Func Called");
        console.log(event.target.value);
        if (this.state.regex.test(event.target.value)) {
            this.setState({ updatedSQMinGPA: event.target.value });
        }

    }

    handleCancelUpdateButtonPressed() {
        this.setState({ showUpdateWindow: false });
    }

    handleConfirmUpdateButtonPressed(event) {
        if (this.state.updatedMinGPA === '' && this.state.updatedOwnMinGPA === '' && this.state.updatedSQMinGPA === '') {
            alert("𝐌𝐢𝐧 𝐆𝐏𝐀, 𝐎𝐰𝐧 𝐌𝐢𝐧 𝐆𝐏𝐀 and 𝐒𝐐 𝐌𝐢𝐧 𝐆𝐏𝐀 can't be empty");

        }
        else if (this.state.updatedMinGPA === '' && this.state.updatedOwnMinGPA === '') {
            alert("𝐌𝐢𝐧 𝐆𝐏𝐀 and 𝐎𝐰𝐧 𝐌𝐢𝐧 𝐆𝐏𝐀 can't be empty");

        }
        else if (this.state.updatedMinGPA === '' && this.state.updatedSQMinGPA === '') {
            alert("𝐌𝐢𝐧 𝐆𝐏𝐀 and 𝐒𝐐 𝐌𝐢𝐧 𝐆𝐏𝐀 can't be empty");

        }
        else if (this.state.updatedOwnMinGPA === '' && this.state.updatedSQMinGPA === '') {
            alert("𝐎𝐰𝐧 𝐌𝐢𝐧 𝐆𝐏𝐀 and 𝐒𝐐 𝐌𝐢𝐧 𝐆𝐏𝐀 can't be empty");

        }
        else if (this.state.updatedMinGPA === '') alert("𝐌𝐢𝐧 𝐆𝐏𝐀 can't be empty");
        else if (this.state.updatedOwnMinGPA === '') {
            alert("𝐎𝐰𝐧 𝐌𝐢𝐧 𝐆𝐏𝐀 can't be empty");
        }
        else if (this.state.updatedSQMinGPA === '') {
            alert("𝐒𝐐 𝐌𝐢𝐧 𝐆𝐏𝐀 can't be empty");
        }

        event.preventDefault();
        let updatedSVGToSubmit = this.state.svgs[this.state.updatingSVGIndex];
        updatedSVGToSubmit.minGPA = (Math.round(this.state.updatedMinGPA * 100) / 100).toFixed(2);
        updatedSVGToSubmit.ownMinGPA = (Math.round(this.state.updatedOwnMinGPA * 100) / 100).toFixed(2);
        updatedSVGToSubmit.sqMinGPA = (Math.round(this.state.updatedSQMinGPA * 100) / 100).toFixed(2);

        console.log(updatedSVGToSubmit);

        fetch(institutionModuleRootAddress +'/updateSVGData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.props.keycloak.token}`,
            },
            body: JSON.stringify(updatedSVGToSubmit)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200 && data.message == "Success") {
                    this.fetchSVGs();
                    this.setState({ showUpdateSuccessWindow: true, showUpdateWindow: false });
                }
            });
    }

    handleUpdateSuccessAcknowledged() {
        this.setState({ showUpdateSuccessWindow: false });
    }
    PaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
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
            print: true,
            selectableRows: false
        };
        return (
            <>
                {this.state.width}
                <div>
                    <Dialog
                        open={this.state.showUpdateWindow}
                        onClose={this.handleCancelUpdateButtonPressed}
                        PaperComponent={this.PaperComponent}
                        aria-labelledby="draggable-dialog-title"
                    >
                        <DialogTitle style={{ cursor: 'move', textAlign: 'center' }} id="draggable-dialog-title">
                            Edit SVG Entry
                        </DialogTitle>
                        <DialogContent>
                            <form id="update-svg-form" >
                                <div class="row">
                                    <div class="col-sm-12-top-padded col-md-6-top-padded">
                                        <FormControl>
                                            <TextField
                                                id="standard-basic"
                                                label="Shift"
                                                value={this.state.selectedShift}
                                                disabled={true}
                                            />
                                        </FormControl>
                                    </div>
                                    <div class="col-sm-12-top-padded col-md-6-top-padded">
                                        <FormControl>
                                            <TextField
                                                id="standard-basic"
                                                label="Version"
                                                value={this.state.selectedVersion}
                                                disabled={true}
                                            />
                                        </FormControl>
                                    </div>

                                    <div class="col-sm-12-top-padded col-md-6-top-padded">
                                        <FormControl>
                                            <TextField
                                                id="standard-basic"
                                                label="Group"
                                                value={this.state.selectedGroup}
                                                disabled={true}
                                            />
                                        </FormControl>
                                    </div>

                                    <div class="col-sm-12-top-padded col-md-6-top-padded">
                                        <FormControl>
                                            <TextField
                                                id="standard-basic"
                                                label="Gender"
                                                value={this.state.selectedGender}
                                                disabled={true}
                                            />
                                        </FormControl>
                                    </div>

                                    <div class="col-sm-12-top-padded col-md-6-top-padded">
                                        <FormControl>
                                            <TextField
                                                id="standard-basic"
                                                label="Min GPA"
                                                defaultValue={this.state.updatedMinGPA}
                                                onBlur={this.handleUpdatedMinGPAChange}
                                                required={true}
                                            />
                                        </FormControl>
                                    </div>

                                    <div class="col-sm-12-top-padded col-md-6-top-padded">
                                        <FormControl>
                                            <TextField
                                                id="standard-basic"
                                                label="Own Min GPA"
                                                value={this.state.updatedOwnMinGPA}
                                                onChange={this.handleUpdatedOwnMinGPAChange}
                                                required={true}
                                            />
                                        </FormControl>
                                    </div>

                                    <div class="col-sm-12-top-padded col-md-6-top-padded">
                                        <FormControl>
                                            <TextField
                                                id="standard-basic"
                                                label="SQ Availabilty"
                                                value={this.state.selectedSQAvailabilty}
                                                disabled={true}
                                            />
                                        </FormControl>
                                    </div>

                                    <div class="col-sm-12-top-padded col-md-6-top-padded">
                                        <FormControl>
                                            <TextField
                                                id="standard-basic"
                                                label="SQ Min GPA"
                                                value={this.state.updatedSQMinGPA}
                                                onChange={this.handleUpdatedSQMinGPAChange}
                                                required={true}
                                            />
                                        </FormControl>
                                    </div>

                                    <div class="col-sm-12-top-padded col-md-6-top-padded">
                                        <FormControl>
                                            <TextField
                                                id="standard-basic"
                                                label="Reserved Seats"
                                                value={this.state.selectedReservedSeats}
                                                disabled={true}
                                            />
                                        </FormControl>
                                    </div>

                                    <div class="col-sm-12-top-padded col-md-6-top-padded">
                                        <FormControl>
                                            <TextField
                                                id="standard-basic"
                                                label="Total Seats"
                                                value={this.state.selectedTotalSeats}
                                                disabled={true}
                                            />
                                        </FormControl>
                                    </div>
                                </div>
                            </form>

                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus color="primary" onClick={this.handleCancelUpdateButtonPressed}>
                                Cancel
                            </Button>
                            <Button onClick={this.handleConfirmUpdateButtonPressed} form="update-svg-form" color="primary">
                                Update
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={this.state.showUpdateSuccessWindow}
                        onClose={this.handleUpdateSuccessAcknowledged}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title" style={{ textAlign: "center" }}>{"Successfully Saved"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                You have successfully Updated the Offered SVG
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleUpdateSuccessAcknowledged} color="primary" autoFocus>
                                OK
                            </Button>
                        </DialogActions>
                    </Dialog>

                </div>

                <div className="flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4 card-container">
                    <div className="d-block mb-4 mb-xl-0">
                        <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                            <Breadcrumb.Item active>View/Update SVGs</Breadcrumb.Item>
                        </Breadcrumb>
                        <h4 class="card-container-h4">Offered SVG List</h4>
                        <div class="col d-flex justify-content-center">
                            <Card>
                                <Card.Header>
                                    <h5>{this.props.institute.eiin + ' - ' + this.props.institute.name}</h5>
                                </Card.Header>
                                <Card.Body>
                                    {
                                         this.state.svgs.length === 0 &&
                                        <div style={{ textAlign: "center" }}>
                                            <LoaderProvider indicator={<Bars width="50" />}>
                                                <Loader />
                                            </LoaderProvider>
                                        </div>
                                    }
                                    {
                                        this.state.svgs.length > 0 &&
                                        <div class="muidatatable-update-svg">
                                            <MuiThemeProvider theme={this.getMuiTheme()}>
                                                <MUIDataTable
                                                    data={this.state.svgs}
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

export default ViewUpdateSVG;