// Emergency
// check in my choice list

import React, { PropTypes, Component } from 'react'
import { Redirect } from 'react-router-dom'
import { useBeforeunload } from 'react-beforeunload'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
  TextField,
  Checkbox
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import AddIcon from '@material-ui/icons/Add'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ClearIcon from '@material-ui/icons/Clear'
import SaveIcon from '@material-ui/icons/Save'
import UpdateIcon from '@material-ui/icons/Delete'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { Breadcrumb } from '@themesberg/react-bootstrap'
import {
  Col,
  Row,
  Nav,
  Card,
  Image,
  Table,
  Dropdown,
  ProgressBar,
  Pagination,
  ButtonGroup,
  Accordion
} from '@themesberg/react-bootstrap'
import '../../../styles/Rashed.css'

import { faBook, faArrowDown } from '@fortawesome/free-solid-svg-icons'

import { Routes } from '../../../routes'

import {
  studentModuleRootAddress,
  boardModuleRootAddress
} from '../../../data/constants'
import { gwprocessParameters } from '../ssecommerz-parameters/GWProcess'

import MUIDataTable from 'mui-datatables'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'

import moment from 'moment'

class SubmitApplication extends Component {
  constructor (props) {
    super(props)
    this.state = {
      quotaStatus: [],
      boardsProp: {
        options: [],
        getOptionLabel: option => option.boardName
      },
      districtsProp: {
        options: [],
        getOptionLabel: option => option.districtName
      },
      thanasProp: {
        options: [],
        getOptionLabel: option => option.thanaName
      },
      collegesProp: {
        options: [],
        getOptionLabel: option => option.collegeName
      },
      resetDistrict: false,
      resetThana: false,
      resetCollege: false,

      board: '',
      district: '',
      thana: '',
      college: '',
      collegeName: '',
      esvgs: [],

      applicationAllowed: true,
      notAllowedMessage: '',
      notAllowedPrompt: false,

      choices: [],
      submittedChoices: [],
      selectedEIINList: [],
      selectedEIINCount: 0,
      maximumEIINCount: 10,
      minimumEIINCount: 5,
      overflowEIINCount: false,
      lastPriority: 0,
      alreadySubmitted: false,
      showSubmitButton: true,
      showUpdateButton: false,
      disableButton: true,
      disableUpdateButton: true,
      alreadySubmittedPrompt: false,
      submitApplicationPrompt: false,
      updateApplicationPrompt: false,
      paymentRedirection: false,
      successfullyUpdated: false,

      sscEIIN: '',
      sscGPA: 0.0,
      gender: '',
      allowedHSCGroups: [],
      quotaSuccessDialog: false
    }

    // required funtions
    this.updateQuotaStatus = this.updateQuotaStatus.bind(this)
    this.changeQuotaSelection = this.changeQuotaSelection.bind(this)
    this.handleBoardChange = this.handleBoardChange.bind(this)
    this.handleDistrictChange = this.handleDistrictChange.bind(this)
    this.handleThanaChange = this.handleThanaChange.bind(this)
    this.handleCollegeChange = this.handleCollegeChange.bind(this)
    this.isSVGAllowed = this.isSVGAllowed.bind(this)
    this.compareChoiceLists = this.compareChoiceLists.bind(this)
    this.handleAddChoiceButtonPressed = this.handleAddChoiceButtonPressed.bind(
      this
    )
    this.handlePriorityUpButtonPressed = this.handlePriorityUpButtonPressed.bind(
      this
    )
    this.handlePriorityDownButtonPressed = this.handlePriorityDownButtonPressed.bind(
      this
    )
    this.handleRemoveChoiceButtonPressed = this.handleRemoveChoiceButtonPressed.bind(
      this
    )
    this.handleSQCheckedChange = this.handleSQCheckedChange.bind(this)
    this.updateApplication = this.updateApplication.bind(this)
  }

