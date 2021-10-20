// import * as React from "react";
import Box from '@mui/material/Box'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'

import React, { useState } from 'react'

import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
// import "date-fns";


// import 'bootstrap/dist/css/bootstrap.min.css'

import Container from '@mui/material/Container'
import { makeStyles } from '@material-ui/core/styles'

import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import produce from 'immer'
import ResultDataSyncronization from '../../components/NewComponents/ResultDataSyncronization'
import ApplicantsRequirement from '../../components/NewComponents/ApplicantsRequirement'

import PhaseComponent from '../../components/NewComponents/PhaseComponent'
import Quota from '../../components/NewComponents/Quota'




import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'

const initialQuotas = [
	{
		id: 1,
		name: 'Freedom Fighter Quota',
		percentage: 20,
		unSeats: 12,
		priority: 1,
		desc:
      'Lorem ipsum dolor sit amet, populo delicatissimi  interpretaris ea cum. Mutat pertinax assentior ea   eam, ea atqui consul ius. Eum prima debitis ei. Eu est libris regione gubergren, democritum reprimique pri id. Cu qui regione patrioque.',
		q: 'general'
	},
	{
		id: 2,
		name: 'Own Quota',
		percentage: 20,
		unSeats: 12,
		priority: 2,
		desc:
      'Lorem ipsum dolor sit amet, populo delicatissimi  interpretaris ea cum. Mutat pertinax assentior ea   eam, ea atqui consul ius. Eum prima debitis ei. Eu est libris regione gubergren, democritum reprimique pri id. Cu qui regione patrioque.',

		q: 'general'
	},
	{
		id: 3,
		name: 'Special Quota',
		percentage: 5,
		unSeats: 12,
		priority: 4,
		desc:
      'Lorem ipsum dolor sit amet, populo delicatissimi  interpretaris ea cum. Mutat pertinax assentior ea   eam, ea atqui consul ius. Eum prima debitis ei. Eu est libris regione gubergren, democritum reprimique pri id. Cu qui regione patrioque.',

		q: 'special'
	},
	{
		id: 4,
		name: 'General Quota',
		percentage: 20,
		unSeats: 12,
		priority: 3,
		desc:
      'Lorem ipsum dolor sit amet, populo delicatissimi  interpretaris ea cum. Mutat pertinax assentior ea   eam, ea atqui consul ius. Eum prima debitis ei. Eu est libris regione gubergren, democritum reprimique pri id. Cu qui regione patrioque.',

		q: 'general'
	}
]

const steps = [
	{
		label: 'Application Configuration',
		description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`
	},
	{
		label: 'Quota metadata management',
		description:
      'An ad group contains one or more ads which target a shared set of keywords.'
	},
	{
		label: 'Phases of Application Processing',
		description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`
	},
	{
		label: 'Result Data Syncronization Criteria'
	}
]

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		'& .MuiOutlinedInput-root': {
			'& fieldset': {
				borderRadius: '10px 10px 10px 10px'
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
	},

	step: {
		// .MuiSvgIcon-root .MuiStepIcon-root
		'&  .MuiStepIcon-root.MuiStepIcon-active': {
			// color: '#17A5CE',
			// backgroundColor: '#17A5CE'
			fontSize: '30px',
			marginLeft: '-3px'
		},
		'& .MuiStepIcon-root.MuiStepIcon-completed': {
			// color: '#17A5CE',
			fontSize: '30px',
			marginLeft: '-3px'
		},
		'& .MuiStepLabel-label.MuiStepLabel-disabled': {
			fontSize: '30px',
			marginLeft: '-3px'
		},
		'.MuiStepIcon-root.MuiStepIcon-disabled': {
			fontSize: '30px',
			marginLeft: '-3px'
		}
	},
	stepLabel: {
		'& .MuiStepLabel-label.MuiStepLabel-active': {
			fontWeight: 'bold'
		},
		'& .MuiStepLabel-label.MuiStepLabel-completed': {
			fontWeight: 'bold'
		},
		'& .MuiStepLabel-label.MuiStepLabel-disabled': {
			fontSize: '30px',
			marginLeft: '-3px'
		},
		'.MuiStepIcon-root.MuiStepIcon-disabled': {
			fontSize: '30px',
			marginLeft: '-3px'
		}
	}
}))

