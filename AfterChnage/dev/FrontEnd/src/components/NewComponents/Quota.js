import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { Table } from 'react-bootstrap'
import clsx from 'clsx'
import useMediaQuery from '@mui/material/useMediaQuery'

import {
  Checkbox,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core'
// import { containerClasses, IconButton, TextField } from '@mui/material'
import Fab from '@mui/material/Fab'
import { Collapse, Dialog, DialogTitle, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { makeStyles } from '@mui/styles'
import { ColorTextFields } from './TextField'
import produce from 'immer'

const useStyles = makeStyles({
  collapseStyle: {
    '& .MuiCollapse-wrapper': {
      // color: '#17A5CE',
      // backgroundColor: '#17A5CE',
      width: '80%',
      margin: '20px 30px 20px 40px'
    }
  },
  dialog: {
    '& .css-m9glnp-MuiPaper-root-MuiDialog-paper': {
      borderRadius: '10px',
      // border: '1px solid rgba(0,0,0,.25)',
      // border: '1px solid #999A9B',
      boxShadow: '-5px -5px rgba(0, 0, 0, 0.05), 5px 5px rgba(0, 0, 0, 0.05)'
      // boxShadow: '5px 5px #888888',
    }
  },
  btn: {
    // background: "#17A5CE",
    // backgroundColor: "#17A5CE",
    // backgroundColor: "#000",
    borderRadius: '7px',
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    textAlign: 'center',
    fontSize: '16 px',
    '& .MuiButton-contained': {
      backgroundColor: '#17A5CE',
      color: '#17A5CE'
    }
  },
  editableTextField: {
    '& label.Mui-focused': {
      // color: '#17A5CE',
      // padding: '2px 10px 0px 10px',
      // letterSpacing: '.75px',
      // // backgroundColor: 'red',
      // // position: 'relative',
      // // width: '80px',
      // fontSize: '20px',
      // // color: "red",
      // backgroundColor: 'white'
    },
    '& .MuiOutlinedInput': {},
    '& .MuiInputBase-input': {
      // padding: '4px 17px',
      marginTop: '-4px',
      maxHeight: '0px',
      textAlign: 'center',
      fontSize: '20px'

      // maxWidth: '300px',
      // backgroundColor: 'blue'
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
        border: '0px solid rgba(199, 199, 199, .7)'
      }
    }
  },
  textField: {
    '& label.Mui-focused': {
      color: '#17A5CE',
      padding: '2px 10px 0px 10px',
      letterSpacing: '.75px',

      // backgroundColor: 'red',
      // position: 'relative',
      // width: '80px',
      fontSize: '20px',
      top: '-9px',

      // color: "red",
      backgroundColor: 'white'
    },
    '& .MuiOutlinedInput': {},
    '& .MuiInputBase-input': {
      // padding: '4px 17px',
      marginTop: '-10px'

      // maxWidth: '300px',
      // backgroundColor: 'blue'
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
        border: '2px solid rgba(199, 199, 199, .7)'
      }
    }
  }
})

