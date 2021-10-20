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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from 'mui-datatables'
import moment from 'moment'
import Loader from './../../components/Loader'
import Checkbox from '@material-ui/core/Checkbox'
import CircleChecked from '@material-ui/icons/CheckCircleOutline'
import CircleCheckedFilled from '@material-ui/icons/CheckCircle'
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked'
import { Select, MenuItem } from '@material-ui/core'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DetailsIcon from '@material-ui/icons/Details'
import ClearIcon from '@material-ui/icons/Clear'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
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
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

import {
  boardModuleRootAddress,
  rankingTypeCodes,
  rankingOrderTextualFields,
  rankingOrderFiledsCodes,
  rankingOrderFiledsCodesTextual,
  rankingTypeTextToCode,
  rankingCategory
} from '../../data/constants'

class RankingCriteriaEdit extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      criteriaType: 'Science',
      criteriaAvailable: [],
      criteriaSelected: [],
      subCriteriaAvailable: [],
      subCriteriaSelected: [],

      columnsCrieriaAvailable: [
        {
          name: 'displayName',
          label: '',
          options: {
            filter: false,
            sort: false,
            customHeadRender: () => null,
            setCellProps: () => {
              return {
                style: {
                  textAlign: 'left',
                  paddingLeft: '20px'
                }
              }
            }
          }
        },
        {
          name: 'checkBox',
          label: '',
          options: {
            filter: false,
            sort: false,
            customHeadRender: () => null,
            setCellProps: () => {
              return {
                style: {
                  textAlign: 'right',
                  paddingRight: '0px'
                }
              }
            }
          }
        }
      ],

      columnsCrieriaSelected: [
        {
          name: 'priorityIfSelected',
          label: 'Priority',
          options: {
            filter: false,
            sort: false,
            setCellProps: () => {
              return {
                style: {
                  textAlign: 'center',
                  paddingLeft: '0px',
                  paddingRight: '0px'
                }
              }
            }
          }
        },
        {
          name: 'displayName',
          label: 'Criteria Field',
          options: {
            filter: false,
            sort: false,
            setCellProps: () => {
              return {
                style: {
                  textAlign: 'center',
                  paddingLeft: '0px'
                }
              }
            }
          }
        },
        {
          name: 'sortingOrder',
          label: 'Sorting Order',
          options: {
            filter: false,
            sort: false,
            setCellProps: () => {
              return {
                style: {
                  textAlign: 'center'
                  //paddingLeft: '10px'
                }
              }
            }
          }
        },
        {
          name: 'action',
          label: 'Action',
          options: {
            filter: false,
            sort: false,
            setCellProps: () => {
              return {
                style: {
                  textAlign: 'right'
                  //paddingLeft: '20px'
                }
              }
            }
          }
        }
      ],
      columnsSubCrieriaAvailable: [
        {
          name: 'subCriteriaFieldDisplayName',
          label: '',
          options: {
            filter: false,
            sort: false,
            customHeadRender: () => null,
            setCellProps: () => {
              return {
                style: {
                  textAlign: 'left',
                  paddingLeft: '20px'
                }
              }
            }
          }
        },
        {
          name: 'checkBox',
          label: '',
          options: {
            filter: false,
            sort: false,
            customHeadRender: () => null,
            setCellProps: () => {
              return {
                style: {
                  textAlign: 'right',
                  paddingRight: '0px'
                }
              }
            }
          }
        }
      ],
      columnsSubCrieriaSelected: [
        {
          name: 'priority',
          label: 'Priority',
          options: {
            filter: false,
            sort: false
          },
          setCellProps: () => {
            return {
              style: {
                textAlign: 'right',
                paddingRight: '0px'
              }
            }
          }
        },
        {
          name: 'subCriteriaFieldDisplayName',
          label: 'Sub Criteria Field',
          options: {
            filter: false,
            sort: false
          }
        },
        {
          name: 'action',
          label: 'Action',
          options: {
            filter: false,
            sort: false
          }
        }
      ],
      selectedCriteria: null,
      successfullySaved: false,
      tableHeightTop: 80,
      tableHeightBottom: 35,
      tableHeight: window.innerHeight - 400,
      x: 0,
      y: 0
    }
    this.criteriaCheckedUnchecked = this.criteriaCheckedUnchecked.bind(this)
    this.handleChangeSortingOrder = this.handleChangeSortingOrder.bind(this)
    this.handleIncreasePriorityButtonPressed = this.handleIncreasePriorityButtonPressed.bind(
      this
    )
    this.handleDecreasePriorityButtonPressed = this.handleDecreasePriorityButtonPressed.bind(
      this
    )
    this.handleRemoveCriteriaButtonPressed = this.handleRemoveCriteriaButtonPressed.bind(
      this
    )
    this.handleIncreaseSubPriorityButtonPressed = this.handleIncreaseSubPriorityButtonPressed.bind(
      this
    )
    this.handleDecreaseSubPriorityButtonPressed = this.handleDecreaseSubPriorityButtonPressed.bind(
      this
    )
    this.saveUpdatedCriteria = this.saveUpdatedCriteria.bind(this)
    this.handleSaveSuccessfullAcceptedButtonPressed = this.handleSaveSuccessfullAcceptedButtonPressed.bind(
      this
    )
  }

  handleResize = e => {
    this.setState({ tableHeight: window.innerHeight - 400 })
  }

  handleIncreaseSubPriorityButtonPressed (
    indexInSelectedList,
    subCriterionIndex
  ) {
    let updatedSubcriteriaList = []
    if (subCriterionIndex > 0) {
      let updatedSelectedCriteriaList = this.state.criteriaSelected
      console.log(
        this.state.criteriaSelected[indexInSelectedList].rankingSubCriteria
      )
      updatedSelectedCriteriaList[indexInSelectedList].rankingSubCriteria[
        subCriterionIndex
      ].priority -= 1
      updatedSelectedCriteriaList[indexInSelectedList].rankingSubCriteria[
        subCriterionIndex - 1
      ].priority += 1
      const temp =
        updatedSelectedCriteriaList[indexInSelectedList].rankingSubCriteria[
          subCriterionIndex
        ]
      updatedSelectedCriteriaList[indexInSelectedList].rankingSubCriteria[
        subCriterionIndex
      ] =
        updatedSelectedCriteriaList[indexInSelectedList].rankingSubCriteria[
          subCriterionIndex - 1
        ]
      updatedSelectedCriteriaList[indexInSelectedList].rankingSubCriteria[
        subCriterionIndex - 1
      ] = temp

      updatedSelectedCriteriaList[
        indexInSelectedList
      ].rankingSubCriteria.forEach((element, updatedSubCriterionIndex) => {
        updatedSubcriteriaList.push({
          priority: element.priority,
          subCriteriaField: element.name,
          subCriteriaFieldDisplayName: element.displayName,
          //sortingOrder: <div class="box" style={{ width: '140px', color: "blue" }}>  </div>,
          action: (
            <div>
              <Tooltip title='Increase Priority'>
                <IconButton
                  aria-label='add'
                  color='primary'
                  style={{
                    marginTop: '-1px',
                    width: '32px',
                    height: '32px',
                    minHeight: '32px',
                    backgroundColor: '#bde2e8',
                    marginRight: '5px'
                  }}
                  onClick={() =>
                    this.handleIncreaseSubPriorityButtonPressed(
                      indexInSelectedList,
                      updatedSubCriterionIndex
                    )
                  }
                >
                  <ExpandLessIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Decrease Priority'>
                <IconButton
                  aria-label='add'
                  color='primary'
                  style={{
                    marginTop: '-1px',
                    width: '32px',
                    height: '32px',
                    minHeight: '32px',
                    backgroundColor: '#bde2e8',
                    marginRight: '5px'
                  }}
                  onClick={() =>
                    this.handleDecreaseSubPriorityButtonPressed(
                      indexInSelectedList,
                      updatedSubCriterionIndex
                    )
                  }
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Tooltip>
              {
                //<Tooltip title="Remove Criteria">
                //    <IconButton aria-label="add" color="secondary" style={{ marginTop: "-1px", width: "32px", height: "32px", minHeight: "32px", backgroundColor: "#f7bc78" }} onClick={() => this.handleRemoveCriteriaButtonPressed(indexInSelectedList, )}>
                //        <ClearIcon style={{ width: "0.8em" }} />
                //    </IconButton>
                //</Tooltip>
              }
            </div>
          )
        })
      })

      updatedSubcriteriaList.sort(function (a, b) {
        if (a.priority < b.priority) return -1
        if (a.priority > b.priority) return 1
        return 0
      })

      this.setState({
        criteriaSelected: updatedSelectedCriteriaList,
        subCriteriaSelected: updatedSubcriteriaList
      })
    }
  }

  handleDecreaseSubPriorityButtonPressed (
    indexInSelectedList,
    subCriterionIndex
  ) {
    let updatedSubcriteriaList = []
    if (subCriterionIndex < this.state.subCriteriaSelected.length - 1) {
      let updatedSelectedCriteriaList = this.state.criteriaSelected
      updatedSelectedCriteriaList[indexInSelectedList].rankingSubCriteria[
        subCriterionIndex
      ].priority += 1
      updatedSelectedCriteriaList[indexInSelectedList].rankingSubCriteria[
        subCriterionIndex + 1
      ].priority -= 1
      const temp =
        updatedSelectedCriteriaList[indexInSelectedList].rankingSubCriteria[
          subCriterionIndex
        ]
      updatedSelectedCriteriaList[indexInSelectedList].rankingSubCriteria[
        subCriterionIndex
      ] =
        updatedSelectedCriteriaList[indexInSelectedList].rankingSubCriteria[
          subCriterionIndex + 1
        ]
      updatedSelectedCriteriaList[indexInSelectedList].rankingSubCriteria[
        subCriterionIndex + 1
      ] = temp

      updatedSelectedCriteriaList[
        indexInSelectedList
      ].rankingSubCriteria.forEach((element, updatedSubCriterionIndex) => {
        updatedSubcriteriaList.push({
          priority: element.priority,
          subCriteriaField: element.name,
          subCriteriaFieldDisplayName: element.displayName,
          //sortingOrder: <div class="box" style={{ width: '140px', color: "blue" }}>  </div>,
          action: (
            <div>
              <Tooltip title='Increase Priority'>
                <IconButton
                  aria-label='add'
                  color='primary'
                  style={{
                    marginTop: '-1px',
                    width: '32px',
                    height: '32px',
                    minHeight: '32px',
                    backgroundColor: '#bde2e8',
                    marginRight: '5px'
                  }}
                  onClick={() =>
                    this.handleIncreaseSubPriorityButtonPressed(
                      indexInSelectedList,
                      updatedSubCriterionIndex
                    )
                  }
                >
                  <ExpandLessIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Decrease Priority'>
                <IconButton
                  aria-label='add'
                  color='primary'
                  style={{
                    marginTop: '-1px',
                    width: '32px',
                    height: '32px',
                    minHeight: '32px',
                    backgroundColor: '#bde2e8',
                    marginRight: '5px'
                  }}
                  onClick={() =>
                    this.handleDecreaseSubPriorityButtonPressed(
                      indexInSelectedList,
                      updatedSubCriterionIndex
                    )
                  }
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Tooltip>
              {
                //<Tooltip title="Remove Criteria">
                //    <IconButton aria-label="add" color="secondary" style={{ marginTop: "-1px", width: "32px", height: "32px", minHeight: "32px", backgroundColor: "#f7bc78" }} onClick={() => this.handleRemoveCriteriaButtonPressed(indexInSelectedList, )}>
                //        <ClearIcon style={{ width: "0.8em" }} />
                //    </IconButton>
                //</Tooltip>
              }
            </div>
          )
        })
      })

      updatedSubcriteriaList.sort(function (a, b) {
        if (a.priority < b.priority) return -1
        if (a.priority > b.priority) return 1
        return 0
      })

      this.setState({
        criteriaSelected: updatedSelectedCriteriaList,
        subCriteriaSelected: updatedSubcriteriaList
      })
    }
  }

  handleSaveSuccessfullAcceptedButtonPressed () {
    //
  }

  saveUpdatedCriteria () {
    let criteriaToSubmit = []
    if (this.state.criteriaSelected.length > 0) {
      this.state.criteriaSelected.forEach(element => {
        let criterion = {
          criterionId: element.criterionId,
          sortingOrder: rankingOrderFiledsCodesTextual[element.selectedOrder]
        }
        if (
          rankingTypeTextToCode[this.props.rankingType] ===
          rankingTypeCodes.scienceTypeRankingCode
        )
          criterion.priorityScience = element.priorityIfSelected
        else criterion.priorityAll = element.priorityIfSelected
        criterion.rankingSubCriteria = element.rankingSubCriteria
        criteriaToSubmit.push(criterion)
      })
    }
    console.log(criteriaToSubmit)
    fetch(boardModuleRootAddress + '/updateRankingCriteria/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.keycloak.token}`
        //   //Accept: 'application/json'
      },
      body: JSON.stringify({
        rankPhase: rankingCategory[this.props.category].code,
        type: rankingTypeTextToCode[this.props.rankingType],
        criteriaList: criteriaToSubmit
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({ successfullySaved: true })
      })
  }

  /*handleDecreaseSubPriorityButtonPressed(indexInSelectedList, subCriterionIndex) {
        let updatedSubcriteriaList = this.state.subCriteriaSelected;
        if (subCriterionIndex < updatedSubcriteriaList.length - 1) {
            let updatedSelectedCriteriaList = this.state.criteriaSelected;
            console.log(updatedSelectedCriteriaList[indexInSelectedList]);
            console.log(updatedSelectedCriteriaList[indexInSelectedList].rankingSubCriteria[subCriterionIndex]);
            const temp = updatedSubcriteriaList[subCriterionIndex];
            temp.priority += 1;
            updatedSubcriteriaList[subCriterionIndex] = updatedSubcriteriaList[subCriterionIndex + 1];
            updatedSubcriteriaList[subCriterionIndex + 1] = temp;
            updatedSubcriteriaList[subCriterionIndex + 1].priority -= 1;

            updatedSubcriteriaList.sort(function (a, b) {
                if (a.priorityIfSelected < b.priorityIfSelected) return -1;
                if (a.priorityIfSelected > b.priorityIfSelected) return 1;
                return 0;
            });

            this.setState({ subCriteriaSelected: updatedSubcriteriaList });
        }
    }*/

  manageSubCriteria (index) {
    let subCriteriaAvailable = []
    let subCriteriaSelected = []
    this.state.criteriaSelected[index].rankingSubCriteria.forEach(
      (element, subCriterionIndex) => {
        subCriteriaAvailable.push({
          subCriteriaField: element.name,
          subCriteriaFieldDisplayName: element.displayName,
          checkBox: (
            <Checkbox
              icon={<CircleUnchecked />}
              checkedIcon={<CircleCheckedFilled />}
              color='primary'
              checked={true}
            />
          )
        })

        subCriteriaSelected.push({
          priority: element.priority,
          subCriteriaField: element.name,
          subCriteriaFieldDisplayName: element.displayName,
          //sortingOrder: <div class="box" style={{ width: '140px', color: "blue" }}>  </div>,
          action: (
            <div>
              <Tooltip title='Increase Priority'>
                <IconButton
                  aria-label='add'
                  color='primary'
                  style={{
                    marginTop: '-1px',
                    width: '32px',
                    height: '32px',
                    minHeight: '32px',
                    backgroundColor: '#bde2e8',
                    marginRight: '5px'
                  }}
                  onClick={() =>
                    this.handleIncreaseSubPriorityButtonPressed(
                      index,
                      subCriterionIndex
                    )
                  }
                >
                  <ExpandLessIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Decrease Priority'>
                <IconButton
                  aria-label='add'
                  color='primary'
                  style={{
                    marginTop: '-1px',
                    width: '32px',
                    height: '32px',
                    minHeight: '32px',
                    backgroundColor: '#bde2e8',
                    marginRight: '5px'
                  }}
                  onClick={() =>
                    this.handleDecreaseSubPriorityButtonPressed(
                      index,
                      subCriterionIndex
                    )
                  }
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Tooltip>
            </div>
          )
        })
      }
    )
    subCriteriaSelected.sort(function (a, b) {
      if (a.priority < b.priority) return -1
      if (a.priority > b.priority) return 1
      return 0
    })
    this.setState({
      selectedCriteria: this.state.criteriaSelected[index],
      subCriteriaAvailable: subCriteriaAvailable,
      subCriteriaSelected: subCriteriaSelected
    })
  }

  componentDidMount () {
    let criteriaCode = rankingTypeTextToCode[this.props.rankingType]
    //if (this.props.rankingType === 'Science') criteriaCode = rankingTypeCodes.scienceTypeRankingCode;
    //else criteriaCode = rankingTypeCodes.allTypeRankingCode;

    fetch(boardModuleRootAddress + '/getRankingCriteria/' + criteriaCode, {
      headers: {
        Authorization: `bearer ${this.props.keycloak.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          let rankingCriteria = data.result
          let criteriaAvailable = []
          let criteriaSelected = []
          let indexAvailable = 0
          if (criteriaCode === rankingTypeCodes.allTypeRankingCode) {
            // filter out science relavant criteria
            rankingCriteria.forEach((element, index) => {
              if (
                element.type === rankingTypeCodes.allTypeRankingCode ||
                element.type === rankingTypeCodes.bothTypeRankingCode
              ) {
                element.checked = element.priorityAll > 0 && true
                element.checkBox = (
                  <Checkbox
                    icon={<CircleUnchecked />}
                    checkedIcon={<CircleCheckedFilled />}
                    color='primary'
                    onChange={() => this.criteriaCheckedUnchecked(index)}
                    checked={element.checked}
                  />
                )
                indexAvailable += 1

                element.priorityIfSelected = element.priorityAll

                element.selectedOrder =
                  rankingOrderTextualFields[element.sortingOrder]

                if (element.selectedOrder !== 'Custom')
                  element.sortingOrders = ['Descending', 'Ascending']
                else {
                  element.sortingOrders = ['Custom']
                  element.rankingSubCriteria.sort(function (a, b) {
                    if (a.priority < b.priority) return -1
                    if (a.priority > b.priority) return 1
                    return 0
                  })
                }

                criteriaAvailable.push(element)

                // if this item is selected, insert it in selected list
                if (element.priorityAll > 0) {
                  element.indexInAvailableList = index
                  criteriaSelected.push(element)
                }
              }
            })
            criteriaSelected.sort(function (a, b) {
              if (a.priorityIfSelected < b.priorityIfSelected) return -1
              if (a.priorityIfSelected > b.priorityIfSelected) return 1
              return 0
            })
            criteriaSelected.forEach((element, index) => {
              element.sortingOrder = (
                <div class='box'>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={element.selectedOrder}
                    onChange={event =>
                      this.handleChangeSortingOrder(index, event)
                    }
                    style={{ minWidth: 120, color: 'white' }}
                    disableUnderline={true}
                  >
                    {element.sortingOrders.map(order => (
                      <MenuItem value={order}>{order}</MenuItem>
                    ))}
                  </Select>
                </div>
              )
              if (element.selectedOrder === 'Custom') {
                element.action = (
                  <div>
                    <Tooltip title='Manage Sub-Criteria'>
                      <IconButton
                        aria-label='add'
                        color=''
                        style={{
                          marginTop: '-1px',
                          width: '32px',
                          height: '32px',
                          minHeight: '32px',
                          backgroundColor: '#bde2e8',
                          marginRight: '5px'
                        }}
                        onClick={() => this.manageSubCriteria(index)}
                      >
                        <DetailsIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Increase Priority'>
                      <IconButton
                        aria-label='add'
                        color='primary'
                        style={{
                          marginTop: '-1px',
                          width: '32px',
                          height: '32px',
                          minHeight: '32px',
                          backgroundColor: '#bde2e8',
                          marginRight: '5px'
                        }}
                        onClick={() =>
                          this.handleIncreasePriorityButtonPressed(index)
                        }
                      >
                        <ExpandLessIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Decrease Priority'>
                      <IconButton
                        aria-label='add'
                        color='primary'
                        style={{
                          marginTop: '-1px',
                          width: '32px',
                          height: '32px',
                          minHeight: '32px',
                          backgroundColor: '#bde2e8',
                          marginRight: '5px'
                        }}
                        onClick={() =>
                          this.handleDecreasePriorityButtonPressed(index)
                        }
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Remove Criteria'>
                      <IconButton
                        aria-label='add'
                        color='secondary'
                        style={{
                          marginTop: '-1px',
                          width: '32px',
                          height: '32px',
                          minHeight: '32px',
                          backgroundColor: '#f7bc78'
                        }}
                        onClick={() =>
                          this.handleRemoveCriteriaButtonPressed(index)
                        }
                      >
                        <ClearIcon style={{ width: '0.8em' }} />
                      </IconButton>
                    </Tooltip>
                  </div>
                )
              } else {
                element.action = (
                  <div>
                    <Tooltip title='Increase Priority'>
                      <IconButton
                        aria-label='add'
                        color='primary'
                        style={{
                          marginTop: '-1px',
                          width: '32px',
                          height: '32px',
                          minHeight: '32px',
                          backgroundColor: '#bde2e8',
                          marginRight: '5px'
                        }}
                        onClick={() =>
                          this.handleIncreasePriorityButtonPressed(index)
                        }
                      >
                        <ExpandLessIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Decrease Priority'>
                      <IconButton
                        aria-label='add'
                        color='primary'
                        style={{
                          marginTop: '-1px',
                          width: '32px',
                          height: '32px',
                          minHeight: '32px',
                          backgroundColor: '#bde2e8',
                          marginRight: '5px'
                        }}
                        onClick={() =>
                          this.handleDecreasePriorityButtonPressed(index)
                        }
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Remove Criteria'>
                      <IconButton
                        aria-label='add'
                        color='secondary'
                        style={{
                          marginTop: '-1px',
                          width: '32px',
                          height: '32px',
                          minHeight: '32px',
                          backgroundColor: '#f7bc78'
                        }}
                        onClick={() =>
                          this.handleRemoveCriteriaButtonPressed(index)
                        }
                      >
                        <ClearIcon style={{ width: '0.8em' }} />
                      </IconButton>
                    </Tooltip>
                  </div>
                )
              }
            })
            console.log(criteriaSelected)
            this.setState({
              criteriaAvailable: criteriaAvailable,
              criteriaSelected: criteriaSelected
            })
          } else {
            // filter out all type relavant criteria
            // filter out science relavant criteria
            rankingCriteria.forEach((element, index) => {
              if (
                element.type === rankingTypeCodes.scienceTypeRankingCode ||
                element.type === rankingTypeCodes.bothTypeRankingCode
              ) {
                element.checked = element.priorityScience > 0 && true
                element.checkBox = (
                  <Checkbox
                    icon={<CircleUnchecked />}
                    checkedIcon={<CircleCheckedFilled />}
                    color='primary'
                    onChange={() => this.criteriaCheckedUnchecked(index)}
                    checked={element.checked}
                  />
                )
                indexAvailable += 1

                element.priorityIfSelected = element.priorityScience

                element.selectedOrder =
                  rankingOrderTextualFields[element.sortingOrder]

                if (element.selectedOrder !== 'Custom')
                  element.sortingOrders = ['Descending', 'Ascending']
                else {
                  element.sortingOrders = ['Custom']
                  element.rankingSubCriteria.sort(function (a, b) {
                    if (a.priority < b.priority) return -1
                    if (a.priority > b.priority) return 1
                    return 0
                  })
                }

                criteriaAvailable.push(element)

                // if this item is selected, insert it in selected list
                if (element.priorityScience > 0) {
                  element.indexInAvailableList = index
                  criteriaSelected.push(element)
                }
              }
            })
            criteriaSelected.sort(function (a, b) {
              if (a.priorityIfSelected < b.priorityIfSelected) return -1
              if (a.priorityIfSelected > b.priorityIfSelected) return 1
              return 0
            })
            criteriaSelected.forEach((element, index) => {
              element.sortingOrder = (
                <div class='box'>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={element.selectedOrder}
                    onChange={event =>
                      this.handleChangeSortingOrder(index, event)
                    }
                    style={{ minWidth: 120, color: 'white' }}
                    disableUnderline={true}
                  >
                    {element.sortingOrders.map(order => (
                      <MenuItem value={order}>{order}</MenuItem>
                    ))}
                  </Select>
                </div>
              )
              if (element.selectedOrder === 'Custom') {
                element.action = (
                  <div>
                    <Tooltip title='Manage Sub-Criteria'>
                      <IconButton
                        aria-label='add'
                        color=''
                        style={{
                          marginTop: '-1px',
                          width: '32px',
                          height: '32px',
                          minHeight: '32px',
                          backgroundColor: '#bde2e8',
                          marginRight: '5px'
                        }}
                        onClick={() => this.manageSubCriteria(index)}
                      >
                        <DetailsIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Increase Priority'>
                      <IconButton
                        aria-label='add'
                        color='primary'
                        style={{
                          marginTop: '-1px',
                          width: '32px',
                          height: '32px',
                          minHeight: '32px',
                          backgroundColor: '#bde2e8',
                          marginRight: '5px'
                        }}
                        onClick={() =>
                          this.handleIncreasePriorityButtonPressed(index)
                        }
                      >
                        <ExpandLessIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Decrease Priority'>
                      <IconButton
                        aria-label='add'
                        color='primary'
                        style={{
                          marginTop: '-1px',
                          width: '32px',
                          height: '32px',
                          minHeight: '32px',
                          backgroundColor: '#bde2e8',
                          marginRight: '5px'
                        }}
                        onClick={() =>
                          this.handleDecreasePriorityButtonPressed(index)
                        }
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Remove Criteria'>
                      <IconButton
                        aria-label='add'
                        color='secondary'
                        style={{
                          marginTop: '-1px',
                          width: '32px',
                          height: '32px',
                          minHeight: '32px',
                          backgroundColor: '#f7bc78'
                        }}
                        onClick={() =>
                          this.handleRemoveCriteriaButtonPressed(index)
                        }
                      >
                        <ClearIcon style={{ width: '0.8em' }} />
                      </IconButton>
                    </Tooltip>
                  </div>
                )
              } else {
                element.action = (
                  <div>
                    <Tooltip title='Increase Priority'>
                      <IconButton
                        aria-label='add'
                        color='primary'
                        style={{
                          marginTop: '-1px',
                          width: '32px',
                          height: '32px',
                          minHeight: '32px',
                          backgroundColor: '#bde2e8',
                          marginRight: '5px'
                        }}
                        onClick={() =>
                          this.handleIncreasePriorityButtonPressed(index)
                        }
                      >
                        <ExpandLessIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Decrease Priority'>
                      <IconButton
                        aria-label='add'
                        color='primary'
                        style={{
                          marginTop: '-1px',
                          width: '32px',
                          height: '32px',
                          minHeight: '32px',
                          backgroundColor: '#bde2e8',
                          marginRight: '5px'
                        }}
                        onClick={() =>
                          this.handleDecreasePriorityButtonPressed(index)
                        }
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Remove Criteria'>
                      <IconButton
                        aria-label='add'
                        color='secondary'
                        style={{
                          marginTop: '-1px',
                          width: '32px',
                          height: '32px',
                          minHeight: '32px',
                          backgroundColor: '#f7bc78'
                        }}
                        onClick={() =>
                          this.handleRemoveCriteriaButtonPressed(index)
                        }
                      >
                        <ClearIcon style={{ width: '0.8em' }} />
                      </IconButton>
                    </Tooltip>
                  </div>
                )
              }
            })
            console.log(criteriaSelected)
            this.setState({
              criteriaAvailable: criteriaAvailable,
              criteriaSelected: criteriaSelected
            })
          }
        }
      })
  }

  criteriaCheckedUnchecked (idx) {
    let criteriaAvailableUpdated = this.state.criteriaAvailable
    console.log(idx)
    criteriaAvailableUpdated[idx].checked = !criteriaAvailableUpdated[idx]
      .checked
    let criteriaSelectedUpdated = this.state.criteriaSelected
    if (criteriaAvailableUpdated[idx].checked === true) {
      criteriaSelectedUpdated.push(this.state.criteriaAvailable[idx])
      criteriaSelectedUpdated[
        criteriaSelectedUpdated.length - 1
      ].indexInAvailableList = idx
      criteriaSelectedUpdated[
        criteriaSelectedUpdated.length - 1
      ].priorityIfSelected = criteriaSelectedUpdated.length
    } else {
      const indexInSelectedList = criteriaSelectedUpdated.findIndex(function (
        criteria
      ) {
        return criteria.indexInAvailableList === idx
      })
      console.log(indexInSelectedList)
      for (
        let i = indexInSelectedList;
        i < criteriaSelectedUpdated.length;
        i++
      ) {
        criteriaSelectedUpdated[i] = criteriaSelectedUpdated[i + 1]
      }
      criteriaSelectedUpdated = criteriaSelectedUpdated.slice(
        0,
        criteriaSelectedUpdated.length - 1
      )
    }
    console.log(criteriaSelectedUpdated)
    criteriaSelectedUpdated.forEach((element, index) => {
      element.priorityIfSelected = index + 1
      element.sortingOrder = (
        <div class='box'>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={element.selectedOrder}
            onChange={event => this.handleChangeSortingOrder(index, event)}
            style={{ minWidth: 120, color: 'white' }}
            disableUnderline={true}
          >
            {element.sortingOrders.map(order => (
              <MenuItem value={order}>{order}</MenuItem>
            ))}
          </Select>
        </div>
      )
      if (element.selectedOrder === 'Custom') {
        element.action = (
          <div>
            <Tooltip title='Manage Sub-Criteria'>
              <IconButton
                aria-label='add'
                color=''
                style={{
                  marginTop: '-1px',
                  width: '32px',
                  height: '32px',
                  minHeight: '32px',
                  backgroundColor: '#bde2e8',
                  marginRight: '5px'
                }}
                onClick={() => this.manageSubCriteria(index)}
              >
                <DetailsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Increase Priority'>
              <IconButton
                aria-label='add'
                color='primary'
                style={{
                  marginTop: '-1px',
                  width: '32px',
                  height: '32px',
                  minHeight: '32px',
                  backgroundColor: '#bde2e8',
                  marginRight: '5px'
                }}
                onClick={() => this.handleIncreasePriorityButtonPressed(index)}
              >
                <ExpandLessIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Decrease Priority'>
              <IconButton
                aria-label='add'
                color='primary'
                style={{
                  marginTop: '-1px',
                  width: '32px',
                  height: '32px',
                  minHeight: '32px',
                  backgroundColor: '#bde2e8',
                  marginRight: '5px'
                }}
                onClick={() => this.handleDecreasePriorityButtonPressed(index)}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Remove Criteria'>
              <IconButton
                aria-label='add'
                color='secondary'
                style={{
                  marginTop: '-1px',
                  width: '32px',
                  height: '32px',
                  minHeight: '32px',
                  backgroundColor: '#f7bc78'
                }}
                onClick={() => this.handleRemoveCriteriaButtonPressed(index)}
              >
                <ClearIcon style={{ width: '0.8em' }} />
              </IconButton>
            </Tooltip>
          </div>
        )
      } else {
        element.action = (
          <div>
            <Tooltip title='Increase Priority'>
              <IconButton
                aria-label='add'
                color='primary'
                style={{
                  marginTop: '-1px',
                  width: '32px',
                  height: '32px',
                  minHeight: '32px',
                  backgroundColor: '#bde2e8',
                  marginRight: '5px'
                }}
                onClick={() => this.handleIncreasePriorityButtonPressed(index)}
              >
                <ExpandLessIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Decrease Priority'>
              <IconButton
                aria-label='add'
                color='primary'
                style={{
                  marginTop: '-1px',
                  width: '32px',
                  height: '32px',
                  minHeight: '32px',
                  backgroundColor: '#bde2e8',
                  marginRight: '5px'
                }}
                onClick={() => this.handleDecreasePriorityButtonPressed(index)}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Remove Criteria'>
              <IconButton
                aria-label='add'
                color='secondary'
                style={{
                  marginTop: '-1px',
                  width: '32px',
                  height: '32px',
                  minHeight: '32px',
                  backgroundColor: '#f7bc78'
                }}
                onClick={() => this.handleRemoveCriteriaButtonPressed(index)}
              >
                <ClearIcon style={{ width: '0.8em' }} />
              </IconButton>
            </Tooltip>
          </div>
        )
      }
    })
    criteriaAvailableUpdated.forEach((element, index) => {
      element.checkBox = (
        <Checkbox
          icon={<CircleUnchecked />}
          checkedIcon={<CircleCheckedFilled />}
          color='primary'
          onChange={() => this.criteriaCheckedUnchecked(index)}
          checked={element.checked}
        />
      )
    })

    this.setState({
      criteriaSelected: criteriaSelectedUpdated,
      criteriaAvailable: criteriaAvailableUpdated
    })
  }

  handleChangeSortingOrder (index, event) {
    console.log(index)
    console.log(event.target.value)
    let criteriaSelectedUpdated = this.state.criteriaSelected
    criteriaSelectedUpdated[index].sortingOrder = (
      <div class='box'>
        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={event.target.value}
          onChange={event => this.handleChangeSortingOrder(index, event)}
          style={{ minWidth: 120, color: 'white' }}
          disableUnderline={true}
        >
          {criteriaSelectedUpdated[index].sortingOrders.map(order => (
            <MenuItem value={order}>{order}</MenuItem>
          ))}
        </Select>
      </div>
    )
    criteriaSelectedUpdated[index].selectedOrder = event.target.value
    this.setState({ criteriaSelected: criteriaSelectedUpdated })
  }

  handleIncreasePriorityButtonPressed (index) {
    console.log(index)
    console.log(this.state.criteriaSelected)
    if (index !== 0) {
      let criteriaSelectedUpdated = this.state.criteriaSelected
      const temp = criteriaSelectedUpdated[index]
      temp.priorityIfSelected = temp.priorityIfSelected - 1
      criteriaSelectedUpdated[index] = criteriaSelectedUpdated[index - 1]
      criteriaSelectedUpdated[index].priorityIfSelected =
        criteriaSelectedUpdated[index].priorityIfSelected + 1
      criteriaSelectedUpdated[index - 1] = temp
      criteriaSelectedUpdated.forEach((element, index) => {
        element.priorityIfSelected = index + 1
        element.sortingOrder = (
          <div class='box'>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={element.selectedOrder}
              onChange={event => this.handleChangeSortingOrder(index, event)}
              style={{ minWidth: 120, color: 'white' }}
              disableUnderline={true}
            >
              {element.sortingOrders.map(order => (
                <MenuItem value={order}>{order}</MenuItem>
              ))}
            </Select>
          </div>
        )
        if (element.selectedOrder === 'Custom') {
          element.action = (
            <div>
              <Tooltip title='Manage Sub-Criteria'>
                <IconButton
                  aria-label='add'
                  color=''
                  style={{
                    marginTop: '-1px',
                    width: '32px',
                    height: '32px',
                    minHeight: '32px',
                    backgroundColor: '#bde2e8',
                    marginRight: '5px'
                  }}
                  onClick={() => this.manageSubCriteria(index)}
                >
                  <DetailsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Increase Priority'>
                <IconButton
                  aria-label='add'
                  color='primary'
                  style={{
                    marginTop: '-1px',
                    width: '32px',
                    height: '32px',
                    minHeight: '32px',
                    backgroundColor: '#bde2e8',
                    marginRight: '5px'
                  }}
                  onClick={() =>
                    this.handleIncreasePriorityButtonPressed(index)
                  }
                >
                  <ExpandLessIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Decrease Priority'>
                <IconButton
                  aria-label='add'
                  color='primary'
                  style={{
                    marginTop: '-1px',
                    width: '32px',
                    height: '32px',
                    minHeight: '32px',
                    backgroundColor: '#bde2e8',
                    marginRight: '5px'
                  }}
                  onClick={() =>
                    this.handleDecreasePriorityButtonPressed(index)
                  }
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Remove Criteria'>
                <IconButton
                  aria-label='add'
                  color='secondary'
                  style={{
                    marginTop: '-1px',
                    width: '32px',
                    height: '32px',
                    minHeight: '32px',
                    backgroundColor: '#f7bc78'
                  }}
                  onClick={() => this.handleRemoveCriteriaButtonPressed(index)}
                >
                  <ClearIcon style={{ width: '0.8em' }} />
                </IconButton>
              </Tooltip>
            </div>
          )
        } else {
          element.action = (
            <div>
              <Tooltip title='Increase Priority'>
                <IconButton
                  aria-label='add'
                  color='primary'
                  style={{
                    marginTop: '-1px',
                    width: '32px',
                    height: '32px',
                    minHeight: '32px',
                    backgroundColor: '#bde2e8',
                    marginRight: '5px'
                  }}
                  onClick={() =>
                    this.handleIncreasePriorityButtonPressed(index)
                  }
                >
                  <ExpandLessIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Decrease Priority'>
                <IconButton
                  aria-label='add'
                  color='primary'
                  style={{
                    marginTop: '-1px',
                    width: '32px',
                    height: '32px',
                    minHeight: '32px',
                    backgroundColor: '#bde2e8',
                    marginRight: '5px'
                  }}
                  onClick={() =>
                    this.handleDecreasePriorityButtonPressed(index)
                  }
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Remove Criteria'>
                <IconButton
                  aria-label='add'
                  color='secondary'
                  style={{
                    marginTop: '-1px',
                    width: '32px',
                    height: '32px',
                    minHeight: '32px',
                    backgroundColor: '#f7bc78'
                  }}
                  onClick={() => this.handleRemoveCriteriaButtonPressed(index)}
                >
                  <ClearIcon style={{ width: '0.8em' }} />
                </IconButton>
              </Tooltip>
            </div>
          )
        }
      })
      this.setState({ criteriaSelected: criteriaSelectedUpdated })
    }
    //console.log(this.state.criteriaSelected);
  }
  handleDecreasePriorityButtonPressed (index) {
    console.log(this.state.criteriaSelected)
    if (index !== this.state.criteriaSelected.length - 1) {
      let criteriaSelectedUpdated = this.state.criteriaSelected
      const temp = criteriaSelectedUpdated[index]
      temp.priorityIfSelected = temp.priorityIfSelected + 1
      criteriaSelectedUpdated[index] = criteriaSelectedUpdated[index + 1]
      criteriaSelectedUpdated[index].priorityIfSelected =
        criteriaSelectedUpdated[index].priorityIfSelected - 1
      criteriaSelectedUpdated[index + 1] = temp
      criteriaSelectedUpdated.forEach((element, index) => {
        element.priorityIfSelected = index + 1
        element.sortingOrder = (
          <div class='box'>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={element.selectedOrder}
              onChange={event => this.handleChangeSortingOrder(index, event)}
              style={{ minWidth: 120, color: 'white' }}
              disableUnderline={true}
            >
              {element.sortingOrders.map(order => (
                <MenuItem value={order}>{order}</MenuItem>
              ))}
            </Select>
          </div>
        )
        if (element.selectedOrder === 'Custom') {
          element.action = (
            <div>
              <Tooltip title='Manage Sub-Criteria'>
                <IconButton
                  aria-label='add'
                  color=''
                  style={{
                    marginTop: '-1px',
                    width: '32px',
                    height: '32px',
                    minHeight: '32px',
                    backgroundColor: '#bde2e8',
                    marginRight: '5px'
                  }}
                  onClick={() => this.manageSubCriteria(index)}
                >
                  <DetailsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Increase Priority'>
                <IconButton
                  aria-label='add'
                  color='primary'
                  style={{
                    marginTop: '-1px',
                    width: '32px',
                    height: '32px',
                    minHeight: '32px',
                    backgroundColor: '#bde2e8',
                    marginRight: '5px'
                  }}
                  onClick={() =>
                    this.handleIncreasePriorityButtonPressed(index)
                  }
                >
                  <ExpandLessIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Decrease Priority'>
                <IconButton
                  aria-label='add'
                  color='primary'
                  style={{
                    marginTop: '-1px',
                    width: '32px',
                    height: '32px',
                    minHeight: '32px',
                    backgroundColor: '#bde2e8',
                    marginRight: '5px'
                  }}
                  onClick={() =>
                    this.handleDecreasePriorityButtonPressed(index)
                  }
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Remove Criteria'>
                <IconButton
                  aria-label='add'
                  color='secondary'
                  style={{
                    marginTop: '-1px',
                    width: '32px',
                    height: '32px',
                    minHeight: '32px',
                    backgroundColor: '#f7bc78'
                  }}
                  onClick={() => this.handleRemoveCriteriaButtonPressed(index)}
                >
                  <ClearIcon style={{ width: '0.8em' }} />
                </IconButton>
              </Tooltip>
            </div>
          )
        } else {
          element.action = (
            <div>
              <Tooltip title='Increase Priority'>
                <IconButton
                  aria-label='add'
                  color='primary'
                  style={{
                    marginTop: '-1px',
                    width: '32px',
                    height: '32px',
                    minHeight: '32px',
                    backgroundColor: '#bde2e8',
                    marginRight: '5px'
                  }}
                  onClick={() =>
                    this.handleIncreasePriorityButtonPressed(index)
                  }
                >
                  <ExpandLessIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Decrease Priority'>
                <IconButton
                  aria-label='add'
                  color='primary'
                  style={{
                    marginTop: '-1px',
                    width: '32px',
                    height: '32px',
                    minHeight: '32px',
                    backgroundColor: '#bde2e8',
                    marginRight: '5px'
                  }}
                  onClick={() =>
                    this.handleDecreasePriorityButtonPressed(index)
                  }
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Remove Criteria'>
                <IconButton
                  aria-label='add'
                  color='secondary'
                  style={{
                    marginTop: '-1px',
                    width: '32px',
                    height: '32px',
                    minHeight: '32px',
                    backgroundColor: '#f7bc78'
                  }}
                  onClick={() => this.handleRemoveCriteriaButtonPressed(index)}
                >
                  <ClearIcon style={{ width: '0.8em' }} />
                </IconButton>
              </Tooltip>
            </div>
          )
        }
      })
      this.setState({ criteriaSelected: criteriaSelectedUpdated })
    }
    //console.log(this.state.criteriaSelected);
  }
  handleRemoveCriteriaButtonPressed (index) {
    let criteriaSelectedUpdated = this.state.criteriaSelected
    const indexInAvailableList =
      criteriaSelectedUpdated[index].indexInAvailableList
    console.log(indexInAvailableList)
    for (let i = index; i < this.state.criteriaSelected.length; i++) {
      criteriaSelectedUpdated[i] = criteriaSelectedUpdated[i + 1]
    }
    criteriaSelectedUpdated = criteriaSelectedUpdated.slice(
      0,
      this.state.criteriaSelected.length - 1
    )
    console.log(criteriaSelectedUpdated)
    criteriaSelectedUpdated.forEach((element, index) => {
      element.priorityIfSelected = index + 1
      element.sortingOrder = (
        <div class='box'>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={element.selectedOrder}
            onChange={event => this.handleChangeSortingOrder(index, event)}
            style={{ minWidth: 120, color: 'white' }}
            disableUnderline={true}
          >
            {element.sortingOrders.map(order => (
              <MenuItem value={order}>{order}</MenuItem>
            ))}
          </Select>
        </div>
      )
      if (element.selectedOrder === 'Custom') {
        element.action = (
          <div>
            <Tooltip title='Manage Sub-Criteria'>
              <IconButton
                aria-label='add'
                color=''
                style={{
                  marginTop: '-1px',
                  width: '32px',
                  height: '32px',
                  minHeight: '32px',
                  backgroundColor: '#bde2e8',
                  marginRight: '5px'
                }}
                onClick={() => this.manageSubCriteria(index)}
              >
                <DetailsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Increase Priority'>
              <IconButton
                aria-label='add'
                color='primary'
                style={{
                  marginTop: '-1px',
                  width: '32px',
                  height: '32px',
                  minHeight: '32px',
                  backgroundColor: '#bde2e8',
                  marginRight: '5px'
                }}
                onClick={() => this.handleIncreasePriorityButtonPressed(index)}
              >
                <ExpandLessIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Decrease Priority'>
              <IconButton
                aria-label='add'
                color='primary'
                style={{
                  marginTop: '-1px',
                  width: '32px',
                  height: '32px',
                  minHeight: '32px',
                  backgroundColor: '#bde2e8',
                  marginRight: '5px'
                }}
                onClick={() => this.handleDecreasePriorityButtonPressed(index)}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Remove Criteria'>
              <IconButton
                aria-label='add'
                color='secondary'
                style={{
                  marginTop: '-1px',
                  width: '32px',
                  height: '32px',
                  minHeight: '32px',
                  backgroundColor: '#f7bc78'
                }}
                onClick={() => this.handleRemoveCriteriaButtonPressed(index)}
              >
                <ClearIcon style={{ width: '0.8em' }} />
              </IconButton>
            </Tooltip>
          </div>
        )
      } else {
        element.action = (
          <div>
            <Tooltip title='Increase Priority'>
              <IconButton
                aria-label='add'
                color='primary'
                style={{
                  marginTop: '-1px',
                  width: '32px',
                  height: '32px',
                  minHeight: '32px',
                  backgroundColor: '#bde2e8',
                  marginRight: '5px'
                }}
                onClick={() => this.handleIncreasePriorityButtonPressed(index)}
              >
                <ExpandLessIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Decrease Priority'>
              <IconButton
                aria-label='add'
                color='primary'
                style={{
                  marginTop: '-1px',
                  width: '32px',
                  height: '32px',
                  minHeight: '32px',
                  backgroundColor: '#bde2e8',
                  marginRight: '5px'
                }}
                onClick={() => this.handleDecreasePriorityButtonPressed(index)}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Remove Criteria'>
              <IconButton
                aria-label='add'
                color='secondary'
                style={{
                  marginTop: '-1px',
                  width: '32px',
                  height: '32px',
                  minHeight: '32px',
                  backgroundColor: '#f7bc78'
                }}
                onClick={() => this.handleRemoveCriteriaButtonPressed(index)}
              >
                <ClearIcon style={{ width: '0.8em' }} />
              </IconButton>
            </Tooltip>
          </div>
        )
      }
    })
    let criteriaAvailableUpdated = this.state.criteriaAvailable
    criteriaAvailableUpdated[
      indexInAvailableList
    ].checked = !criteriaAvailableUpdated[indexInAvailableList].checked
    console.log(criteriaAvailableUpdated)
    criteriaAvailableUpdated[indexInAvailableList].checkBox = (
      <Checkbox
        defaultChecked={criteriaAvailableUpdated[indexInAvailableList].checked}
        icon={<CircleUnchecked />}
        checkedIcon={<CircleCheckedFilled />}
        color='primary'
        onChange={() => this.criteriaCheckedUnchecked(indexInAvailableList)}
      />
    )
    this.setState({
      criteriaSelected: criteriaSelectedUpdated,
      criteriaAvailable: criteriaAvailableUpdated
    })
  }

  muiTableThemeCriteriaAvailable = () =>
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
          head: {
            backgroundColor: '#f5f8fb !important'
          },
          root: {
            paddingTop: '3px',
            paddingBottom: '3px'
          }
        },
        MUIDataTable: {
          responsiveScroll: {
            maxHeight:
              (this.state.tableHeight * this.state.tableHeightTop) / 100 +
              'px !important'
          }
        }
      }
    })

  muiTableThemeSubCriteriaAvailable = () =>
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
          head: {
            backgroundColor: '#f5f8fb !important'
          },
          root: {
            paddingTop: '3px',
            paddingBottom: '3px'
          }
        },
        MUIDataTable: {
          responsiveScroll: {
            maxHeight:
              (this.state.tableHeight * this.state.tableHeightBottom) / 100 +
              'px !important'
          }
        }
      }
    })

  muiTableThemeCriteriaSelected = () =>
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
          head: {
            backgroundColor: '#f5f8fb !important',
            '&:nth-child(1)': {
              textAlign: 'center',
              paddingLeft: '0px',
              paddingRight: '0px'
            },
            '&:nth-child(2)': {
              textAlign: 'center',
              paddingLeft: '0px'
            },
            '&:nth-child(3)': {
              textAlign: 'center'
              //paddingLeft: '10px'
            },
            '&:nth-child(4)': {
              textAlign: 'center',
              paddingLeft: '5px',
              paddingRight: '5px'
            },
            '&:nth-child(5)': {
              textAlign: 'center'
              //paddingLeft: '5px',
              //paddingRight: '5px'
            }
          },
          root: {
            paddingTop: '5px',
            paddingBottom: '5px'
          }
        },
        MUIDataTable: {
          responsiveScroll: {
            maxHeight:
              (this.state.tableHeight * this.state.tableHeightTop) / 100 +
              'px !important'
          }
        }
      }
    })

  muiTableThemeSubCriteriaSelected = () =>
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
          head: {
            backgroundColor: '#f5f8fb !important'
          },
          root: {
            paddingTop: '5px',
            paddingBottom: '5px',
            '&:nth-child(1)': {
              textAlign: 'center',
              paddingLeft: '0px',
              paddingRight: '0px'
            },
            '&:nth-child(2)': {
              textAlign: 'center',
              paddingLeft: '0px'
            },
            '&:nth-child(3)': {
              textAlign: 'center'
              //paddingLeft: '10px'
            }
          }
        },
        MUIDataTable: {
          responsiveScroll: {
            maxHeight:
              (this.state.tableHeight * this.state.tableHeightBottom) / 100 +
              'px !important'
          }
        }
      }
    })

  render () {
    const optionsCriteriaAvailable = {
      filter: false,
      filterType: 'dropdown',
      selectableRows: 'none',
      print: false,
      responsive: 'scroll',
      //tableBodyHeight: '340px',
      search: false,
      viewColumns: false,
      download: false,
      pagination: false
    }

    const optionsCriteriaSelected = {
      filter: false,
      filterType: 'dropdown',
      selectableRows: 'none',
      print: false,
      responsive: 'scroll',
      //tableBodyHeight: '340px',
      search: false,
      viewColumns: false,
      download: false,
      pagination: false,
      onRowSelectionChange: (
        currentRowsSelected,
        allRowsSelected,
        rowsSelected
      ) => {
        console.log(currentRowsSelected[0].dataIndex)
        console.log(rowsSelected[0])
        const criteriaField = this.state.criteriaSelected[
          currentRowsSelected[0].dataIndex
        ].name
        //criteriaField
        const indexInAvailableList = this.state.criteriaAvailable.findIndex(
          function (criteria) {
            return criteria.name === criteriaField
          }
        )
        console.log(
          this.state.criteriaAvailable[indexInAvailableList].selectedOrder ===
            rankingOrderTextualFields[rankingOrderFiledsCodes.custom]
        )
        console.log(this.state.criteriaAvailable[indexInAvailableList])
        if (
          this.state.criteriaAvailable[indexInAvailableList].selectedOrder ===
          rankingOrderTextualFields[rankingOrderFiledsCodes.custom]
        ) {
          let subCriteriaAvailable = []
          let subCriteriaSelected = []
          this.state.criteriaAvailable[
            indexInAvailableList
          ].rankingSubCriteria.forEach((element, subCriterionIndex) => {
            subCriteriaAvailable.push({
              subCriteriaField: element.name,
              subCriteriaFieldDisplayName: element.displayName,
              checkBox: (
                <Checkbox
                  icon={<CircleUnchecked />}
                  checkedIcon={<CircleCheckedFilled />}
                  color='primary'
                  checked={true}
                />
              )
            })

            subCriteriaSelected.push({
              priority: element.priority,
              subCriteriaField: element.name,
              subCriteriaFieldDisplayName: element.displayName,
              //sortingOrder: <div class="box" style={{ width: '140px', color: "blue" }}>  </div>,
              action: (
                <div>
                  <Tooltip title='Increase Priority'>
                    <IconButton
                      aria-label='add'
                      color='primary'
                      style={{
                        marginTop: '-1px',
                        width: '32px',
                        height: '32px',
                        minHeight: '32px',
                        backgroundColor: '#bde2e8',
                        marginRight: '5px'
                      }}
                      onClick={() =>
                        this.handleIncreaseSubPriorityButtonPressed(
                          currentRowsSelected[0].dataIndex,
                          subCriterionIndex
                        )
                      }
                    >
                      <ExpandLessIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Decrease Priority'>
                    <IconButton
                      aria-label='add'
                      color='primary'
                      style={{
                        marginTop: '-1px',
                        width: '32px',
                        height: '32px',
                        minHeight: '32px',
                        backgroundColor: '#bde2e8',
                        marginRight: '5px'
                      }}
                      onClick={() =>
                        this.handleDecreaseSubPriorityButtonPressed(
                          currentRowsSelected[0].dataIndex,
                          subCriterionIndex
                        )
                      }
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  </Tooltip>
                  {
                    //<Tooltip title="Remove Criteria">
                    //    <IconButton aria-label="add" color="secondary" style={{ marginTop: "-1px", width: "32px", height: "32px", minHeight: "32px", backgroundColor: "#f7bc78" }} onClick={() => this.handleRemoveCriteriaButtonPressed(indexInSelectedList, )}>
                    //        <ClearIcon style={{ width: "0.8em" }} />
                    //    </IconButton>
                    //</Tooltip>
                  }
                </div>
              )
            })
          })
          console.log(this.state.criteriaAvailable[indexInAvailableList])
          subCriteriaSelected.sort(function (a, b) {
            if (a.priority < b.priority) return -1
            if (a.priority > b.priority) return 1
            return 0
          })
          this.setState({
            selectedCriteria: this.state.criteriaAvailable[
              indexInAvailableList
            ],
            subCriteriaAvailable: subCriteriaAvailable,
            subCriteriaSelected: subCriteriaSelected
          })
        } else this.setState({ selectedCriteria: null })
      },
      selectToolbarPlacement: 'none',
      customToolbarSelect: () => {}
    }

    const optionsSubCriteriaAvailable = {
      filter: false,
      filterType: 'dropdown',
      selectableRows: 'none',
      print: false,
      responsive: 'scroll',
      search: false,
      viewColumns: false,
      download: false,
      pagination: false
    }

    const optionsSubCriteriaSelected = {
      filter: false,
      filterType: 'dropdown',
      selectableRows: 'none',
      print: false,
      responsive: 'scroll',
      //tableBodyHeight: '340px',
      search: false,
      viewColumns: false,
      download: false,
      pagination: false
    }

    return (
      <>
        <Dialog
          open={this.state.successfullySaved}
          onClose={() =>
            this.props.updateStateFunction(
              'criteria-view',
              this.props.rankingType
            )
          }
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title' style={{ textAlign: 'center' }}>
            {'Successfully Saved'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id='alert-dialog-description'
              style={{ textAlign: 'center' }}
            >
              Ranking crietria for {this.props.rankingType} type ranking has
              been successfully updated.
            </DialogContentText>
          </DialogContent>
          <DialogActions
            style={{ justifyContent: 'center', marginBottom: '20px' }}
          >
            <Button
              onClick={() =>
                this.props.updateStateFunction(
                  'criteria-view',
                  this.props.rankingType
                )
              }
              color='primary'
              variant='contained'
              autoFocus
            >
              OK
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
                <Breadcrumb.Item
                  onClick={() =>
                    this.props.updateStateFunction(
                      'criteria-view',
                      this.props.rankingType
                    )
                  }
                >
                  View Details
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Edit</Breadcrumb.Item>
              </Breadcrumb>

              <div class='col d-flex justify-content-center edit-ranking-criteria'>
                <Card>
                  <Card.Header>
                    <div className='row'>
                      <div className='col-6'>
                        <Tooltip title='Back'>
                          <IconButton
                            color='black'
                            onClick={() =>
                              this.props.updateStateFunction(
                                'criteria-view',
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
                              'landing',
                              this.props.rankingType
                            )
                          }
                          variant='contained'
                          color='primary'
                          size='medium'
                          disabled={false}
                          //startIcon={<SaveIcon />}
                        >
                          Home
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                          className='mui-ranking-button-right'
                          onClick={this.saveUpdatedCriteria}
                          variant='contained'
                          color='primary'
                          size='medium'
                          disabled={false}
                          //startIcon={<SaveIcon />}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div className='card-criteria'>
                      <Card>
                        <Card.Header>Criteria</Card.Header>
                        <Card.Body>
                          <div className='row'>
                            <div className='col-4 edit-ranking-right-bordered'>
                              <Card>
                                <Card.Body>
                                  <MuiThemeProvider
                                    theme={this.muiTableThemeCriteriaAvailable()}
                                  >
                                    <MUIDataTable
                                      data={this.state.criteriaAvailable}
                                      columns={
                                        this.state.columnsCrieriaAvailable
                                      }
                                      options={optionsCriteriaAvailable}
                                    />
                                  </MuiThemeProvider>
                                </Card.Body>
                              </Card>
                            </div>
                            <div className='col-8'>
                              <Card>
                                <Card.Body>
                                  <MuiThemeProvider
                                    theme={this.muiTableThemeCriteriaSelected()}
                                  >
                                    <MUIDataTable
                                      data={this.state.criteriaSelected}
                                      columns={
                                        this.state.columnsCrieriaSelected
                                      }
                                      options={optionsCriteriaSelected}
                                    />
                                  </MuiThemeProvider>
                                </Card.Body>
                              </Card>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                    {this.state.selectedCriteria &&
                      this.state.selectedCriteria.rankingSubCriteria && (
                        <div className='card-criteria'>
                          <Card style={{ marginTop: '20px' }}>
                            <Card.Header>
                              Sub-Criteria of{' '}
                              <b> {this.state.selectedCriteria.name} </b>
                            </Card.Header>
                            <Card.Body>
                              <div className='row'>
                                <div className='col-4 edit-ranking-right-bordered'>
                                  <Card>
                                    <Card.Body>
                                      <MuiThemeProvider
                                        theme={this.muiTableThemeSubCriteriaAvailable()}
                                      >
                                        <MUIDataTable
                                          data={this.state.subCriteriaAvailable}
                                          columns={
                                            this.state
                                              .columnsSubCrieriaAvailable
                                          }
                                          options={optionsSubCriteriaAvailable}
                                        />
                                      </MuiThemeProvider>
                                    </Card.Body>
                                  </Card>
                                </div>
                                <div className='col-8'>
                                  <Card>
                                    <Card.Body>
                                      <MuiThemeProvider
                                        theme={this.muiTableThemeSubCriteriaSelected()}
                                      >
                                        <MUIDataTable
                                          data={this.state.subCriteriaSelected}
                                          columns={
                                            this.state.columnsSubCrieriaSelected
                                          }
                                          options={optionsSubCriteriaSelected}
                                        />
                                      </MuiThemeProvider>
                                    </Card.Body>
                                  </Card>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
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

export default RankingCriteriaEdit