import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import {
  Breadcrumb,
  Card,
  Row,
  Col,
  Accordion
} from '@themesberg/react-bootstrap'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  IconButton
} from '@material-ui/core'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from 'mui-datatables'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import Loader from './../../components/Loader'
import {
  boardModuleRootAddress,
  rankingTypeCodes,
  rankingOrderTextualFields,
  rankingTypeTextToCode,
  LROCodes,
  rankingCategory
} from '../../data/constants'
import { Bars } from '@agney/react-loading'
import { LoaderProvider, useLoading } from '@agney/react-loading'

import moment from 'moment'
import '../../styles/Rashed.css'
import '../../styles/board-styling.css'

class RankingCriteriaView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tableColumns: [
        {
          name: 'priority',
          label: 'Priority',
          options: {
            filter: false,
            sort: false
          }
        },
        {
          name: 'displayName',
          label: 'Criteria Field',
          options: {
            filter: false,
            sort: false
          }
        },
        {
          name: 'sortingOrderTextual',
          label: 'Sorting Order',
          options: {
            filter: false,
            sort: false
          }
        },
        {
          name: 'subCriteriaFields',
          label: 'Sub Criteria Fields (appearing priority wise)',
          options: {
            filter: false,
            sort: false
          }
        }
      ],
      loading: true,
      criteiaSelected: [],
      startRanking: false,
      rankingStarted: false,
      moveToLanding: false,
      tableHeight: window.innerHeight - 300,
      loading: true,
      rankingAllowed: true,
      notAllowedPrompt: false,
      notAllowedMessage: ''
    }
    this.startRanking = this.startRanking.bind(this)
    this.startRankingConfirmation = this.startRankingConfirmation.bind(this)
    this.cancelRanking = this.cancelRanking.bind(this)
  }

  handleResize = e => {
    this.setState({ tableHeight: window.innerHeight - 300 })
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
    let criteriaCode = rankingTypeTextToCode[this.props.rankingType]
    fetch(boardModuleRootAddress + '/getRankingCriteria/' + criteriaCode, {
      headers: {
        Authorization: `bearer ${this.props.keycloak.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          let rankingCriteria = data.result
          console.log(rankingCriteria)
          let scienceCriteria = []
          let allCriteria = []
          rankingCriteria.forEach(element => {
            element.sortingOrderTextual =
              rankingOrderTextualFields[element.sortingOrder]
            element.rankingSubCriteria.sort(function (a, b) {
              if (a.priority < b.priority) return -1
              if (a.priority > b.priority) return 1
              return 0
            })
            element.subCriteriaFields = element.rankingSubCriteria.map(
              subElement => <div class='box'>{subElement.displayName}</div>
            )
            if (
              criteriaCode === rankingTypeCodes.scienceTypeRankingCode &&
              element.priorityScience > 0
            ) {
              element.priority = element.priorityScience
              scienceCriteria.push(element)
            } else if (
              criteriaCode === rankingTypeCodes.allTypeRankingCode &&
              element.priorityAll > 0
            ) {
              element.priority = element.priorityAll
              allCriteria.push(element)
            }
          })
          if (criteriaCode === rankingTypeCodes.scienceTypeRankingCode) {
            scienceCriteria.sort(function (a, b) {
              if (a.priority < b.priority) return -1
              if (a.priority > b.priority) return 1
              return 0
            })
            this.setState({ criteiaSelected: scienceCriteria })
          } else {
            allCriteria.sort(function (a, b) {
              if (a.priority < b.priority) return -1
              if (a.priority > b.priority) return 1
              return 0
            })
            this.setState({ criteiaSelected: allCriteria })
          }
        }
        this.setState({ loading: false })
      })

    if (this.props.category === 'pre-ranking') {
      fetch(boardModuleRootAddress + '/getScheduleData/0', {
        headers: {
          Authorization: `bearer ${this.props.keycloak.token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          data.result.forEach(schedule => {
            if (schedule.name === 'LOCK_SSC_RESULT') {
              console.log(
                moment(schedule.startDateTime).format('YYYY-MM-DD HH:mm:ss')
              )
              console.log(moment().format('YYYY-MM-DD HH:mm:ss'))

              if (
                moment(schedule.startDateTime).format('YYYY') !== '1900' &&
                moment(schedule.startDateTime).format('YYYY-MM-DD HH:mm:ss') >
                  moment().format('YYYY-MM-DD HH:mm:ss')
              ) {
                console.log(
                  'SSC result date is yet to be locked. Pre Ranking is not allowed'
                )
                this.setState({
                  notAllowedMessage:
                    'SSC result date is yet to be locked. Pre Ranking is not allowed'
                })
                this.setState({ rankingAllowed: false })
              }
            }
          })
        })
    }

    if (this.props.category === 'post-ranking') {
      fetch(boardModuleRootAddress + '/getPhaseCount', {
        headers: {
          Authorization: `bearer ${this.props.keycloak.token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          const phaseCount = parseInt(data.result) - 1

          fetch(boardModuleRootAddress + '/getScheduleData/' + phaseCount, {
            headers: {
              Authorization: `bearer ${this.props.keycloak.token}`
            }
          })
            .then(response => response.json())
            .then(data => {
              data.result.forEach(schedule => {
                if (schedule.name === 'APPLICATION') {
                  console.log(
                    moment(schedule.endDateTime).format('YYYY-MM-DD HH:mm:ss')
                  )
                  console.log(moment().format('YYYY-MM-DD HH:mm:ss'))

                  if (
                    moment(schedule.endDateTime).format('YYYY') !== '1900' &&
                    moment(schedule.endDateTime).format('YYYY-MM-DD HH:mm:ss') >
                      moment().format('YYYY-MM-DD HH:mm:ss')
                  ) {
                    console.log(
                      'Current Application phase is yet to be finished. Post Ranking is not allowed'
                    )
                    this.setState({
                      notAllowedMessage:
                        'Current Application phase is yet to be finished. Post Ranking is not allowed'
                    })
                    this.setState({ rankingAllowed: false })
                  }
                }
              })
            })
        })
    }
  }

  startRankingConfirmation () {
    if (this.state.rankingAllowed) this.setState({ startRanking: true })
    else this.setState({ notAllowedPrompt: true })
  }

  cancelRanking () {
    this.setState({ startRanking: false })
  }

  startRanking () {
    let opCode = 0
    if (
      rankingTypeTextToCode[this.props.rankingType] ===
      rankingTypeCodes.scienceTypeRankingCode
    )
      opCode = LROCodes[this.props.category].scienceTypeRankingCode
    else opCode = LROCodes[this.props.category].allTypeRankingCode
    fetch(boardModuleRootAddress + '/startLRO/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.keycloak.token}`
      },
      body: JSON.stringify({
        opCode: opCode,
        lroPhase: rankingCategory[this.props.category].code
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({ rankingStarted: true, startRanking: false })
        setInterval(() => this.setState({ moveToLanding: true }), 3000)
      })
  }

  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableBodyCell: {
          root: {
            '&:nth-child(1)': {
              textAlign: 'center'
            },
            '&:nth-child(4)': {
              textAlign: 'center'
            }
          }
        },
        MUIDataTableHeadCell: {
          root: {
            '&:nth-child(1)': {
              textAlign: 'center'
            },
            '&:nth-child(4)': {
              textAlign: 'center'
            }
          }
        },
        MuiPaper: {
          root: {
            boxShadow: 'none !important'
          }
        },
        MuiTableCell: {
          head: {
            backgroundColor: '#f5f8fb !important'
          },
          root: {
            padding: '20px'
          }
        },
        MUIDataTable: {
          responsiveScroll: {
            maxHeight: this.state.tableHeight + 'px !important'
          }
        }
      }
    })

  render () {
    const options = {
      filter: false,
      filterType: 'dropdown',
      selectableRows: false,
      print: false,
      pagination: false,
      responsive: 'scroll',
      search: false,
      viewColumns: false,
      download: false
    }
    if (this.state.moveToLanding)
      this.props.updateStateFunction('landing', this.props.rankingType)
    return (
      <>
        <Dialog
          open={this.state.rankingStarted}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle
            id='alert-dialog-title'
            style={{ textAlign: 'center' }}
          ></DialogTitle>
          <DialogContent>
            <DialogContentText
              id='alert-dialog-description'
              style={{ textAlign: 'center' }}
            >
              {this.props.rankingType} type ranking has been successfully
              started...
            </DialogContentText>
          </DialogContent>
        </Dialog>

        <Dialog
          open={this.state.notAllowedPrompt}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle
            id='alert-dialog-title'
            style={{ textAlign: 'center' }}
          ></DialogTitle>
          <DialogContent>
            <DialogContentText
              id='alert-dialog-description'
              style={{ textAlign: 'center' }}
            >
              {this.state.notAllowedMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions
            style={{ justifyContent: 'center', marginBottom: '20px' }}
          >
            <Button
              onClick={() => this.setState({ notAllowedPrompt: false })}
              color='primary'
              variant='contained'
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.startRanking}
          onClose={this.handleSaveSuccessfullAcceptedButtonPressed}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle
            id='alert-dialog-title'
            style={{ textAlign: 'center' }}
          ></DialogTitle>
          <DialogContent>
            <DialogContentText
              id='alert-dialog-description'
              style={{ textAlign: 'center' }}
            >
              Do you confirm ranking crietria...?
            </DialogContentText>
          </DialogContent>
          <DialogActions
            style={{ justifyContent: 'center', marginBottom: '20px' }}
          >
            <Button
              onClick={this.cancelRanking}
              color='secondary'
              variant='contained'
              autoFocus
            >
              Cancel
            </Button>
            <Button
              onClick={this.startRanking}
              color='primary'
              variant='contained'
              autoFocus
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

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
                <Breadcrumb.Item>
                  {rankingCategory[this.props.category].upperLevel}
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  onClick={() =>
                    this.props.updateStateFunction(
                      'landing',
                      this.props.rankingType
                    )
                  }
                >
                  {rankingCategory[this.props.category].text}
                </Breadcrumb.Item>
                <Breadcrumb.Item active>View Details</Breadcrumb.Item>
              </Breadcrumb>

              <div class='col d-flex justify-content-center ranking-criteria'>
                <Card>
                  <Card.Header>
                    <div className='row'>
                      <div className='col-6'>
                        <Tooltip title='Back'>
                          <IconButton
                            color='black'
                            onClick={() =>
                              this.props.updateStateFunction(
                                'landing',
                                this.props.rankingType
                              )
                            }
                          >
                            <ArrowBackIcon />
                          </IconButton>
                        </Tooltip>
                        {this.props.rankingType} Type Ranking
                      </div>
                      <div className='col-6 button-div'>
                        <Button
                          className='mui-ranking-button'
                          onClick={() =>
                            this.props.updateStateFunction(
                              'criteria-edit',
                              this.props.rankingType
                            )
                          }
                          variant='contained'
                          color='primary'
                          size='medium'
                          disabled={false}
                        >
                          Edit
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                          className='mui-ranking-button-right'
                          onClick={this.startRankingConfirmation}
                          variant='contained'
                          color='primary'
                          size='medium'
                          disabled={false}
                        >
                          Rank
                        </Button>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    {this.state.loading && (
                      <div style={{ textAlign: 'center' }}>
                        <LoaderProvider indicator={<Bars width='50' />}>
                          <Loader />
                        </LoaderProvider>
                      </div>
                    )}
                    {!this.state.loading && (
                      <MuiThemeProvider theme={this.getMuiTheme()}>
                        <MUIDataTable
                          data={this.state.criteiaSelected}
                          columns={this.state.tableColumns}
                          options={options}
                        />
                      </MuiThemeProvider>
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
export default RankingCriteriaView