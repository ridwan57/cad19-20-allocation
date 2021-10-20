/* eslint-disable react/prop-types */
import React  from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Container, Button } from '@material-ui/core'
import 'date-fns'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'

import { DateComponent, TimeComponent } from './DataTimeComponent'
import AddIcon from '@mui/icons-material/Add'

import Fab from '@mui/material/Fab'
import { Collapse } from '@mui/material'

// import ExpandMoreIcon from '@mui/icons-material/KeyboardArrowDown'
// import ExpandLessIcon from '@mui/icons-material/KeyboardArrowUp'

import produce from 'immer'


const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		'& .MuiOutlinedInput-root': {
			'& fieldset': {
				borderRadius: '10px 10px 10px 10px',
			},
		},
	},
	button: {
		marginTop: theme.spacing(1),
		marginRight: theme.spacing(1),
	},
	actionsContainer: {
		marginBottom: theme.spacing(2),
	},
	resetContainer: {
		padding: theme.spacing(3),
	},
}))
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
	const classes = useStyles()

	const [id, setId] = React.useState(2)

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
					key={i}
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
								onClick={() => {
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
								<ExpandMoreIcon

									// style={{ width: '0.88em', height: '0.88em' }}
								/>
							</Fab>
						) : (
							<Fab
								// className={classes.disabled}
								onClick={() => {
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
								<ExpandLessIcon
							
								/>
							</Fab>
						)}
					</div>
					<Collapse
				
						in={i === id}
	
					>
					
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

							<span style={{ marginLeft: '15px' }}>
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

							<span style={{marginLeft: '15px' }}>
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

							<span style={{ marginLeft: '15px' }}>
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
				color='primary'
				style={{
			

					marginTop: '20px',
					marginLeft: '-10px',
					// border: '1.5px solid #17A5CE',
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