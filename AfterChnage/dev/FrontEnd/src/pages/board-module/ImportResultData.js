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
  fileUpload: {
    // '& .MuiLinearProgress-barColorPrimary': {
    //   backgroundColor: '#17A5CE',
    //   color: '#c7c7c7'
    // },
    '& .MuiLinearProgress-colorPrimary': {
      backgroundColor: 'red'
    },
    '& .MuiLinearProgress-barColorPrimary': {
      backgroundColor: '#17A5CE'
    }
  },
  textField: {
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
    '& .MuiOutlinedInput': {},
    '& .MuiInputBase-input': {
      padding: '6px 17px',
      maxWidth: '300px',
      color: '#c7c7c7',
      cursor: 'pointer'
    },
    '& .MuiOutlinedInput-root': {
      // color: 'white',
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
        border: '1px solid #C7C7C7',
        cursor: 'pointer'
      }
    }
  },

  btn: {
    // background: "#17A5CE",
    // backgroundColor: "#17A5CE",
    // backgroundColor: "#000",
    borderRadius: '7px',
    border: 0,
    color: 'white',
    height: 40,
    // : 200,
    // width: 'text',

    textAlign: 'center',
    fontSize: '16 px',
    '& .MuiButton-contained': {
      // backgroundColor: '#17A5CE',
      // color: '#17A5CE',
      // padding: '0 20px'
    }
  }
})
const inlineStyle = {
  btnStyle: {
    borderRadius: '7px',
    bottom: '-10px',
    backgroundColor: '#17A5CE',
    marginLeft: '50%',
    transform: 'translateX(-50%)',
    padding: '8px 26px',

    width: 'auto',
    // height: '45px',
    color: 'white',
    textAlign: 'center',
    // fontFamily: 'open-sans',
    fontWeight: 'bold',
    fontSize: '16px',
    letterSpacing: '.75px',
    textTransform: 'capitalize',
    whiteSpace: 'nowrap'
  },
  circleIconStyle: {
    border: '3px solid #17A5CE',

    color: '#17A5CE',
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
const columns = ['CRVS ID', 'SSC roll', 'SSc year', 'Comments']

// Array.
// const data = [
//   ['233444', '4324444', '2020', 'lorem ipasom ok gfg recx c f ds fdgd'],
//   ['233444', '4324444', '2020', 'lorem ipasom ok gfg recx c f ds fdgd'],
//   ['233444', '4324444', '2020', 'lorem ipasom ok gfg recx c f ds fdgd'],
//   ['233444', '4324444', '2020', 'lorem ipasom ok gfg recx c f ds fdgd']
// ]
const data = new Array(50).fill([
  '233444',
  '4324444',
  '2020',
  'lorem ipasom ok gfg recx c f ds fdgd'
])

//  setRowProps: (row, dataIndex, rowIndex) => {
//   return { style: { color: `${rowIndex%2==0 ? 'blue' : 'red'` } }
// }
const axioses = axios.create({
  baseURL: 'https://v2.convertapi.com'
})

const ButtonStyle = {
  backgroundColor: '#2424e8a8',
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
          backgroundColor: `${rowIndex % 2 === 0 ? 'white' : '#EAFAFF'}`
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
                  style={inlineStyle.btnStyle}
                  // className={classes.btn}
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
                    //   name={name}
                    // id=
                    // style={{ color: "blue" }}
                    style={{
                      // display: 'none',
                      // color: 'white',
                      cursor: 'pointer',
                      position: 'relative',
                      maxWidth: `400px`,
                      // fontFamily: "open-sans",
                      marginTop: '20px'
                      // border: "1px solid #C7C7C7",
                    }}
                    fullWidth
                    className={classes.textField}
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
                    style={inlineStyle.btnStyle}
                    className={classes.btn}
                    sx={{ mt: 1, mr: 1 }}
                    // component='label'
                    // for='upload-photo'
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
                      className={classes.fileUpload}
                    />
                    <div style={{ margin: '-13px 0px 0px 10px' }}>
                      {Math.round(progress)}%
                    </div>
                  </div>
                  <Button
                    variant='outlined'
                    color='error'
                    style={{
                      ...inlineStyle.btnStyle,
                      color: 'red',
                      backgroundColor: 'white',
                      border: '1px solid #ff0000',
                      height: '35px'
                    }}
                    // className={classes.btn}
                    sx={{ mt: 1, mr: 1 }}
                    // component='label'
                    // for='upload-photo'
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
              title={'Employee List'}
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