const resetNewQuota = {
  name: '',
  type: '',
  desc: ''
}
const Quota = ({ quotas, setQuotas, handleUpPriority, handleDownPriority }) => {
  const smMatches = useMediaQuery(theme => theme.breakpoints.up('sm'))

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
  const handleChange = id => {
    setId(id)
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
          maxHeight: '450px',
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
                  className={classes.textField}
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
                style={{ marginBottom: '20px', marginTop: '10px' }}
              >
                <FormControl fullWidth variant='standard'>
                  <TextField
                    select
                    label='Quota Type'
                    className={classes.textField}
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
                      // className={clsx(
                      //   classes.menuitem,
                      //   !showPlaceholder ? classes.menuitemhidden : null
                      // )}
                      // onClick={handleClickItem}
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

                {/* <TextField
                  className={classes.textField}
                  // sx={{ marginLeft: '10px', width: '40%' }}
                  fullWidth
                  focused
                  label='Quota Type'
                  placeholdre='Enter from DropDown'
                  InputProps={{ endAdornment: <KeyboardArrowDownIcon /> }}
                /> */}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
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
              <Grid item xs={6}></Grid>
              <Grid item xs={3}>
                <Button
                  variant='outlined'
                  // sx={{ color: '#17A5CE' }}
                  // color='primary'
                  style={{
                    backgroundColor: 'white',
                    color: 'red',
                    textTransform: 'capitalize',
                    width: '90%',
                    borderRadius: '7px',
                    border: '1px solid red'
                  }}
                  onClick={() => {
                    setOpenDialog(false)
                    setNewQuota(resetNewQuota)
                  }}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant='contained'
                  // color='success'
                  // sx={{ color: '#17A5CE' }}
                  onClick={() => {
                    saveQuota()
                    setOpenDialog(false)
                  }}
                  // color='primary'
                  style={{
                    backgroundColor: '#17A5CE',
                    color: 'white',
                    textTransform: 'capitalize',
                    width: '90%',
                    borderRadius: '7px'
                  }}
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
          className='thead-light'
          style={{
            letterSpacing: '.75px',
            fontWeight: 600,
            marginBottom: '10px'
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
            <th className='border-0' style={{ width: '10%' }}>
              Priority
            </th>
            <th className='border-0 w-30'></th>
          </tr>
        </thead>
        {quotas.map((eachQuota, i) => (
          <tbody style={{ verticalAlign: 'middle' }}>
            <tr
              style={{
                backgroundColor: `${
                  id === eachQuota.id
                    ? '#E2E2E2'
                    : i % 2 === 0
                    ? '#EAFAFF'
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
                <TextField
                  style={{
                    // height: '40%',
                    minWidth: '75px',
                    maxWidth: '40%',
                    margin: 'auto auto auto auto',
                    // paddingRight: '10px',

                    paddingTop: '5px',
                    border: '2px solid rgba(199, 199, 199, .7)',

                    backgroundColor: 'white',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    paddingRight: '7%'
                  }}
                  className={classes.editableTextField}
                  fullWidth
                  focused
                  // label='Quota Name'
                  name='percentage'
                  onChange={e => handleQuotaChange(e, eachQuota.id)}
                  value={eachQuota.percentage}
                />
                <span
                  style={{
                    fontSize: '18px',
                    position: 'absolute',
                    left: 'calc(46% + ' + '15px' + ')',
                    top: 'calc(50% + ' + '-13px' + ')'
                  }}
                >
                  %
                </span>
              </td>
              <td>
                <TextField
                  style={{
                    height: '40%',
                    minWidth: '55px',
                    maxWidth: '40%',
                    margin: 'auto auto auto auto',
                    paddingTop: '5px',

                    border: '2px solid rgba(199, 199, 199, .7)',
                    // border: '1px solid #C7c7c7',
                    backgroundColor: 'white',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                  className={classes.editableTextField}
                  fullWidth
                  focused
                  // label='Quota Name'
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
                    color: eachQuota.q === 'general' ? '#17A5CE' : null
                  }}
                  checked={eachQuota.q === 'general'}
                ></Checkbox>
              </td>
              <td>
                <Checkbox
                  name='special'
                  onChange={e => handleQuotaChange(e, eachQuota.id)}
                  style={{
                    color: eachQuota.q === 'special' ? '#17A5CE' : null
                  }}
                  checked={eachQuota.q === 'special'}
                  onClick={e => {
                    console.log(e.target.checked)
                  }}
                ></Checkbox>
              </td>
              <td>
                <div
                  style={{ display: 'flex', justifyContent: 'space-evenly' }}
                >
                  <Fab
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      boxShadow: 'none',
                      color: 'rgba(0,0,0,0.75)',
                      marginTop: '0px'
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
                      backgroundColor: 'rgba(23, 165, 206, 0.1)',
                      boxShadow: 'none',
                      color: 'rgba(23, 165, 206,95)',
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
                    onClick={e => {
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
                    onClick={e => {
                      if (id === eachQuota.id) {
                        setId(null)
                      } else setId(eachQuota.id)
                    }}
                    sx={{
                      // backgroundColor: 'rgba(106,106,106,0.15)',
                      // backgroundColor: `${i % 2 === 0 ? '#EAFAFF' : '#fff'}`,
                      // backgroundColor: 'red',
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
              // className='mt-10'
              style={{
                // display: `${eachQuota.id !== id ? 'none' : 'table-row'}`,
                visibility: `${eachQuota.id !== id ? 'collapse' : 'visible'}`,
                // visibility: 'hidden',
                // visibility: 'collapse',
                // maxHeight: '0px',
                transition: 'all  .3s cubic-bezier(0.66, 0.77, 0.02, .63)'
                // cubic - bezier(0.66, 0.77, 0.55, 1.06)
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
                      className={classes.textField}
                      sx={{ borderRadius: '10px' }}
                      style={{ borderRadius: '10px' }}
                      multiline
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
        // color='primary'
        style={{
          color: '#17A5CE',

          marginTop: '20px',
          border: '1.5px solid #17A5CE',
          letterSpacing: '.75px',
          fontWeight: '700'
        }}
        variant='outlined'
        onClick={() => setOpenDialog(true)}
      >
        Add another Quota
      </Button>
    </>
  )
}

export default Quota