import {
	Paper,
	Typography,
	Button,
	Container,
	LinearProgress,
	createTheme,
	ThemeProvider
} from '@material-ui/core'
import { makeStyles } from '@mui/styles'
import MUIDataTable from 'mui-datatables'
import Error from 'react-500'

import { TextField } from '@mui/material'
import React, { useState } from 'react'
import { style } from '@mui/system'
import '../../styles/ImportResultData.css'
import axios from 'axios'

const useStyles = makeStyles({
	table: {
		// backgroundColor: 'red',
		'& .MuiTableCell-head': {
			// textAlign: 'center',
			// backgroundColor: 'red',

			// marginLeft: '20px',
			'& span': {
				// display: 'flex',
				justifyContent: 'center',
				// textAlign: 'center',
				// alignItems: 'center'
				// backgroundColor: 'red'
				fontWeight: 'bold'
			}
		}

		// '& .MuiTableHead-root': {
		//   display: 'flex',
		//   justifyContent: 'center',
		//   alignItems: 'center',
		//   backgroundColor: 'red'
		// }
	},
})

const inlineStyle = {
	btnStyle: {
		borderRadius: '7px',
		bottom: '-10px',
		marginLeft: '50%',
		transform: 'translateX(-50%)',
		padding: '8px 26px',

		width: 'auto',
		textAlign: 'center',
	
	},
	circleIconStyle: {
		border: '3px solid #2424e8',
		color: '#2424e8',
		height: '20px',
		lineHeight: '12px',
		fontWeight: 'bold',
		width: '20px',
		display: 'flex',
		borderRadius: '50%',
		textAlign: 'center',
		justifyContent: 'center',
		padding: '1px',
		margin: '2px 6px 0px 0px'
		// translate: 'translateY(-50%)'
	}

	// fontSize: "18px",
}

const theme = createTheme({
	overrides: {
		// MUIDataTable: {
		//   root: {
		//     // backgroundColor: '#FF000'
		//   },
		//   paper: {
		//     // boxShadow: 'none'
		//   }
		// },
		MUIDataTableHead: {
			root: {
				backgroundColor: '#1D252D',
				color: 'blue',
				borderBottom: 'none'
			}
		},
		MUIDataTableBodyCell: {
			root: {
				// backgroundColor: '#FFF',
				textAlign: 'center',
				paddingRight: '15px'
			}
		},
		MuiTableCell: {
			head: {
				// fontWeight: 'bold',
				// display: 'block',
				// textAlign: 'center',
				// justifyContent: 'center',
				// marginLeft: 'auto',
				// backgroundColor: 'red'
			}
		}
		// MUIDataTablePagination: {
		//   root: {
		//     backgroundColor: '#000',
		//     color: '#fff'
		//   }
		// }
	}
})
const columns = ['CRVS ID', 'SSC roll', 'SSC year', 'Comments']


const data = new Array(50).fill([
	'233444',
	'4324444',
	'2020',
	'lorem ipasom ok fderer recx crerwr frere rerrewrds fdgd'
])

//  setRowProps: (row, dataIndex, rowIndex) => {
//   return { style: { color: `${rowIndex%2==0 ? 'blue' : 'red'` } }
// }
const axioses = axios.create({
	baseURL: 'https://v2.convertapi.com'
})

const ButtonStyle = {
	backgroundColor: '#2424e8',
	color: 'white',
	padding: '10px 25px',
	borderRadius: '20px',
	marginLeft: '8.5rem',
	marginTop: '2rem',
	border: 0
}
const ErrButton = () => {
	return (
		<button style={ButtonStyle} onClick={() => window.location.reload()}>
      Try again
		</button>
	)
}

