import React, { Component, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faCheck,
  faMinus,
  faEye
} from '@fortawesome/free-solid-svg-icons'
import { Breadcrumb } from '@themesberg/react-bootstrap'
import { Table, Card } from '@themesberg/react-bootstrap'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import RemoveIcon from '@material-ui/icons/Remove'
import VisibilityIcon from '@material-ui/icons/Visibility'
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
  Checkbox,
  Tooltip,
  Paper,
  Input
} from '@material-ui/core'
import Draggable from 'react-draggable'
import '../../styles/Rashed.css'
import '../../styles/institute-styling.css'
import _ from 'underscore'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import { institutionModuleRootAddress } from '../../data/constants'

import { TablePagination } from '@material-ui/core'

//import MuiDataTable from "react-mui-datatables";
import MUIDataTable from 'mui-datatables'

import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { faLess } from '@fortawesome/free-brands-svg-icons'

class UploadAdmissionData extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tableColumns: [
        {
          name: 'crvsId',
          label: 'CRVS ID',
          options: {
            filter: true,
            sort: true
          }
        },
        {
          name: 'studentName',
          label: 'APPLICANT NAME',
          options: {
            filter: false,
            sort: true
          }
        },
        {
          name: 'shiftName',
          label: 'SHIFT',
          options: {
            filter: true,
            sort: true
          }
        },
        {
          name: 'versionName',
          label: 'VERSION',
          options: {
            filter: true,
            sort: true
          }
        },
        {
          name: 'hscGroupName',
          label: 'GROUP',
          options: {
            filter: true,
            sort: true
          }
        },
        {
          name: 'action',
          label: 'ACTION',
          options: {
            filter: false,
            sort: false
          }
        }
      ],
      collegeeiin: 107858,
      collegeName: 'B. A. F. Shaheen College, Tejgaon',
      showAddAdmissionDataWindow: false,
      admissionData: [],
      CRVSID: '',
      applicantName: '',
      shiftName: '',
      versionName: '',
      hscGroupName: '',
      svgs: [],
      shifts: [],
      versions: [],
      groups: [],
      selectedShift: '',
      selectedVersion: '',

      editingIndex: -1,
      showEditWindow: false
    }
    this.newAdmissionDataAddition = this.newAdmissionDataAddition.bind(this)
    this.addAdmissionData = this.addAdmissionData.bind(this)
    this.cancelAddition = this.cancelAddition.bind(this)
    this.updateCRVSID = this.updateCRVSID.bind(this)
    this.updateApplicantName = this.updateApplicantName.bind(this)
    this.updateShift = this.updateShift.bind(this)
    this.updateVersion = this.updateVersion.bind(this)
    this.updateGroup = this.updateGroup.bind(this)
    this.findSVGID = this.findSVGID.bind(this)
    this.state.handleEditButtonPressed = this.handleDeleteButtonPressed.bind(
      this
    )
    this.handleDeleteButtonPressed = this.handleDeleteButtonPressed.bind(this)
    this.handleShiftSelection = this.handleShiftSelection.bind(this)
    this.handleVersionSelection = this.handleVersionSelection.bind(this)
    this.cancelUpdate = this.cancelAddition.bind(this)
    this.updateAdmissionData = this.updateAdmissionData.bind(this)
    this.fetchApplicantName = this.fetchApplicantName.bind(this)
  }

  componentDidMount () {
    fetch(institutionModuleRootAddress + '/getSVGData/', {
      headers: {
        Authorization: `bearer ${this.props.keycloak.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        var lst = []
        if (data.status === 200) {
          data.result.map(svg => lst.push(svg))

          let shifts = []
          let versions = []
          let groups = []
          console.log(lst)
          lst.forEach((element, index) => {
            shifts.push(element.shift.shiftName)
            //versions.push(element.version.versionName);
            //groups.push(element.groupId.hscGroupName);
          })
          console.log(shifts)
          this.setState({
            svgs: lst,
            shifts: [...new Set(shifts)]
            //versions: [...new Set(versions)],
            //groups: [...new Set(groups)]
          })
        } else
          this.setState({
            svgs: []
          })
      })

    fetch(institutionModuleRootAddress + '/getAdmissionData', {
      headers: {
        Authorization: `bearer ${this.props.keycloak.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.result?.length > 0) {
          var lst = data.result
          lst.forEach((element, index) => {
            element.action = (
              <div>
                <Tooltip title='Edit'>
                  <IconButton
                    aria-label='add'
                    color='primary'
                    style={{
                      marginTop: '-4px',
                      width: '32px',
                      height: '32px',
                      minHeight: '32px'
                    }}
                    onClick={() => this.handleEditButtonPressed(index)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Delete'>
                  <IconButton
                    aria-label='add'
                    color='secondary'
                    style={{
                      marginTop: '-4px',
                      width: '32px',
                      height: '32px',
                      minHeight: '32px'
                    }}
                    onClick={() => this.handleDeleteButtonPressed(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            )
          })
          this.setState({ admissionData: data.result })
        }
      })
  }
  newAdmissionDataAddition () {
    this.setState({
      editingIndex: -1,
      CRVSID: '',
      applicantName: '',
      shiftName: '',
      versionName: '',
      hscGroupName: ''
    })
    this.setState({ showAddAdmissionDataWindow: true })
  }

  cancelAddition () {
    this.setState({ showAddAdmissionDataWindow: false })
  }

  handleShiftSelection (e) {
    let versions = []
    this.state.svgs.forEach((element, index) => {
      if (element.shift.shiftName === e.target.value)
        versions.push(element.version.versionName)
    })
    this.setState({
      shiftName: e.target.value,
      selectedShift: e.target.value,
      vsersion: '',
      hscGroupName: '',
      versions: [...new Set(versions)],
      groups: []
    })
  }

  handleVersionSelection (e) {
    let groups = []
    this.state.svgs.forEach((element, index) => {
      if (
        element.shift.shiftName === this.state.selectedShift &&
        element.version.versionName === e.target.value
      )
        groups.push(element.hscGroup.hscGroupName)
    })
    this.setState({
      versionName: e.target.value,
      selectedVersion: e.target.value,
      hscGroupName: '',
      groups: [...new Set(groups)]
    })
  }

  findSVGID (shift, version, group) {
    const svgIndex = this.state.svgs.findIndex(function (svg) {
      return (
        svg.shift.shiftName === shift &&
        svg.version.versionName === version &&
        svg.hscGroup.hscGroupName === group
      )
    })
    console.log(this.state.svgs)
    console.log(svgIndex)
    return this.state.svgs[svgIndex].esvgId
  }

  addAdmissionData () {
    const newSingleAdmissionData = {
      crvsId: this.state.CRVSID,
      studentName: this.state.applicantName,
      shiftName: this.state.shiftName,
      versionName: this.state.versionName,
      hscGroupName: this.state.hscGroupName,
      esvgId: this.findSVGID(
        this.state.shiftName,
        this.state.versionName,
        this.state.hscGroupName
      )
    }

    const newAdmissionData = [newSingleAdmissionData].concat(
      this.state.admissionData
    )
    newAdmissionData.forEach((element, index) => {
      element.action = (
        <div>
          <Tooltip title='Edit'>
            <IconButton
              aria-label='add'
              color='primary'
              style={{
                marginTop: '-4px',
                width: '32px',
                height: '32px',
                minHeight: '32px'
              }}
              onClick={() => this.handleEditButtonPressed(index)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton
              aria-label='add'
              color='secondary'
              style={{
                marginTop: '-4px',
                width: '32px',
                height: '32px',
                minHeight: '32px'
              }}
              onClick={() => this.handleDeleteButtonPressed(index)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      )
    })
    console.log(newAdmissionData)
    const admissionDataToSave = {
      CRVSID: this.state.CRVSID,
      quotaFF: 'No',
      allocatedESVG: this.findSVGID(
        this.state.shiftName,
        this.state.versionName,
        this.state.hscGroupName
      )
    }

    fetch(institutionModuleRootAddress + '/addAdmissionData/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${this.props.keycloak.token}`
      },
      body: JSON.stringify(admissionDataToSave)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.message === 'Success') {
          this.setState({
            admissionData: newAdmissionData,
            showAddAdmissionDataWindow: false,
            CRVSID: '',
            applicantName: '',
            shiftName: '',
            versionName: '',
            hscGroupName: ''
          })
        }
      })
  }

  handleEditButtonPressed (index) {
    console.log(index)
    console.log(this.state.admissionData[index])

    const currentShift = this.state.admissionData[index].shiftName
    const currentVersion = this.state.admissionData[index].versionName
    const currentGroup = this.state.admissionData[index].hscGroupName

    let versions = []
    this.state.svgs.forEach((element, index) => {
      if (element.shift.shiftName === currentShift)
        versions.push(element.version.versionName)
    })

    console.log(versions)

    let groups = []
    this.state.svgs.forEach((element, index) => {
      if (
        element.shift.shiftName === currentShift &&
        currentVersion === element.version.versionName
      )
        groups.push(element.hscGroup.hscGroupName)
    })

    console.log(groups)

    this.setState({
      editingIndex: index,
      CRVSID: this.state.admissionData[index].crvsId,
      applicantName: this.state.admissionData[index].studentName,
      shiftName: currentShift,
      versionName: currentVersion,
      hscGroupName: currentGroup,
      versions: [...new Set(versions)],
      groups: [...new Set(groups)],
      showEditWindow: true
    })
  }

  cancelUpdate () {
    console.log('Cancel')
    this.setState({ showEditWindow: false })
  }

  updateAdmissionData () {
    const newSingleAdmissionData = {
      crvsId: this.state.CRVSID,
      studentName: this.state.applicantName,
      shiftName: this.state.shiftName,
      versionName: this.state.versionName,
      hscGroupName: this.state.hscGroupName,
      esvgId: this.findSVGID(
        this.state.shiftName,
        this.state.versionName,
        this.state.hscGroupName
      )
    }

    var newAdmissionData = this.state.admissionData
    newAdmissionData[this.state.editingIndex] = newSingleAdmissionData
    newAdmissionData.forEach((element, index) => {
      element.action = (
        <div>
          <Tooltip title='Edit'>
            <IconButton
              aria-label='add'
              color='primary'
              style={{
                marginTop: '-4px',
                width: '32px',
                height: '32px',
                minHeight: '32px'
              }}
              onClick={() => this.handleEditButtonPressed(index)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton
              aria-label='add'
              color='secondary'
              style={{
                marginTop: '-4px',
                width: '32px',
                height: '32px',
                minHeight: '32px'
              }}
              onClick={() => this.handleDeleteButtonPressed(index)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      )
    })

    const admissionDataToSave = {
      CRVSID: newSingleAdmissionData.crvsId,
      quotaFF: 'No ',
      allocatedESVG: newSingleAdmissionData.esvgId
    }

    fetch(institutionModuleRootAddress + '/addAdmissionData/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${this.props.keycloak.token}`
      },
      body: JSON.stringify(admissionDataToSave)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.message === 'Success') {
          this.setState({
            admissionData: newAdmissionData,
            showEditWindow: false,
            CRVSID: '',
            applicantName: '',
            shiftName: '',
            versionName: '',
            hscGroupName: ''
          })
        }
      })
  }

  handleDeleteButtonPressed (index) {
    console.log(index)
    var newAdmissionData = this.state.admissionData
    newAdmissionData.splice(index, 1)
    this.setState({
      admissionData: newAdmissionData,
      showEditWindow: false,
      CRVSID: '',
      applicantName: '',
      shiftName: '',
      versionName: '',
      hscGroupName: ''
    })
  }

  updateCRVSID (e) {
    this.setState({ CRVSID: e.target.value })
  }
  updateApplicantName (e) {
    //e.persist();
    //console.log(e.target.value);
    //if(!this.debouncedFn){
    //    this.debouncedFn = _.debounce(() => {
    //        console.log(e.target.value);
    this.setState({ applicantName: e.target.value })
    //    }, 300);
    //}
    //this.debouncedFn();
  }
  updateShift (e) {
    this.setState({ shiftName: e.target.value })
  }
  updateVersion (e) {
    this.setState({ versionName: e.target.value })
  }
  updateGroup (e) {
    this.setState({ hscGroupName: e.target.value })
  }
  PaperComponent (props) {
    return (
      <Draggable
        handle='#draggable-dialog-title'
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} maxWidth='700px' />
      </Draggable>
    )
  }

  fetchApplicantName () {
    //  @ to do
    // if already admitted ?
    console.log('called')

    fetch(
      institutionModuleRootAddress + '/getCRVSProfile/' + this.state.CRVSID,
      {
        headers: {
          Authorization: `Bearer ${this.props.keycloak.token}`
        }
      }
    )
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.result) {
          if (data.message === 'Success') {
            this.setState({ applicantName: data.result.studentName })
          }
        }
      })
  }

  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MuiTableCell: {
          head: {
            backgroundColor: '#f5f8fb !important'
          }
        }
      }
    })

  render () {
    const options = {
      filter: true,
      filterType: 'dropdown',
      print: false,
      selectableRows: false
    }
    return (
      <>
        <Dialog
          open={this.state.showAddAdmissionDataWindow}
          //onClose={this.handleCancelUpdateButtonPressed}
          PaperComponent={this.PaperComponent}
          aria-labelledby='draggable-dialog-title'
          maxWidth='400px'
        >
          <DialogTitle
            style={{ cursor: 'move', textAlign: 'center' }}
            id='draggable-dialog-title'
          >
            Add New Admission Entry
          </DialogTitle>
          <DialogContent>
            <form id='upload-admission-data-form'>
              <div class='row upload-admission-data-form'>
                <div class='col-sm-12 col-md-4'>
                  <FormControl>
                    <TextField
                      id='standard-basic'
                      label='CRVS ID'
                      value={this.state.CRVSID}
                      onChange={this.updateCRVSID}
                      onBlur={this.fetchApplicantName}
                    />
                  </FormControl>
                </div>
                <div class='col-sm-12 col-md-8'>
                  <FormControl>
                    <TextField
                      id='standard-basic'
                      label='Applicant Name'
                      value={this.state.applicantName}
                      onChange={this.updateApplicantName}
                      disabled={true}
                    />
                  </FormControl>
                </div>
                <div class='col-sm-12 col-md-4'>
                  <FormControl>
                    <InputLabel id='demo-simple-select-label'>Shift</InputLabel>
                    <Select
                      id='standard-basic'
                      label='Shift'
                      value={this.state.shift}
                      width='100%'
                      onChange={this.handleShiftSelection}
                    >
                      {this.state.shifts.map(shift => (
                        <MenuItem value={shift}>{shift}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div class='col-sm-12 col-md-4'>
                  <FormControl>
                    <InputLabel id='demo-simple-select-label'>
                      Version
                    </InputLabel>
                    <Select
                      id='standard-basic'
                      label='Version'
                      width='100%'
                      value={this.state.version}
                      onChange={this.handleVersionSelection}
                    >
                      {this.state.versions.map(version => (
                        <MenuItem value={version}>{version}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div class='col-sm-12 col-md-4'>
                  <FormControl>
                    <InputLabel id='demo-simple-select-label'>Group</InputLabel>
                    <Select
                      id='standard-basic'
                      label='Group'
                      width='100%'
                      value={this.state.group}
                      onChange={this.updateGroup}
                    >
                      {this.state.groups.map(group => (
                        <MenuItem value={group}>{group}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <Button autoFocus color='primary' onClick={this.cancelAddition}>
              Cancel
            </Button>
            <Button
              form='update-svg-form'
              color='primary'
              onClick={this.addAdmissionData}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.showEditWindow}
          //onClose={this.handleCancelUpdateButtonPressed}
          PaperComponent={this.PaperComponent}
          aria-labelledby='draggable-dialog-title'
          maxWidth='400px'
        >
          <DialogTitle
            style={{ cursor: 'move', textAlign: 'center' }}
            id='draggable-dialog-title'
          >
            Update Existing Admission Entry {this.state.versionName}
            {this.state.hscGroupName}
          </DialogTitle>
          <DialogContent>
            <form id='upload-admission-data-form'>
              <div class='row upload-admission-data-form'>
                <div class='col-sm-12 col-md-4'>
                  <FormControl>
                    <TextField
                      id='standard-basic'
                      label='CRVS ID'
                      value={this.state.CRVSID}
                      disabled={true}
                    />
                  </FormControl>
                </div>
                <div class='col-sm-12 col-md-8'>
                  <FormControl>
                    <TextField
                      id='standard-basic'
                      label='Applicant Name'
                      value={this.state.applicantName}
                      disabled={true}
                    />
                  </FormControl>
                </div>
                <div class='col-sm-12 col-md-4'>
                  <FormControl>
                    <InputLabel id='demo-simple-select-label'>Shift</InputLabel>
                    <Select
                      id='standard-basic'
                      label='Shift'
                      value={this.state.shiftName}
                      width='100%'
                      onChange={this.handleShiftSelection}
                    >
                      {this.state.shifts.map(shift => (
                        <MenuItem value={shift}>{shift}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div class='col-sm-12 col-md-4'>
                  <FormControl>
                    <InputLabel id='demo-simple-select-label'>
                      Version
                    </InputLabel>
                    <Select
                      id='standard-basic'
                      label='Version'
                      value={this.state.versionName}
                      width='100%'
                      onChange={this.handleVersionSelection}
                    >
                      {this.state.versions.map(version => (
                        <MenuItem value={version}>{version}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div class='col-sm-12 col-md-4'>
                  <FormControl>
                    <InputLabel id='demo-simple-select-label'>Group</InputLabel>
                    <Select
                      id='standard-basic'
                      label='Group'
                      width='100%'
                      value={this.state.hscGroupName}
                      onChange={this.updateGroup}
                    >
                      {this.state.groups.map(group => (
                        <MenuItem value={group}>{group}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              color='primary'
              onClick={() => this.setState({ showEditWindow: false })}
            >
              Cancel
            </Button>
            <Button
              form='update-svg-form'
              color='primary'
              onClick={this.updateAdmissionData}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <div className='flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4 update-svg'>
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
              <Breadcrumb.Item active>Upload Admission Data</Breadcrumb.Item>
            </Breadcrumb>
            <h4 class='update-svg-h4'>Upload Admission Data</h4>
            <div class='col d-flex justify-content-center'>
              <Card>
                <Card.Header>
                  <h5>
                    {this.props.institute.eiin +
                      ' - ' +
                      this.props.institute.name}
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div style={{ alignContent: 'right' }}>
                    <Button
                      variant='contained'
                      color='primary'
                      startIcon={<AddIcon />}
                      onClick={this.newAdmissionDataAddition}
                    >
                      Add New Admission Entry
                    </Button>
                  </div>
                  <div class='muidatatable-update-sq'>
                    <MuiThemeProvider theme={this.getMuiTheme()}>
                      <MUIDataTable
                        data={this.state.admissionData}
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
    )
  }
}

export default UploadAdmissionData