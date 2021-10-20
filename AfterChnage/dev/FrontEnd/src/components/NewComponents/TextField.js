import * as React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'

import { makeStyles } from '@mui/styles'

function ColorTextFields (props) {
  const useStyles = makeStyles({
    root: {
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
        padding: '4px 17px',
        maxWidth: '300px'
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
          border: '1px solid #C7C7C7'
        }
      }
    }
  })

  // console.log('props:', props)
  const {
    placeHolderName = '',
    titleName = 'Default',
    width = 'auto',
    value,
    name,
    handleChange
  } = props
  const classes = useStyles()
  return (
    <TextField
      // multiline
      label={`${titleName}`}
      color='primary'
      name={name}
      // id=
      // style={{ color: "blue" }}
      style={{
        // width: `${width}`,
        // fontFamily: "open-sans",
        padding: '0'
        // border: "1px solid #C7C7C7",
      }}
      fullWidth
      className={classes.root}
      value={value}
      // color='se'
      onChange={handleChange}
      focused
      placeholder={`${placeHolderName}`}
    />
  )
}
function SpanText (props) {
  const useStyles = makeStyles({
    spanText: {
      fontFamily: 'Open-Sans',
      fontStyle: 'Regular',
      fontSize: '18px',
      lineHeight: '25px',
      letterSpacing: '0.75px',

      /* light text */

      color: '#717171'
    }
  })
  // console.log("props:", props);
  const classes = useStyles()
  const { text = 'default' } = props

  return <span className={classes.spanText}>{text}</span>
}

export { SpanText, ColorTextFields }