let source
const ImportResultData = () => {
	const [isRPModule, setIsRPModule] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [selectedFiles, setSelectedFiles] = useState(null)
	const classes = useStyles()

	const uploadFile = () => {
		console.log('upload file')
		source = axios.CancelToken.source()
		axioses.CancelToken = axios.CancelToken
		axioses.isCancel = axios.isCancel

		axioses
			.post('/upload', selectedFiles, {
				headers: {
					'Content-Type': selectedFiles.type
				},
				cancelToken: source.token,
				onUploadProgress: progressEvent =>
					setProgress(
						Math.round(100 * (progressEvent.loaded / progressEvent.total))
					)
			})
			.catch(error => {
				// this.isLoading = false
				if (axioses.isCancel(error)) {
					console.log('Request canceled')
				}
			})
	}
	const options = {
		jumpToPage: true,
		filter: true,
		filterType: 'dropdown',
		print: false,
		selectableRows: false,
		rowsPerPage: [3],
		rowsPerPageOptions: [1, 3, 5, 50],
		elevation: false,

		setRowProps: (row, dataIndex, rowIndex) => {
			return {
				style: {
					backgroundColor: `${rowIndex % 2 === 0 ? 'white' :'rgba(209, 223, 255,.3)'}`
				}
			}
		},
		// setCellProps: value => {
		//   return {
		//     style: {
		//       textAlign: 'center'
		//     }
		//   }
		// },
		textLabels: {
			pagination: {
				next: 'Next >',
				previous: '< Previous',
				rowsPerPage: 'Total items Per Page',
				displayRows: 'OF'
			}
		},
		onChangePage (currentPage) {
			console.log({ currentPage })
		},
		onChangeRowsPerPage (numberOfRows) {
			console.log({ numberOfRows })
		}
		// customFooter: (
		//   count,
		//   page,
		//   rowsPerPage,
		//   changeRowsPerPage,
		//   changePage,
		//   textLabels
		// ) => {
		//   return (
		//     <CustomFooter
		//       count={count}
		//       page={page}
		//       rowsPerPage={rowsPerPage}
		//       changeRowsPerPage={changeRowsPerPage}
		//       changePage={changePage}
		//       textLabels={textLabels}
		//     />
		//   )
		// }

		// setCellHeaderProps: () => ({
		//   className: classes.table
		// })
	}

	const [progress, setProgress] = React.useState(0)

	// React.useEffect(() => {
	//   const timer = setInterval(() => {
	//     setProgress(oldProgress => {
	//       if (oldProgress === 100) {
	//         return 0
	//       }
	//       const diff = Math.random() * 10
	//       return Math.min(oldProgress + diff, 100)
	//     })
	//   }, 500)

	//   return () => {
	//     clearInterval(timer)
	//   }
	// }, [])
	// return <Error button={ErrButton} />
	return (
		<Container>
			<Paper>
				<div className='d-sm-flex justify-content-around p-5'>
					<div className='d-flex'>
						<span style={inlineStyle.circleIconStyle}>i</span>
						<Typography paragraph style={{ width: '90%' }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
							{/* similique excepturi possimus itaque autem velit aliquam. Nisi
            molestias atque cupiditate, non impedit suscipit reprehenderit odit
            quo consequuntur quam aliquam quod.
           */}
						</Typography>
					</div>
					<div>
						{!uploading ? (
							isRPModule ? (
								<Button
									variant='contained'
									color='primary'
									style={inlineStyle.btnStyle}
								
									sx={{ mt: 1, mr: 1 }}
								>
                  Import from RP Module
								</Button>
							) : (
								<>
									<TextField
										// multiline
										label='Upload File here'
										color='primary'
										type='file'
										title=' upload file'
										onChange={e => {
											console.log(e.target.files)
											setSelectedFiles(e.target.files[0])
										}}
										sx={{cursor:'pointer'}}
								
										style={{
								
											cursor: 'pointer',
											position: 'relative',
											maxWidth: '400px',
				
											marginTop: '20px'
							
										}}
										fullWidth
							
										//   value={value}
										// color='se'
										//   onChange={handleChange}
										focused
										placeholder='Select yout reuired file...'
										id='upload-photo'
									/>
									{/* <p style={{ top: '20px' }}>fdfdsfsd</p> */}

									<Button
										variant='contained'
										color='primary'
										style={inlineStyle.btnStyle}
					
										sx={{ mt: 1, mr: 1 }}
							
										onClick={() => {
											console.log('upload button clicked')
											uploadFile()
											setUploading(true)
										}}
										disabled={selectedFiles === null}
									>
										{/* <input type='file' hidden /> */}
                    Upload
									</Button>
								</>
							)
						) : (
							<>
								<h5>File Uploading</h5>
								<div style={{ width: '300px' }}>
									<div className='d-flex'>
										<LinearProgress
											variant='determinate'
											// sx={{ color: 'red' }}
											style={{ width: '100%' }}
											color='primary'
											value={progress}
											
										/>
										<div style={{ margin: '-13px 0px 0px 10px' }}>
											{Math.round(progress)}%
										</div>
									</div>
									<Button
										variant='outlined'
										color='secondary'
										className={inlineStyle.btnStyle}
							
										sx={{ mt: 1, mr: 1 }}
							
										onClick={() => {
											console.log('canel btn clicked')
											source.cancel()
											setUploading(false)
											setSelectedFiles(null)
											setProgress(0)
										}}
									>
                    Cancel Upload
									</Button>
								</div>
							</>
						)}
					</div>
				</div>
				<div className='d-flex justify-content-between align-items-center p-5'>
					<Typography>
            No of Records Inserted:{' '}
						<span style={{ fontWeight: 'bold', marginLeft: '20px' }}>
							{43434}
						</span>
					</Typography>

					<Typography>
            No of Records Updated:{' '}
						<span
							style={{ fontWeight: 'bold', color: 'green', marginLeft: '20px' }}
						>
							{43434}
						</span>
					</Typography>

					<Typography>
            No of Records Deleted:{' '}
						<span
							style={{ fontWeight: 'bold', color: 'red', marginLeft: '20px' }}
						>
							{43434}
						</span>
					</Typography>
				</div>
				<Container>
					<ThemeProvider theme={theme}>
						<MUIDataTable
							title={'Result List'}
							data={data}
							columns={columns}
							options={options}
							className={classes.table}
						/>
					</ThemeProvider>
				</Container>
			</Paper>
		</Container>
	)
}

export default ImportResultData