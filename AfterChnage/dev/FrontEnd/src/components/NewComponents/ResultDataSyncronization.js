import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { Table } from 'react-bootstrap'
import clsx from 'clsx'

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
const useStyles = makeStyles({
  textField: {
    '& label.Mui-focused': {
      color: '#17A5CE',
      padding: '0px 10px 0px 10px',
      letterSpacing: '.75px',
      visibility: 'hidden',

      // backgroundColor: 'red',
      // position: 'relative',
      // width: '50%',
      fontSize: '20px',
      top: '-9px'

      // color: "red",
      // backgroundColor: 'white'
    },
    '& .MuiOutlinedInput': {},
    '& .MuiInputBase-input': {
      padding: '8px'
      // marginTop: '10px'
      // maxWidth: '20px'
      // backgroundColor: 'blue'
    },
    '& .MuiOutlinedInput-root': {
      // color: "#17A5CE",
      // - The Input-root, inside the TextField-root
      '& fieldset': {
        // - The <fieldset> inside the Input-root
        borderColor: 'pink' // - Set the Input border
      },
      '&:hover fieldset': {
        borderColor: 'yellow' // - Set the Input border when parent has :hover
      },
      '&.Mui-focused fieldset': {
        // - Set the Input border when parent is focused
        // borderColor: 'green',
        border: '2px solid rgba(199, 199, 199, .7)'
      }
    }
  }
})

const ResultDataSyncronization = () => {
  const classes = useStyles()
  return (
    <Table
      borderless
      responsive
      // bordered

      className='table-centered rounded mb-0 overflow-hidden text-center'
      style={
        {
          // borderSpacing: 0,
          // borderCollapse: 'collapse',
          // border: '0px solid #fff',
          // marginLeft: '15px'
          // marginRight: 'auto'
        }
      }
    >
      <thead
        className='thead-light'
        style={{
          letterSpacing: '.75px',
          fontWeight: 600,
          marginBottom: '10px',
          justifyContent: 'center'
        }}
      >
        <tr
        //   className='mb-100'
        //   data-toggle='collapse'
        //   data-target='#demo1'
        //   class='accordion-toggle'
        //   style={{ backgroundColor: 'red' }}
        //   className='pb-5'
        >
          <th
            // className='border-0 bg-secondary'
            style={{
              maxWidth: '80px',

              paddingRight: '20px'
              //   whiteSpace: 'nowrap'
            }}
          >
            Serial No.
          </th>
          <th
            // className='border-0  bg-primary'
            style={{
              maxWidth: '180px',
              textAlign: 'left',
              paddingLeft: '0px'
              // paddingRight: '50px',
              //   minWidth: '100px'
            }}
          >
            Education Board Name
          </th>
          <th
            // className='border-0 bg-black'
            style={{ textAlign: 'right', paddingRight: '60px' }}
          >
            Result Data Synchronization
          </th>
        </tr>
      </thead>
      <tbody style={{ verticalAlign: 'middle' }}>
        {boards.map((board, i) => (
          <tr
            key={board.id}
            style={{
              backgroundColor: `${i % 2 === 0 ? '#EAFAFF' : '#fff'}`,
              height: '60px',
              //   width: 'auto',
              borderBottom: '1px solid #C7c7c7'
            }}
          >
            <td style={{ paddingRight: '50px' }}>{board.id}</td>
            <td style={{ textAlign: 'left' }}>{board.name}</td>
            <td style={{ textAlign: 'right' }}>
              <div>
                <FormControl fullWidth variant='standard'>
                  <TextField
                    select
                    label='Quota Type'
                    className={classes.textField}
                    fullWidth
                    focused
                    defaultValue='default'
                    sx={{
                      width: '60%',
                      alignItems: 'end',
                      // backgroundColor: 'red',
                      marginLeft: 'auto'
                    }}
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
                      key='0'
                      disabled
                      defaultChecked
                      value='default'
                    >
                      Select from dropdown...
                    </MenuItem>
                    <MenuItem value={'general'}>Import From RP Module</MenuItem>
                    <MenuItem value={'special'}>Upload File</MenuItem>
                  </TextField>
                </FormControl>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default ResultDataSyncronization