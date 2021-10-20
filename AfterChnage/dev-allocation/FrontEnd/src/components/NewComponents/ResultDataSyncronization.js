import React from 'react'

import { Table } from 'react-bootstrap'


import {

	FormControl,

	MenuItem,
	
} from '@material-ui/core'
import {TextField } from '@mui/material'
import { makeStyles } from '@mui/styles'


const useStyles = makeStyles(()=>({
	table:{
		'& .MuiFormControl-root':{
			paddingBottom:'0px !important'
		}
	}
	
}))
const boards = [
	{
		id: 1,
		name: 'Dhaka'
	},
	{
		id: 2,
		name: 'Rajshahi'
	},
	{
		id: 3,
		name: 'Dinajpur'
	}
]


const ResultDataSyncronization = () => {
	const classes  = useStyles()
	return (
		<Table
			borderless
			responsive
	

			className='table-centered rounded mb-0 overflow-hidden text-center'
			
		>
			<thead
			
				style={{
					letterSpacing: '.75px',
					fontWeight: 'bold',
					marginBottom: '10px',
					backgroundColor: 'white',
					borderCollapse:'collapse'
				}}
			>
				<tr
				
				>
					<th
		
						style={{
							minWidth: '40px',

							paddingRight: '20px'
			
						}}
					>
            Serial No.
					</th>
					<th
					
						style={{
							minWidth: '80px',
							textAlign: 'left',
							paddingLeft: '0px'
						
						}}
					>
            Education Board Name
					</th>
					<th
						// className='border-0 bg-black'
						style={{ textAlign: 'right',minWidth:'50px' }}
					>
            Result Data Synchronization
					</th>
				</tr>
			</thead>
			<tbody style={{ verticalAlign: 'middle' }}>
				{boards.map((board, i) => (
					<tr
						className={classes.table}
						key={board.id}
						style={{
							backgroundColor: `${i % 2 === 0 ? '#EAFAFF' : '#fff'}`,
							// lineHeight: '10px',
							//   width: 'auto',
							borderBottom: '1px solid #C7c7c7'
						}}
					>
						<td >{board.id}</td>
						<td style={{ textAlign: 'left' }}>{board.name}</td>
						<td style={{ textAlign: 'right' }} className={classes.table}>
							{/* <div> */}
							<FormControl fullWidth variant='standard' className={classes.table}>
								<TextField
									select
									label='Synchronization '
									className={classes.table}
									
									// variant='outlined'
									// fullWidth
									// focused
									defaultValue='default'
									// onChange={handleNewQuota}
									name='type'
									sx={{ maxWidth: '270px',marginLeft:'auto',padding:'0px',marginBottom:'0px' }}
									SelectProps={{
										variant: 'filled',
										color: 'primary'
										
									}}
								>
									<MenuItem
										
										key='0'
										disabled
										defaultChecked
										value='default'
									>
                      Select from dropdown...
									</MenuItem>
									<MenuItem value={'general'}>Import from RP Module</MenuItem>
									<MenuItem value={'special'}>Upload file</MenuItem>
								</TextField>
							</FormControl>
							{/* </div> */}
						</td>
					</tr>
				))}
			</tbody>
		</Table>
	)
}

export default ResultDataSyncronization