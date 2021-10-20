import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import 'date-fns'
import Grid from '@material-ui/core/Grid'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from '@material-ui/pickers'

import '../../styles/board-styling.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { Breadcrumb, Card } from '@themesberg/react-bootstrap'

import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import AddIcon from '@material-ui/icons/Add'

import moment from 'moment'

import {
  boardModuleRootAddress,
  defaultPhaseData,
  defaultScheduleData,
  scheduleStatuses
} from '../../data/constants'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: `10px 10px 10px 10px`
      }
    }
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  }
}))

export default function VerticalLinearStepper (props) {
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(0)
  const steps = getSteps()

  const [scheduleStatus, setScheduleStatus] = useState(0)

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const savePhaseData = () => {
    let scheduleArrayToSubmit = []
    initialPhaseData.forEach(schedule => {
      schedule.startDateTime =
        moment(schedule.date).format('yyyy-MM-DD') +
        ' ' +
        moment(schedule.time).format('HH:mm:ss')
      schedule.endDateTime = schedule.startDateTime
      scheduleArrayToSubmit.push(schedule)
    })
    phaseTaskData.forEach(phase => {
      phase.forEach(taskData => {
        if (taskData.sameStartEnd) {
          taskData.startDateTime =
            moment(taskData.startDate).format('yyyy-MM-DD') +
            ' ' +
            moment(taskData.startTime).format('HH:mm:ss')
          taskData.endDateTime = taskData.startDateTime
          scheduleArrayToSubmit.push(taskData)
        } else {
          taskData.startDateTime =
            moment(taskData.startDate).format('yyyy-MM-DD') +
            ' ' +
            moment(taskData.startTime).format('HH:mm:ss')
          taskData.endDateTime =
            moment(taskData.endDate).format('yyyy-MM-DD') +
            ' ' +
            moment(taskData.endTime).format('HH:mm:ss')
          scheduleArrayToSubmit.push(taskData)
        }
      })
    })
    console.log(scheduleArrayToSubmit)

    fetch(boardModuleRootAddress + '/updateScheduleData/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.keycloak.token}`
        //   //Accept: 'application/json'
      },
      body: JSON.stringify({
        data: scheduleArrayToSubmit
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Successfully updated schedule data') {
          console.log(data)
          setScheduleStatus(scheduleStatuses.validState)
          setActiveStep(0)
          setSavePrompt(false)
        }
      })
  }
  const [dates, setUpdatedDates] = useState(defaultScheduleData)

  const updateDates = (date, dateIndex) => {
    setUpdatedDates(prevDates => ({
      ...prevDates,
      [dateIndex]: date
    }))
  }

  const [times, setUpdatedTimes] = useState(defaultScheduleData)

  const updateTimes = (time, timeIndex) => {
    setUpdatedTimes(prevTimes => ({
      ...prevTimes,
      [timeIndex]: time
    }))
  }

  const [tasks, setUpdatedTasks] = useState(defaultPhaseData)

  const updateTasks = (data, field, index) => {}

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  function getSteps () {
    return [
      'Time Table for Data Synchronization',
      'Phases of Application Processing'
    ]
  }

  const [initialPhaseData, setInitialPhaseData] = useState([])
  const [phaseTaskData, setPhaseTaskData] = useState([])

  const updateInitialPhaseData = (dateTime, index, key) => {
    let updatedData = [...initialPhaseData]
    updatedData[index][key] = dateTime
    console.log(updatedData)
    setInitialPhaseData(updatedData)
  }

  const updatePhaseTaskData = (
    dateTime,
    phaseIndex,
    indexPhaseData,
    key1,
    key2
  ) => {
    let updatedPhaseTaskData = [...phaseTaskData]
    updatedPhaseTaskData[phaseIndex][indexPhaseData][key1] = dateTime
    if (key2) updatedPhaseTaskData[phaseIndex][indexPhaseData][key2] = dateTime
    console.log(updatedPhaseTaskData)
    setPhaseTaskData(updatedPhaseTaskData)
  }

  const [phaseCount, setPhaseCount] = useState(1)

  const fetchPhaseData = () => {
    console.log('fetching Data')
    fetch(boardModuleRootAddress + '/getScheduleData/0', {
      headers: {
        Authorization: `bearer ${props.keycloak.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.result)
        data.result.forEach(schedule => {
          if (moment(schedule.startDateTime).format('YYYY') === '1900') {
            schedule.date = null
            schedule.time = moment('2021-09-07T08:00:00+06:00')
          } else {
            schedule.date = schedule.startDateTime
            schedule.time = schedule.startDateTime
          }
        })
        setInitialPhaseData(data.result)
        fetch(boardModuleRootAddress + '/getPhaseCount', {
          headers: {
            Authorization: `bearer ${props.keycloak.token}`
          }
        })
          .then(response => response.json())
          .then(data => {
            setPhaseCount(parseInt(data.result))
            //fetchPhaseData(parseInt(data.result));
            let fetchedPhaseTaskData = []
            for (let phase = 1; phase < parseInt(data.result); phase++) {
              fetch(boardModuleRootAddress + '/getScheduleData/' + phase, {
                headers: {
                  Authorization: `bearer ${props.keycloak.token}`
                }
              })
                .then(response => response.json())
                .then(data => {
                  console.log(phase)
                  //console.log(data.result);
                  data.result.forEach(schedule => {
                    if (schedule.startDateTime === schedule.endDateTime)
                      schedule.sameStartEnd = true
                    if (
                      moment(schedule.startDateTime).format('YYYY') === '1900'
                    ) {
                      schedule.startDate = null
                      schedule.startTime = moment('2021-09-07T08:00:00+06:00')
                      schedule.endDate = null
                      schedule.endTime = moment('2021-09-07T23:59:00+06:00')
                    } else {
                      schedule.startDate = schedule.startDateTime
                      schedule.startTime = schedule.startDateTime
                      schedule.endDate = schedule.endDateTime
                      schedule.endTime = schedule.endDateTime
                    }
                  })
                  fetchedPhaseTaskData.push(data.result)
                  console.log(fetchedPhaseTaskData)
                  setPhaseTaskData(fetchedPhaseTaskData)
                })
            }
          })
      })

    //if (scheduleStatus === scheduleStatuses.resetState) setScheduleStatus(2);
  }
  const createButtonPressed = () => {
    fetchPhaseData()
    setScheduleStatus(2)
  }

  const resetSchedule = () => {
    fetch(boardModuleRootAddress + '/resetSchedule', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${props.keycloak.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Success') {
          setScheduleStatus(scheduleStatuses.resetState)
          handleReset()
        }
      })
  }

  const addNewPhase = newPhaseData => {
    let addedPhaseData = [...newPhaseData]
    addedPhaseData.forEach(task => {
      task.startDate = null
      task.endDate = null
      task.startTime = null
      task.endTime = null
      task.phase += 1
    })
    let updatedPhaseTaskData = [...phaseTaskData]
    updatedPhaseTaskData.push(addedPhaseData)
    console.log(addedPhaseData)
    console.log(updatedPhaseTaskData)
    setPhaseTaskData(updatePhaseTaskData)
  }

  useEffect(() => {
    fetch(boardModuleRootAddress + '/getScheduleStatus', {
      headers: {
        Authorization: `bearer ${props.keycloak.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setScheduleStatus(parseInt(data.result))
        if (parseInt(data.result) === scheduleStatuses.validState) {
          console.log(parseInt(data.result))
          fetchPhaseData()
        }
      })
  }, [])

  const [savePrompt, setSavePrompt] = useState(false)

  function getStepContent (step) {
    switch (step) {
      case 0:
        return (
          <div>
            {initialPhaseData.map((schedule, index) => (
              <div className='row'>
                <div className='col-4 scheduling-title'>
                  {schedule['displayDescription']}
                </div>
                <div className='col-4'>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justifycontent='space-around'>
                      <KeyboardDatePicker
                        //disableToolbar
                        //variant="inline"
                        inputVariant='outlined'
                        format='MM/dd/yyyy'
                        margin='normal'
                        id='date-picker-inline'
                        label='Date'
                        placeholder={'Enter a Date'}
                        value={schedule['date']}
                        onChange={date =>
                          updateInitialPhaseData(date, index, 'date')
                        }
                        KeyboardButtonProps={{
                          'aria-label': 'change date'
                        }}
                        disabled={
                          scheduleStatus === scheduleStatuses.validState
                        }
                        //autoOk={true}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                </div>
                <div className='col-4'>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justifycontent='space-around'>
                      <KeyboardTimePicker
                        //variant="inline"
                        inputVariant='outlined'
                        margin='normal'
                        id='time-picker'
                        label='Time'
                        value={schedule['time']}
                        onChange={time =>
                          updateInitialPhaseData(time, index, 'time')
                        }
                        KeyboardButtonProps={{
                          'aria-label': 'change time'
                        }}
                        keyboardIcon={<AccessTimeIcon />}
                        disabled={
                          scheduleStatus === scheduleStatuses.validState
                        }
                        //autoOk='true'
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                </div>
              </div>
            ))}
          </div>
        )
      case 1:
        return phaseTaskData.map((phase, phaseIndex) => (
          <div>
            <div className='bordered-div'>
              <Accordion defaultExpanded={true}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls='panel1a-content'
                  id='panel1a-header'
                >
                  <Typography className={classes.heading}>
                    <b>Phase {phaseIndex + 1}</b>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography component={'span'} style={{ width: '100%' }}>
                    {phase.map((phaseData, indexPhaseData) => (
                      <div>
                        <hr />
                        {!phaseData.sameStartEnd && (
                          <div className='row'>
                            <div className='col-4 scheduling-title'>
                              {phaseData['displayDescription']}
                            </div>
                            <div className='col-8'>
                              <div className='row'>
                                <div className='col-6'>
                                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid
                                      container
                                      justifycontent='space-around'
                                    >
                                      <KeyboardDatePicker
                                        //disableToolbar
                                        //variant="inline"
                                        inputVariant='outlined'
                                        format='MM/dd/yyyy'
                                        margin='normal'
                                        id='date-picker-inline'
                                        label='Start Date'
                                        placeholder={'Enter a Date'}
                                        value={phaseData['startDate']}
                                        onChange={date =>
                                          updatePhaseTaskData(
                                            date,
                                            phaseIndex,
                                            indexPhaseData,
                                            'startDate',
                                            null
                                          )
                                        }
                                        KeyboardButtonProps={{
                                          'aria-label': 'change date'
                                        }}
                                        disabled={
                                          scheduleStatus ===
                                          scheduleStatuses.validState
                                        }
                                        //autoOk={true}
                                      />
                                    </Grid>
                                  </MuiPickersUtilsProvider>
                                </div>
                                <div className='col-6'>
                                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid
                                      container
                                      justifycontent='space-around'
                                    >
                                      <KeyboardTimePicker
                                        //variant="inline"
                                        inputVariant='outlined'
                                        margin='normal'
                                        id='time-picker'
                                        label='Start Time'
                                        value={phaseData['startTime']}
                                        onChange={time =>
                                          updatePhaseTaskData(
                                            time,
                                            phaseIndex,
                                            indexPhaseData,
                                            'startTime',
                                            null
                                          )
                                        }
                                        KeyboardButtonProps={{
                                          'aria-label': 'change time'
                                        }}
                                        keyboardIcon={<AccessTimeIcon />}
                                        disabled={
                                          scheduleStatus ===
                                          scheduleStatuses.validState
                                        }
                                        //autoOk='true'
                                      />
                                    </Grid>
                                  </MuiPickersUtilsProvider>
                                </div>
                              </div>
                              <div className='row'>
                                <div className='col-6'>
                                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid
                                      container
                                      justifycontent='space-around'
                                    >
                                      <KeyboardDatePicker
                                        //disableToolbar
                                        //variant="inline"
                                        inputVariant='outlined'
                                        format='MM/dd/yyyy'
                                        margin='normal'
                                        id='date-picker-inline'
                                        label='End Date'
                                        placeholder={'Enter a Date'}
                                        value={phaseData['endDate']}
                                        onChange={date =>
                                          updatePhaseTaskData(
                                            date,
                                            phaseIndex,
                                            indexPhaseData,
                                            'endDate',
                                            null
                                          )
                                        }
                                        KeyboardButtonProps={{
                                          'aria-label': 'change date'
                                        }}
                                        disabled={
                                          scheduleStatus ===
                                          scheduleStatuses.validState
                                        }
                                        //autoOk={true}
                                      />
                                    </Grid>
                                  </MuiPickersUtilsProvider>
                                </div>
                                <div className='col-6'>
                                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid
                                      container
                                      justifycontent='space-around'
                                    >
                                      <KeyboardTimePicker
                                        //variant="inline"
                                        inputVariant='outlined'
                                        margin='normal'
                                        id='time-picker'
                                        label='End Time'
                                        value={phaseData['endTime']}
                                        onChange={time =>
                                          updatePhaseTaskData(
                                            time,
                                            phaseIndex,
                                            indexPhaseData,
                                            'endTime',
                                            null
                                          )
                                        }
                                        KeyboardButtonProps={{
                                          'aria-label': 'change time'
                                        }}
                                        keyboardIcon={<AccessTimeIcon />}
                                        disabled={
                                          scheduleStatus ===
                                          scheduleStatuses.validState
                                        }
                                        //autoOk='true'
                                      />
                                    </Grid>
                                  </MuiPickersUtilsProvider>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {phaseData.sameStartEnd && (
                          <div className='row'>
                            <div className='col-4 scheduling-title'>
                              {phaseData['displayDescription']}
                            </div>
                            <div className='col-4'>
                              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justifycontent='space-around'>
                                  <KeyboardDatePicker
                                    //disableToolbar
                                    //variant="inline"
                                    inputVariant='outlined'
                                    format='MM/dd/yyyy'
                                    margin='normal'
                                    id='date-picker-inline'
                                    label='Date'
                                    placeholder={'Enter a Date'}
                                    value={phaseData['startDate']}
                                    onChange={date =>
                                      updatePhaseTaskData(
                                        date,
                                        phaseIndex,
                                        indexPhaseData,
                                        'startDate',
                                        'endDate'
                                      )
                                    }
                                    KeyboardButtonProps={{
                                      'aria-label': 'change date'
                                    }}
                                    disabled={
                                      scheduleStatus ===
                                      scheduleStatuses.validState
                                    }
                                    //autoOk={true}
                                  />
                                </Grid>
                              </MuiPickersUtilsProvider>
                            </div>
                            <div className='col-4'>
                              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justifycontent='space-around'>
                                  <KeyboardTimePicker
                                    //variant="inline"
                                    inputVariant='outlined'
                                    margin='normal'
                                    id='time-picker'
                                    label='Time'
                                    value={phaseData['startTime']}
                                    onChange={time =>
                                      updatePhaseTaskData(
                                        time,
                                        phaseIndex,
                                        indexPhaseData,
                                        'startTime',
                                        'endTime'
                                      )
                                    }
                                    KeyboardButtonProps={{
                                      'aria-label': 'change time'
                                    }}
                                    keyboardIcon={<AccessTimeIcon />}
                                    disabled={
                                      scheduleStatus ===
                                      scheduleStatuses.validState
                                    }
                                    //autoOk='true'
                                  />
                                </Grid>
                              </MuiPickersUtilsProvider>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        ))
      case 2:
        return `Try out different ad text to see what brings in the most customers,
                and learn how to enhance your ads using features like ad extensions.
                If you run into any problems with your ads, find out how to tell if
                they're running and how to resolve approval issues.`
      default:
        return 'Unknown step'
    }
  }

  if (scheduleStatus === scheduleStatuses.resetState) {
    // no schedule is created
    // show create new schedule option
    return (
      <>
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
              <Breadcrumb.Item>Configuration</Breadcrumb.Item>
              <Breadcrumb.Item active>Scheduling</Breadcrumb.Item>
            </Breadcrumb>

            <div className='col d-flex justify-content-center scheduling'>
              <Card>
                <Card.Body>
                  <div className='row'>
                    <div className='col-6'>
                      <h5>Schedule has not yet been created. </h5>
                    </div>
                    <div className='col-6' style={{ textAlign: 'right' }}>
                      <Button
                        onClick={createButtonPressed}
                        variant='contained'
                        color='primary'
                        size='medium'
                      >
                        Create Schedule
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (
    scheduleStatus === scheduleStatuses.createNewSchedule ||
    scheduleStatus === scheduleStatuses.validState ||
    scheduleStatus === scheduleStatuses.editState
  ) {
    return (
      <>
        <Dialog
          open={savePrompt}
          onClose={() => setSavePrompt(false)}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle className='dialoge-text'>{'Attention!'}</DialogTitle>
          <DialogContent>
            <DialogContentText className='dialoge-text'>
              Do your really want to{' '}
              {scheduleStatus === scheduleStatuses.editState
                ? 'update'
                : 'save'}{' '}
              the schedule data?
            </DialogContentText>
          </DialogContent>
          <DialogActions
            className='dialoge-text'
            style={{ justifyContent: 'center', marginBottom: '20px' }}
          >
            <Button
              onClick={() => setSavePrompt(false)}
              color='secondary'
              variant='contained'
              autoFocus
            >
              No
            </Button>
            <Button
              onClick={savePhaseData}
              color='primary'
              variant='contained'
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        {/* <Dialog
                    open={saveSuccess}
                    onClose={() => setSaveSuccess(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle className="dialoge-text">{"Attention!"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText className="dialoge-text">
                            
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions className="dialoge-text">
                        <Button onClick={savePhaseData} color="primary" autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog> */}

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
              <Breadcrumb.Item>Configuration</Breadcrumb.Item>
              <Breadcrumb.Item active>Scheduling</Breadcrumb.Item>
              <Breadcrumb.Item active>
                {scheduleStatus === scheduleStatuses.createNewSchedule &&
                  'Create Schedule'}
                {scheduleStatus === scheduleStatuses.validState &&
                  'Scheduling Details'}
                {scheduleStatus === scheduleStatuses.editState &&
                  'Edit Schedule'}
              </Breadcrumb.Item>
            </Breadcrumb>

            <div className='col d-flex justify-content-center scheduling'>
              <Card>
                <Card.Header>
                  <div className='row'>
                    <div className='col-6'>
                      <h5 style={{}}>
                        {scheduleStatus ===
                          scheduleStatuses.createNewSchedule &&
                          'Create Schedule'}
                        {scheduleStatus === scheduleStatuses.validState &&
                          'Scheduling Details'}
                        {scheduleStatus === scheduleStatuses.editState &&
                          'Edit Schedule'}
                      </h5>
                    </div>
                    {scheduleStatus === scheduleStatuses.validState && (
                      <div className='col-6' style={{ textAlign: 'right' }}>
                        <Button
                          onClick={() =>
                            setScheduleStatus(scheduleStatuses.editState)
                          }
                          className={classes.button}
                          variant='contained'
                          color='primary'
                        >
                          Edit
                        </Button>
                        &nbsp;
                        <Button
                          onClick={resetSchedule}
                          className={classes.button}
                          variant='contained'
                          color='primary'
                        >
                          Reset
                        </Button>
                      </div>
                    )}
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className={classes.root}>
                    <Stepper activeStep={activeStep} orientation='vertical'>
                      {steps.map((label, index) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                          <StepContent>
                            <Typography component={'span'} variant={'body2'}>
                              {getStepContent(index)}
                            </Typography>
                            <div className={classes.actionsContainer}>
                              {/* {
                                                                (activeStep === steps.length - 1 && (scheduleStatus === scheduleStatuses.createNewSchedule || scheduleStatus === scheduleStatuses.editState)) &&
                                                                <div>
                                                                    <Button
                                                                        onClick={() => addNewPhase(phaseTaskData[phaseTaskData.length - 1])}
                                                                        variant="contained"
                                                                        color="primary"
                                                                        size="medium"
                                                                        startIcon={<AddIcon />}
                                                                    >
                                                                        Add New Phase
                                                                    </Button>
                                                                    <br />
                                                                </div>
                                                            } */}
                              <div>
                                <Button
                                  disabled={activeStep === 0}
                                  onClick={handleBack}
                                  className={classes.button}
                                  variant='contained'
                                  //color="primary"
                                >
                                  Back
                                </Button>
                                {activeStep === steps.length - 2 && (
                                  <Button
                                    variant='contained'
                                    color='primary'
                                    onClick={handleNext}
                                    className={classes.button}
                                  >
                                    Next
                                    {/* {activeStep === steps.length - 1 ? 'Finish' : 'Next'} */}
                                  </Button>
                                )}

                                {(scheduleStatus ===
                                  scheduleStatuses.createNewSchedule ||
                                  scheduleStatus ===
                                    scheduleStatuses.editState) &&
                                  activeStep === steps.length - 1 && (
                                    <Button
                                      variant='contained'
                                      color='primary'
                                      onClick={handleNext}
                                      className={classes.button}
                                    >
                                      Finish
                                      {/* {activeStep === steps.length - 1 ? 'Finish' : 'Next'} */}
                                    </Button>
                                  )}

                                {(scheduleStatus ===
                                  scheduleStatuses.createNewSchedule ||
                                  scheduleStatus ===
                                    scheduleStatuses.editState) && (
                                  <Button
                                    variant='contained'
                                    color='secondary'
                                    onClick={() => {
                                      if (
                                        scheduleStatus ===
                                        scheduleStatuses.createNewSchedule
                                      ) {
                                        setScheduleStatus(
                                          scheduleStatuses.resetState
                                        )
                                        handleReset()
                                      } else {
                                        setScheduleStatus(
                                          scheduleStatuses.validState
                                        )
                                        handleReset()
                                      }
                                    }}
                                    className={classes.button}
                                  >
                                    Cancel
                                  </Button>
                                )}
                              </div>
                            </div>
                          </StepContent>
                        </Step>
                      ))}
                    </Stepper>
                    {activeStep === steps.length && (
                      <Paper
                        square
                        elevation={0}
                        className={classes.resetContainer}
                      >
                        <Typography>
                          All steps completed - you&apos;re finished
                        </Typography>
                        <Button
                          onClick={handleReset}
                          className={classes.button}
                          variant='contained'
                          color='secondary'
                        >
                          Reset
                        </Button>
                        {(scheduleStatus ===
                          scheduleStatuses.createNewSchedule ||
                          scheduleStatus === scheduleStatuses.editState) && (
                          <Button
                            onClick={() => setSavePrompt(true)}
                            className={classes.button}
                            variant='contained'
                            color='primary'
                          >
                            {scheduleStatus === scheduleStatuses.editState
                              ? 'Update'
                              : 'Save'}
                          </Button>
                        )}
                      </Paper>
                    )}
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