export const Routes = {


    Home: { Path: '/' },

    // Student Module Pages
    'studentUser': {
        MyProfile: { path: "/" },
        SSCResult: { path: "/sscresult" },
        SearchCollege: { path: "/searchcollege" },
        Application: {
            SubmitApplication: { path: "/application/submitapplication" },
            ViewApplication: { path: "/application/viewapplication" },
            UpdateApplication: { path: "/application/updateapplication" }
        },
        Allocation: {
            ViewAllocation: { path: "/allocation/viewallocation" },
            ConfirmAllocation: { path: "/allocation/confirmallocation" },
            CancelAllocation: { path: "/allocation/cancelallocation" }
        },
        PaymentHistory: { path: "/payment-history" },
        //: {
        //      ApplicationPayment: { path: "/payment/applicationpayment" },
        //    AllocationPayment: { path: "/payment/allocationpayment" }
        //},
        ImportantNotices: { path: "/notices" },
    },


    // Insitutional Module Pages
    'cadInstitution': {
        Dashboard: { path: "/" },
        ViewUpdateSVG: { path: "/updatesvg" },
        ManageSQApplications: { path: "/managesqapps" },
        AllocatedApplicants: { path: "/allocatedapplicants" },
    },

    'nonCadInstitution': {
        Dashboard: { path: "/" },
        ViewUpdateSVG: { path: "/updatesvg" },
        UploadAdmissionData: { path: "/uploadadmissiondata" },
    },

    // Board Nodule Pages
    'board': {
        Dashboard: { path: "/" },
        Configuration: {
            Scheduling: { path: "/configuration/scheduling" },
            PreRanking: { path: "/configuration/pre-ranking" },
        },
        DataInformation: { path: "/data-information" },
        StudentAllocation: {
            Allocation: { path: "/allocation/student-allocation" },
            PostRanking: { path: "/allocation/post-ranking" },
        },
        //SVGAllocation: { path: "/svg-allocation" },
        ExternalAdmission: { path: "/external-admission" },
        CancellationRequest: { path: "/canellation-request" },
        Ranking: { 
            LandingPage: { path: "/ranking" },
            CriteriaView: { path: "/ranking/criteria-view" },
            CiteriaEdit: { path: "/ranking/criteria-edit" }
        },
        AdmissionResult: { path: "/admission-result" },
    },

};
