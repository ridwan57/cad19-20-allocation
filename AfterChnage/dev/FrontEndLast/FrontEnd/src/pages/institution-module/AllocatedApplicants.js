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
import CheckIcon from '@material-ui/icons/Check'
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
import '../../styles/institute-styling.css'
import MUIDataTable from 'mui-datatables'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'

import Loader from '../../components/Loader'

import { institutionModuleRootAddress } from '../../data/constants'

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
  ThreeDots
} from '@agney/react-loading'

import { LoaderProvider, useLoading } from '@agney/react-loading'
import { CADApplicationStatuses } from './ApplicationStatuses'

class AllocatedAapplicants extends Component {
  constructor (props) {
    super(props)
    this.state = {
      collegeeiin: 107858,
      collegeName: 'B. A. F. Shaheen College, Tejgaon',
      allocatedApplicants: [],
      selectedRows: []
      // showAddAdmissionDataWindow: false,
      // admissionData: [],
      // CRVSID: 'ABCD',
      // applicantName: 'A',
      // shift: '',
      // version: '',
      // group: '',
      // svgs: [],
      // shifts: [],
      // versions: [],
      // groups: [],
      // selectedShift: '',
      // selectedVersion: '',

      // editingIndex: -1,
      // showEditWindow: false,
    }
    this.handleBulkAdmissionConfirmation = this.handleBulkAdmissionConfirmation.bind(
      this
    )
    this.handleBulkAdmissionCancellation = this.handleBulkAdmissionCancellation.bind(
      this
    )
    this.handleConfirmAdmissionButtonPressed = this.handleConfirmAdmissionButtonPressed.bind(
      this
    )
    this.handleCancelAdmissionButtonPressed = this.handleCancelAdmissionButtonPressed.bind(
      this
    )
    // this.newAdmissionDataAddition = this.newAdmissionDataAddition.bind(this);
    // this.addAdmissionData = this.addAdmissionData.bind(this);
    // this.cancelAddition = this.cancelAddition.bind(this);
    // this.updateCRVSID = this.updateCRVSID.bind(this);
    // this.updateApplicantName = this.updateApplicantName.bind(this);
    // this.updateShift = this.updateShift.bind(this);
    // this.updateVersion = this.updateVersion.bind(this);
    // this.updateGroup = this.updateGroup.bind(this);
    // this.findSVGID = this.findSVGID.bind(this);
    // this.state.handleEditButtonPressed = this.handleDeleteButtonPressed.bind(this);
    // this.handleDeleteButtonPressed = this.handleDeleteButtonPressed.bind(this);
    // this.handleShiftSelection = this.handleShiftSelection.bind(this);
    // this.handleVersionSelection = this.handleVersionSelection.bind(this);
    // this.cancelUpdate = this.cancelAddition.bind(this);
    // this.updateAdmissionData = this.updateAdmissionData.bind(this);
  }
  componentDidMount () {
    fetch(institutionModuleRootAddress + '/getAllocatedApplicantList', {
      headers: {
        Authorization: `bearer ${this.props.keycloak.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.result?.length > 0) {
          var lst = []
          data.result.forEach((element, index) => {
            element.admissionStatus =
              //   (element.applicationStatus === 4 && 'Allocated') ||
              //   (element.applicationStatus === 3 && 'Admitted') ||
              //   (element.applicationStatus === 3 && 'Cancelled')
              (element.applicationStatus ===
                CADApplicationStatuses.AllocationConfirmed &&
                'Allocated') ||
              (element.applicationStatus === CADApplicationStatuses.Admitted &&
                'Admitted') ||
              (element.applicationStatus === CADApplicationStatuses.Cancelled &&
                'Cancelled')
            element.action = (
              <div>
                <Tooltip title='Confirm Admission'>
                  <IconButton
                    aria-label='add'
                    color=''
                    style={{
                      marginTop: '-4px',
                      width: '32px',
                      height: '32px',
                      minHeight: '32px'
                    }}
                    onClick={() =>
                      this.handleConfirmAdmissionButtonPressed(index)
                    }
                  >
                    <CheckIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Confirm Cancellation'>
                  <IconButton
                    aria-label='add'
                    color=''
                    style={{
                      marginTop: '-4px',
                      width: '32px',
                      height: '32px',
                      minHeight: '32px'
                    }}
                    onClick={() =>
                      this.handleCancelAdmissionButtonPressed(index)
                    }
                  >
                    <RemoveIcon />
                  </IconButton>
                </Tooltip>
              </div>
            )
            if (element.applicationStatus > 1) lst.push(element)
          })
          this.setState({ allocatedApplicants: lst })
        }
      })
  }

  handleConfirmAdmissionButtonPressed (index) {
    var updatedAllocatedApplicants = this.state.allocatedApplicants
    updatedAllocatedApplicants[index].admissionStatus = 'Admitted'
    // updatedAllocatedApplicants[index].applicationStatus = 5
    updatedAllocatedApplicants[index].applicationStatus =
      CADApplicationStatuses.Admitted

    fetch(institutionModuleRootAddress + '/updateAdmissionStatus/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${this.props.keycloak.token}`
      },
      body: JSON.stringify({
        applicantList: [
          {
            CRVSID: updatedAllocatedApplicants[index].crvsId,
            // applicationStatus: 5
            applicationStatus: CADApplicationStatuses.Admitted
          }
        ]
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Success') {
          this.setState({ allocatedApplicants: updatedAllocatedApplicants })
        }
      })
  }

  handleCancelAdmissionButtonPressed (index) {
    var updatedAllocatedApplicants = this.state.allocatedApplicants
    updatedAllocatedApplicants[index].admissionStatus = 'Cancelled'
    // updatedAllocatedApplicants[index].applicationStatus = 6
    updatedAllocatedApplicants[index].applicationStatus =
      CADApplicationStatuses.Cancelled

    fetch(institutionModuleRootAddress + '/updateAdmissionStatus/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${this.props.keycloak.token}`
      },
      body: JSON.stringify({
        applicantList: [
          {
            CRVSID: updatedAllocatedApplicants[index].crvsId,
            // applicationStatus: 6
            applicationStatus: CADApplicationStatuses.Cancelled
          }
        ]
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Success') {
          this.setState({ allocatedApplicants: updatedAllocatedApplicants })
        }
      })
  }

