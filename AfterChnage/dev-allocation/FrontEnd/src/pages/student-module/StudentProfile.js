
import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { Col, Row, Card, Image, Breadcrumb } from '@themesberg/react-bootstrap';
import { Col, Row, Card, Image, Breadcrumb } from 'react-bootstrap';
import { faHome } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

import { studentModuleRootAddress, totalStudents, bucketSize, groupIDs } from '../../data/constants';
import { CADApplicationStatuses } from "../institution-module/ApplicationStatuses";

class StudentProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            singleColumn: false,
            testVar: 'test',
            applicant: {
                "crvsId": "",
                "studentName": "",
                "fatherName": "",
                "motherName": "",
                "dob": "",
                "gender": "",
                "contactNo": "",
                "address":
                {
                    "present": "B-13, E-04, AGB Colony (Al-Helal Zone), Motijheel, Dhaka - 1000",
                    "permanent": "Village: Chowbari, Post Office: Chowbari, Police Station: Kamarkhan, DIstrict: Sirajganj"
                }
            },
            sscInfo: {
                // eduInstitution: {
                //     eiin: "",
                //     name: ""
                // },
                sscEiin:"",
                sscYear: "",
                eduBoard: {
                    "boardId": "",
                    "boardName": "",
                    "establishmentYear": null
                },
                roll: "",
                regno: "",
                sscGroup: {
                    sscGroupId: "",
                    sscGroupName: ""
                },
                sscGPA: "",
                gpaWO4thSub: "",
            },
            ranking: {},
            applicationStatus: null, //todo
            applicationPayment: null,
            allocationStatus: null,
        }
    }
    handleResize = (e) => {
        this.setState({ width: window.innerWidth });
        if (window.innerWidth < 992) {
            this.setState({ singleColumn: true });
        }
        else {
            this.setState({ singleColumn: false });
        }
    }
    omponentWillMount() {
        window.addEventListener("resize", this.handleResize);
    }
    componentDidMount() {
        let thisApplicant = null;
        fetch(studentModuleRootAddress + '/getCRVSProfile', {
            headers: {
                'Authorization': `bearer ${this.props.keycloak.token}`
            }
        }).then(response => response.json()).then(data => {
            console.log("Here " + data.result.length);
            thisApplicant = data.result;
            if (thisApplicant.gender === "M") thisApplicant.gender = "Male";
            else thisApplicant.gender = "Female";
            thisApplicant.address =
            {
                present: "B-13, E-04, AGB Colony (Al-Helal Zone), Motijheel, Dhaka - 1000",
                permanent: "Village: Chowbari, Post Office: Chowbari, Police Station: Kamarkhan, DIstrict: Sirajganj"
            };
            this.setState({ applicant: thisApplicant });
        });

        let sscInfo = null;
        fetch(studentModuleRootAddress + '/getSSCResult', {
            headers: {
                'Authorization': `bearer ${this.props.keycloak.token}`
            }
        }).then(response => response.json()).then(data => {
            console.log(data);
            if (data.message === "Success") {
                console.log(data.result);
                console.log('data');
                sscInfo = data.result;
                this.setState({ sscInfo: sscInfo });
            }
        });

        let ranking = {};
        ranking.preSRank = null;
        ranking.preARank = null;
        fetch(studentModuleRootAddress + '/getPreRanks', {
            headers: {
                'Authorization': `bearer ${this.props.keycloak.token}`
            }
        }).then(response => response.json()).then(data => {
            console.log(data);
            if (data.result) {
                console.log(data.result);
                ranking.preSRank = data.result.preSRank;
                ranking.preARank = data.result.preARank;

                if (ranking.preSRank) {
                    const sMeritBucket = Math.floor(data.result.preSRank / bucketSize);
                    ranking.sMeritStart = sMeritBucket * bucketSize + 1;
                    ranking.sMeritEnd = (sMeritBucket + 1) * bucketSize;
                }

                if (ranking.preARank) {
                    const aMeritBucket = Math.floor(data.result.preARank / bucketSize);
                    ranking.aMeritStart = aMeritBucket * bucketSize + 1;
                    ranking.aMeritEnd = (aMeritBucket + 1) * bucketSize;
                }

                this.setState({ ranking: ranking });

            }
        });
        // let thisApplicant = { sscinfo: {} };
        // fetch(studentModuleRootAddress + '/getCRVSProfile', {
        //     headers: {
        //         'Authorization': `bearer ${this.props.keycloak.token}`
        //     }
        // }).then(response => response.json()).then(data => {
        //     console.log("Here " + data.result.length);
        //     thisApplicant = data.result;
        //     if (thisApplicant.gender === "M") thisApplicant.gender = "Male";
        //     else thisApplicant.gender = "Female";
        //     thisApplicant.address =
        //     {
        //         present: "B-13, E-04, AGB Colony (Al-Helal Zone), Motijheel, Dhaka - 1000",
        //         permanent: "Village: Chowbari, Post Office: Chowbari, Police Station: Kamarkhan, DIstrict: Sirajganj"
        //     };
        //     /*thisApplicant.sscinfo =
        //     {
        //         eduInstitution: {
        //             eiin: "1111",
        //             name: "Test Name"
        //         },
        //         sscYear: "2014",
        //         eduBoard: {
        //             "boardId": 12,
        //             "boardName": "Rajshahi",
        //             "establishmentYear": null
        //         },
        //         roll: "1123369",
        //         regno: "111222555",
        //         sscGroup: {
        //             sscGroupId: "0",
        //             sscGroupName: "SCIENCE"
        //         },
        //         gpoint: 5.0,
        //         gpaWO4thSub: "5",
        //     };*/

        //     //this.setState({ applicant: thisApplicant });
        //     //console.log(this.state.applicant);
        //     //this.setState({ testVar: "Updated2" });
        //     fetch(studentModuleRootAddress + '/getSSCResult', {
        //         headers: {
        //             'Authorization': `bearer ${this.props.keycloak.token}`
        //         }
        //     }).then(response => response.json()).then(data => {
        //         console.log(data);
        //         if (data.message === "Success") {
        //             console.log(data.result);
        //             console.log('data');
        //             thisApplicant.sscinfo = data.result;
        //             this.setState({ applicant: thisApplicant });

        //             thisApplicant.preSRank = null;
        //             thisApplicant.preARank = null;
        //             fetch(studentModuleRootAddress + '/getPreRanks', {
        //                 headers: {
        //                     'Authorization': `bearer ${this.props.keycloak.token}`
        //                 }
        //             }).then(response => response.json()).then(data => {
        //                 console.log(data);
        //                 if (data.result) {
        //                     console.log(data.result);
        //                     thisApplicant.preSRank = data.result.preSRank;
        //                     thisApplicant.preARank = data.result.preARank;

        //                     if (thisApplicant.preSRank) {
        //                         const sMeritBucket = Math.floor(data.result.preSRank / bucketSize);
        //                         console.log(thisApplicant.sscinfo);
        //                         thisApplicant.sscinfo.sMeritStart = sMeritBucket * bucketSize + 1;
        //                         thisApplicant.sscinfo.sMeritEnd = (sMeritBucket + 1) * bucketSize;
        //                     }

        //                     if (thisApplicant.preARank) {
        //                         const aMeritBucket = Math.floor(data.result.preARank / bucketSize);
        //                         thisApplicant.sscinfo.aMeritStart = aMeritBucket * bucketSize + 1;
        //                         thisApplicant.sscinfo.aMeritEnd = (aMeritBucket + 1) * bucketSize;
        //                     }
        //                     // console.log('data');
        //                     // thisApplicant.sscinfo = data.result;
        //                     // const meritBucket = Math.floor(data.result.meritPos / bucketSize);
        //                     // thisApplicant.sscinfo.meritStart = meritBucket * bucketSize + 1;
        //                     // thisApplicant.sscinfo.meritEnd = (meritBucket + 1) * bucketSize;
        //                     this.setState({ applicant: thisApplicant });
        //                 }
        //             })
        //         }
        //     });
        // });




        fetch(studentModuleRootAddress + '/getPaymentHistory', {
            headers: {
                'Authorization': `bearer ${this.props.keycloak.token}`
            }
        }).then(response => response.json()).then(data => {
            if ( data.result?.length > 0) {
                data.result.forEach((element, id) => {
                    element.id = id + 1;
                    element.purposeName = element.paymentPurpose.purposeName;
                    element.amountRequired = element.paymentPurpose.amountRequired + ' BDT';
                    //var moment = require('moment');
                    element.timeStamp = 'Paid at ' + moment(element.timeStamp).subtract(6,'hours').format('YYYY-MM-DD, h:mm:ss A').toString();//Date.parse(element.timeStamp).toDateString();
                });
                this.setState({ applicationPayment: data.result[0] })
            }
        });

        window.addEventListener("resize", this.handleResize);
        if (window.innerWidth < 992) {
            this.setState({ singleColumn: true });
        }
    }
    render() {
        return (
            <>
                <div className="flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">

                    <div className="d-block mb-4 mb-xl-0">
                        <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
                            <Breadcrumb.Item active>My Profile</Breadcrumb.Item>
                        </Breadcrumb>

                        <div class="col d-flex justify-content-center">

                        </div>

                        <div class="col d-flex justify-content-center" style={{ paddingTop: "20px" }}>
                            <Card style={{ width: "98%" }}>
                                <Card.Body>
                                    <Card style={{ border: "0" }}>
                                        <Card.Header style={{ textAlign: "center" }}>
                                            <h4 style={{ textAlign: "center", marginLeft: "-12px" }}>Applicant's Profile</h4>
                                            <h6 style={{ display: "inline" }}>Welcome </h6>
                                            <h5 style={{ display: "inline" }}><b>{this.state.applicant && this.state.applicant.studentName}</b></h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <div class="row">
                                                <div class="col-md-12 col-lg-4">
                                                    <Card style={{ border: "0" }}>
                                                        <Card.Header>
                                                            <h5>Profile Photo</h5>
                                                        </Card.Header>
                                                        <Card.Body >
                                                            <div class="row">
                                                                <div class={((window.innerWidth > 450 && window.innerWidth < 992) || window.innerWidth > 1275) && "md-sm-12 width-img-300-px"} style={{ textAlign: "center" }}>
                                                                    {this.state.applicant && <Image src={process.env.PUBLIC_URL + '/images/' + this.state.applicant.crvsId + '.jpg'} />}
                                                                </div>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </div>
                                                {
                                                    this.state.applicant &&
                                                    <div class="col-md-12 col-lg-8">
                                                        <Card style={{ minHeight: "440px", verticalAlign: "middle" }}>
                                                            <Card.Header>
                                                                <h5>Personal Information</h5>
                                                            </Card.Header>
                                                            <Card.Body>
                                                                <div class="personal-ssc-info">
                                                                    <Row>
                                                                        <Col>
                                                                            <h6>CRVS ID</h6>
                                                                        </Col>
                                                                        <Col>
                                                                            {this.state.applicant.crvsId}
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <h6>Applicant Name</h6>
                                                                        </Col>
                                                                        <Col>
                                                                            {this.state.applicant.studentName}
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <h6>Father's Name</h6>
                                                                        </Col>
                                                                        <Col>
                                                                            {this.state.applicant.fatherName}
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <h6>Mother's Name</h6>
                                                                        </Col>
                                                                        <Col>
                                                                            {this.state.applicant.motherName}
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <h6>Date of Birth</h6>
                                                                        </Col>
                                                                        <Col>
                                                                            {this.state.applicant.dob}
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <h6>Gender</h6>
                                                                        </Col>
                                                                        <Col>
                                                                            {this.state.applicant.gender}
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <h6>Contact No</h6>
                                                                        </Col>
                                                                        <Col>
                                                                            {this.state.applicant.contactNo}
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <h6>Present Address</h6>
                                                                        </Col>
                                                                        <Col>
                                                                            {this.state.applicant.address.present}
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <h6>Permanent Address</h6>
                                                                        </Col>
                                                                        <Col>
                                                                            {this.state.applicant.address.permanent}
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    </div>
                                                }
                                            </div>

                                            <div style={{ paddingTop: "10px" }}>
                                                <div class="row">
                                                    <div class={"col-md-12 col-lg-6" + (!this.state.singleColumn && " padded-down")}>
                                                        {
                                                            this.state.sscInfo &&
                                                            <div class="personal-ssc-info">
                                                                <Card style={{ minHeight: "350px" }}>
                                                                    <Card.Header>
                                                                        <h5>SSC Information</h5>
                                                                    </Card.Header>
                                                                    <Card.Body>
                                                                        <Row>
                                                                            <Col>
                                                                                <h6>SSC EIIN</h6>
                                                                            </Col>
                                                                            <Col>
                                                                            {this.state.sscInfo.sscEiin}
                                                                                {/* {this.state.sscInfo.eduInstitution.name} */}
                                                                                 {/* //todo */}
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col>
                                                                                <h6>Roll No.</h6>
                                                                            </Col>
                                                                            <Col>
                                                                                118798
                                                                                {/*this.state.sscinfo.roll*/}
                                                                            </Col>
                                                                        </Row>

                                                                        <Row>
                                                                            <Col>
                                                                                <h6>Board</h6>
                                                                            </Col>
                                                                            <Col>
                                                                                {this.state.sscInfo.eduBoard.boardName}
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col>
                                                                                <h6>Group</h6>
                                                                            </Col>
                                                                            <Col>
                                                                                {this.state.sscInfo.sscGroup.sscGroupName}
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col>
                                                                                <h6>Passing Year</h6>
                                                                            </Col>
                                                                            <Col>
                                                                                {this.state.sscInfo.sscYear}
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col>
                                                                                <h6>GPA (with 4th Subject)</h6>
                                                                            </Col>
                                                                            <Col>
                                                                                {this.state.sscInfo.sscGPA}
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col>
                                                                                <h6>GPA (without 4th Subject)</h6>
                                                                            </Col>
                                                                            <Col>
                                                                                {this.state.sscInfo.gpaWO4thSub}
                                                                            </Col>
                                                                        </Row>
                                                                        {
                                                                            this.state.ranking.preSRank &&
                                                                            <Row>
                                                                                <Col>
                                                                                    <h6>Merit Position (Science)</h6>
                                                                                </Col>
                                                                                <Col>
                                                                                    {this.state.ranking.sMeritStart} - {this.state.ranking.sMeritEnd}
                                                                                </Col>
                                                                            </Row>
                                                                        }
                                                                        {
                                                                            this.state.ranking.preARank &&
                                                                            <Row>
                                                                                <Col>
                                                                                    <h6>Merit Position (All)</h6>
                                                                                </Col>
                                                                                <Col>
                                                                                    {this.state.ranking.aMeritStart} - {this.state.ranking.aMeritEnd}
                                                                                </Col>
                                                                            </Row>
                                                                        }


                                                                    </Card.Body>
                                                                </Card>
                                                            </div>
                                                        }
                                                    </div>
                                                    <div class="col-md-12 col-lg-6">
                                                        <div>
                                                            {
                                                                this.state.applicant &&
                                                                <div class="single-column-card top-padded">
                                                                    <Card>
                                                                        <Card.Header>
                                                                            <h5>Application Status</h5>
                                                                        </Card.Header>
                                                                        <Card.Body>
                                                                            <Row>
                                                                                <Col>
                                                                                    <h6>Application Submitted</h6>
                                                                                </Col>
                                                                                <Col>
                                                                                    {/* {this.props.applicant.applicationStatus >= 2 && "Yes" || "No"} */}
                                                                                    {this.props.applicant.applicationStatus > CADApplicationStatuses.Submitted && "Yes" || "No"}
                                                                                </Col>
                                                                            </Row>
                                                                            <Row>
                                                                                <Col>
                                                                                    <h6>Submission Date</h6>
                                                                                </Col>
                                                                                <Col>
                                                                                {/* {this.props.applicant.applicationStatus >= 2 && moment(this.props.applicant.applicationSubmissionDate).format('YYYY-MM-DD, h:mm:ss A') || "N/A"} */}
                                                                                    {this.props.applicant.applicationStatus > CADApplicationStatuses.Submitted && moment(this.props.applicant.applicationSubmissionDate).format('YYYY-MM-DD, h:mm:ss A') || "N/A"}
                                                                                </Col>
                                                                            </Row>
                                                                            <Row>
                                                                                <Col>
                                                                                    <h6>Application Update Count</h6>
                                                                                </Col>
                                                                                <Col>
                                                                                    {/* {this.props.applicant.applicationStatus !== 0 && Number(this.props.applicant.noOfUpdates) - 1 || "N/A"} */}
                                                                                    {this.props.applicant.applicationStatus !== CADApplicationStatuses.NotApplied && Number(this.props.applicant.noOfUpdates) - 1 || "N/A"}
                                                                                </Col>


                                                                            </Row>
                                                                            <Row >
                                                                                <Col>
                                                                                    <h6 >Application Submission Deadline</h6>
                                                                                </Col>
                                                                                <Col>
                                                                                    N/A
                                                                                </Col>
                                                                            </Row>
                                                                        </Card.Body>
                                                                    </Card>
                                                                </div>
                                                            }
                                                            {
                                
                                                                <div class="single-column-card top-padded">
                                                                    <Card>
                                                                        <Card.Header>
                                                                            <h5>Payment Status</h5>
                                                                        </Card.Header>
                                                                        <Card.Body>
                                                                            <Row>
                                                                                <Col>
                                                                                    <h6>Application Payment</h6>
                                                                                </Col>
                                                                                <Col>
                                                                                    {this.state.applicationPayment && this.state.applicationPayment.timeStamp || "N/A"}
                                                                                </Col>
                                                                            </Row>
                                                                            <Row>
                                                                                <Col>
                                                                                    <h6>Allocation Confirmation Payment</h6>
                                                                                </Col>
                                                                                <Col>
                                                                                    N/A
                                                                                </Col>
                                                                            </Row>
                                                                        </Card.Body>
                                                                    </Card>
                                                                </div>
                                                            }
                                                            {
                                                                <div class="single-column-card top-padded">
                                                                    <Card>
                                                                        <Card.Header>
                                                                            <h5>Allocation Status</h5>
                                                                        </Card.Header>
                                                                        <Card.Body>
                                                                            <Row>
                                                                                <Col>
                                                                                    <h6>Allocated College</h6>
                                                                                </Col>
                                                                                <Col>
                                                                                    N/A
                                                                                </Col>
                                                                            </Row>
                                                                            <Row>
                                                                                <Col>
                                                                                    <h6>Allocation Confirmation Deadline</h6>
                                                                                </Col>
                                                                                <Col>
                                                                                    N/A
                                                                                </Col>
                                                                            </Row>
                                                                        </Card.Body>
                                                                    </Card>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </Card.Body>
                                    </Card>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>

                </div>
            </>
        );
    }
}

export default StudentProfile;
