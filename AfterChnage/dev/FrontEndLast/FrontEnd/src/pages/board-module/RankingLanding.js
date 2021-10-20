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
import '../../styles/Rashed.css'
import '../../styles/board-styling.css'
import {
  Button,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TableFooter,
  TablePagination,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core'
import {
  createMuiTheme,
  MuiThemeProvider,
  makeStyles,
  useTheme
} from '@material-ui/core/styles'
import MUIDataTable from 'mui-datatables'
import moment from 'moment'

import PropTypes from 'prop-types'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import LastPageIcon from '@material-ui/icons/LastPage'
import Loader from '../../components/Loader'

import {
  boardModuleRootAddress,
  rankingTypeCodes,
  rankingStatusCodes,
  rankingTypesAvailable,
  LROCodes,
  precisionFields,
  rankingCategory,
  rankedApplicantCountKey,
  rankingTypeTextToCode
} from '../../data/constants'

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

const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5)
  }
}))

function TablePaginationActions (props) {
  const classes = useStyles1()
  const theme = useTheme()
  const { count, page, rowsPerPage, onChangePage } = props

  const handleFirstPageButtonClick = event => {
    onChangePage(event, 0)
  }

  const handleBackButtonClick = event => {
    onChangePage(event, page - 1)
  }

  const handleNextButtonClick = event => {
    onChangePage(event, page + 1)
  }

  const handleLastPageButtonClick = event => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <div className={classes.root}>
      <Tooltip title='First Page'>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label='first page'
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
      </Tooltip>
      <Tooltip title='Next Page'>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label='previous page'
        >
          {theme.direction === 'rtl' ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
      </Tooltip>
      <Tooltip title='Next Page'>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='next page'
        >
          {theme.direction === 'rtl' ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
      </Tooltip>
      <Tooltip title='Last Page'>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='last page'
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Tooltip>
    </div>
  )
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
}

class RankingLanding extends Component {
  constructor (props) {
    super(props)
    this.state = {
      scienceRankingMetaData: null,
      allRankingMetaData: null,
      metaDataUpdated: false,
      currentTime: moment(Date.now()),
      rankedList: [],
      rankingTypeCodeForRankedList: -1,
      selectedRankingTypeForRankedList: '',
      rankingTypesAvailable: [],
      fetchRankedListDisable: true,
      columns: [],
      rankingCriteriaFetched: [],
      columnOptions: {},
      tableHeight: window.innerHeight / 2,
      x: 0,
      y: 0,
      pageNumber: 0,
      rowsPerPage: 10,
      divElement: null,
      totalCount: 0,
      startRanking: false,
      rankingStarted: false,
      rankingCodeToStart: 0
    }
    this.changeRankingType = this.changeRankingType.bind(this)
    this.fetchRankedList = this.fetchRankedList.bind(this)
    this.startRanking = this.startRanking.bind(this)
    this.startRankingConfirmation = this.startRankingConfirmation.bind(this)
    this.cancelRanking = this.cancelRanking.bind(this)
  }

  handleResize = e => {
    if (this.props.state === 'landing')
      this.setState({
        tableHeight:
          window.innerHeight -
          2 * this.state.divElement.getBoundingClientRect().bottom
      })
  }
  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
    //console.log(window.innerHeight-660-50);
    //console.log(this.divElement.getBoundingClientRect());
    //console.log(660-this.divElement.getBoundingClientRect().bottom);
    //console.log(window.innerHeight-350-this.divElement.getBoundingClientRect().bottom);
    //console.log(window.innerHeight - 2*this.divElement.getBoundingClientRect().bottom);
    this.setState({
      tableHeight:
        window.innerHeight -
        350 -
        this.divElement.getBoundingClientRect().bottom -
        20,
      divElement: this.divElement
    })
    this.setState({ rankingTypesAvailable: rankingTypesAvailable })
    rankingTypesAvailable.map(element => console.log(element))
    // @ to-do
    // Hard coded now
    // will eventually make an API call
    fetch(
      boardModuleRootAddress +
        '/getRankingMetaData/' +
        LROCodes[this.props.category].scienceTypeRankingCode,
      {
        headers: {
          Authorization: `bearer ${this.props.keycloak.token}`
        }
      }
    )
      .then(response => response.json())
      .then(dataForScience => {
        const scienceRankingMetaData = dataForScience.result
        fetch(
          boardModuleRootAddress +
            '/getRankingMetaData/' +
            LROCodes[this.props.category].allTypeRankingCode,
          {
            headers: {
              Authorization: `bearer ${this.props.keycloak.token}`
            }
          }
        )
          .then(response => response.json())
          .then(dataForAll => {
            const allRankingMetaData = dataForAll.result
            this.setState({
              scienceRankingMetaData: scienceRankingMetaData,
              allRankingMetaData: allRankingMetaData,
              metaDataUpdated: true
            })
            /*this.state.scienceRankingMetaData.rankingStatus === rankingStatusCodes.rankingStatusRunning &&
                            setInterval(async () => {
                                this.setState({ currentTime: Date.now() });
                                fetch(boardModuleRootAddress + '/getRankingMetaData/' + LROCodes.scienceTypeRankingCode, {
                                    headers: {
                                        'Authorization': `bearer ${this.props.keycloak.token}`
                                    }
                                })
                                    .then(response => response.json())
                                    .then(dataForScience => {
                                        const scienceRankingMetaData = dataForScience.result;
                                        this.setState({
                                            scienceRankingMetaData: scienceRankingMetaData
                                        });
                                    });
                            }, 1000);*/
            clearInterval(this.IntervalScience)
            this.IntervalScience = setInterval(async () => {
              this.setState({ currentTime: Date.now() })
              if (
                this.state.scienceRankingMetaData.rankingStatus ===
                rankingStatusCodes.rankingStatusRunning
              ) {
                fetch(
                  boardModuleRootAddress +
                    '/getRankingMetaData/' +
                    LROCodes[this.props.category].scienceTypeRankingCode,
                  {
                    headers: {
                      Authorization: `bearer ${this.props.keycloak.token}`
                    }
                  }
                )
                  .then(response => response.json())
                  .then(dataForScience => {
                    const scienceRankingMetaData = dataForScience.result
                    this.setState({
                      scienceRankingMetaData: scienceRankingMetaData
                    })
                  })
              } else clearInterval(this.IntervalScience)
            }, 1000)

            clearInterval(this.IntervalAll)
            this.IntervalAll = setInterval(async () => {
              this.setState({ currentTime: Date.now() })
              if (
                this.state.allRankingMetaData.rankingStatus ===
                rankingStatusCodes.rankingStatusRunning
              ) {
                fetch(
                  boardModuleRootAddress +
                    '/getRankingMetaData/' +
                    LROCodes[this.props.category].allTypeRankingCode,
                  {
                    headers: {
                      Authorization: `bearer ${this.props.keycloak.token}`
                    }
                  }
                )
                  .then(response => response.json())
                  .then(dataForAll => {
                    const allRankingMetaData = dataForAll.result
                    this.setState({
                      allRankingMetaData: allRankingMetaData
                    })
                  })
              } else clearInterval(this.IntervalAll)
            }, 1000)
          })
      })
    console.log(moment('2021-07-30').format('DD.MM.YYYY'))

    //this.interval = setInterval(() => this.setState({ currentTime: Date.now() }), 1000);
  }

  changeRankingType (event) {
    console.log(this.state.allRankingMetaData.rankingStatus)
    console.log(event.target.value)
    console.log(rankingTypeCodes.allTypeRankingCode)
    this.setState({
      rankingTypeCodeForRankedList: event.target.value,
      rankedList: []
    })
    if (
      event.target.value < 0 ||
      (event.target.value === rankingTypeCodes.allTypeRankingCode &&
        this.state.allRankingMetaData.rankingStatus === null) ||
      (event.target.value === rankingTypeCodes.scienceTypeRankingCode &&
        this.state.scienceRankingMetaData.rankingStatus === null)
    ) {
      console.log('test')
      this.setState({
        fetchRankedListDisable: true,
        rankedList: []
      })
    } else {
      fetch(
        boardModuleRootAddress + '/getRankingCriteria/' + event.target.value,
        {
          headers: {
            Authorization: `bearer ${this.props.keycloak.token}`
          }
        }
      )
        .then(response => response.json())
        .then(data => {
          if (data.result) {
            let rankingCriteria = []
            if (
              event.target.value === rankingTypeCodes.scienceTypeRankingCode
            ) {
              data.result.forEach(element => {
                if (element.priorityScience > 0) {
                  element.priority = element.priorityScience
                  rankingCriteria.push(element)
                }
              })
            } else {
              data.result.forEach(element => {
                if (element.priorityAll > 0) {
                  element.priority = element.priorityAll
                  rankingCriteria.push(element)
                }
              })
            }
            rankingCriteria.sort(function (a, b) {
              if (a.priority < b.priority) return -1
              if (a.priority > b.priority) return 1
              return 0
            })
            this.setState({ rankingCriteriaFetched: rankingCriteria })
            console.log(rankingCriteria)

            let columns = []

            columns.push({
              name: 'rank',
              label: 'Rank',
              options: {
                filter: false,
                sort: false,
                setCellProps: () => {
                  return {
                    style: {
                      textAlign: 'center'
                      //paddingRight: '0px'
                    }
                  }
                }
              }
            })

            columns.push({
              name: 'name',
              label: rankingCategory[this.props.category].fetched + ' Name',
              options: {
                filter: false,
                sort: false
              }
            })
            let columnOptions = {
              backgroundColor: '#f5f8fb !important',
              '&:nth-child(1)': {
                textAlign: 'center'
              },
              '&:nth-child(2)': {
                textAlign: 'left'
              }
            }
            let index = 3
            rankingCriteria.forEach(element => {
              columns.push({
                name: element.name.toLowerCase(),
                label: element.name,
                options: {
                  filter: false,
                  sort: false,
                  setCellProps: () => {
                    return {
                      style: {
                        textAlign: 'center'
                        //paddingRight: '0px'
                      }
                    }
                  }
                }
              })
              const columnId = '&:nth-child(' + index + ')'
              columnOptions[columnId] = {
                textAlign: 'center'
              }
              index += 1
            })

            // for (let index = 0; index < columns.length+5; index++) {
            //     const columnId = '&:nth-child('+index+')';

            // }

            this.setState({ columnOptions: columnOptions, columns: columns })
            console.log(this.state.columnOptions)
            let rowCount = 0
            fetch(
              boardModuleRootAddress +
                rankingCategory[this.props.category].countAPI,
              {
                headers: {
                  Authorization: `bearer ${this.props.keycloak.token}`
                }
              }
            )
              .then(response => response.json())
              .then(data => {
                const key =
                  rankingCategory[this.props.category].countKeyJSON +
                  rankedApplicantCountKey[
                    this.state.rankingTypeCodeForRankedList
                  ].keyJSON
                console.log(key)
                rowCount = data.result[key]
                this.setState({ totalCount: rowCount })
                console.log(rowCount)
              })
          }
        })
      this.setState({
        fetchRankedListDisable: false
      })
    }
  }
  //this.fetchRankedList(event.target.value);

  fetchRankedList () {
    console.log(this.state.pageNumber)
    fetch(boardModuleRootAddress + '/getRankedApplicantList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.keycloak.token}`
        //   //Accept: 'application/json'
      },
      body: JSON.stringify({
        type: this.state.rankingTypeCodeForRankedList,
        rankPhase: rankingCategory[this.props.category].code,
        offset: this.state.rowsPerPage * this.state.pageNumber,
        count: this.state.rowsPerPage
      })
    })
      .then(response => response.json())
      .then(data => {
        let rankedList = data.result
        rankedList.forEach(element => {
          precisionFields.forEach(field => {
            if (element[field]) element[field] = element[field].toFixed(2)
          })
          for (const [key, value] of Object.entries(element)) {
            if (value === false) element[key] = 'No'
            else if (value === true) element[key] = 'Yes'
          }
        })
        this.setState({ rankedList: rankedList, fetchRankedListDisable: true })
      })
  }

  updateState (state, type) {
    console.log(state)
    this.props.updateStateFunction(state, type)
  }
  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableBodyCell: {
          // root: {
          //     '&:nth-child(1)': {
          //         textAlign: 'left',
          //         paddingLeft: '20px'
          //     },
          //     '&:nth-child(2)': {
          //         textAlign: 'right',
          //         paddingRight: '0px'
          //     },
          // },
        },
        MuiPaper: {
          root: {
            boxShadow: 'none !important'
          }
        },
        MuiTableCell: {
          head: this.state.columnOptions,
          root: {
            paddingTop: '5px',
            paddingBottom: '5px'
          }
        },
        MUIDataTable: {
          responsiveScroll: {
            maxHeight: Math.max(this.state.tableHeight, 300) + 'px !important'
          }
        }
      }
    })

  _onMouseMove (e) {
    this.setState({ x: e.screenX, y: e.screenY })
  }

  startRankingConfirmation () {
    this.setState({ startRanking: true })
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
        opCode: this.state.rankingCodeToStart,
        lroPhase: rankingCategory[this.props.category].code
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({ rankingStarted: true, startRanking: false })
        setInterval(() => this.setState({ rankingStarted: false }), 3000)
      })
  }
  render () {
    const options = {
      filter: true,
      filterType: 'dropdown',
      print: true,
      selectableRows: false,
      print: false,
      responsive: 'scroll',
      rowsPerPageOptions: [10, 20, 40],
      onChangePage: currentPage => {
        this.setState({ pageNumber: currentPage })
        console.log(currentPage)
      },
      onChangeRowsPerPage: numberOfRows => {
        this.setState({ rowsPerPage: numberOfRows })
      },
      pagination: false,
      customFooter: () => {
        if (this.state.rankedList.length) {
          return (
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  colSpan={4}
                  count={this.state.totalCount}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.pageNumber}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true
                  }}
                  onChangePage={(event, currentPage) => {
                    console.log(currentPage)
                    this.setState(
                      { pageNumber: currentPage },
                      this.fetchRankedList
                    )
                  }}
                  onChangeRowsPerPage={event => {
                    this.setState(
                      {
                        rowsPerPage: parseInt(event.target.value, 10),
                        pageNumber: 0
                      },
                      this.fetchRankedList
                    )
                  }}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          )
        }
        return <></>
      }
    }

    //onMouseMove={/*this._onMouseMove.bind(this)*/}

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
          <DialogActions style={{ justifyContent: 'center' }}>
            <Button onClick={this.cancelRanking} color='secondary' autoFocus>
              Cancel
            </Button>
            <Button onClick={this.startRanking} color='primary' autoFocus>
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
                <Breadcrumb.Item active>
                  {rankingCategory[this.props.category].text}
                </Breadcrumb.Item>
              </Breadcrumb>

              <div
                class='col d-flex justify-content-center ranking'
                ref={divElement => {
                  this.divElement = divElement
                }}
              >
                <Card style={{ marginRight: '2%' }}>
                  <Card.Header>
                    <div className='row'>
                      <div className='col-10'>Science Type Ranking</div>
                      <div className='col-2' style={{ textAlign: 'right' }}>
                        <div></div>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div className='row'>
                      <div className='col-6 gray-text'>
                        Ranking Criteria Updated On
                      </div>
                      <div className='col-6'>
                        {(this.state.metaDataUpdated &&
                          this.state.scienceRankingMetaData
                            .rankingCriteriaLastUpdateDate !== null &&
                          moment(
                            this.state.scienceRankingMetaData
                              .rankingCriteriaLastUpdateDate
                          )
                            .add(6, 'hours')
                            .format('DD.MM.YYYY, h:mm:ss A')) ||
                          (this.state.metaDataUpdated &&
                            this.state.scienceRankingMetaData
                              .rankingCriteriaLastUpdateDate === null &&
                            'N/A')}
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-6 gray-text'>
                        {this.state.metaDataUpdated &&
                          (!this.state.scienceRankingMetaData.rankingStatus ||
                            this.state.scienceRankingMetaData.rankingStatus ===
                              rankingStatusCodes.rankingStatusCompleted) &&
                          'Ranking Updated On'}
                        {this.state.metaDataUpdated &&
                          this.state.scienceRankingMetaData.rankingStatus ===
                            rankingStatusCodes.rankingStatusRunning &&
                          'Ranking Started On'}
                      </div>
                      <div className='col-6'>
                        {(this.state.metaDataUpdated &&
                          this.state.scienceRankingMetaData.rankingStatus ===
                            rankingStatusCodes.rankingStatusCompleted &&
                          this.state.scienceRankingMetaData
                            .rankingLastUpdateDate !== null &&
                          moment(
                            this.state.scienceRankingMetaData
                              .rankingLastUpdateDate
                          ).format('DD.MM.YYYY, h:mm:ss A')) ||
                          (this.state.metaDataUpdated &&
                            (!this.state.scienceRankingMetaData.rankingStatus ||
                              this.state.scienceRankingMetaData
                                .rankingStatus ===
                                rankingStatusCodes.rankingStatusCompleted) &&
                            this.state.scienceRankingMetaData
                              .rankingLastUpdateDate === null &&
                            'N/A')}
                        {this.state.metaDataUpdated &&
                          this.state.scienceRankingMetaData.rankingStatus ===
                            rankingStatusCodes.rankingStatusRunning &&
                          moment(
                            this.state.scienceRankingMetaData
                              .rankingProcessStartDateTime
                          ).format('DD.MM.YYYY, h:mm:ss A')}
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-7 gray-text'>
                        {this.state.metaDataUpdated &&
                          this.state.scienceRankingMetaData.rankingStatus ===
                            rankingStatusCodes.rankingStatusRunning && (
                            <div className='process-time'>
                              <div className='row'>
                                <div
                                  className='col-6'
                                  style={{ paddingTop: '13px' }}
                                >
                                  Process Time
                                </div>

                                <div className='col-6'>
                                  <Row>
                                    <div className='col-12 gray-text small-text'>
                                      hh:mm:ss
                                    </div>
                                  </Row>
                                  <Row>
                                    <div className='col-12 bold-text'>
                                      {moment(
                                        moment(this.state.currentTime) -
                                          moment(
                                            this.state.scienceRankingMetaData
                                              .rankingProcessStartDateTime
                                          )
                                      )
                                        .subtract(6, 'hours')
                                        .format('HH:mm:ss')}
                                    </div>
                                  </Row>
                                </div>
                              </div>
                            </div>
                          )}
                      </div>

                      <div className='col-5 ranking-button'>
                        <div className='button'>
                          <Button
                            onClick={() =>
                              this.props.updateStateFunction(
                                'criteria-view',
                                'Science'
                              )
                            }
                            variant='contained'
                            color='primary'
                            size='medium'
                            disabled={false}
                            //startIcon={<SaveIcon />}
                          >
                            Details
                          </Button>
                          {/* &nbsp;&nbsp;
                                                    <Button
                                                        className="mui-ranking-button-right"
                                                        onClick={() => {
                                                            this.setState({rankingCodeToStart: 3});
                                                            this.startRankingConfirmation();
                                                        }}
                                                        variant="contained"
                                                        color="primary"
                                                        size="medium"
                                                        disabled={false}
                                                    >
                                                        Rank
                                                    </Button> */}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Header>
                    <div className='row'>
                      <div className='col-10'>All Type Ranking</div>
                      <div className='col-2' style={{ textAlign: 'right' }}>
                        <div></div>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div className='row'>
                      <div className='col-6 gray-text'>
                        Ranking Criteria Updated On
                      </div>
                      <div className='col-6'>
                        {(this.state.metaDataUpdated &&
                          this.state.allRankingMetaData
                            .rankingCriteriaLastUpdateDate !== null &&
                          moment(
                            this.state.allRankingMetaData
                              .rankingCriteriaLastUpdateDate
                          )
                            .add(6, 'hours')
                            .format('DD.MM.YYYY, h:mm:ss A')) ||
                          (this.state.metaDataUpdated &&
                            this.state.allRankingMetaData
                              .rankingCriteriaLastUpdateDate === null &&
                            'N/A')}
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-6 gray-text'>
                        {this.state.metaDataUpdated &&
                          (!this.state.allRankingMetaData.rankingStatus ||
                            this.state.allRankingMetaData.rankingStatus ===
                              rankingStatusCodes.rankingStatusCompleted) &&
                          'Ranking Updated On'}
                        {this.state.metaDataUpdated &&
                          this.state.allRankingMetaData.rankingStatus ===
                            rankingStatusCodes.rankingStatusRunning &&
                          'Ranking Started On'}
                      </div>
                      <div className='col-6'>
                        {(this.state.metaDataUpdated &&
                          this.state.allRankingMetaData.rankingStatus ===
                            rankingStatusCodes.rankingStatusCompleted &&
                          this.state.allRankingMetaData
                            .rankingLastUpdateDate !== null &&
                          moment(
                            this.state.allRankingMetaData.rankingLastUpdateDate
                          ).format('DD.MM.YYYY, h:mm:ss A')) ||
                          (this.state.metaDataUpdated &&
                            (!this.state.allRankingMetaData.rankingStatus ||
                              this.state.allRankingMetaData.rankingStatus ===
                                rankingStatusCodes.rankingStatusCompleted) &&
                            this.state.allRankingMetaData
                              .rankingLastUpdateDate === null &&
                            'N/A')}
                        {this.state.metaDataUpdated &&
                          this.state.allRankingMetaData.rankingStatus ===
                            rankingStatusCodes.rankingStatusRunning &&
                          moment(
                            this.state.allRankingMetaData
                              .rankingProcessStartDateTime
                          ).format('DD.MM.YYYY, h:mm:ss A')}
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-7 gray-text'>
                        {this.state.metaDataUpdated &&
                          this.state.allRankingMetaData.rankingStatus ===
                            rankingStatusCodes.rankingStatusRunning && (
                            <div className='process-time'>
                              <div className='row'>
                                <div
                                  className='col-6'
                                  style={{ paddingTop: '13px' }}
                                >
                                  Process Time
                                </div>

                                <div className='col-6'>
                                  <Row>
                                    <div className='col-12 gray-text small-text'>
                                      hh:mm:ss
                                    </div>
                                  </Row>
                                  <Row>
                                    <div className='col-12 bold-text'>
                                      {moment(
                                        moment(this.state.currentTime) -
                                          moment(
                                            this.state.allRankingMetaData
                                              .rankingProcessStartDateTime
                                          )
                                      )
                                        .subtract(6, 'hours')
                                        .format('HH:mm:ss')}
                                    </div>
                                  </Row>
                                </div>
                              </div>
                            </div>
                          )}
                      </div>

                      <div className='col-5 ranking-button'>
                        <div className='button'>
                          <Button
                            onClick={() =>
                              this.props.updateStateFunction(
                                'criteria-view',
                                'All'
                              )
                            }
                            variant='contained'
                            color='primary'
                            size='medium'
                            disabled={false}
                            //startIcon={<SaveIcon />}
                          >
                            Details
                          </Button>
                          {/* &nbsp;&nbsp;
                                                    <Button
                                                        className="mui-ranking-button-right"
                                                        onClick={() => {
                                                            this.setState({rankingCodeToStart: 4});
                                                            this.startRankingConfirmation();
                                                        }}
                                                        variant="contained"
                                                        color="primary"
                                                        size="medium"
                                                        disabled={false}
                                                    >
                                                        Rank
                                                    </Button> */}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>

              <div
                class='col d-flex justify-content-center ranking'
                style={{ paddingTop: '20px' }}
              >
                <Accordion defaultActiveKey='0' className='ranked-list'>
                  <Accordion.Item eventKey='1'>
                    <Accordion.Header>
                      <div className='row'>
                        <div className='col-5'>
                          <div className='row'>
                            <div className='col-12 header'>
                              Ranked{' '}
                              {rankingCategory[this.props.category].fetched}
                            </div>
                          </div>
                        </div>
                        <div className='col-7'>
                          <div className='row'>
                            {/* <div className="col-4 gray-text">
                                                            Ranking Updated
                                                        </div>
                                                        <div className="col-8">
                                                            20.12.2020
                                                        </div> */}
                          </div>
                        </div>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className='row'>
                        <div className='col-4' style={{ paddingTop: '15px' }}>
                          <FormControl variant=''>
                            <InputLabel id='demo-simple-select-label'>
                              Ranking Type
                            </InputLabel>
                            <Select
                              labelId='demo-simple-select-label'
                              id='demo-simple-select'
                              value={this.state.rankingTypeCodeForRankedList}
                              onChange={this.changeRankingType}
                            >
                              <MenuItem value={-1}>
                                <em>None</em>
                              </MenuItem>
                              {this.state.rankingTypesAvailable.map(element => (
                                <MenuItem value={element.typeCode}>
                                  {element.typeText}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>

                        <div
                          className='col-8 button'
                          style={{ textAlign: 'left', verticalAlign: 'middle' }}
                        >
                          <Button
                            onClick={this.fetchRankedList}
                            variant='contained'
                            color='primary'
                            size='medium'
                            disabled={this.state.fetchRankedListDisable}
                            //startIcon={<SaveIcon />}
                          >
                            View Ranked{' '}
                            {rankingCategory[this.props.category].fetched}
                          </Button>
                        </div>
                      </div>
                      <MuiThemeProvider theme={this.getMuiTheme()}>
                        <MUIDataTable
                          data={this.state.rankedList}
                          columns={this.state.columns}
                          options={options}
                        />
                      </MuiThemeProvider>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </div>
          }
        </div>
      </>
    )
  }
}

export default RankingLanding