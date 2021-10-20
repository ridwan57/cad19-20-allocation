/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { Table } from 'react-bootstrap'


import {
	Checkbox,
	Button,
	Container,
	FormControl,
	TextField,
	MenuItem,
	
} from '@material-ui/core'
// import { containerClasses, IconButton, TextField } from '@mui/material'
import Fab from '@mui/material/Fab'
import { Collapse, Dialog, DialogTitle } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { makeStyles } from '@mui/styles'

import produce from 'immer'

const useStyles = makeStyles({
	collapseStyle: {
		'& .MuiCollapse-wrapper': {
			width: '80%',
			margin: '20px 30px 20px 40px'
		}
	},
	dialog: {
		'& .css-m9glnp-MuiPaper-root-MuiDialog-paper': {
			borderRadius: '10px',
			boxShadow: '-5px -5px rgba(0, 0, 0, 0.05), 5px 5px rgba(0, 0, 0, 0.05)'

		}
	}


})

const resetNewQuota = {
	name: '',
	type: '',
	desc: ''
}
const Quota = ({ quotas, setQuotas, handleUpPriority, handleDownPriority }) => {
	// console.log('smMatches', smMatches)

	const classes = useStyles()
	const [id, setId] = React.useState(0)
	const [openDialog, setOpenDialog] = useState(false)

	const [newQuota, setNewQuota] = useState(resetNewQuota)
	const saveQuota = () => {
		// console.log('saveQuota', saveQuota)
		setQuotas(prev => [
			...prev,
			{
				id: prev.length + 1,
				name: newQuota.name,
				q: newQuota.type,
				desc: newQuota.desc,
				percentage: 20,
				unSeats: 12,
				priority: prev.length + 1
			}
		])
		setNewQuota(resetNewQuota)
	}

	const handleNewQuota = e => {
		const { name, value, checked } = e.target
		console.log('e.target', e.target)
		setNewQuota(prev => ({
			...prev,
			[name]: name === 'undefined' ? checked : value
		}))
	}

	const handleQuotaChange = (e, id) => {
		const { name, value } = e.target

		const quotaTypes = ['general', 'special']
		if (quotaTypes.includes(name)) {
			setQuotas(
				produce(draft => {
					const findQuotaById = draft.find(quota => quota.id === id)
					findQuotaById.q = findQuotaById.q === name ? null : name
				})
			)
		} else {
			setQuotas(
				produce(draft => {
					const findQuotaById = draft.find(quota => quota.id === id)
					findQuotaById[name] = value
				})
			)
		}
	}

	return (
		<>
			{/* Dialog box */}

			<Dialog
				open={openDialog}
				className={classes.dialog}
				onClose={() => setOpenDialog(false)}
				sx={{
					maxWidth: '900px',
					maxHeight:'500px',
					m: 'auto auto',

					p: 5
				}}
				fullScreen
			>
				<DialogTitle>Add Quota</DialogTitle>
				<>
					<Container>
						<Grid
							container
							spacing={3}
							direction='row'
							justifyContent='space-around'
							alignItems='center'
						>
							<Grid
								item
								xs={6}
								style={{ marginBottom: '20px', marginTop: '10px' }}
							>
								<TextField
									
									variant='outlined'
									fullWidth
									focused
									label='Quota Name'
									name='name'
									placeholder='Enter your text here..'
									onChange={handleNewQuota}
									value={newQuota.name}
								/>
							</Grid>
							<Grid
								item
								xs={6}
								// style={{ marginBottom: '20px', marginTop: '10px' }}
							>
								<FormControl fullWidth variant='standard'>
									<TextField
										select
										label='Quota Type'
										
										variant='outlined'
										fullWidth
										focused
										defaultValue='default'
										onChange={handleNewQuota}
										name='type'
										// sx={{ width: '100%' }}
										SelectProps={{
											variant: 'filled',
											color: 'primary'
											// multiple: true,
											// value: []
											// label: 'gfgg'
											// displayEmpty: 'true'
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
										<MenuItem value={'general'}>General</MenuItem>
										<MenuItem value={'special'}>Special</MenuItem>
									</TextField>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<TextField
								
									variant='outlined'
									multiline
									rows={4}
									fullWidth
									focused
									placeholder='Enter your text here...'
									label='Description'
									name='desc'
									onChange={handleNewQuota}
									value={newQuota.desc}
									// value=''
								/>
							</Grid>
							<Grid item xs={8}></Grid>
							<Grid item xs={4}direction="row"
								justifyContent="center"
								alignItems="center"
							
							>
								<Button
									variant='outlined'
									style={{marginRight:'10px'}}
									color='secondary'
									
									onClick={() => {
										setOpenDialog(false)
										setNewQuota(resetNewQuota)
									}}
								>
						Cancel
								</Button>
							
								<Button
									variant='contained'
								
								
									onClick={() => {
										saveQuota()
										setOpenDialog(false)
									}}
									color='primary'
									
								>
                  Save
								</Button>
							</Grid>
						</Grid>
					</Container>
				</>
			</Dialog>

			{/* Dialog box */}

			<Table
				borderless
				responsive
				// bordered

				className='table-centered rounded mb-0 overflow-scroll text-center'
				style={{
					borderSpacing: 0,
					borderCollapse: 'collapse',
					border: '0px solid #fff'
				}}
			>
				<thead
					// className='thead-light'
					style={{
						letterSpacing: '.75px',
						fontWeight: 'bold',
						marginBottom: '10px',
						backgroundColor: 'white'
					}}
				>
					<tr className='mb-100'>
						<th className='border-0 ' style={{ width: '10%' }}>
              ID
						</th>
						<th className='border-0 ' style={{ width: '20%' }}>
              Quota Name
						</th>
						<th className='border-0' style={{ width: '15%' }}>
              Percentage
						</th>
						<th className='border-0' style={{ width: '15%' }}>
              Unallocated Seats
						</th>
						<th className='border-0' style={{ width: '10%' }}>
              General
						</th>
						<th className='border-0' style={{ width: '10%' }}>
              Special
						</th>
						<th className='border-0' style={{ width: '15%' }}>
              Priority
						</th>
						<th className='border-0 w-30'></th>
					</tr>
				</thead>
				{quotas.map((eachQuota, i) => (
					<tbody style={{ verticalAlign: 'middle' }} key={eachQuota.id}>
						<tr
							style={{
								backgroundColor: `${
									id === eachQuota.id
										? '#E2E2E2'
										: i % 2 === 0
											? 'rgba(209, 223, 255,.3)'
											: '#fff'
								}`,
								height: '60px',
								borderBottom: '.1px solid #C7c7c7'
							}}
							// className='border-2'
						>
							<td>{eachQuota.id}</td>
							<td>{eachQuota.name}</td>
							<td style={{ position: 'relative' }}>
								{/* <div> */}
								<TextField
									inputProps={{min: 0, style: { textAlign: 'center' }}} // the change is here

									variant='standard'
									style={{
								
										width:'50%',
										
									}}
									focused
				
									name='percentage'
									onChange={e => handleQuotaChange(e, eachQuota.id)}
									value={eachQuota.percentage}
								/>
								{/* </div> */}
								<span
									style={{
										// fontSize: '18px',
										position: 'absolute',
										left: 'calc(46% + ' + '25px' + ')',
										top: 'calc(50% + ' +'-15px'+ ')'
									}}
								>
                  %
								</span>
							</td>
							<td>
								<TextField
									inputProps={{min: 0, style: { textAlign: 'center' }}} // the change is here
									style={{
									
										width:'50%',
										
									
									}}
									variant='standard'		
									focused
									sx={{textAlign:'center'}}
									
									name='unSeats'
									onChange={e => handleQuotaChange(e, eachQuota.id)}
									value={eachQuota.unSeats}
								/>
							</td>
							<td>
								<Checkbox
									name='general'
									onChange={e => handleQuotaChange(e, eachQuota.id)}
									style={{
										color: eachQuota.q === 'general' ? 'secondary' : null
									}}
									checked={eachQuota.q === 'general'}
								></Checkbox>
							</td>
							<td>
								<Checkbox
									name='special'
									onChange={e => handleQuotaChange(e, eachQuota.id)}
									style={{
										color: eachQuota.q === 'special' ? 'secondary' : null
									}}
									checked={eachQuota.q === 'special'}
									onClick={e => {
										console.log(e.target.checked)
									}}
								></Checkbox>
							</td>
							<td>
								<div
									style={{ display: 'flex', justifyContent: 'center' }}
								>
									<Fab
										sx={{
											backgroundColor: 'rgba(23, 165, 206, 0.3)',
											boxShadow: 'none',
											color: 'secondary',
											marginTop: '0px',
											marginRight:'4px'
										}}
										size='small'
									>
										<KeyboardArrowUpIcon
											// style={{ width: '0.88em', height: '0.88em' }}
											onClick={() => handleUpPriority(eachQuota.id)}
										/>
									</Fab>
									{/* rgba(23, 165, 206, 1) */}

									<Fab
										sx={{
											backgroundColor: 'rgba(23, 165, 206, 0.3)',
											boxShadow: 'none',
											color: 'primary',
											marginTop: '0px'
										}}
										size='small'
									>
										<KeyboardArrowDownIcon
											onClick={() => handleDownPriority(eachQuota.id)}
											// style={{ width: '0.88em', height: '0.88em' }}
										/>
									</Fab>
								</div>
							</td>
							<td>
								{id !== eachQuota.id ? (
									<Fab
										onClick={() => {
											if (id === eachQuota.id) {
												setId(null)
											} else setId(eachQuota.id)
										}}
										sx={{
											// backgroundColor: 'rgba(106,106,106,0.15)',
											backgroundColor: `${i % 2 === 0 ? '#EAFAFF' : '#fff'}`,
											boxShadow: 'none',
											zIndex: 1
										}}
										size='small'
									>
										<KeyboardArrowDownIcon
											style={{ width: '0.88em', height: '0.88em' }}
										/>
									</Fab>
								) : (
									<Fab
										onClick={() => {
											if (id === eachQuota.id) {
												setId(null)
											} else setId(eachQuota.id)
										}}
										sx={{
										
											boxShadow: 'none',
											zIndex: 1
										}}
										size='small'
									>
										<KeyboardArrowUpIcon
											style={{ width: '0.88em', height: '0.88em' }}
										/>
									</Fab>
								)}
							</td>
						</tr>
						<tr
			
							style={{
						
								visibility: `${eachQuota.id !== id ? 'collapse' : 'visible'}`,
						
								transition: 'all  .3s cubic-bezier(0.66, 0.77, 0.02, .63)'
					
							}}
						>
							<td colSpan='10'>
								<div>
									<Collapse
										// collapsedSize='large'
										in={eachQuota.id === id}
										className={classes.collapseStyle}
									>
										<TextField
											// className={classes.textField}
											sx={{ borderRadius: '10px' }}
											style={{ borderRadius: '10px' }}
											multiline
											variant='outlined'
											fullWidth
											focused
											label='Description'
											value={eachQuota.desc}
										/>
									</Collapse>
								</div>
							</td>
						</tr>
					</tbody>
				))}
			</Table>
			<Button
				className='text-capitalize'
				startIcon={<AddIcon />}
				color='primary'
				style={{
					marginTop: '20px',
				
					letterSpacing: '.75px',
					fontWeight: '700'
				}}
				variant='outlined'
				// onClick={() => setOpenDialog(true)}
				onClick={() => setOpenDialog(true)}
			>
        Add another Quota
			</Button>
		</>
	)
}

export default Quota