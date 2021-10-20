import React, { useState } from 'react'

import { Grid, Container, Button } from '@material-ui/core'
import 'date-fns'
import { makeStyles } from '@material-ui/styles'

import { DateComponent, TimeComponent } from './DataTimeComponent'
import AddIcon from '@mui/icons-material/Add'
import DoneOutlineRoundedIcon from '@mui/icons-material/DoneOutlineRounded'
import CancelIcon from '@mui/icons-material/Cancel'

import Fab from '@mui/material/Fab'
import { Collapse, Dialog, DialogTitle } from '@mui/material'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import produce from 'immer'

const useStyles = makeStyles({
  // disabled: {
  //   '& .MuiButtonBase-root.Mui-disabled': {
  //     backgroundColor: 'red'
  //   },
  //   '& .Mui-disabled': {
  //     backgroundColor: 'red'
  //   }
  // },
  fab: {
    '&$disabled': {
      backgroundColor: 'red'
    }
  },
  disabled: {},
  keyboardPicker: {
    '& label.Mui-focused': {
      color: '#17A5CE',
      padding: '2px 10px 0px 10px',
      letterSpacing: '.9px',
      // backgroundColor: 'red',
      // position: 'relative',
      // width: '80px'
      top: '-5px',

      // color: "red",
      backgroundColor: 'white'
    },

    '& .MuiInputBase-input': {
      padding: '6px 17px'
      //   width: '100%'
    },
    '& .MuiOutlinedInput-root': {
      // color: "#17A5CE",
      // - The Input-root, inside the TextField-root
      '& fieldset': {
        // - The <fieldset> inside the Input-root
        // borderColor: "pink", // - Set the Input border
      },
      '&:hover fieldset': {
        // borderColor: "yellow", // - Set the Input border when parent has :hover
      },
      '&.Mui-focused fieldset': {
        // - Set the Input border when parent is focused
        // borderColor: "green",
        border: '1px solid #C7C7C7'
      }
    }
  }
})

// .MuiOutlinedInput-input