  handleBulkAdmissionConfirmation (selectedRows) {
    var updatedAllocatedApplicants = this.state.allocatedApplicants
    console.log(selectedRows)
    var applicantList = {
      applicantList: []
    }

    selectedRows.data.forEach(element => {
      const applicant = {
        CRVSID: updatedAllocatedApplicants[element.index].crvsId,
        // applicationStatus: 5
        applicationStatus: CADApplicationStatuses.Admitted
      }
      applicantList.applicantList.push(applicant)
    })
    fetch(institutionModuleRootAddress + '/updateAdmissionStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${this.props.keycloak.token}`
      },
      body: JSON.stringify(applicantList)
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Success') {
          selectedRows.data.forEach(element => {
            updatedAllocatedApplicants[element.index].admissionStatus =
              'Admitted'
            // updatedAllocatedApplicants[element.index].applicationStatus = 5
            updatedAllocatedApplicants[element.index].applicationStatus =
              CADApplicationStatuses.Admitted
          })
          this.setState({ allocatedApplicants: updatedAllocatedApplicants })
          selectedRows.data.splice(0, selectedRows.data.length)
          selectedRows.lookup = {}
        } else {
          selectedRows.data.splice(0, selectedRows.data.length)
          selectedRows.lookup = {}
        }
      })
  }

  handleBulkAdmissionCancellation (selectedRows) {
    var updatedAllocatedApplicants = this.state.allocatedApplicants
    console.log(selectedRows)
    var applicantList = {
      applicantList: []
    }

    selectedRows.data.forEach(element => {
      const applicant = {
        CRVSID: updatedAllocatedApplicants[element.index].crvsId,
        // applicationStatus: 6
        applicationStatus: CADApplicationStatuses.Cancelled
      }
      applicantList.applicantList.push(applicant)
    })
    fetch(institutionModuleRootAddress + '/updateAdmissionStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${this.props.keycloak.token}`
      },
      body: JSON.stringify(applicantList)
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Success') {
          selectedRows.data.forEach(element => {
            updatedAllocatedApplicants[element.index].admissionStatus =
              'Cacelled'
            // updatedAllocatedApplicants[element.index].applicationStatus = 6
            updatedAllocatedApplicants[element.index].applicationStatus =
              CADApplicationStatuses.Cancelled
          })
          this.setState({ allocatedApplicants: updatedAllocatedApplicants })
          selectedRows.data.splice(0, selectedRows.data.length)
          selectedRows.lookup = {}
        } else {
          selectedRows.data.splice(0, selectedRows.data.length)
          selectedRows.lookup = {}
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
    const tableColumns = [
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
        name: 'admissionStatus',
        label: 'Admission Status',
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
    ]
    const options = {
      filter: true,
      filterType: 'dropdown',
      print: false,
      selectableRows: true,
      customToolbarSelect: selectedRows => (
        <div>
          <Button
            variant='contained'
            color='primary'
            startIcon={<CheckIcon />}
            onClick={() => this.handleBulkAdmissionConfirmation(selectedRows)}
          >
            Mark Selected as Admitted
          </Button>
          &nbsp;
          <Button
            variant='contained'
            color='secondary'
            startIcon={<RemoveIcon />}
            onClick={() => this.handleBulkAdmissionCancellation(selectedRows)}
          >
            Mark Selected as Cancelled
          </Button>
        </div>
      )
    }
    return (
      <>
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
              <Breadcrumb.Item active>Allocated Applicants</Breadcrumb.Item>
            </Breadcrumb>
            <h4 class='update-svg-h4'>Confirm Allocated Applicants</h4>
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
                  {this.state.allocatedApplicants.length === 0 && (
                    <div style={{ textAlign: 'center' }}>
                      <LoaderProvider indicator={<Bars width='50' />}>
                        <Loader />
                      </LoaderProvider>
                    </div>
                  )}
                  {this.state.allocatedApplicants.length !== 0 && (
                    <div class='muidatatable-update-sq'>
                      <MuiThemeProvider theme={this.getMuiTheme()}>
                        <MUIDataTable
                          data={this.state.allocatedApplicants}
                          columns={tableColumns}
                          options={options}
                        />
                      </MuiThemeProvider>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default AllocatedAapplicants