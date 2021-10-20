import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { Breadcrumb } from '@themesberg/react-bootstrap'
import { Table, Card } from '@themesberg/react-bootstrap'
import '../../styles/Rashed.css'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from 'mui-datatables'
import moment from 'moment'

import Loader from './../../components/Loader'

import { studentModuleRootAddress } from '../../data/constants'

import {
  Audio,
  BallTriangle,
  Bars,
  Circles,
  Grid,
  Hearts,
  Oval,
  Puff,
  Rings,
  SpinningCircles,
  TailSpin,
  ThreeDots
} from '@agney/react-loading'

import { LoaderProvider, useLoading } from '@agney/react-loading'

class PaymentHistory extends Component {
  constructor (props) {
    super(props)
    this.state = {
      paymentHistory: [],
      tableColumns: [
        {
          name: 'id',
          label: '#',
          options: {
            filter: false,
            sort: true
          }
        },
        {
          name: 'transactionId',
          label: 'TRANSACTION ID',
          options: {
            filter: true,
            sort: true
          }
        },
        {
          name: 'pspid',
          label: 'PAYMENT SERVICE PROVIDER',
          options: {
            filter: true,
            sort: true
          }
        },
        {
          name: 'purposeName',
          label: 'PAYMENT PURPOSE',
          options: {
            filter: true,
            sort: true
          }
        },
        {
          name: 'amountRequired',
          label: 'PAID AMOUNT',
          options: {
            filter: true,
            sort: true
          }
        },
        {
          name: 'timeStamp',
          label: 'PAYMENT TIME',
          options: {
            filter: false,
            sort: true
          }
        }
      ],
      loading: true
    }
  }

  componentDidMount () {
    fetch(studentModuleRootAddress + '/getPaymentHistory', {
      headers: {
        Authorization: `bearer ${this.props.keycloak.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          data.result.forEach((element, id) => {
            element.id = id + 1
            element.purposeName = element.paymentPurpose.purposeName
            element.amountRequired =
              element.paymentPurpose.amountRequired + ' BDT'
            element.timeStamp = moment(element.timeStamp)
              .subtract(6, 'hours')
              .format('YYYY-MM-DD, h:mm:ss A')
              .toString()
          })
          this.setState({ paymentHistory: data.result, loading: false })
        }
      })
  }

  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MuiTableCell: {
          head: {
            backgroundColor: '#f5f8fb !important'
          }
        }
      }
    })

  render () {
    const options = {
      filter: true,
      filterType: 'dropdown',
      print: true,
      selectableRows: false,
      print: false
    }
    return (
      <>
        <div className='flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4'>
          {
            <div className='d-block mb-4 mb-xl-0'>
              <Breadcrumb
                className='d-none d-md-inline-block'
                listProps={{
                  className: 'breadcrumb-dark breadcrumb-transparent'
                }}
              >
                <Breadcrumb.Item>
                  <FontAwesomeIcon icon={faHome} />
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Payment History</Breadcrumb.Item>
              </Breadcrumb>
              <h4 style={{ textAlign: 'center', marginLeft: '-12px' }}>
                Payment History
              </h4>
              <div class='col d-flex justify-content-center'>
                <div>
                  <Card
                    style={{
                      alignContent: 'center',
                      display: 'flex',
                      position: 'center',
                      backgroundColor: '#f5f8fc',
                      border: '0',
                      marginTop: '-5px'
                    }}
                  >
                    <Card.Header style={{ textAlign: 'center' }}>
                      <h6 style={{ display: 'inline' }}>
                        Recent Transactions of{' '}
                      </h6>
                      <h5 style={{ display: 'inline' }}>
                        <b>{this.props.keycloak.tokenParsed.name}</b>
                      </h5>
                    </Card.Header>
                  </Card>
                </div>
              </div>

              <div
                class='col d-flex justify-content-center'
                style={{ paddingTop: '20px' }}
              >
                <Card style={{ width: '1600px' }}>
                  <Card.Body>
                    {this.state.loading && (
                      <div style={{ textAlign: 'center' }}>
                        <LoaderProvider indicator={<Bars width='50' />}>
                          <Loader />
                        </LoaderProvider>
                      </div>
                    )}
                    {!this.state.loading && (
                      <div class='muidatatable-update-svg'>
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                          <MUIDataTable
                            data={this.state.paymentHistory}
                            columns={this.state.tableColumns}
                            options={options}
                          />
                        </MuiThemeProvider>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </div>
            </div>
          }
        </div>
      </>
    )
  }
}

export default PaymentHistory
