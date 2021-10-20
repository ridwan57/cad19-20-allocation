import React, { Component } from "react";

import i18n from "i18next";

import { withStyles } from '@material-ui/core/styles';


import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { Card } from '@themesberg/react-bootstrap';
import '../../styles/Rashed.css';

import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import { studentModuleRootAddress } from '../../data/constants';

const useStyles = theme => ({
    option: {
      fontSize: 15,
      '& > span': {
        marginRight: 10,
        fontSize: 18,
      },
    },
  });


class SearchCollege extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boards: [],
            districts: [],
            thanas: [],
            colleges: [],
            esvgs: [],

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
                    }
                },
                {
                    name: "sqminGPA",
                    label: "SQ MIN GPA",
                    options: {
                        filter: false,
                        sort: true,
                    }
                },
                {
                    name: "seatsAvailable",
                    label: "TOTAL SEATS",
                    options: {
                        filter: false,
                        sort: true,
                    }
                },
            ],


            board: '',
            district: '',
            thana: '',
            college: '',
            collegeName: '',


            // width: window.innerWidth,
            // selectFontSize: 15,
            // selectWidth: window.innerWidth / 12,
            // selectLeftPadding: "-12px",

            // shrink: false,
            // singleColumn: false,

            boardsProp: {
                options: [],
                getOptionLabel: (option) => option.boardName,
            },
            districtsProp: {
                options: [],
                getOptionLabel: (option) => option.districtName,
            },
            thanasProp: {
                options: [],
                getOptionLabel: (option) => option.thanaName,
            },
            collegesProp: {
                options: [],
                getOptionLabel: (option) => option.collegeName,
            },
            resetThana: false,
            resetDistrict: false,
            resetCollege: false,
        }
        this.handleBoardChange = this.handleBoardChange.bind(this);
        this.handleDistrictChange = this.handleDistrictChange.bind(this);
        this.handleThanaChange = this.handleThanaChange.bind(this);
        this.handleCollegeChange = this.handleCollegeChange.bind(this);
    }

    componentDidMount() {
        // add event listeners
        // window.addEventListener("resize", this.handleResize);

        // // configure the column count and the widths of the dropdown selects based on the screen width
        // if (window.innerWidth < 600)
        //     this.setState({
        //         selectWidth: window.innerWidth / 18,
        //         shrink: true,
        //         singleColumn: true
        //     });
        // else if (window.innerWidth < 768)
        //     this.setState({
        //         selectWidth: window.innerWidth / 14,
        //         shrink: false,
        //         singleColumn: true
        //     });
        // else if (window.innerWidth < 992)
        //     this.setState({
        //         selectWidth: window.innerWidth / 12,
        //         shrink: true,
        //         singleColumn: false
        //     });
        // else
        //     this.setState({
        //         selectWidth: window.innerWidth / 10,
        //         shrink: false,
        //         singleColumn: false
        //     });

        // fetch the initial list of education boards 
        fetch(studentModuleRootAddress + '/getBoardList', {
            headers: {
                'Authorization': `bearer ${this.props.keycloak.token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                var lst = [];
                data.result.map(
                    board => lst.push(board)
                );
                this.setState({
                    boards: lst
                })

                console.log(lst);
                let newDefaultProps = {
                    options: lst,
                    getOptionLabel: (option) => option.boardName,
                }
                this.setState({ boardsProp: newDefaultProps });
            })
    }


    // componentWillMount() {
    //     // add event listeners
    //     window.addEventListener("resize", this.handleResize);

    //     // configure the column count and the widths of the dropdown selects based on the screen width
    //     if (window.innerWidth < 600)
    //         this.setState({
    //             selectWidth: window.innerWidth / 18,
    //             shrink: true,
    //             singleColumn: true
    //         });
    //     else if (window.innerWidth < 768)
    //         this.setState({
    //             selectWidth: window.innerWidth / 14,
    //             shrink: false,
    //             singleColumn: true
    //         });
    //     else if (window.innerWidth < 992)
    //         this.setState({
    //             selectWidth: window.innerWidth / 12,
    //             shrink: true,
    //             singleColumn: false
    //         });
    //     else
    //         this.setState({
    //             selectWidth: window.innerWidth / 10,
    //             shrink: false,
    //             singleColumn: false
    //         });
    // }

    // // function to handle the rendered page based on the screen resizing
    // handleResize = (e) => {
    //     this.setState({ width: window.innerWidth });

    //     // configure the column count and the widths of the dropdown selects based on the screen width
    //     if (window.innerWidth < 600)
    //         this.setState({
    //             selectWidth: window.innerWidth / 18,
    //             shrink: true,
    //             singleColumn: true
    //         });
    //     else if (window.innerWidth < 768)
    //         this.setState({
    //             selectWidth: window.innerWidth / 14,
    //             shrink: false,
    //             singleColumn: true
    //         });
    //     else if (window.innerWidth < 992)
    //         this.setState({
    //             selectWidth: window.innerWidth / 12,
    //             shrink: true,
    //             singleColumn: false
    //         });
    //     else
    //         this.setState({
    //             selectWidth: window.innerWidth / 10,
    //             shrink: false,
    //             singleColumn: false
    //         });
    // }

    // Dropdown ==> Education Boards
    handleBoardChange(event, board) {
        // when one board is selected
        // districts under that board will be fetched and showed
        // the thana list is set to empty
        // the college list is set to empty
        // the esvg table is reset 

        //fetch and set districts under the selected board
        fetch(studentModuleRootAddress + '/getDistrictList/' + board.boardId, {
            headers: {
                'Authorization': `bearer ${this.props.keycloak.token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                var lst = [];
                data.result.map(
                    district => lst.push(district)
                );
                this.setState({
                    districts: lst,
                })
                let newDefaultProps = {
                    options: lst,
                    getOptionLabel: (option) => option.districtName,
                }
                this.setState({ districtsProp: newDefaultProps });
            })

        const resetCollege = !this.state.resetCollege;
        const resetDistrict = !this.state.resetDistrict;
        const resetThana = !this.state.resetThana;

        // reset the other variables
        this.setState({
            board: board.boardId,
            district: '',
            thanas: [],
            thana: '',
            colleges: [],
            college: '',
            esvgs: [],
            resetCollege: resetCollege,
            resetDistrict: resetDistrict,
            resetThana: resetThana,
            collegesProp: {
                options: [],
                getOptionLabel: (option) => option.eiin + ' - ' + option.name,
            },
        })
    }

    // Dropdown ==> District
    handleDistrictChange(event, district) {
        // when one board is selected
        // when a district is selected 
        // thanas under that district will be fetched and showed
        // the college list is set to empty
        // the esvg table is reset

        // fetch and set the thanas under the selected district

        fetch(studentModuleRootAddress + '/getCollegeListByDistrict/' + this.state.board + '/' + district.districtId, {
            headers: {
                'Authorization': `bearer ${this.props.keycloak.token}`
            }
        }).then(response => response.json()).then(data => {
            var lst = [];
            data.result.map(
                college => lst.push(college)
            );
            let newDefaultProps = {
                options: lst,
                getOptionLabel: (option) => option.eiin + ' - ' + option.name,
            }
            console.log(newDefaultProps);
            this.setState({ collegesProp: newDefaultProps });
        });

        fetch(studentModuleRootAddress + '/getThanaList/' + district.districtId, {
            headers: {
                'Authorization': `bearer ${this.props.keycloak.token}`
            }
        }).then(response => response.json()).then(data => {
            var lst = [];
            data.result.map(
                thana => lst.push(thana)
            );
            let newDefaultProps = {
                options: lst,
                getOptionLabel: (option) => option.thanaName,
            }
            console.log(newDefaultProps);
            this.setState({ thanasProp: newDefaultProps });
        });

        const resetCollege = !this.state.resetCollege;
        const resetThana = !this.state.resetThana;

        // reset the other variables
        this.setState({
            district: district.id,
            thana: '',
            colleges: [],
            college: '',
            esvgs: [],
            resetCollege: resetCollege,
            resetThana: resetThana,
        });
    }

    // Dropdown ==> Thanas
    handleThanaChange(event, thana) {
        // when one board is selected
        // when a district is selected 
        // when a thana is selected
        // college under that thana will be fetched and showed
        // the esvg table is reset

        // fetch and set colleges under the selected thana
        fetch(studentModuleRootAddress + '/getCollegeListByThana/' + + this.state.board + '/' + thana.thanaId, {
            headers: {
                'Authorization': `bearer ${this.props.keycloak.token}`
            }
        }).then(response => response.json()).then(data => {
            var lst = [];
            data.result.map(
                college => lst.push(college)
            );
            let newDefaultProps = {
                options: lst,
                getOptionLabel: (option) => option.eiin + ' - ' + option.name,
            }
            console.log(newDefaultProps);
            this.setState({ collegesProp: newDefaultProps });
        });

        const resetCollege = !this.state.resetCollege;

        // reset the other variables
        this.setState({
            college: '',
            esvgs: [],
            resetCollege: resetCollege
        })
    }

    // Dropdown ==> Colleges
    handleCollegeChange(event, college) {
        // when one board is selected
        // when a district is selected 
        // when a thana is selected
        // when a college is selected
        // esvgs under that college will be fetched esvg table is populated

        // fetch and set the SVGs under the selected college
        fetch(studentModuleRootAddress + '/getSVG/' + college.eiin, {
            headers: {
                'Authorization': `bearer ${this.props.keycloak.token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                var lst = [];
                data.result.map(
                    svg => lst.push(svg)
                );
                lst.forEach((element, index) => {
                    element.id = index + 1;
                    element.minimumGPA = (Math.round(element.minimumGPA * 100) / 100).toFixed(2);
                    element.ownMinimumGPA = (Math.round(element.ownMinimumGPA * 100) / 100).toFixed(2);
                    element.sqminGPA = (Math.round(element.sqminGPA * 100) / 100).toFixed(2);
                    element.shiftName = element.shift.shiftName;
                    element.versionName = element.version.versionName;
                    element.groupName = element.hscGroup.hscGroupName;
                    element.seatsAvailable = element.totalSeats - element.reservedSeats;
                    if (element.isSQ === 'N') {
                        element.sqMinGPA = 'N/A';
                        element.isSQ = 'No'
                    }
                    else
                        element.isSQ = 'Yes'

                    element.gender = (element.gender === 'F' && 'Female') || (element.gender === 'M' && 'Male') || (element.gender === 'C' && 'Co-Education');
                });
                console.log(lst);
                this.setState({
                    esvgs: lst,
                })
            })

        // this function is called with the college EIIN only. So we need to find out the College Name with this selected EIIN
        //const colName = this.state.colleges[this.state.colleges.findIndex(function (element) {
        //    return element.eiin === college.eiin
        //})].name;

        // set the College Name and College EIIN
        this.setState({
            college: college.eiin,
            collegeName: college.name
        })
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
        const { classes } = this.props;
        const options = {
            filter: true,
            filterType: "dropdown",
            print: false,
            selectableRows: false
        };
        return (
            <>
                {/*{this.state.width}
                {this.state.singleColumn && ", single column: true "}
                {!this.state.singleColumn && ", single column: false "}
                {!this.state.shrink && ", shrink: false "}
        {this.state.shrink && ", shrink: true "}*/}
                <div className="flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4 college-search">
                    <div className="d-block mb-4 mb-xl-0">
                        <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                            <Breadcrumb.Item active>Search Colleges</Breadcrumb.Item>
                        </Breadcrumb>

                        <div class="col d-flex justify-content-center" style={{ paddingTop: "20px" }}>
                            <Card>
                                <Card.Header>
                                    College Selection
                                </Card.Header>
                                <Card.Body>
                                    <div class="row search-college">
                                        <div class="col-3">
                                            <Autocomplete
                                                {...this.state.boardsProp}
                                                id="boardProp"
                                                disableClearable
                                                onChange={this.handleBoardChange}
                                                renderInput={(params) => <TextField {...params} label="Board" margin="normal" />}
                                            />
                                        </div>
                                        <div class="col-3">
                                            <Autocomplete
                                                key={this.state.resetDistrict}
                                                {...this.state.districtsProp}
                                                id="districtProp"
                                                disableClearable
                                                onChange={this.handleDistrictChange}
                                                renderInput={(params) => <TextField {...params} label="District" margin="normal" />}
                                            />
                                        </div>
                                        <div class="col-3">
                                            <Autocomplete
                                                classes={{
                                                    option: classes.option,
                                                  }}
                                                  autoHighlight
                                                key={this.state.resetThana}
                                                {...this.state.thanasProp}
                                                id="thanaProp"
                                                disableClearable
                                                onChange={this.handleThanaChange}
                                                renderInput={(params) => <TextField 
                                                                            {...params} 
                                                                            label="Thana" 
                                                                            margin="normal" 
                                                                         />}
                                            />
                                        </div>
                                        <div class="col-6">
                                            <Autocomplete
                                                key={this.state.resetCollege}
                                                {...this.state.collegesProp}
                                                id="collegeProp"
                                                disableClearable
                                                onChange={this.handleCollegeChange}
                                                renderInput={(params) => <TextField {...params} label="College" margin="normal" />}
                                            />
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>


                        <div class="col d-flex justify-content-center" style={{ paddingTop: "20px" }}>
                            <Card >
                                <Card.Header>
                                    {this.state.college !== '' && ('Selected College: ' + this.state.college + ' - ' + this.state.collegeName)}
                                </Card.Header>
                                <Card.Body>
                                    <div class="muidatatable-update-sq">
                                        <MuiThemeProvider theme={this.getMuiTheme()}>
                                            <MUIDataTable
                                                data={this.state.esvgs}
                                                columns={this.state.tableColumns}
                                                options={options}
                                            />
                                        </MuiThemeProvider>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>

            </>
        );
    }
}

export default withStyles(useStyles)(SearchCollege);    

