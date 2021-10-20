import React, { useState } from 'react'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from '@material-ui/pickers'
import { Grid, Container } from '@material-ui/core'
import 'date-fns'
import { ColorTextFields } from './TextField'
import { makeStyles } from '@material-ui/styles'

import TextField from '@mui/material/TextField'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import TimePicker from '@mui/lab/TimePicker'
import DateTimePicker from '@mui/lab/DateTimePicker'
import DesktopDatePicker from '@mui/lab/DesktopDatePicker'
import MobileDatePicker from '@mui/lab/MobileDatePicker'

const useStyles = makeStyles({
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

const DateComponent = ({ name, handleChange, value }) => {
  const classes = useStyles()
  return (
    <DesktopDatePicker
      label={name}
      inputFormat='MM/dd/yyyy'
      placeholder='Time'
      value={value}
      onChange={handleChange}
      // className={classes.keyboardPicker}
      focused
      renderInput={params => (
        <TextField
          {...params}
          className={classes.keyboardPicker}
          style={{ maxWidth: '300px' }}
          focused
          fullWidth
        />
      )}
    />
  )
}
const TimeComponent = ({ handleChange, value }) => {
  const classes = useStyles()

  return (
    <TimePicker
      label='Time'
      value={value}
      placeholder='Time'
      onChange={handleChange}
      focused
      // className={classes.keyboardPicker}
      renderInput={params => (
        <TextField
          {...params}
          className={classes.keyboardPicker}
          style={{ maxWidth: '300px' }}
          focused
          fullWidth
        />
      )}
    />
  )
}
export { DateComponent, TimeComponent }
