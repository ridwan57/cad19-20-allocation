const studentModuleRootAddress = '/students'
const institutionModuleRootAddress = '/institute'
const boardModuleRootAddress = '/board'

const totalStudents = 1000000;
const bucketSize = 1000;

const groupIDs = {
    science: 0,
}

const rankingTypeCodes = {
    scienceTypeRankingCode: 0,
    allTypeRankingCode: 2,
    bothTypeRankingCode: 2
}

const rankingTypeTextToCode = {
    'Science': 0,
    'All': 2
}

const rankingTypesAvailable = [
    {
        typeCode: 0,
        typeText: 'Science Type Ranking',
    },
    {
        typeCode: 2,
        typeText: 'All Type Ranking',
    },
]

const rankingStatusCodes =  {
    rankingStatusCompleted: 0,
    rankingStatusRunning: 1
}



const rankingOrderTextualFields = {
    'asc': 'Ascending',
    'desc': 'Descending',
    'custom': 'Custom'
}

const rankingOrderFiledsCodes = {
    ascending: 'asc',
    descending: 'desc',
    custom: 'custom'
}

const rankingOrderFiledsCodesTextual = {
    'Ascending': 'asc',
    'Descending': 'desc',
    'Custom': 'custom'
}

const LROCodes = {
    'pre-ranking': {
        scienceTypeRankingCode: 3,
        allTypeRankingCode: 4,
    },
    'post-ranking': {
        scienceTypeRankingCode: 5,
        allTypeRankingCode: 6,
    }
    
}

const precisionFields = [
    'gpaobt',
    'gpawo4thSub',
    "english",
    "math",
    "phy",
    "total_marks",
    "cgpa",
    "chem",
    "hmath",
    "bengali"
]

const rankingCategory = {
    'pre-ranking': {
        code: 0,
        text: 'Pre Ranking',
        upperLevel: 'Configuration',
        fetched: 'Students',
        countAPI: '/getPreRankedApplicantsCount',
        countKeyJSON: 'pre'
    },
    'post-ranking': {
        code: 1,
        text: 'Post Ranking',
        upperLevel: 'Allocation',
        fetched: 'Applicants',
        countAPI: '/getPostRankedApplicantsCount',
        countKeyJSON: 'post'
    }
}

const rankedApplicantCountKey = {
    0: {
        type: 'Science',
        keyJSON: 'ScienceCount'
    },
    2: {
        type: 'All',
        keyJSON: 'AllCount'
    }

}

const defaultPhaseData = [
    {
        label: 'Task 1',
        task: 'Accepting Applications',
        startData: null,
        endData: null,
        startTime: null,
        endTime: null,
        description: '',
    },
    {
        label: 'Task 2',
        task: 'Migration Result Publishing',
        startData: null,
        endData: null,
        startTime: null,
        endTime: null,
        description: '',
    },
    {
        label: 'Task 3',
        task: 'Allocation Confirmation by Applicant',
        startData: null,
        endData: null,
        startTime: null,
        endTime: null,
        description: '',
    },

]

const scheduleStatuses =  {
    resetState: 0,
    validState: 1,
    createNewSchedule: 2,
    editState: 3,
}

const defaultScheduleData = {
    'SVG_DATA_SYNC': null,
    'GPA_UPDATE_STARTS': null,
    'GPA_UPDATE_ENDS': null,
    'SYNC_SSC_RESULT': null,
    'NORMALIZE_SSC_RESULT': null,
    'LOCK_SSC_RESULT': null,
}

export { 
    studentModuleRootAddress, 
    institutionModuleRootAddress, 
    boardModuleRootAddress, 
    totalStudents,
    bucketSize,
    groupIDs,
    rankingTypeCodes,
    rankingStatusCodes,
    rankingOrderTextualFields,
    rankingOrderFiledsCodes,
    rankingOrderFiledsCodesTextual,
    rankingTypesAvailable,
    LROCodes,
    rankingTypeTextToCode,
    precisionFields,
    rankingCategory,
    rankedApplicantCountKey,
    defaultPhaseData,
    defaultScheduleData,
    scheduleStatuses
}