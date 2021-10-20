import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { Breadcrumb } from '@themesberg/react-bootstrap'
import {
  Col,
  Row,
  Nav,
  Card,
  Image,
  Button,
  Table,
  Dropdown,
  ProgressBar,
  Pagination,
  ButtonGroup
} from '@themesberg/react-bootstrap'
import { CardHeader } from 'semantic-ui-react'
import '../../styles/Rashed.css'

class SSCresult extends Component {
  constructor (props) {
    super(props)
    this.state = {
      singleColumn: false
    }
  }
  handleResize = e => {
    if (window.innerWidth < 1200) {
      this.setState({ singleColumn: true })
    } else {
      this.setState({ singleColumn: false })
    }
  }
  omponentWillMount () {
    window.addEventListener('resize', this.handleResize)
  }
  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
    if (window.innerWidth < 1200) {
      this.setState({ singleColumn: true })
    }
  }
  render () {
    return (
      <>
        {window.innerWidth}
        <div className='flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4'>
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
              <Breadcrumb.Item active>SSC Result</Breadcrumb.Item>
            </Breadcrumb>
            <h4 style={{ textAlign: 'center' }}>
              Detailed Result of Secondary School Certificate (SSC) Examination
            </h4>
            <div class='col d-flex justify-content-center'>
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
                  <h5>
                    <b>{this.props.applicant.name}</b>
                  </h5>
                </Card.Header>
                <Card.Body style={{ marginLeft: '0', fontSize: 'small' }}>
                  <Row>
                    <Col>
                      <h7
                        style={{
                          display: 'inline',
                          fontSize: '15px',
                          fontWeight: 'bold'
                        }}
                      >
                        Roll No.:
                      </h7>{' '}
                      {this.props.applicant.sscinfo.roll}
                    </Col>
                    <Col>
                      <h7
                        style={{
                          display: 'inline',
                          fontSize: '15px',
                          fontWeight: 'bold'
                        }}
                      >
                        Board:
                      </h7>{' '}
                      {this.props.applicant.sscinfo.board}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <h7
                        style={{
                          display: 'inline',
                          fontSize: '15px',
                          fontWeight: 'bold'
                        }}
                      >
                        Group:
                      </h7>{' '}
                      {this.props.applicant.sscinfo.group}
                    </Col>
                    <Col>
                      <h7
                        style={{
                          display: 'inline',
                          fontSize: '15px',
                          fontWeight: 'bold'
                        }}
                      >
                        Passing Year:
                      </h7>{' '}
                      {this.props.applicant.sscinfo.passingyear}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
        <Card border='light' className='shadow-sm mb-4'>
          <Card.Body className='pb-0'>
            <Table
              responsive
              className='table-centered table-nowrap rounded mb-0 ssc-result-table'
            >
              {!this.state.singleColumn && (
                <thead className='thead-light'>
                  <tr>
                    <th className='border-0'>Subject Code</th>
                    <th className='border-0'>Subject Name</th>
                    <th className='border-0'>Obtained Marks</th>
                    <th className='border-0'>Letter Grade</th>
                    <th className='border-0'>Grade Point</th>
                  </tr>
                </thead>
              )}
              {this.state.singleColumn && (
                <thead className='thead-light'>
                  <tr>
                    <th className='border-0'>
                      Subject
                      <br />
                      Code
                    </th>
                    <th className='border-0'>
                      Subject
                      <br />
                      Name
                    </th>
                    <th className='border-0'>
                      Obtained
                      <br />
                      Marks
                    </th>
                    <th className='border-0'>
                      Letter
                      <br />
                      Grade
                    </th>
                    <th className='border-0'>
                      Grade
                      <br />
                      Point
                    </th>
                  </tr>
                </thead>
              )}
              <tbody>
                <tr>
                  <td>{this.props.applicant.sscresult[0].subjectcode}</td>
                  <td>{this.props.applicant.sscresult[0].subjectname}</td>
                  <td>{this.props.applicant.sscresult[0].marks}</td>
                  <td>{this.props.applicant.sscresult[0].lettergrade}</td>
                  <td rowSpan='2' style={{ verticalAlign: 'middle' }}>
                    {this.props.applicant.sscresult[0].gradepoint}
                  </td>
                </tr>
                <tr>
                  <td>{this.props.applicant.sscresult[1].subjectcode}</td>
                  <td>{this.props.applicant.sscresult[1].subjectname}</td>
                  <td>{this.props.applicant.sscresult[1].marks}</td>
                  <td>{this.props.applicant.sscresult[1].lettergrade}</td>
                </tr>
                <tr>
                  <td>{this.props.applicant.sscresult[2].subjectcode}</td>
                  <td>{this.props.applicant.sscresult[2].subjectname}</td>
                  <td>{this.props.applicant.sscresult[2].marks}</td>
                  <td>{this.props.applicant.sscresult[2].lettergrade}</td>
                  <td rowSpan='2' style={{ verticalAlign: 'middle' }}>
                    {this.props.applicant.sscresult[2].gradepoint}
                  </td>
                </tr>
                <tr>
                  <td>{this.props.applicant.sscresult[3].subjectcode}</td>
                  <td>{this.props.applicant.sscresult[3].subjectname}</td>
                  <td>{this.props.applicant.sscresult[3].marks}</td>
                  <td>{this.props.applicant.sscresult[3].lettergrade}</td>
                </tr>
                {this.props.applicant.sscresult.slice(4).map(student => (
                  <tr>
                    <td>{student.subjectcode}</td>
                    <td>{student.subjectname}</td>
                    <td>{student.marks}</td>
                    <td>{student.lettergrade}</td>
                    <td>{student.gradepoint}</td>
                  </tr>
                ))}
                <tr>
                  <td
                    style={{
                      textAlign: 'left',
                      fontWeight: 'bold',
                      borderBottom: '0'
                    }}
                  ></td>
                  {!this.state.singleColumn && (
                    <td
                      style={{
                        textAlign: 'left',
                        fontWeight: 'bold',
                        borderBottom: '0'
                      }}
                    ></td>
                  )}
                  <td
                    colSpan={
                      (!this.state.singleColumn && '2') ||
                      (this.state.singleColumn && '3')
                    }
                    style={{ textAlign: 'center', fontWeight: 'bold' }}
                  >
                    Grade Point in Average (GPA) with 4th Subject
                  </td>
                  <td style={{ textAlign: 'left', fontWeight: 'bold' }}>
                    {this.props.applicant.sscinfo.gpaw4th}
                  </td>
                </tr>
                <tr>
                  <td></td>
                  {!this.state.singleColumn && <td></td>}
                  <td
                    colSpan={
                      (!this.state.singleColumn && '2') ||
                      (this.state.singleColumn && '3')
                    }
                    style={{ textAlign: 'center', fontWeight: 'bold' }}
                  >
                    Grade Point in Average (GPA) with 4th Subject
                  </td>
                  <td style={{ textAlign: 'left', fontWeight: 'bold' }}>
                    {this.props.applicant.sscinfo.gpaw4th}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </>
    )
  }
}

export default SSCresult