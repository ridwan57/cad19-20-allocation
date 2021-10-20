/* eslint-disable react/prop-types */
import React from 'react'
// import DateFnsUtils from '@date-io/date-fns'
// import { makeStyles } from '@material-ui/core'
import TextField from '@mui/material/TextField'

import 'date-fns'


import TimePicker from '@mui/lab/TimePicker'
import DesktopDatePicker from '@mui/lab/DesktopDatePicker'


const DateComponent = ({ name, handleChange, value }) => {
	// const classes = useStyles()
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
					style={{ maxWidth: '300px' }}
					focused
					fullWidth
				/>
			)}
		/>
	)
}
const TimeComponent = ({ handleChange, value }) => {
	// const classes = useStyles()

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
					// className={classes.keyboardPicker}
					style={{ maxWidth: '300px' }}
					focused
					fullWidth
				/>
			)}
		/>
	)
}
export { DateComponent, TimeComponent }