function VerticalLinearStepper () {
	const [activeStep, setActiveStep] = React.useState(3)

	const [appReq, setAppReq] = useState({
		minSSCGeneral: '',
		maxSSCGeneral: '',
		minSSCBOU: '',
		maxSSCBOU: '',
		minChoices: '',
		maxChoices: '',
		applicationFee: '',
		registrationFee: ''
	})
	const handleChangeAppReq = e => {
		console.log(e.target)
		const { name, value } = e.target
		setAppReq(prev => ({
			...prev,
			[name]: value
		}))
	}

	//state for quotas

	const [quotas, setQuotas] = useState(
		initialQuotas.sort((a, b) => a.priority - b.priority)
	)
	const handleUpQuotaPriority = id => {
		console.log('id', id)
		setQuotas(
			produce(draft => {
				const clickedQuota = draft.find(quota => quota.id === id)

				// console.log('clickedQuota', clickedQuota)
				if (clickedQuota.priority !== 1) {
					const higherQuota = draft.find(
						quota => quota.priority === clickedQuota.priority - 1
					)
					clickedQuota.priority = clickedQuota.priority - 1

					higherQuota.priority = higherQuota.priority + 1
				}
				return draft.sort((a, b) => a.priority - b.priority)
			})
		)
	}
	const handleDownQuotaPriority = id => {
		console.log('id', id)
		setQuotas(
			produce(draft => {
				const clickedQuota = draft.find(quota => quota.id === id)

				// console.log('clickedQuota', clickedQuota)
				if (clickedQuota.priority !== draft.length) {
					const lowerQuota = draft.find(
						quota => quota.priority === clickedQuota.priority + 1
					)
					clickedQuota.priority = clickedQuota.priority + 1

					lowerQuota.priority = lowerQuota.priority - 1
				}
				return draft.sort((a, b) => a.priority - b.priority)
			})
		)
	}

	//state of phases

	const [phasesState, setPhasesState] = useState([])

	const classes = useStyles()

	const handleNext = () => {
		setActiveStep(prevActiveStep => prevActiveStep + 1)
	}

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1)
	}

	const handleReset = () => {
		setActiveStep(0)
	}

	return (
		<div>
			<Breadcrumbs
				aria-label='breadcrumb'
				separator={
					<DoubleArrowIcon
						size='small'
						style={{ width: '100%', color: 'rgba(160, 154, 157, 0.8)' }}
					/>
				}
				style={{ margin: '10px 0px 0px 15px' }}
			>
				<Link underline='hover' color='primary' href='/'>
          Settings
				</Link>
				{/* <Link
          underline='hover'
          color='primary'
          href='/getting-started/installation/'
        >
          Create Announcements
        </Link> */}
			</Breadcrumbs>

			<Paper style={{ marginLeft: '20px' }} elevation={4}>
				<h3 style={{ letterSpacing: '10', padding: '20px 0px 0px 20px' }}>
          Settings
				</h3>
				<Box sx={{ width: '100%' }}>
					<Stepper activeStep={activeStep} orientation='vertical'>
						{steps.map((step, index) => (
							<Step key={step.label} className={classes.step}>
								<StepLabel
									className={classes.stepLabel}
							
								>
									<span style={{ marginLeft: '15px' }}>{step.label}</span>
									{/* <TextField /> */}
								</StepLabel>

								<StepContent>
									{index === 0 && (
										<Container
											maxWidth='100%'
											style={{
												marginLeft: '-10px',
												marginTop: '20px'
							
											}}
										>
											<ApplicantsRequirement
												appReq={appReq}
												handleChange={handleChangeAppReq}
											/>
										</Container>
									)}
									{index === 1 && (
										<Container
											maxWidth='100%'
											style={{
												marginLeft: '-10px',
												marginTop: '10px'

											}}
										>
											<Quota
												quotas={quotas}
												setQuotas={setQuotas}
												handleUpPriority={handleUpQuotaPriority}
												handleDownPriority={handleDownQuotaPriority}
											/>
										</Container>
									)}
									{index === 2 && (
										<Container
											maxWidth='100%'
											style={{
												marginTop: '20px'
									
											}}
										>
											<PhaseComponent
												phasesState={phasesState}
												setPhasesState={setPhasesState}
											/>
										</Container>
									)}

									{index === 3 && (
										<Container
											maxWidth='100%'
											style={{
												marginTop: '20px',
												marginLeft: '-10px'
											}}
										>
											<ResultDataSyncronization />
										</Container>
									)}

									<Container
										maxWidth='100%'
										style={{ marginTop: '20px', marginLeft: '-10px' }}
									>
										<Button
											variant='outlined'
											disabled={index === 0}
											// color='primary'
											onClick={handleBack}
									
											className={classes.button}
										>
                      Back
										</Button>
										<Button
											variant='contained'
											onClick={handleNext}
										
											color="primary"
									
											className={classes.button}
										>
											{index === steps.length - 1 ? 'Finish' : 'Next'}
										</Button>
									</Container>
								</StepContent>
							</Step>
						))}
					</Stepper>

					{activeStep === steps.length && (
						<Paper
							square
							elevation={0}
							style={{ marginLeft: '20px', paddingBottom: '30px' }}
						>
							<Typography style={{ marginBottom: '20px' }}>
                All steps completed - Do you want to save the Announcements?
							</Typography>

							<Button
								// startIcon={<AddIcon />}
								color='primary'
								// style={{
								// 	color: '#17A5CE',
								// 	padding: '18px 36px',
								// 	borderRadius: '7px',
								// 	// marginTop: '20px',
								// 	border: '1.5px solid #17A5CE',
								// 	letterSpacing: '.75px',
								// 	fontWeight: '700'
								// }}
								// sx={{ mt: 1, ml: 20 }}
								variant='outlined'
								onClick={handleReset}
								className={classes.button}
							>
                Reset
							</Button>
							<Button
								variant='contained'
								onClick={handleNext}
							
								color="primary"
								className={classes.button}
							>
                Save
							</Button>
						</Paper>
					)}
				</Box>
			</Paper>
		</div>
	)
}

export default function Settings () {
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			{/* <ThemeProvider theme={theme}> */}

			<VerticalLinearStepper />

			{/* </ThemeProvider> */}
		</LocalizationProvider>
	)
}