  componentDidMount () {
    // fetch the phase data to check if the system is accepting application
    fetch(boardModuleRootAddress + '/getPhaseCount', {
      headers: {
        Authorization: `bearer ${this.props.keycloak.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        const lastesPhase = parseInt(data.result) - 1

        fetch(boardModuleRootAddress + '/getScheduleData/' + lastesPhase, {
          headers: {
            Authorization: `bearer ${this.props.keycloak.token}`
          }
        })
          .then(response => response.json())
          .then(data => {
            if (data.result) {
              data.result.forEach(schedule => {
                if (schedule.name === 'APPLICATION') {
                  console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
                  console.log(
                    moment(schedule.startDateTime).format('YYYY-MM-DD HH:mm:ss')
                  )
                  console.log(
                    moment(schedule.endDateTime).format('YYYY-MM-DD HH:mm:ss')
                  )
                  console.log(
                    moment(schedule.startDateTime).format(
                      'YYYY-MM-DD HH:mm:ss'
                    ) > moment().format('YYYY-MM-DD HH:mm:ss')
                  )
                  if (
                    moment(schedule.endDateTime).format('YYYY') !== '1900' &&
                    moment(schedule.endDateTime).format('YYYY-MM-DD HH:mm:ss') <
                      moment().format('YYYY-MM-DD HH:mm:ss')
                  ) {
                    console.log(
                      'Current Application phase is finished. Please wait until the next application phase opens'
                    )
                    this.setState({
                      notAllowedMessage:
                        'Current Application phase is finished. Please wait until the next application phase opens'
                    })
                    this.setState({
                      applicationAllowed: false,
                      notAllowedPrompt: true
                    })
                  } else if (
                    moment(schedule.startDateTime).format('YYYY') !== '1900' &&
                    moment(schedule.startDateTime).format(
                      'YYYY-MM-DD HH:mm:ss'
                    ) > moment().format('YYYY-MM-DD HH:mm:ss')
                  ) {
                    console.log(
                      'The next application phase is scheduled to start from ' +
                        moment(schedule.startDateTime).format(
                          'YYYY-MM-DD hh:mm A'
                        ) +
                        '. Please try later'
                    )
                    this.setState({
                      notAllowedMessage:
                        'The next application phase is scheduled to start from ' +
                        moment(schedule.startDateTime).format(
                          'YYYY-MM-DD hh:mm A'
                        ) +
                        '. Please try later'
                    })
                    this.setState({
                      applicationAllowed: false,
                      notAllowedPrompt: true
                    })
                  } else if (
                    moment(schedule.endDateTime).format('YYYY') === '1900'
                  ) {
                    console.log(
                      'Application Process has not been started yet. Please wait until the next application phase opens'
                    )
                    this.setState({
                      notAllowedMessage:
                        'Application Process has not been started yet. Please wait until the next application phase opens'
                    })
                    this.setState({
                      applicationAllowed: false,
                      notAllowedPrompt: true
                    })
                  }
                }
              })
            }
          })
      })

    // fetch the available quotas to show to the applicant
    fetch(studentModuleRootAddress + '/getAvailableQuotas', {
      headers: {
        Authorization: `bearer ${this.props.keycloak.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        let quotaStatus = data.result

        fetch(studentModuleRootAddress + '/getApplicantQuotaStatus', {
          headers: {
            Authorization: `bearer ${this.props.keycloak.token}`
          }
        })
          .then(response => response.json())
          .then(data => {
            if (data.result) {
              quotaStatus.forEach((quota, index) => {
                if (data.result.includes(quota.quotaId)) quota.status = true
                else quota.status = false
                quota.checkbox = (
                  <Checkbox
                    onChange={() => this.changeQuotaSelection(index)}
                    color='primary'
                    checked={quota.status}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                )
              })
            }
            this.setState({ quotaStatus: quotaStatus })
          })

        console.log(quotaStatus)
      })

    // fetch the initial list of education boards
    fetch(studentModuleRootAddress + '/getBoardList', {
      headers: {
        Authorization: `bearer ${this.props.keycloak.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('submit application data', data)
        var lst = []
        if (data.status === 500) return Promise.reject('server error')
        if (data.result) {
          data.result.map(board => lst.push(board))
        }
        this.setState({
          boards: lst
        })
        console.log(lst)
        let newDefaultProps = {
          options: lst,
          getOptionLabel: option => option.boardName
        }
        this.setState({ boardsProp: newDefaultProps })
      })
      .catch(err => {
        console.log('err', err)
      })

    // check if this applicant already has a draft choice list
    var lst = []
    fetch(studentModuleRootAddress + '/getApplicationChoices', {
      headers: {
        Authorization: `bearer ${this.props.keycloak.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.result?.length > 0) {
          console.log(data)
          data.result.map(choice => lst.push(choice))
          lst.forEach(element => {
            element.shift = {
              shiftId: element.shiftId,
              shiftName: element.shiftName
            }
            element.version = {
              versionId: element.versionId,
              versionName: element.versionName
            }
            // @to-do when
            element.hscGroup = {
              hscGroupId: element.groupId,
              hscGroupName: element.hscGroupName
            }
            if (!element.isSQ) element.SQChecked = false
            else element.SQChecked = true
            // @ to-do
            element.priority = element.choicePriority
            element.collegeName = element.name
          })
          lst.sort(function (a, b) {
            var keyA = a.priority,
              keyB = b.priority
            if (keyA < keyB) return -1
            if (keyA > keyB) return 1
            return 0
          })
          const lst1 = [...lst]
          this.setState({ choices: lst, submittedChoices: lst1 })
          const selectedEIINList = []
          console.log(lst)

          for (let index = 0; index < this.state.choices.length; index++) {
            selectedEIINList.push(this.state.choices[index].eiin)
          }

          const selectedEIINListUnique = [...new Set(selectedEIINList)]
          this.setState({
            selectedEIINList: selectedEIINListUnique,
            selectedEIINCount: selectedEIINListUnique.length,
            lastPriority: lst.length,
            alreadySubmitted: true,
            showSubmitButton: false,
            showUpdateButton: true,
            disableButton: true,
            disableUpdateButton: true,
            alreadySubmittedPrompt: true
          })
          this.id = setTimeout(
            () => this.setState({ alreadySubmittedPrompt: false }),
            3000
          )
        }
      })

    fetch(studentModuleRootAddress + '/getSSCGPAandEIIN', {
      headers: {
        Authorization: `bearer ${this.props.keycloak.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 500) return Promise.reject('server error')
        if (data.result?.sscGPA) {
          console.log('getSSCGPAandEIIN ' + data)
          this.setState({
            sscGPA: data.result.sscGPA
          })
        }
        if (data.result?.eduInstitution) {
          console.log('getSSCGPAandEIIN ' + data)
          this.setState({
            sscEIIN: data.result.eduInstitution.eiin
          })
        }
      })
      .catch(err => {
        console.log('err', err)
      })

    fetch(studentModuleRootAddress + '/getGroupMapping', {
      headers: {
        Authorization: `bearer ${this.props.keycloak.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.result?.length > 0) {
          console.log(data)
          this.setState({
            allowedHSCGroups: data.result
          })
        }
      })

    fetch(studentModuleRootAddress + '/getCRVSProfile', {
      headers: {
        Authorization: `bearer ${this.props.keycloak.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('getCRVSProfile ' + data)
        if (data.result?.gender) {
          this.setState({
            gender: data.result.gender
          })
        }
      })
  }

  changeQuotaSelection (index) {
    console.log(index)
    let updatedQuotaStatus = this.state.quotaStatus
    updatedQuotaStatus[index].status = !updatedQuotaStatus[index].status
    updatedQuotaStatus[index].checkbox = (
      <Checkbox
        onChange={() => this.changeQuotaSelection(index)}
        color='primary'
        checked={updatedQuotaStatus[index].status}
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
    )
    this.setState({ quotaStatus: updatedQuotaStatus })
  }

  updateQuotaStatus () {
    let quotaSelected = ''
    let quotaCount = 0
    this.state.quotaStatus.forEach(quota => {
      if (quota.status) {
        quotaSelected += quota.quotaId + ','
        quotaCount += 1
      }
    })
    console.log(quotaSelected.substring(0, quotaSelected.length - 1))

    fetch(studentModuleRootAddress + '/setApplicantQuota', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.keycloak.token}`
      },
      body: JSON.stringify({
        quotaCount: quotaCount,
        crvsId: '',
        quotaIDs: quotaSelected.substring(0, quotaSelected.length - 1)
      })
    })
      .then(response => response.json())
      .then(data => this.setState({ quotaSuccessDialog: true }))
  }

  // Dropdown ==> Education Boards
  handleBoardChange (event, board) {
    console.log(board)
    // when one board is selected
    // districts under that board will be fetched and showed
    // the thana list is set to empty
    // the college list is set to empty
    // the esvg table is reset

    //fetch and set districts under the selected board
    fetch(studentModuleRootAddress + '/getDistrictList/' + board.boardId, {
      headers: {
        Authorization: `bearer ${this.props.keycloak.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('districtdata', data)
        var lst = []

        if (data.result) {
          data.result.map(district => lst.push(district))
        }
        this.setState({
          districts: lst
        })
        let newDefaultProps = {
          options: lst,
          getOptionLabel: option => option.districtName
        }
        this.setState({ districtsProp: newDefaultProps })
      })

    const resetCollege = !this.state.resetCollege
    const resetDistrict = !this.state.resetDistrict
    const resetThana = !this.state.resetThana

    // reset the other variables
    this.setState({
      collegesProp: {
        options: [],
        getOptionLabel: option => option.eiin + ' - ' + option.name
      },
      board: board.boardId,
      district: '',
      // thanas: [],
      // thana: '',
      // colleges: [],
      college: '',
      esvgs: [],
      resetCollege: resetCollege,
      resetDistrict: resetDistrict,
      resetThana: resetThana

      // applicationAllowed: true,
      // notAllowedPrompt: false,
      // notAllowedMessage: '',
    })
  }

  // Dropdown ==> Districts
  handleDistrictChange (event, district) {
    // when one board is selected
    // when a district is selected
    // thanas under that district will be fetched and showed
    // the college list is set to empty
    // the esvg table is reset

    // fetch and set the thanas under the selected district

    fetch(
      studentModuleRootAddress +
        '/getCollegeListByDistrict/' +
        this.state.board +
        '/' +
        district.districtId,
      {
        headers: {
          Authorization: `bearer ${this.props.keycloak.token}`
        }
      }
    )
      .then(response => response.json())
      .then(data => {
        var lst = []
        if (data.result) {
          data.result.map(college => lst.push(college))
        }
        let newDefaultProps = {
          options: lst,
          getOptionLabel: option => option.eiin + ' - ' + option.name
        }
        console.log(newDefaultProps)
        this.setState({ collegesProp: newDefaultProps })
      })

    fetch(studentModuleRootAddress + '/getThanaList/' + district.districtId, {
      headers: {
        Authorization: `bearer ${this.props.keycloak.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        var lst = []
        if (data.result) {
          data.result.map(thana => lst.push(thana))
        }
        let newDefaultProps = {
          options: lst,
          getOptionLabel: option => option.thanaName
        }
        console.log(newDefaultProps)
        this.setState({ thanasProp: newDefaultProps })
      })

    const resetCollege = !this.state.resetCollege
    const resetThana = !this.state.resetThana

    // reset the other variables
    this.setState({
      district: district.id,
      thana: '',
      // colleges: [],
      college: '',
      esvgs: [],
      resetCollege: resetCollege,
      resetThana: resetThana
    })
  }

  // Dropdown ==> Thanas
  handleThanaChange (event, thana) {
    // when one board is selected
    // when a district is selected
    // when a thana is selected
    // college under that thana will be fetched and showed
    // the esvg table is reset

    // fetch and set colleges under the selected thana
    fetch(
      studentModuleRootAddress +
        '/getCollegeListByThana/' +
        +this.state.board +
        '/' +
        thana.thanaId,
      {
        headers: {
          Authorization: `bearer ${this.props.keycloak.token}`
        }
      }
    )
      .then(response => response.json())
      .then(data => {
        var lst = []
        if (data.result) {
          data.result.map(college => lst.push(college))
        }
        let newDefaultProps = {
          options: lst,
          getOptionLabel: option => option.eiin + ' - ' + option.name
        }
        console.log(newDefaultProps)
        this.setState({ collegesProp: newDefaultProps })
      })

    const resetCollege = !this.state.resetCollege

    // reset the other variables
    this.setState({
      college: '',
      esvgs: [],
      resetCollege: resetCollege
    })
  }

  // Dropdown ==> Colleges
  handleCollegeChange (event, college) {
    // when one board is selected
    // when a district is selected
    // when a thana is selected
    // when a college is selected
    // esvgs under that college will be fetched esvg table is populated

    // fetch and set the SVGs under the selected college
    fetch(studentModuleRootAddress + '/getSVG/' + college.eiin, {
      headers: {
        Authorization: `bearer ${this.props.keycloak.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        var lst = []
        if (data.result) {
          data.result.map(svg => lst.push(svg))
        }

        // check if this svg is already in the choice list of the applicant
        // if there is, then set the flag alreadyExistinChoiceList to true
        // otherwise make it false
        var idx = -1
        let esvgAllowed = []
        let index = 0
        console.log(lst)
        lst.forEach(svg => {
          idx = this.state.choices.findIndex(function (choice) {
            console.log('')

            console.log(choice.eiin)
            console.log(svg.eiin)

            console.log(choice.shift.shiftId)
            console.log(svg.shift.shiftId)

            console.log(choice.version.versionId)
            console.log(svg.version.versionId)

            console.log(choice.hscGroup.hscGroupId)
            console.log(svg.hscGroup.hscGroupId)

            return (
              choice.eiin === svg.eiin &&
              choice.shift.shiftId === svg.shift.shiftId &&
              choice.version.versionId === svg.version.versionId &&
              choice.hscGroup.hscGroupId === svg.hscGroup.hscGroupId
            )
          })
          if (idx === -1) {
            // svg is not exist in choice list
            svg.alreadyExistInChoiceList = false
            svg.SQChecked = false
          } else {
            svg.alreadyExistInChoiceList = true
            svg.SQChecked = this.state.choices[idx].SQChecked
          }
          if (this.isSVGAllowed(svg)) {
            console.log('Allowed')
            svg.id = index + 1
            svg.shiftName = svg.shift.shiftName
            svg.versionName = svg.version.versionName
            svg.groupName = svg.hscGroup.hscGroupName
            //svg.SQChecked = false;
            svg.seatsAvailable = svg.totalSeats - svg.reservedSeats
            console.log('insert')
            esvgAllowed.push(svg)
            index += 1
            svg.gender =
              (svg.gender === 'F' && 'Female') ||
              (svg.gender === 'M' && 'Male') ||
              (svg.gender === 'C' && 'Co-Ed.')
          }
        })

        console.log(esvgAllowed)
        this.setState({
          esvgs: esvgAllowed
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

  // Check if an SVG is allowed to choose for the applicant
  isSVGAllowed (svg) {
    let isAllowed = true
    const idx = this.state.allowedHSCGroups.findIndex(function (hscGroup) {
      return hscGroup.hscGroupId === svg.hscGroup.hscGroupId
    })
    console.log('idx' + idx)
    console.log('sscEIIN' + this.state.sscEIIN)
    console.log('eiin' + svg.eiin)
    console.log('sscGPA' + this.state.sscGPA)
    console.log('minimumGPA' + svg.minimumGPA)
    console.log('ownMinimumGPA' + svg.ownMinimumGPA)

    if (idx === -1) {
      // this hsc group is not allowed by group mapping
      {
        console.log('Ret 0')
        return false
      }
    }
    if (
      this.state.sscEIIN === svg.eiin &&
      this.state.sscGPA < svg.ownMinimumGPA
    ) {
      // he is a student of this eiin and his gpa is less than allowed own gpa
      console.log('Ret 1')
      return false
    }
    if (this.state.sscEIIN !== svg.eiin && this.state.sscGPA < svg.minimumGPA) {
      // he is a student of this eiin and his gpa is less than allowed own gpa
      console.log('Ret 2')
      return false
    }
    if (
      (this.state.gender.charAt(0) === 'M' && svg.gender.charAt(0) === 'F') ||
      (this.state.gender.charAt(0) === 'F' && svg.gender.charAt(0) === 'M')
    ) {
      console.log('Ret 3')
      return false
    }
    return isAllowed
  }

  compareChoiceLists (choiceListA, choiceListB) {
    console.log(choiceListA)
    console.log(choiceListB)
    if (choiceListA.length !== choiceListB.length) return false
    for (let index = 0; index < choiceListA.length; index++) {
      const choiceA = choiceListA[index]
      const choiceB = choiceListB[index]
      if (
        choiceA.priority !== choiceB.priority ||
        choiceA.eiin !== choiceB.eiin ||
        choiceA.shift.shiftId !== choiceB.shift.shiftId ||
        choiceA.version.versionId !== choiceB.version.versionId ||
        choiceA.hscGroup.hscGroupId !== choiceB.hscGroup.hscGroupId
      )
        return false
    }
    return true
  }

  // Button Pressed ==> Add New ESVG Choice
  handleAddChoiceButtonPressed (esvg) {
    console.log(esvg)

    // An applicant can choice only 10 distint EIINs
    // checking if a new EIIN selection is allowed

    // get if already this EIIN is selected
    const indexOfEIIN = this.state.selectedEIINList.indexOf(esvg.eiin)
    let selectedEIINCount = this.state.selectedEIINCount

    // EIIN was not selected earlier and the total selected EIIN count is already 10
    // so no new EIIN inclusion is  possible
    if (indexOfEIIN < 0 && selectedEIINCount === this.state.maximumEIINCount) {
      this.setState({ overflowEIINCount: true })
      return
    }

    // insert this EIIN in the selected list if it is a new one
    if (indexOfEIIN < 0) {
      this.state.selectedEIINList.push(esvg.eiin)
      selectedEIINCount += 1
      console.log('selectedEIINCount ' + selectedEIINCount)
      this.setState({ selectedEIINCount: selectedEIINCount })
    }

    if (!esvg.SQChecked) esvg.SQChecked = false

    // create a new object with the selected esvg
    const choice = Object.create(esvg)
    // set the priority
    const NewPriority = this.state.lastPriority + 1
    choice.priority = NewPriority
    choice.collegeName = this.state.collegeName
    // insert this choice in a new choice list to be shown in display
    //this.state.choices.push(choice);
    var newChices = this.state.choices.concat(choice)
    // sort this list according to priority
    newChices.sort(function (a, b) {
      var keyA = a.priority,
        keyB = b.priority
      if (keyA < keyB) return -1
      if (keyA > keyB) return 1
      return 0
    })

    // update the choice list and last inserted priority
    this.setState({ choices: newChices, lastPriority: NewPriority })
    // if 5 distinct EIIN is selected then this application is eligible to submit
    if (selectedEIINCount >= this.state.minimumEIINCount) {
      console.log('Button Enabled')
      this.setState({ disableButton: false })
    }

    // make the svg.alreadyExistInChoiceList
    // 1. Make a shallow copy of the items
    //const newESVGs = [...this.state.esvgs];
    //newESVGs[esvg.id].alreadyExistInChoiceList = true;
    //this.setState({ esvgs: newESVGs });
    //console.log(newChices);
    esvg.alreadyExistInChoiceList = true

    if (this.compareChoiceLists(this.state.submittedChoices, newChices))
      this.setState({ disableButton: true })
    //else this.setState({ disableButton: false });
    // @to-do
    //this.handleScroll();
  }

  // Button Pressed ==> Set Priority Up
  handlePriorityUpButtonPressed (choice) {
    // get the pririry to go upward
    const thisPriority = choice.priority

    // First, Update the priorities in the choice list to be shown to display

    // find the index of this choice in choices list
    var thisIndex = this.state.choices.findIndex(function (element) {
      return element.priority === thisPriority
    })

    // create a new choice list by swapping this choice priority and its prior choice priority
    var newChices = this.state.choices
    newChices[thisIndex].priority = thisPriority - 1
    newChices[thisIndex - 1].priority = thisPriority
    newChices.sort(function (a, b) {
      var keyA = a.priority,
        keyB = b.priority
      if (keyA < keyB) return -1
      if (keyA > keyB) return 1
      return 0
    })

    // set the updated choice list
    this.setState({ choices: newChices })

    if (this.compareChoiceLists(this.state.submittedChoices, newChices))
      this.setState({ disableButton: true })

    // if (this.compareChoiceLists(this.state.draftChoices, this.state.choices))
    //     this.setState({ draftChoicesUpdated: false });
    // else this.setState({ draftChoicesUpdated: true });
  }

  // Button Pressed ==> Set Priority Down
  handlePriorityDownButtonPressed (choice) {
    // get the pririry to go upward
    const thisPriority = choice.priority

    // First, Update the priorities in the choice list to be shown to display

    // find the index of this choice in choices list
    var thisIndex = this.state.choices.findIndex(function (element) {
      return element.priority === thisPriority
    })

    // create a new choice list by swapping this choice priority and its later choice priority
    var newChices = this.state.choices
    newChices[thisIndex].priority = thisPriority + 1
    newChices[thisIndex + 1].priority = thisPriority
    newChices.sort(function (a, b) {
      var keyA = a.priority,
        keyB = b.priority
      if (keyA < keyB) return -1
      if (keyA > keyB) return 1
      return 0
    })

    // set the updated choice list
    this.setState({ choices: newChices })

    // if (this.compareChoiceLists(this.state.draftChoices, this.state.choices))
    //     this.setState({ draftChoicesUpdated: false });
    // else this.setState({ draftChoicesUpdated: true });
    if (this.compareChoiceLists(this.state.submittedChoices, newChices))
      this.setState({ disableButton: true })
  }

  // Button Pressed ==> Remove Choice
  handleRemoveChoiceButtonPressed (choice) {
    // get the priority of the ESVG choice to be deleted
    const thisPriority = choice.priority

    // get the index in the choice list of this ESVG
    const thisIndex = this.state.choices.findIndex(function (element) {
      return element.priority === thisPriority
    })

    console.log('This priority ' + thisPriority)
    console.log('This Index ' + thisIndex)

    // get the EIIN to be remove from selected EIIN list
    const deletedEIIN = choice.eiin

    // check if this EIIN will still be present in the choice list after deletion of this choice
    const isEIINtoDelelete = this.state.choices.findIndex(function (element) {
      return element.priority !== thisPriority && element.eiin === deletedEIIN
    })

    let selectedEIINCount = this.state.selectedEIINCount
    // if no same EIIN is present then remove this EIIN from the selected EIIN list
    if (isEIINtoDelelete === -1) {
      selectedEIINCount -= 1
      this.state.selectedEIINList.splice(
        this.state.selectedEIINList.indexOf(choice.eiin)
      )
      this.setState({ selectedEIINCount: selectedEIINCount })
    }

    // take new choice list
    var newChices = this.state.choices

    console.log(newChices)

    // remove the choice from choice list
    if (thisIndex > -1) {
      newChices.splice(thisIndex, 1)
    }

    // update all the priorities greter than the deleted priority
    newChices.forEach(element => {
      if (element.priority > thisPriority) {
        console.log(element.priority + ' priority Updated')
        element.priority -= 1
      }
    })

    // sort the new choice according to the priorities
    newChices.sort(function (a, b) {
      var keyA = a.priority,
        keyB = b.priority
      // Compare the 2 dates
      if (keyA < keyB) return -1
      if (keyA > keyB) return 1
      return 0
    })

    // update the choice list and last added priority
    this.setState({ choices: newChices, lastPriority: newChices.length })
    console.log(newChices)

    // if the selected EIIN chount is now less than 5, the apllicantion will become ineligible to be submitted
    if (selectedEIINCount < this.state.minimumEIINCount) {
      this.setState({ disableButton: true })
    }

    // make alreadyExistInChoiceList=false of this svg
    const displayingEIIN = this.state.college
    const indexOfRemovedESVG = this.state.esvgs.findIndex(function (svg) {
      return (
        displayingEIIN === choice.eiin &&
        choice.shift.shiftId === svg.shift.shiftId &&
        choice.version.versionId === svg.version.versionId &&
        choice.hscGroup.hscGroupId === svg.hscGroup.hscGroupId
      )
    })

    if (indexOfRemovedESVG >= 0) {
      const newESVGs = this.state.esvgs
      newESVGs[indexOfRemovedESVG].alreadyExistInChoiceList = false
      this.setState({ esvgs: newESVGs })
    }

    // if (this.compareChoiceLists(this.state.draftChoices, this.state.choices))
    //     this.setState({ draftChoicesUpdated: false });
    // else this.setState({ draftChoicesUpdated: true });
    if (this.compareChoiceLists(this.state.submittedChoices, newChices))
      this.setState({ disableButton: true })
  }

  handleSQCheckedChange (esvg) {
    console.log(esvg.id)
    let updatedESVGs = this.state.esvgs
    updatedESVGs[esvg.id - 1].SQChecked = !esvg.SQChecked
    this.setState({ esvgs: updatedESVGs })
    //if (!esvg.SQChecked) esvg.SQChecked = true;
    //else esvg.SQChecked = false;
  }

  handleScroll () {
    window.scroll({
      top: document.body.offsetHeight,
      left: 0,
      behavior: 'smooth'
    })
  }

  submitApplication () {
    this.updateQuotaStatus()
    let choicesJSON = []
    for (let index = 0; index < this.state.choices.length; index++) {
      const choice = this.state.choices[index]
      const newChoiceJSON = {
        esvgID: choice.esvgId,
        priority: choice.priority,
        isSQ: choice.SQChecked
      }
      choicesJSON.push(newChoiceJSON)
    }

    console.log(choicesJSON)
    let value_b = []
    let value_c = []
    let value_d = []

    choicesJSON.forEach(choice => {
      value_b.push(choice.esvgID)
      value_c.push(choice.priority)
      if (choice.isSQ) value_d.push(1)
      else value_d.push(0)
    })

    var formBody = []
    for (var property in gwprocessParameters) {
      var encodedKey = encodeURIComponent(property)
      var encodedValue = ''
      if (property === 'tran_id')
        encodedValue = encodeURIComponent(
          this.props.keycloak.tokenParsed.CRVSID
        )
      else encodedValue = encodeURIComponent(gwprocessParameters[property])
      formBody.push(encodedKey + '=' + encodedValue)
    }
    var encodedKey = encodeURIComponent('value_b')
    encodedValue = encodeURIComponent(value_b)
    formBody.push(encodedKey + '=' + encodedValue)

    encodedKey = encodeURIComponent('value_c')
    encodedValue = encodeURIComponent(value_c)
    formBody.push(encodedKey + '=' + encodedValue)

    encodedKey = encodeURIComponent('value_d')
    encodedValue = encodeURIComponent(value_d)
    formBody.push(encodedKey + '=' + encodedValue)

    formBody = formBody.join('&')

    console.log(formBody)

    fetch('https://sandbox.sslcommerz.com/gwprocess/v4/api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    })
      .then(response => response.json())
      .then(data => {
        const gatewayPageURL = data.GatewayPageURL
        window.location.assign(gatewayPageURL)
        //this.props.history.history.history.push(gatewayPageURL);
        //this.setState({ gatewayPageURL: gatewayPageURL, gatewayRedirect: true });
      })
  }

  // Button Pressed ==> Update
  updateApplication () {
    this.updateQuotaStatus()
    const choicesJSON = []
    for (let index = 0; index < this.state.choices.length; index++) {
      const choice = this.state.choices[index]
      const newChoiceJSON = {
        esvgID: choice.esvgId,
        priority: choice.priority,
        isSQ: choice.SQChecked
      }
      choicesJSON.push(newChoiceJSON)
    }

    console.log(choicesJSON)

    this.setState({ choiceListJSON: choicesJSON })

    fetch(studentModuleRootAddress + '/updateChoices/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.keycloak.token}`
        //   //Accept: 'application/json'
      },
      body: JSON.stringify({
        Choices: choicesJSON
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.message === 'Successful') {
          //this.props.updateFunctions.applicationStatusUpdater(1);
          //this.props.updateFunctions.applicationChoiceUpdater(this.state.choices);
          this.setState({ successfullyUpdated: true })
          //setTimeout(() => this.props.history.push('/viewapplication'), 3000);
        }
      })

    //this.setState({ successfullySaved: true });

    //this.id = setTimeout(() => this.setState({ redirect: true }), 5000);
  }

  render () {
    return (
      <>
        {/* prompt for quota update  */}
        <Dialog
          // open={true}
          open={this.state.quotaSuccessDialog}
          // className={classes.dialog}
          onClose={() => this.setState({ quotaSuccessDialog: false })}
          sx={{
            width: '50vw',
            height: '50vh',
            m: 'auto auto',

            p: 2
          }}
          // fullScreen
        >
          <DialogTitle style={{ margin: 'auto auto' }}>
            Quota Successfully updated
          </DialogTitle>
          <Button
            // color='secondary'
            variant='contained'
            style={{
              width: '10%',
              margin: '0px auto 10px auto',
              backgroundColor: '#17A5CE',
              color: 'white'
            }}
            onClick={() => this.setState({ quotaSuccessDialog: false })}
          >
            OK
          </Button>
        </Dialog>

        {/* Prompt for application not allowed now */}
        <Dialog
          open={this.state.notAllowedPrompt}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle
            id='alert-dialog-title'
            style={{ textAlign: 'center' }}
          ></DialogTitle>
          <DialogContent>
            <DialogContentText
              id='alert-dialog-description'
              style={{ textAlign: 'center' }}
            >
              {this.state.notAllowedMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions
            style={{ justifyContent: 'center', marginBottom: '20px' }}
          >
            <Button
              onClick={() => {
                this.setState({ notAllowedPrompt: false })
                this.props.history.push('/')
              }}
              color='primary'
              variant='contained'
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {/* Prompt for already applied */}
        <Dialog
          open={this.state.alreadySubmittedPrompt}
          onClose={() => this.setState({ alreadySubmittedPrompt: false })}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle className='dialoge-text'>{'Attention!'}</DialogTitle>
          <DialogContent>
            <DialogContentText className='dialoge-text'>
              You already have a submitted your application choices. You can
              update it at your preference.
            </DialogContentText>
          </DialogContent>
          <DialogActions
            className='dialoge-text'
            style={{ justifyContent: 'center', marginBottom: '20px' }}
          >
            <Button
              onClick={() => this.setState({ alreadySubmittedPrompt: false })}
              color='primary'
              variant='contained'
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {/* Prompt for EIIN count saturates */}
        <Dialog
          open={this.state.overflowEIINCount}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle
            id='alert-dialog-title'
            style={{ textAlign: 'center' }}
          ></DialogTitle>
          <DialogContent>
            <DialogContentText
              id='alert-dialog-description'
              style={{ textAlign: 'center' }}
            >
              You have already added the maximum number of distinct EIIN (10) to
              your choice list.
            </DialogContentText>
          </DialogContent>
          <DialogActions
            style={{ justifyContent: 'center', marginBottom: '20px' }}
          >
            <Button
              onClick={() => {
                this.setState({ overflowEIINCount: false })
              }}
              color='primary'
              variant='contained'
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {/* Prompt before submitting the choice list */}
        <Dialog
          open={this.state.submitApplicationPrompt}
          onClose={() => this.setState({ submitApplicationPrompt: false })}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle className='dialoge-text'>{'Attention!'}</DialogTitle>
          <DialogContent>
            <DialogContentText className='dialoge-text'>
              Do your really want to submit your currectly selected choices? The
              submission will be followed by the payment process. You can modify
              your application after the sucessful submission.
            </DialogContentText>
          </DialogContent>
          <DialogActions
            className='dialoge-text'
            style={{ justifyContent: 'center', marginBottom: '20px' }}
          >
            <Button
              onClick={() => this.setState({ submitApplicationPrompt: false })}
              color='secondary'
              variant='contained'
              autoFocus
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                this.setState({ submitApplicationPrompt: false })
                this.setState({ paymentRedirection: true })
                setTimeout(() => this.submitApplication(), 1)
              }}
              color='primary'
              variant='contained'
              autoFocus
            >
              Proceed
            </Button>
          </DialogActions>
        </Dialog>

        {/* Prompt before updating the choice list */}
        <Dialog
          open={this.state.updateApplicationPrompt}
          onClose={() => this.setState({ updateApplicationPrompt: false })}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle className='dialoge-text'>{'Attention!'}</DialogTitle>
          <DialogContent>
            <DialogContentText className='dialoge-text'>
              Do your really want update your submitted application?
            </DialogContentText>
          </DialogContent>
          <DialogActions
            className='dialoge-text'
            style={{ justifyContent: 'center', marginBottom: '20px' }}
          >
            <Button
              onClick={() => this.setState({ updateApplicationPrompt: false })}
              color='secondary'
              variant='contained'
              autoFocus
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                this.setState({ updateApplicationPrompt: false })
                this.updateApplication()
              }}
              color='primary'
              variant='contained'
              autoFocus
            >
              Proceed
            </Button>
          </DialogActions>
        </Dialog>

        {/* Prompt before payment gateway redirection */}
        <Dialog
          open={this.state.paymentRedirection}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle className='dialoge-text'>{'Attention!'}</DialogTitle>
          <DialogContent>
            <DialogContentText
              className='dialoge-text'
              style={{ justifyContent: 'center', marginBottom: '20px' }}
            >
              Please be patient. You will be redirected to Payment Gateway.
            </DialogContentText>
          </DialogContent>
          <DialogActions
            className='dialoge-text'
            style={{ justifyContent: 'center', marginBottom: '20px' }}
          ></DialogActions>
        </Dialog>

        {/* Prompt after updating the choice list */}
        <Dialog
          open={this.state.successfullyUpdated}
          //onClose={() => this.setState({ successfullyUpdated: false })}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle className='dialoge-text'>{'Attention!'}</DialogTitle>
          <DialogContent>
            <DialogContentText
              style={{ justifyContent: 'center', textAlign: 'center' }}
            >
              Your application is successfully updated.
            </DialogContentText>
          </DialogContent>
          <DialogActions
            className='dialoge-text'
            className='dialoge-text'
            style={{ justifyContent: 'center', marginBottom: '20px' }}
          >
            <Button
              onClick={() => {
                this.props.history.push('/application/viewapplication')
              }}
              color='primary'
              variant='contained'
              autoFocus
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>

        <div className='flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4'>
          <div className='d-block mb-4 mb-xl-0'>
            <Breadcrumb
              className='d-none d-md-inline-block'
              listProps={{
                className: 'breadcrumb-dark breadcrumb-transparent'
              }}
            >
              <Breadcrumb.Item>
                <FontAwesomeIcon icon={faHome} />
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Application</Breadcrumb.Item>
              <Breadcrumb.Item active>Submit Application</Breadcrumb.Item>
            </Breadcrumb>
            {/* <h4 style={{ textAlign: "center", marginLeft: "-12px" }}>Submit your Application Choices</h4> */}

            {/* Start new style coding with proper bootstrap */}

            <div
              className='col d-flex justify-content-center'
              style={{ paddingTop: '20px' }}
            >
              <div style={{ width: '100%' }}>
                <div className='row'>
                  <div className='col-xl-12 col-40-pct'>
                    <Accordion defaultActiveKey='1' className='quota-selection'>
                      <Accordion.Item eventKey='1'>
                        <Accordion.Header>
                          <h5 style={{ paddingLeft: '4px' }}>
                            Quota Selection
                          </h5>
                        </Accordion.Header>
                        <Accordion.Body>
                          <div className='row'>
                            {this.state.quotaStatus.map(quota => (
                              <div className='col-4'>
                                <div className='row'>
                                  <div className='col-8 quota-title'>
                                    {quota.name}
                                  </div>
                                  <div className='col-4 quota-checkbox'>
                                    {quota.checkbox}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className='row'>
                            <div
                              className='col-12'
                              style={{ paddingTop: '20px', textAlign: 'right' }}
                            >
                              <Button
                                onClick={this.updateQuotaStatus}
                                variant='contained'
                                color='primary'
                                size='medium'
                                disabled={false}
                                startIcon={<SaveIcon />}
                              >
                                Update Quota Status
                              </Button>
                            </div>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                    <div
                      className='col d-flex justify-content-center higher-padded-card'
                      style={{ paddingTop: '20px' }}
                    >
                      <Card style={{ width: '100%' }}>
                        <Card.Header style={{ height: '60px' }}>
                          <h5>College Selection</h5>
                        </Card.Header>
                        <Card.Body>
                          <div className='row college-selection'>
                            <div className='col-3'>
                              <Autocomplete
                                {...this.state.boardsProp}
                                id='boardProp'
                                disableClearable
                                onChange={this.handleBoardChange}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    label='Board'
                                    margin='normal'
                                  />
                                )}
                              />
                            </div>
                            <div className='col-3'>
                              <Autocomplete
                                key={this.state.resetDistrict}
                                {...this.state.districtsProp}
                                id='districtProp'
                                disableClearable
                                onChange={this.handleDistrictChange}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    label='District'
                                    margin='normal'
                                  />
                                )}
                              />
                            </div>
                            <div className='col-3'>
                              <Autocomplete
                                autoHighlight
                                key={this.state.resetThana}
                                {...this.state.thanasProp}
                                id='thanaProp'
                                disableClearable
                                onChange={this.handleThanaChange}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    label='Thana'
                                    margin='normal'
                                  />
                                )}
                              />
                            </div>
                            <div className='col-6'>
                              <Autocomplete
                                key={this.state.resetCollege}
                                {...this.state.collegesProp}
                                id='collegeProp'
                                disableClearable
                                onChange={this.handleCollegeChange}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    label='College'
                                    margin='normal'
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>

                    <div className='col d-flex justify-content-center lower-padded-card'>
                      <Card
                        style={{
                          width: '100%',
                          alignContent: 'center',
                          display: 'flex',
                          position: 'center',
                          border: '1'
                        }}
                      >
                        <Card.Header
                          style={{ minHeight: '70px', paddingBottom: '-20px' }}
                        >
                          {this.state.college !== '' && (
                            <>
                              <h6 style={{ display: 'inline' }}>
                                Available ESVG list of{' '}
                              </h6>
                              <h5 style={{ display: 'inline' }}>
                                {this.state.college +
                                  ' - ' +
                                  this.state.collegeName}
                              </h5>
                            </>
                          )}
                        </Card.Header>
                        <Card.Body>
                          <Table
                            responsive
                            className='table-centered table-nowrap rounded mb-0 choice-table'
                          >
                            <thead className='thead-light'>
                              <tr>
                                <th className='border-0'>#</th>
                                <th className='border-0'>Shift</th>
                                <th className='border-0'>Version</th>
                                <th className='border-0'>Group</th>
                                <th className='border-0'>Gender</th>
                                <th className='border-0'>Seats</th>
                                <th className='border-0'>SQ</th>
                                <th className='border-0'>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.esvgs.map((esvg, id) => (
                                <tr>
                                  <td>{id + 1}</td>
                                  <td>{esvg.shift.shiftName}</td>
                                  <td>{esvg.version.versionName}</td>
                                  <td>{esvg.hscGroup.hscGroupName}</td>
                                  <td>{esvg.gender}</td>
                                  <td>{esvg.seatsAvailable}</td>
                                  <td>
                                    {esvg.isSQ === 'Y' && (
                                      <Checkbox
                                        checked={esvg.SQChecked}
                                        disabled={esvg.alreadyExistInChoiceList}
                                        onChange={() =>
                                          this.handleSQCheckedChange(esvg)
                                        }
                                        name='checkedB'
                                        color='primary'
                                        style={{ marginTop: '-10px' }}
                                      />
                                    )}
                                  </td>
                                  <td>
                                    <Fab
                                      aria-label='add'
                                      color={
                                        (!esvg.alreadyExistInChoiceList &&
                                          'primary') ||
                                        'default'
                                      }
                                      style={{
                                        marginTop: '-4px',
                                        width: '32px',
                                        height: '32px',
                                        minHeight: '32px'
                                      }}
                                      onClick={() =>
                                        !esvg.alreadyExistInChoiceList &&
                                        this.handleAddChoiceButtonPressed(esvg)
                                      }
                                    >
                                      <AddIcon
                                        style={{
                                          width: '0.88em',
                                          height: '0.88em'
                                        }}
                                      />
                                    </Fab>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>

                  <div className='col-xl-12 col-60-pct'>
                    <div style={{ width: '100%' }}>
                      <div className='col d-flex justify-content-center view-application'>
                        <Accordion
                          defaultActiveKey='1'
                          className='quota-selection'
                        >
                          <Accordion.Item eventKey='1'>
                            <Accordion.Header>
                              <h6 style={{ display: 'inline' }}>
                                Choice Summary of{' '}
                              </h6>
                              <h5
                                style={{
                                  paddingLeft: '4px',
                                  display: 'inline'
                                }}
                              >
                                {this.props.keycloak.tokenParsed.name}
                              </h5>
                            </Accordion.Header>
                            <Accordion.Body>
                              <div className='row'>
                                <div className='col-sm-6 col-md-6 col-33-pct'>
                                  <h7>
                                    Minimum EIIN Required:{' '}
                                    {this.state.minimumEIINCount}
                                  </h7>
                                </div>

                                <div className='col-sm-6 col-md-6 col-33-pct'>
                                  <h7>
                                    Maximum EIIN Allowed:{' '}
                                    {this.state.maximumEIINCount}
                                  </h7>
                                </div>

                                <div className='col-sm-6 col-md-6 col-33-pct'>
                                  <h7>
                                    Selected EIIN Count:{' '}
                                    {this.state.selectedEIINCount}
                                  </h7>
                                </div>
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </div>

                      <div className='col d-flex justify-content-center lower-padded-card'>
                        <Card
                          style={{
                            width: '100%',
                            alignContent: 'center',
                            position: 'center',
                            border: '1'
                          }}
                        >
                          <Card.Header>
                            <h6 style={{ display: 'inline' }}>
                              Choice List of{' '}
                            </h6>
                            <h5
                              style={{ paddingLeft: '4px', display: 'inline' }}
                            >
                              {this.props.keycloak.tokenParsed.name}
                            </h5>
                          </Card.Header>
                          <Card.Body>
                            <Table
                              responsive
                              className='table-centered table-wrap rounded mb-0 choice-table'
                            >
                              <thead className='thead-light'>
                                <tr>
                                  <th className='border-0'>Priority</th>
                                  <th className='border-0'>College Name</th>
                                  <th className='border-0'>Shift</th>
                                  <th className='border-0'>Version</th>
                                  <th className='border-0'>Group</th>
                                  <th className='border-0'>SQ</th>
                                  <th className='border-0'>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.choices.map((choice, id) => (
                                  <tr>
                                    <td>{choice.priority}</td>
                                    <td>
                                      <span>{choice.collegeName}</span>
                                    </td>
                                    <td>{choice.shift.shiftName}</td>
                                    <td>{choice.version.versionName}</td>
                                    <td>{choice.hscGroup.hscGroupName}</td>
                                    <td>
                                      {(choice.esvgIsSQ === 'Y' ||
                                        choice.isSQ === 'Y' ||
                                        choice.isSQ === true) && (
                                        <Checkbox
                                          checked={choice.SQChecked}
                                          disabled={true}
                                          name='checkedB'
                                          color='primary'
                                          style={{ marginTop: '-10px' }}
                                        />
                                      )}
                                    </td>
                                    <td>
                                      <Fab
                                        color={
                                          (choice.priority === 1 &&
                                            'default') ||
                                          'primary'
                                        }
                                        aria-label='add'
                                        style={{
                                          marginTop: '-4px',
                                          width: '32px',
                                          height: '32px',
                                          minHeight: '32px'
                                        }}
                                        onClick={() =>
                                          choice.priority !== 1 &&
                                          this.handlePriorityUpButtonPressed(
                                            choice
                                          )
                                        }
                                      >
                                        <ArrowUpwardIcon
                                          style={{
                                            width: '0.88em',
                                            height: '0.88em'
                                          }}
                                        />
                                      </Fab>
                                      &nbsp;
                                      <Fab
                                        color={
                                          (choice.priority ===
                                            this.state.lastPriority &&
                                            'default') ||
                                          'primary'
                                        }
                                        aria-label='add'
                                        style={{
                                          marginTop: '-4px',
                                          width: '32px',
                                          height: '32px',
                                          minHeight: '32px'
                                        }}
                                        onClick={() =>
                                          choice.priority !==
                                            this.state.lastPriority &&
                                          this.handlePriorityDownButtonPressed(
                                            choice
                                          )
                                        }
                                      >
                                        <ArrowDownwardIcon
                                          style={{
                                            width: '0.88em',
                                            height: '0.88em'
                                          }}
                                        />
                                      </Fab>
                                      &nbsp;
                                      <Fab
                                        color='secondary'
                                        aria-label='add'
                                        style={{
                                          marginTop: '-4px',
                                          width: '32px',
                                          height: '32px',
                                          minHeight: '32px'
                                        }}
                                        onClick={() =>
                                          this.handleRemoveChoiceButtonPressed(
                                            choice
                                          )
                                        }
                                      >
                                        <ClearIcon
                                          style={{
                                            width: '0.88em',
                                            height: '0.88em'
                                          }}
                                        />
                                      </Fab>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </Card.Body>
                        </Card>
                      </div>
                      <div className='row'>
                        <div
                          className='col-12'
                          style={{ paddingTop: '20px', textAlign: 'center' }}
                        >
                          <Button
                            onClick={() => {
                              if (this.state.showSubmitButton)
                                this.setState({
                                  submitApplicationPrompt: true
                                })
                              if (this.state.showUpdateButton)
                                this.setState({
                                  updateApplicationPrompt: true
                                })
                            }}
                            variant='contained'
                            color='primary'
                            size='medium'
                            disabled={this.state.disableButton}
                            startIcon={<SaveIcon />}
                          >
                            {this.state.showSubmitButton &&
                              'Submit Application'}
                            {this.state.showUpdateButton &&
                              'Update Application'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default SubmitApplication
