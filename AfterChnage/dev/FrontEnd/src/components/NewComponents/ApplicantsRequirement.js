import React, { useState } from 'react'
import { SpanText, ColorTextFields } from './TextField'
import Grid from '@mui/material/Grid'

function ApplicantsRequirement ({ appReq, handleChange }) {
  const placeHolderName = 'Enter year here'
  const titleName = 'minimum'
  const width = '10rem'
  const props = { placeHolderName, titleName, width }

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
          placeHolderName: textFieldsOne.placeHolderName,
          titleName: textFieldsOne.titleName,
          name: textFieldsOne.name,
          value: textFieldsOne.value
        }
        const propsTwo = textFieldsTwo && {
          placeHolderName: textFieldsTwo.placeHolderName,
          titleName: textFieldsTwo.titleName,
          name: textFieldsTwo.name,
          value: textFieldsTwo.value
        }
        return (
          <>
            <Grid item xs={12} md={5}>
              <SpanText text={text} />
            </Grid>
            <Grid item xs={12} md={3.5}>
              <ColorTextFields {...propsOne} handleChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={3.5}>
              {textFieldsTwo && (
                <ColorTextFields {...propsTwo} handleChange={handleChange} />
              )}
            </Grid>
          </>
        )
      })}
    </Grid>
    // <div style={{ display: "flex", flexDirection: "column" }}>
    //   <div>
    //     <SpanText text="Hello" />
    //     <ColorTextFields {...props} />
    //     <ColorTextFields {...props} placeHolderName="Enter your cgpa" />
    //   </div>
    //   <div>
    //     <SpanText text="Hello" />
    //     <ColorTextFields {...props} />
    //     <ColorTextFields {...props} placeHolderName="Enter your cgpa" />
    //   </div>
    //   <div>
    //     <SpanText text="Hello" />
    //     <ColorTextFields {...props} />
    //     <ColorTextFields {...props} placeHolderName="Enter your cgpa" />
    //   </div>
    // </div>
  )
}

export default ApplicantsRequirement