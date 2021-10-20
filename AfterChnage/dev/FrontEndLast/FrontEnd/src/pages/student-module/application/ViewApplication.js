import React, { Component } from 'react'
import { Redirect, Route } from 'react-router-dom'

import i18n from 'i18next'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { Breadcrumb, Card } from '@themesberg/react-bootstrap'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
  Tooltip
} from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'

import MUIDataTable from 'mui-datatables'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'

import { Bars } from '@agney/react-loading'
import { LoaderProvider } from '@agney/react-loading'

import Loader from './../../../components/Loader'

import { Routes } from '../../../routes'
import { studentModuleRootAddress } from '../../../data/constants'
import { gwprocessParameters } from '../ssecommerz-parameters/GWProcess'

import '../../../styles/Rashed.css'
import { CADApplicationStatuses } from '../../institution-module/ApplicationStatuses'

class ViewApplication extends Component {
  constructor (props) {
    super(props)
    this.state = {
      crvsId: '',
      choices: [],
      minimumEIINCount: 5,
      maximumEIINCount: 10,
      selectedEIINCount: 0,
      selectedEIINList: [],
      eligibilityOfSubmission: 'No',
      redirectToUpdateApplication: false,
      applicationSubmittedPrompt:
        (this.props.match.params.status === 'success' && true) || false,
      applicationSubmitted:
        (this.props.match.params.status === 'success' && true) || false,
      loading: true,
      gatewayRedirect: false,
      gatewayPageURL: '',
      showSubmitConfirmationMsg: false,
      showPaymentRedirectionMsg: false
    }
    this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this)
    this.handleSubmitButtonPressed = this.handleSubmitButtonPressed.bind(this)
    this.submitApplicationSuccessMessageAcceptedButtonPressed = this.submitApplicationSuccessMessageAcceptedButtonPressed.bind(
      this
    )
    this.submitConfirmButtonPressed = this.submitConfirmButtonPressed.bind(this)
    this.submitCancelButtonPressed = this.submitCancelButtonPressed.bind(this)
    this.demoPaymentButton = this.demoPaymentButton.bind(this)
  }
  componentDidMount () {
    console.log(this.props.match.params.status)
    console.log(this.props.keycloak.tokenParsed.CRVSID)
    i18n.changeLanguage('en')
    if (this.props.applicant.PaymentSuccess != null) {
      console.log('Payement Successfull')
      this.props.updateFunctions.applicationStatusUpdater(2)
      this.setState({
        applicationSubmitted: true,
        applicationSubmittedPrompt: true
      })
    }
    console.log(this.props.applicant.applicationStatus)
    console.log(this.props.applicant.choices)

    // check if this applicant already has a draft choice list
    var lst = []
    fetch(studentModuleRootAddress + '/getApplicationChoices', {
      headers: {
        Authorization: `bearer ${this.props.keycloak.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.result) {
          data.result.map(choice => lst.push(choice))
        }
        lst.forEach(element => {
          console.log(element.isSQGranted)
          element.shift = {
            shiftId: element.shiftId,
            shiftName: element.shiftName
          }
          element.version = {
            versionId: element.versionId,
            versionName: element.versionName
          }
          element.groupId = {
            hscGroupId: element.groupId,
            hscGroupName: element.hscGroupName
          }
          element.priority = element.choicePriority
          element.collegeName = element.name
          element.isSQGranted =
            (element.isSQ === false && 'N/A') ||
            (!element.isSQGranted && 'Applied') ||
            (element.isSQGranted === 1 && 'Granted') ||
            (element.isSQGranted === 2 && 'Rejected')
        })
        lst.sort(function (a, b) {
          var keyA = a.priority,
            keyB = b.priority
          if (keyA < keyB) return -1
          if (keyA > keyB) return 1
          return 0
        })
        this.setState({ loading: false })
        this.setState({ choices: lst })
        const selectedEIINList = []

        for (let index = 0; index < this.state.choices.length; index++) {
          selectedEIINList.push(this.state.choices[index].eiin)
        }

        const selectedEIINListUnique = [...new Set(selectedEIINList)]
        this.setState({
          selectedEIINList: selectedEIINListUnique,
          selectedEIINCount: selectedEIINListUnique.length
        })
        if (selectedEIINListUnique.length >= 5)
          this.setState({ eligibilityOfSubmission: 'Yes' })
      })
  }

  handleUpdateButtonPressed () {
    console.log('Pressed')
    this.setState({ redirectToUpdateApplication: true })
  }

  handleSubmitButtonPressed () {
    var choicesJSON = []
    for (let index = 0; index < this.state.choices.length; index++) {
      const choice = this.state.choices[index]
      var newChoiceJSON = {
        EIIN: choice.eiin,
        shift: choice.shift.shiftId,
        version: choice.version.versionId,
        group: choice.groupId.hscGroupId,
        priority: choice.priority
      }
      choicesJSON.push(newChoiceJSON)
    }

    console.log(choicesJSON)
    this.setState({ showSubmitConfirmationMsg: true })
  }

  submitApplicationSuccessMessageAcceptedButtonPressed () {
    console.log('Pressed')
    this.setState({ applicationSubmittedPrompt: false })
  }

  submitCancelButtonPressed () {
    this.setState({ showSubmitConfirmationMsg: false })
  }

  submitConfirmButtonPressed () {
    this.setState({
      showPaymentRedirectionMsg: true,
      showSubmitConfirmationMsg: false
    })
    this.demoPaymentButton()
  }

  demoPaymentButton () {
    var formBody = []
    for (var property in gwprocessParameters) {
      var encodedKey = encodeURIComponent(property)
      var encodedValue = ''
      console.log(this.props.applicant.crvsId)
      if (property === 'tran_id')
        encodedValue = encodeURIComponent(
          this.props.keycloak.tokenParsed.CRVSID
        )
      else encodedValue = encodeURIComponent(gwprocessParameters[property])
      formBody.push(encodedKey + '=' + encodedValue)
    }
    formBody = formBody.join('&')

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

  changeLanguage () {
    i18n.changeLanguage('bn')
    //window.location.reload();
  }

  render () {
    if (this.state.gatewayRedirect)
      return (
        <Route render={() => (window.location = this.state.gatewayPageURL)} />
      )
    const options = {
      filter: true,
      filterType: 'dropdown',
      selectableRows: false,
      print: false
    }
    const tableColumns = [
      {
        name: 'priority',
        label: i18n.t('Priority'),
        options: {
          filter: false,
          sort: true
        }
      },
      {
        name: 'eiin',
        label: 'COLLEGE EIIN',
        options: {
          filter: true,
          sort: true
        }
      },
      {
        name: 'name',
        label: i18n.t('CollegeName'),
        options: {
          filter: true,
          sort: true
        }
      },
      {
        name: 'shiftName',
        label: i18n.t('Shift'),
        options: {
          filter: true,
          sort: true
        }
      },

      {
        name: 'versionName',
        label: i18n.t('Version'),
        options: {
          filter: true,
          sort: true
        }
      },
      {
        name: 'hscGroupName',
        label: i18n.t('Group'),
        options: {
          filter: true,
          sort: true
        }
      },
      {
        name: 'isSQGranted',
        label: i18n.t('SQStatus'),
        options: {
          filter: true,
          sort: true
        }
      }
    ]

    return (
      (this.state.redirectToUpdateApplication && (
        <Redirect to={Routes.studentUser.Application.SubmitApplication.path} />
      )) || (
        <>
          {/*<Button onClick={this.changeLanguage}>Change Language</Button>*/}

          <Dialog
            open={this.state.showSubmitConfirmationMsg}
            onClose={this.submitCancelButtonPressed}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle className='dialoge-text'>{'Attention!'}</DialogTitle>
            <DialogContent>
              <DialogContentText className='dialoge-text'>
                Do your really want to submit your currectly saved choices? Once
                submitted, you can not modify your application.
              </DialogContentText>
            </DialogContent>
            <DialogActions className='dialoge-text'>
              <Button
                onClick={this.submitCancelButtonPressed}
                color='secondary'
                autoFocus
              >
                Cancel
              </Button>
              <Button
                onClick={this.submitConfirmButtonPressed}
                color='primary'
                autoFocus
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={this.state.showPaymentRedirectionMsg}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle className='dialoge-text'>{'Attention!'}</DialogTitle>
            <DialogContent>
              <DialogContentText className='dialoge-text'>
                Please be patient. You will be redirected to Payment Gateway.
              </DialogContentText>
            </DialogContent>
            <DialogActions className='dialoge-text'></DialogActions>
          </Dialog>

          <Dialog
            open={this.state.applicationSubmittedPrompt}
            onClose={this.submitApplicationSuccessMessageAcceptedButtonPressed}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle className='dialoge-text'>{'Attention!'}</DialogTitle>
            <DialogContent>
              <DialogContentText className='dialoge-text'>
                You have successfully submitted your College Application
                Choices. Press OK to view your submitted Application Choices.
              </DialogContentText>
            </DialogContent>
            <DialogActions
              className='dialoge-text'
              style={{ justifyContent: 'center', marginBottom: '20px' }}
            >
              <Button
                onClick={
                  this.submitApplicationSuccessMessageAcceptedButtonPressed
                }
                color='primary'
                autoFocus
                variant='contained'
              >
                OK
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
                <Breadcrumb.Item active>View Application</Breadcrumb.Item>
              </Breadcrumb>
              {/* <h4 style={{ textAlign: "center", marginLeft: "-12px" }}>
                            {this.props.applicant.applicationStatus >= 2 && i18n.t('Submitted') || i18n.t('Draft')}
                        </h4>
                        <div class="col d-flex justify-content-center">
                            <div>
                                <Card style={{ alignContent: "center", display: "flex", position: "center", backgroundColor: "#f5f8fc", border: "0", marginTop: "-5px" }}>
                                    <Card.Header style={{ textAlign: "center" }}>
                                        <h6 style={{ display: "inline" }}>Choice List of </h6>
                                        <h5 style={{ display: "inline" }}><b>{this.props.keycloak.tokenParsed.name}</b></h5>
                                    </Card.Header>
                                </Card>
                            </div>
                        </div> */}
              <div
                class='col d-flex justify-content-center choice-table-view'
                style={{ paddingTop: '20px' }}
              >
                <Card
                  style={{
                    width: '1600px',
                    alignContent: 'center',
                    display: 'flex',
                    position: 'center',
                    backgroundColor: '#f5f8fc',
                    border: '0'
                  }}
                >
                  {//this.props.applicant.applicationStatus < 2 &&
                  this.props.applicant.applicationStatus <=
                    CADApplicationStatuses.Submitted && (
                    <Card.Body>
                      <div class='row veiw-application'>
                        <div class='col-sm-6 col-md-6 col-33-pct'>
                          <h7>
                            Min EIIN Required: {this.state.minimumEIINCount}
                          </h7>
                        </div>

                        <div class='col-sm-6 col-md-6 col-33-pct'>
                          <h7>
                            Max EIIN Allowed: {this.state.maximumEIINCount}
                          </h7>
                        </div>

                        <div class='col-sm-6 col-md-6 col-33-pct'>
                          <h7>
                            Selected EIIN Count: {this.state.selectedEIINCount}
                          </h7>
                        </div>
                      </div>
                    </Card.Body>
                  )}
                </Card>
              </div>

              <div
                class='col d-flex justify-content-center'
                style={{ paddingTop: '20px' }}
              >
                <Card
                  style={{
                    width: '98%',
                    alignContent: 'center',
                    position: 'center',
                    border: '1'
                  }}
                >
                  <Card.Header>
                    <div className='row'>
                      <div className='col-6'>
                        <h6 style={{ display: 'inline' }}>
                          Submitted Choice List of{' '}
                        </h6>
                        <h5 style={{ display: 'inline' }}>
                          <b>{this.props.keycloak.tokenParsed.name}</b>
                        </h5>
                      </div>
                      <div className='col-6' style={{ textAlign: 'right' }}>
                        <Button
                          onClick={this.handleUpdateButtonPressed}
                          variant='contained'
                          color='primary'
                          size='medium'
                          disabled={false}
                          startIcon={<SaveIcon />}
                        >
                          Update Application
                        </Button>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    {console.log(this.state.selectedEIINCount)}

                    {this.state.loading && (
                      <div style={{ textAlign: 'center' }}>
                        <LoaderProvider indicator={<Bars width='50' />}>
                          <Loader />
                        </LoaderProvider>
                      </div>
                    )}
                    {this.state.selectedEIINCount > 0 && (
                      <div class='muidatatable-update-sq'>
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                          <MUIDataTable
                            data={this.state.choices}
                            columns={tableColumns}
                            options={options}
                          />
                        </MuiThemeProvider>
                      </div>
                    )}
                    {!this.state.loading && this.state.selectedEIINCount === 0 && (
                      <div style={{ textAlign: 'center' }}>
                        <h5>
                          You Have Not Saved/Submitted Your Choices. Click{' '}
                          <a
                            href={
                              Routes.studentUser.Application.SubmitApplication
                                .path
                            }
                          >
                            Here
                          </a>{' '}
                          or Navigate To "Make Application" to Apply.
                        </h5>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </div>
              {
                // this.state.selectedEIINCount > 0 && !this.state.applicationSubmitted && this.props.applicant.applicationStatus < 2 &&
                // <div class="row">
                //     <div class="col-12 col-md-6" style={{ paddingTop: "20px", textAlign: "center" }}>
                //         <Button
                //             onClick={this.handleUpdateButtonPressed}
                //             variant="contained"
                //             color="primary"
                //             size="medium"
                //             disabled={false}
                //             startIcon={<SaveIcon />}
                //         >
                //             Update Application
                //         </Button>
                //     </div>
                /* <div class="col-xm-12 col-md-6" style={{ paddingTop: "20px", textAlign: "center" }}>
                                    <Tooltip title="Delete">
                                        <Button
                                            onClick={this.handleSubmitButtonPressed}
                                            variant="contained"
                                            color="primary"
                                            size="medium"
                                            disabled={(this.state.eligibilityOfSubmission === 'No' && true) || false}
                                            startIcon={<SaveIcon />}

                                        >
                                            Submit Application
                                        </Button>
                                    </Tooltip>
                                </div> */
                //</div>
              }
            </div>
          </div>
        </>
      )
    )
  }
}

export default ViewApplication