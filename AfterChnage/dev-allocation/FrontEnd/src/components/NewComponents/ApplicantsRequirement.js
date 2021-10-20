/* eslint-disable react/prop-types */
import React from 'react'
import { TextField,Typography } from '@material-ui/core'
import Grid from '@mui/material/Grid'

function ApplicantsRequirement ({ appReq, handleChange }) {


	const appReqData = [
		{
			spanText: 'SSC pass year for general boards:',
			textFieldsOne: {
				titleName: 'Minimum',
				placeHolderName: 'Enter year here....',
				name: 'minSSCGeneral',
				value: appReq.minSSCGeneral
			},
			textFieldsTwo: {
				titleName: 'Maximum',
				placeHolderName: 'Enter year here....',
				name: 'maxSSCGeneral',
				value: appReq.maxSSCGeneral
			}
		},
		{
			spanText: 'SSC pass year for BOU:',
			textFieldsOne: {
				titleName: 'Minimum',
				placeHolderName: 'Enter year here....',
				name: 'minSSCBOU',
				value: appReq.minSSCBOU
			},
			textFieldsTwo: {
				titleName: 'Maximum',
				placeHolderName: 'Enter year here....',
				name: 'maxSSCBOU',
				value: appReq.maxSSCBOU
			}
		},
		{
			spanText: 'Number of choices by an applicant:',
			textFieldsOne: {
				titleName: 'Minimum',
				placeHolderName: 'Enter year here....',
				name: 'minChoices',
				value: appReq.minChoices
			},
			textFieldsTwo: {
				titleName: 'Maximum',
				placeHolderName: 'Enter year here....',
				name: 'maxChoices',
				value: appReq.maxChoices
			}
		},
		{
			spanText: 'Application fee:',
			textFieldsOne: {
				titleName: 'Amount',
				placeHolderName: 'Enter amount here....',
				name: 'applicationFee',
				value: appReq.applicationFee
			}
			//   textFieldsTwo: {
			//     titleName: "Minimum",
			//     placeHolderName: "Enter year here",
			//   },
		},
		{
			spanText: 'Registration fee:',
			textFieldsOne: {
				titleName: 'Amount',
				placeHolderName: 'Enter amount here....',
				name: 'registrationFee',
				value: appReq.registrationFee
			}
			//   textFieldsTwo: { titleName: "Minimum", placeHolderName: "Enter year here" },
		}
	]

	return (
		<Grid
			container
			spacing={3}
			style={{
				display: 'flex',
				// justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			{appReqData.map(obj => {
				const { spanText, textFieldsOne, textFieldsTwo } = obj
				const text = spanText
				const propsOne = {
					placeholder: textFieldsOne.placeHolderName,
					label: textFieldsOne.titleName,
					name: textFieldsOne.name,
					value: textFieldsOne.value
				}
				const propsTwo = textFieldsTwo && {
					placeholder: textFieldsTwo.placeHolderName,
					label: textFieldsTwo.titleName,
					name: textFieldsTwo.name,
					value: textFieldsTwo.value
				}
				return (
					<>
						<Grid item xs={12} md={5}>
							<Typography component='span'>{ text}</Typography>
						</Grid>
						<Grid item xs={12} md={3.5}>
							<TextField
								focused
								variant='outlined'
								{...propsOne} onChange={handleChange} />
						</Grid>
						<Grid item xs={12} md={3.5}>
							{textFieldsTwo && (
								<TextField
									focused
									variant='outlined'
									{...propsTwo} onChange={handleChange} />
							)}
						</Grid>
					</>
				)
			})}
		</Grid>

	)
}

export default ApplicantsRequirement