const defaultPhase = {
  accepting: {
    startDate: new Date(),
    endDate: new Date()
  },
  migration: {
    date: new Date()
  },
  confirmation: {
    startDate: new Date(),
    endDate: new Date()
  }
}
const PhaseComponent = ({ setPhasesState, phasesState }) => {
  const tasks = [
    { title: 'Accepting Applications' },
    { title: 'Migration result publishing' },
    { title: 'Selecttion confirmatin by aplicant' }
  ]
  const classes = useStyles()
  const phases = [1, 2]
  const [id, setId] = React.useState(2)
  const [openDialog, setOpenDialog] = useState(true)
  const handleChange = id => {
    setId(id)
  }

  const handleChangeDateTime = (i, key1, key2, val) => {
    setPhasesState(
      produce(draft => {
        draft[i][key1][key2] = val
      })
    )
  }
  const addPhase = () => {
    setPhasesState(
      produce(draft => {
        draft.push(defaultPhase)
      })
    )
  }

  return (
    <>
      {phasesState.map((phase, i) => (
        <Container
          // key={phase.title}
          style={{
            border: '1px solid #c7c7c7',
            borderRadius: '7px',
            marginLeft: '-10px'
          }}
        >
          <div
            className='d-flex justify-content-around mt-3 p-2 align-items-center'
            style={{ backgroundColor: '#fff' }}
          >
            <h5
              className='d-inline-block'
              style={{ color: 'rgba(74, 72, 72, 1)' }}
            >
              Phases {i + 1}{' '}
            </h5>
            {id !== i ? (
              <Fab
                // disabled
                onClick={e => {
                  if (id === i) {
                    setId(null)
                  } else setId(i)
                }}
                sx={{
                  backgroundColor: 'white',
                  boxShadow: 'none',
                  top: '-5px'
                  // alignItems: 'flex-start'
                }}
                style={{
                  marginLeft: 'auto',
                  display: 'inline-block'
                  // paddingBottom: '20px'
                }}
                size='small'
              >
                <KeyboardArrowDownIcon

                // style={{ width: '0.88em', height: '0.88em' }}
                />
              </Fab>
            ) : (
              <Fab
                className={classes.disabled}
                onClick={e => {
                  if (id === i) {
                    setId(null)
                  } else setId(i)
                }}
                sx={{
                  backgroundColor: 'white',
                  boxShadow: 'none',
                  top: '-5px'
                }}
                style={{ marginLeft: 'auto', display: 'inline-block' }}
                size='small'
              >
                <KeyboardArrowUpIcon
                  className={classes.disabled}

                  // style={{ width: '0.88em', height: '0.88em' }}
                />
              </Fab>
            )}
          </div>
          <Collapse
            // collapsedSize='large'
            in={i === id}
            className={classes.collapseStyle}
          >
            {/* {tasks.map((task, j) => ( */}
            {/* Task 1 */}
            <>
              <span
                className='h5'
                style={{
                  marginLeft: '15px',
                  color: 'rgba(74, 72, 72, .8)'
                }}
              >
                Task 1:{' '}
              </span>

              <span style={{ color: '#17A5CE', marginLeft: '15px' }}>
                Accepting Applications
              </span>
              <Container
                fluid='true'
                style={{
                  padding: '20px 50px 15px 50px',
                  margin: '10px 0px 10px 0px',
                  borderBottom: '1px solid #c7c7c7'
                }}
              >
                <Grid fluid='true' container spacing={1} style={{ gap: 6 }}>
                  <Grid
                    item
                    sm={7}
                    xs={12}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <DateComponent
                      name='Start Date'
                      value={phase.accepting.startDate}
                      handleChange={val =>
                        handleChangeDateTime(i, 'accepting', 'startDate', val)
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    sm={4}
                    xs={12}
                    style={{ display: 'flex', justifyContent: 'flex-start' }}
                  >
                    <TimeComponent
                      value={phase.accepting.startDate}
                      handleChange={val =>
                        handleChangeDateTime(i, 'accepting', 'startDate', val)
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    sm={7}
                    xs={5}
                    style={{ textAlign: 'right', marginLeft: '15px' }}
                  >
                    To
                  </Grid>

                  <Grid
                    item
                    sm={7}
                    xs={12}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <DateComponent
                      name='End Date'
                      value={phase.accepting.endDate}
                      handleChange={val =>
                        handleChangeDateTime(i, 'accepting', 'endDate', val)
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    sm={4}
                    xs={12}
                    style={{ display: 'flex', justifyContent: 'flex-start' }}
                  >
                    <TimeComponent
                      value={phase.accepting.endDate}
                      handleChange={val =>
                        handleChangeDateTime(i, 'accepting', 'endDate', val)
                      }
                    />
                  </Grid>
                </Grid>
              </Container>
            </>
            {/* Task 2 */}
            <>
              <span
                className='h5'
                style={{
                  marginLeft: '15px',
                  color: 'rgba(74, 72, 72, .8)'
                }}
              >
                Task 2:{' '}
              </span>

              <span style={{ color: '#17A5CE', marginLeft: '15px' }}>
                Migration result publishing
              </span>
              <Container
                fluid='true'
                style={{
                  padding: '20px 50px 15px 50px',

                  margin: '10px 0px 10px 0px',
                  borderBottom: '1px solid #c7c7c7'
                }}
              >
                <Grid fluid='true' container spacing={1} style={{ gap: 6 }}>
                  <Grid
                    item
                    sm={7}
                    xs={12}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <DateComponent
                      name='Date'
                      value={phase.migration.date}
                      handleChange={val =>
                        handleChangeDateTime(i, 'migration', 'date', val)
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    sm={4}
                    xs={12}
                    style={{ display: 'flex', justifyContent: 'flex-start' }}
                  >
                    <TimeComponent
                      value={phase.migration.date}
                      handleChange={val =>
                        handleChangeDateTime(i, 'migration', 'date', val)
                      }
                    />
                  </Grid>
                </Grid>
              </Container>
            </>
            {/* Task 3 */}
            <>
              <span
                className='h5'
                style={{
                  marginLeft: '15px',
                  color: 'rgba(74, 72, 72, .8)'
                  // color: '#fff'
                }}
              >
                Task 3:{' '}
              </span>

              <span style={{ color: '#17A5CE', marginLeft: '15px' }}>
                Selection confirmation by applicant
              </span>
              <Container
                fluid='true'
                style={{
                  padding: '20px 50px 15px 50px',
                  margin: '10px 0px 10px 0px'
                  // borderBottom: '1px solid #c7c7c7'
                }}
              >
                <Grid fluid='true' container spacing={1} style={{ gap: 6 }}>
                  <Grid
                    item
                    sm={7}
                    xs={12}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <DateComponent
                      name='Start Date'
                      value={phase.confirmation.startDate}
                      handleChange={val =>
                        handleChangeDateTime(
                          i,
                          'confirmation',
                          'startDate',
                          val
                        )
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    sm={4}
                    xs={12}
                    style={{ display: 'flex', justifyContent: 'flex-start' }}
                  >
                    <TimeComponent
                      value={phase.confirmation.startDate}
                      handleChange={val =>
                        handleChangeDateTime(
                          i,
                          'confirmation',
                          'startDate',
                          val
                        )
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    sm={7}
                    xs={5}
                    style={{ textAlign: 'right', marginLeft: '15px' }}
                  >
                    To
                  </Grid>

                  <Grid
                    item
                    sm={7}
                    xs={12}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <DateComponent
                      name='End Date'
                      value={phase.confirmation.endDate}
                      handleChange={val =>
                        handleChangeDateTime(i, 'confirmation', 'endDate', val)
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    sm={4}
                    xs={12}
                    style={{ display: 'flex', justifyContent: 'flex-start' }}
                  >
                    <TimeComponent
                      value={phase.confirmation.endDate}
                      handleChange={val =>
                        handleChangeDateTime(i, 'confirmation', 'endDate', val)
                      }
                    />
                  </Grid>
                </Grid>
              </Container>
            </>
            {/* ))} */}
          </Collapse>
        </Container>
      ))}
      <Button
        className='text-capitalize'
        startIcon={<AddIcon />}
        // color='primary'
        style={{
          color: '#17A5CE',

          marginTop: '20px',
          marginLeft: '-10px',
          border: '1.5px solid #17A5CE',
          letterSpacing: '.75px',
          fontWeight: '700'
        }}
        variant='outlined'
        // onClick={() => setOpenDialog(true)}
        onClick={() => {
          addPhase()
        }}
      >
        Add another Phase
      </Button>
    </>
  )
}

export default PhaseComponent