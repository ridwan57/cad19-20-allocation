import { faBook, faBoxOpen, faChartPie, faCog, faFileAlt, faHandHoldingUsd, faNewspaper, faNotesMedical, faPiggyBank, faSearch, faSignOutAlt, faSubscript, faTable, faTimes, faUser, faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import { Routes } from "../routes";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";

const maxApplicationStatus = 7;

let allocationSubOptions = {};
const allocationSubOption = [
    {
        title: "View Allocation",
        link: Routes.studentUser.Allocation.ViewAllocation.path
    },
    {
        title: "Confirm Allocation",
        link: Routes.studentUser.Allocation.ConfirmAllocation.path
    },
    {
        title: "Cancel Allocation",
        link: Routes.studentUser.Allocation.CancelAllocation.path
    },
];

for (let index = 0; index <= maxApplicationStatus; index++) {
    allocationSubOptions[index] = allocationSubOption
}


let applicationSubOptions = {
    0: [
        {
            title: "Make Application",
            link: Routes.studentUser.Application.SubmitApplication.path
        },
        {
            title: "View Application",
            link: Routes.studentUser.Application.ViewApplication.path
        },
    ],
    1: [
        {
            title: "Update Application",
            link: Routes.studentUser.Application.SubmitApplication.path
        },
        {
            title: "View Application",
            link: Routes.studentUser.Application.ViewApplication.path
        },
    ],
};

for (let index = 2; index <= maxApplicationStatus; index++) {
    applicationSubOptions[index] = [
        {
            title: "View Application",
            link: Routes.studentUser.Application.ViewApplication.path
        },
    ]   
}

const configurationSubOptions = [
    {
        title: "Scheduling",
        link: Routes.board.Configuration.Scheduling.path
    },
    {
        title: "Pre Ranking",
        link: Routes.board.Configuration.PreRanking.path
    },
]

const allocationBoardSubOptions = [
    {
        title: "Post Ranking",
        link: Routes.board.StudentAllocation.PostRanking.path
    },
    {
        title: "Student Allocation",
        link: Routes.board.StudentAllocation.Allocation.path
    },
    
]

const sideBarOptions = {
    'student-user': [
        {
            type: 'single',
            title: "My Profile",
            link: Routes.studentUser.MyProfile.path,
            icon: faUser
        },
        {
            type: 'single',
            title: "Search Colleges",
            link: Routes.studentUser.SearchCollege.path,
            icon: faSearch
        },
        {
            type: 'collapsable',
            eventKey:"application/", 
            title: "Application", 
            icon: faBook,
            items: applicationSubOptions,
        //{props.applicant.applicationStatus < 2 && <NavItem title={(props.applicant.applicationStatus === 0 && "Make Application") || "Update Application"} link={Routes.Application.SubmitApplication.path} />}

        },
        {
            type: 'collapsable',
            eventKey:"allocation/", 
            title: "Allocation", 
            icon: faTable,
            items: allocationSubOptions,
        },
        {
            type: 'single',
            title: "Payment History",
            link: Routes.studentUser.PaymentHistory.path,
            icon: faPaypal
             
        },
        {
            type: 'single',
            title: "Important Notice", 
            link: Routes.studentUser.ImportantNotices.path,
            icon: faNewspaper
        }

    ],

    'cad-institute': [
        {
            type: 'single',
            title: "Dashboard",
            link: Routes.cadInstitution.Dashboard.path,
            icon: faUser
        },
        {
            type: 'single',
            title: "View/Update SVGs",
            link: Routes.cadInstitution.ViewUpdateSVG.path,
            icon: faUserGraduate
        },
        {
            type: 'single',
            title: "SQ Applications",
            link: Routes.cadInstitution.ManageSQApplications.path,
            icon: faSearch
        },
        {
            type: 'single',
            title: "Allocated Applicants",
            link: Routes.cadInstitution.AllocatedApplicants.path,
            icon: faNewspaper
        },

      //{props.institute.category === 'COLLEGE' && <NavItem title="SQ Applications" link={Routes.ManageSQApplications.path} icon={faSearch} />}
      //{props.institute.category !== 'COLLEGE' && <NavItem title="Admission Data" link={Routes.UploadAdmissionData.path} icon={faNewspaper} />}
      //{props.institute.category === 'COLLEGE' && <NavItem title="Allocated Applicants" link={Routes.AllocatedApplicants.path} icon={faNewspaper} />}
    ],
    'non-cad-institute': [
        {
            type: 'single',
            title: "Dashboard",
            link: Routes.nonCadInstitution.Dashboard.path,
            icon: faUser
        },
        {
            type: 'single',
            title: "View/Update SVGs",
            link: Routes.nonCadInstitution.ViewUpdateSVG.path,
            icon: faUserGraduate
        },
        {
            type: 'single',
            title: "Admission Data",
            link: Routes.nonCadInstitution.UploadAdmissionData.path,
            icon: faNewspaper
        },
    ],
    /*'institute': [
        {
            type: 'single',
            title: "Dashboard",
            link: Routes.Dashboard.path,
            icon: faUser
        },
        {
            type: 'single',
            title: "View/Update SVGs",
            link: Routes.ViewUpdateSVG.path,
            icon: faUserGraduate
        },
        {
            type: 'single',
            title: "SQ Applications",
            link: Routes.ManageSQApplications.path,
            icon: faSearch
        },
        {
            type: 'single',
            title: "Allocated Applicants",
            link: Routes.AllocatedApplicants.path,
            icon: faNewspaper
        },

      //{props.institute.category === 'COLLEGE' && <NavItem title="SQ Applications" link={Routes.ManageSQApplications.path} icon={faSearch} />}
      //{props.institute.category !== 'COLLEGE' && <NavItem title="Admission Data" link={Routes.UploadAdmissionData.path} icon={faNewspaper} />}
      //{props.institute.category === 'COLLEGE' && <NavItem title="Allocated Applicants" link={Routes.AllocatedApplicants.path} icon={faNewspaper} />}
    ],*/
    'board-admin': [
        {
            type: 'single',
            title: "Dashboard",
            link: Routes.board.Dashboard.path,
            icon: faUser
        },
        {
            type: 'collapsable',
            eventKey:"configuration/", 
            title: "Configuration", 
            icon: faTable,
            items: configurationSubOptions,
        },
        {
            type: 'single',
            title: "Data Information",
            link: Routes.board.DataInformation.path,
            icon: faUser
        },
        {
            type: 'collapsable',
            eventKey:"allocation/", 
            title: "Allocation", 
            icon: faTable,
            items: allocationBoardSubOptions,
        },
        // {
        //     type: 'single',
        //     title: "SVG Allocation",
        //     link: Routes.board.SVGAllocation.path,
        //     icon: faUser
        // },
        {
            type: 'single',
            title: "External Admission",
            link: Routes.board.ExternalAdmission.path,
            icon: faUser
        },
        {
            type: 'single',
            title: "Cancellation Request",
            link: Routes.board.CancellationRequest.path,
            icon: faUser
        },
        {
            type: 'single',
            title: "Admission Result",
            link: Routes.board.AdmissionResult.path,
            icon: faUser
        },
    ]
}

/*{
    props.keycloak.resourceRole === "student" &&
    <Nav className="flex-column pt-3 pt-md-0">
      <NavItem style={{ paddingTop: "70px" }} title="IEIMS" image={ReactHero} />
      <br />
      <br />
      
      
      {/*<CollapsableNavItem eventKey="payment/" title="Payment" icon={faPaypal}>
        <NavItem title="Application Payment" link={Routes.Payment.ApplicationPayment.path} />
        <NavItem title="Allocation Payment" link={Routes.Payment.AllocationPayment.path} />
  </CollapsableNavItem>*/
      /*<NavItem title="Payment History" link={Routes.PaymentHistory.path} icon={faPaypal} />
      <NavItem title="Important Notice" link={Routes.ImportantNotices.path} icon={faNewspaper} />
    </Nav>
  props.keycloak.resourceRole === "institute" &&
    <Nav className="flex-column pt-3 pt-md-0">
      <NavItem style={{ paddingTop: "70px" }} title="IEIMS" image={ReactHero} />
      <br />
      <br />
      <NavItem title="Dashboard" link={Routes.Dashboard.path} icon={faUser} />
      <NavItem title="View/Update SVGs" link={Routes.ViewUpdateSVG.path} icon={faUserGraduate} />
      {props.institute.category === 'COLLEGE' && <NavItem title="SQ Applications" link={Routes.ManageSQApplications.path} icon={faSearch} />}
      {props.institute.category !== 'COLLEGE' && <NavItem title="Admission Data" link={Routes.UploadAdmissionData.path} icon={faNewspaper} />}
      {props.institute.category === 'COLLEGE' && <NavItem title="Allocated Applicants" link={Routes.AllocatedApplicants.path} icon={faNewspaper} />}
    </Nav>}*/

export {sideBarOptions}