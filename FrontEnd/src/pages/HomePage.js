import React, { Component, useState, useEffect } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Routes } from '../routes'

import Keycloak from 'keycloak-js'
import jwt_decode from 'jwt-decode'

// contant data
import {
  studentModuleRootAddress,
  institutionModuleRootAddress
} from '../data/constants'
import { sideBarOptions } from '../data/SidebarOptions'

// components
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Preloader from '../components/Preloader'

// pages
import Home from './Home'

// pages for Student Module
import StudentProfile from './student-module/StudentProfile'
import SSCResult from './student-module/SSCResult'
import SearchCollege from './student-module/SearchCollege'
import SubmitApplication from './student-module/application/SubmitApplication'
import ViewApplication from './student-module/application/ViewApplication'
import PaymentHistory from './student-module/PaymentHistory'

// pages for Institution Module
import Dashboard from './institution-module/Dashboard'
import ViewUpdateSVG from './institution-module/ViewUpdateSVG'
import ManageSQApplications from './institution-module/ManageSQApplications'
import UploadAdmissionData from './institution-module/UploadAdmissionData'
import AllocatedApplicants from './institution-module/AllocatedApplicants'

// pages for Board Modules
import RankingLanding from './board-module/RankingLanding'
import PreRanking from './board-module/PreRanking'
import PostRanking from './board-module/PostRanking'
import CreateSchedule from './board-module/CreateSchedule'

import Unauthorized from './Unauthorized'
import { CADApplicationStatuses } from './institution-module/ApplicationStatuses'

const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Route
      {...rest}
      render={props => (
        <>
          {' '}
          <Preloader show={loaded ? false : true} /> <Component {...props} />{' '}
        </>
      )}
    />
  )
}

const RouteWithSidebar = ({
  component: Component,
  applicant: Applicant,
  institute: Institute,
  updateFunctions: functionList,
  keycloak: Keycloak,
  category: Category,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const resize = () => {
    var resize = setInterval(() => {
      window.dispatchEvent(new Event('resize'))
    }, 10)
    setTimeout(function () {
      clearInterval(resize)
    }, 301)
  }

  const localStorageIsContracted = () => {
    return localStorage.getItem('sidebarContracted') === 'false' ? false : true
  }

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem('settingsVisible') === 'false' ? false : true
  }

  const [contracted, setContracted] = useState(localStorageIsContracted())
  const [contractSidebar, setContractSidebar] = useState(
    localStorageIsContracted()
  )
  const [showSettings, setShowSettings] = useState(
    localStorageIsSettingsVisible
  )

  const toggleMouseOver = () => {
    if (contracted) {
      setContractSidebar(!contractSidebar)
    }
    resize()
  }

  const toggleContracted = () => {
    setContracted(!contracted)
    setContractSidebar(!contracted)
    localStorage.setItem('sidebarContracted', !contracted)
    resize()
  }

  const toggleSettings = () => {
    setShowSettings(!showSettings)
    localStorage.setItem('settingsVisible', !showSettings)
  }

  return (
    <Route
      {...rest}
      render={props => (
        <>
          <Preloader show={loaded ? false : true} />
          <Sidebar
            applicant={Applicant}
            keycloak={Keycloak}
            institute={Institute}
            contracted={contractSidebar}
            onMouseEnter={toggleMouseOver}
            onMouseLeave={toggleMouseOver}
          />

          <main className='content'>
            <Navbar
              applicant={Applicant}
              keycloak={Keycloak}
              institute={Institute}
              toggleContracted={toggleContracted}
            />
            <Component
              {...props}
              applicant={Applicant}
              institute={Institute}
              updateFunctions={functionList}
              keycloak={Keycloak}
              category={Category}
            />

            <Footer
              toggleSettings={toggleSettings}
              showSettings={showSettings}
            />
          </main>
        </>
      )}
    />
  )
}

class HomePage extends Component {
  componentDidMount () {
    // Check authentication with keycloak
    const keycloak = Keycloak('/keycloak.json')
    keycloak.init({ onLoad: 'login-required' }).then(authenticated => {
      const tokenDecoded = jwt_decode(keycloak.token)
      console.log(tokenDecoded)
      keycloak.resourceRole = tokenDecoded.resource_access.CAD.roles[0]
      tokenDecoded.realm_access.roles.forEach(role => {
        for (const [key, value] of Object.entries(sideBarOptions)) {
          if (role === key) {
            keycloak.realmRole = role
            break
          }
        }
      })

      console.log(keycloak.realmRole)
      // if the user posses the "student" role then fetch the applicant info
      if (keycloak.resourceRole === 'student') {
        fetch(studentModuleRootAddress + '/getApplicantByCRVS/', {
          headers: {
            Authorization: `bearer ${keycloak.token}`
          }
        })
          .then(response => response.json())
          .then(data => {
            console.log(data.result)
            if (data.result?.applicationStatus) {
              console.log(data.result.length)
              this.setState({ applicant: data.result })
            } else {
              console.log('Else')
              this.setState({
                applicant: {
                  // applicationStatus: 0
                  applicationStatus: CADApplicationStatuses.NotApplied
                }
              })
            }
          })
      }

      if (keycloak.resourceRole === 'institute') {
        fetch(institutionModuleRootAddress + '/getInstitution/', {
          headers: {
            Authorization: `bearer ${keycloak.token}`
          }
        })
          .then(response => response.json())
          .then(data => {
            console.log(data.result)
            if (data.result?.eiin) {
              this.setState({ institute: data.result })
            }
          })
      }
      this.setState({ keycloak: keycloak, authenticated: authenticated })
    })

    //console.log(thisApplicant);
  }

  constructor (props) {
    super(props)
    this.state = {
      keycloak: null,
      authenticated: false,
      applicant: null,
      institute: null
    }

    this.updateApplicationStatus = this.updateApplicationStatus.bind(this)
    this.updateChoiceList = this.updateChoiceList.bind(this)
  }

  updateApplicationStatus (newApplicationStatus) {
    console.log('Application Status Updated')
    let newApplicant = new Object(this.state.applicant)
    newApplicant.applicationStatus = newApplicationStatus
    this.setState({ applicant: newApplicant })
  }
  updateChoiceList (newChoices) {
    let newApplicant = new Object(this.state.applicant)
    newApplicant.choices = newChoices
    this.setState({ applicant: newApplicant })
  }

  render () {
    if (this.state.keycloak) {
      if (this.state.authenticated) {
        if (this.state.keycloak.realmRole == 'student-user') {
          if (this.state.applicant) {
            console.log('Inside Student User')
            return (
              <Switch>
                {/* pages for Student Module */}
                <RouteWithSidebar
                  exact
                  path={Routes.studentUser.MyProfile.path}
                  component={StudentProfile}
                  applicant={this.state.applicant}
                  keycloak={this.state.keycloak}
                />

                <RouteWithSidebar
                  exact
                  path={Routes.studentUser.SSCResult.path}
                  component={SSCResult}
                  applicant={this.state.applicant}
                  keycloak={this.state.keycloak}
                />

                <RouteWithSidebar
                  exact
                  path={Routes.studentUser.SearchCollege.path}
                  component={SearchCollege}
                  applicant={this.state.applicant}
                  keycloak={this.state.keycloak}
                />

                <RouteWithSidebar
                  exact
                  path={Routes.studentUser.Application.SubmitApplication.path}
                  component={
                    // (this.state.applicant.applicationStatus < 2
                    (this.state.applicant.applicationStatus <=
                      CADApplicationStatuses.Submitted &&
                      SubmitApplication) ||
                    ViewApplication
                  }
                  applicant={this.state.applicant}
                  updateFunctions={{
                    applicationStatusUpdater: this.updateApplicationStatus,
                    choiceUpdater: this.updateChoiceList
                  }}
                  keycloak={this.state.keycloak}
                />

                <RouteWithSidebar
                  exact
                  path={
                    Routes.studentUser.Application.ViewApplication.path +
                    '/:status'
                  }
                  component={ViewApplication}
                  applicant={this.state.applicant}
                  updateFunctions={{
                    applicationStatusUpdater: this.updateApplicationStatus,
                    choiceUpdater: this.updateChoiceList
                  }}
                  keycloak={this.state.keycloak}
                />

                <RouteWithSidebar
                  exact
                  path={Routes.studentUser.Application.ViewApplication.path}
                  component={ViewApplication}
                  applicant={this.state.applicant}
                  updateFunctions={{
                    applicationStatusUpdater: this.updateApplicationStatus,
                    choiceUpdater: this.updateChoiceList
                  }}
                  keycloak={this.state.keycloak}
                />

                <RouteWithSidebar
                  exact
                  path={Routes.studentUser.PaymentHistory.path}
                  component={PaymentHistory}
                  applicant={this.state.applicant}
                  updateFunctions={{
                    applicationStatusUpdater: this.updateApplicationStatus,
                    choiceUpdater: this.updateChoiceList
                  }}
                  keycloak={this.state.keycloak}
                />

                <Route component={Unauthorized} />
              </Switch>
            )
          }
        } else if (this.state.keycloak.realmRole === 'cad-institute') {
          if (this.state.institute) {
            return (
              <Switch>
                {/* pages for Institution Module */}

                <RouteWithSidebar
                  exact
                  path={Routes.cadInstitution.Dashboard.path}
                  component={Dashboard}
                  applicant={this.state.applicant}
                  institute={this.state.institute}
                  updateFunctions={{
                    applicationStatusUpdater: this.updateApplicationStatus,
                    choiceUpdater: this.updateChoiceList
                  }}
                  keycloak={this.state.keycloak}
                />

                <RouteWithSidebar
                  exact
                  path={Routes.cadInstitution.ViewUpdateSVG.path}
                  component={ViewUpdateSVG}
                  applicant={this.state.applicant}
                  institute={this.state.institute}
                  updateFunctions={{
                    applicationStatusUpdater: this.updateApplicationStatus,
                    choiceUpdater: this.updateChoiceList
                  }}
                  keycloak={this.state.keycloak}
                />

                <RouteWithSidebar
                  exact
                  path={Routes.cadInstitution.ManageSQApplications.path}
                  component={ManageSQApplications}
                  applicant={this.state.applicant}
                  institute={this.state.institute}
                  updateFunctions={{
                    applicationStatusUpdater: this.updateApplicationStatus,
                    choiceUpdater: this.updateChoiceList
                  }}
                  keycloak={this.state.keycloak}
                />
                <RouteWithSidebar
                  exact
                  path={Routes.cadInstitution.AllocatedApplicants.path}
                  component={AllocatedApplicants}
                  applicant={this.state.applicant}
                  institute={this.state.institute}
                  updateFunctions={{
                    applicationStatusUpdater: this.updateApplicationStatus,
                    choiceUpdater: this.updateChoiceList
                  }}
                  keycloak={this.state.keycloak}
                />
                <Route component={Unauthorized} />
              </Switch>
            )
          }
        } else if (this.state.keycloak.realmRole === 'non-cad-institute') {
          console.log('This is a non CAD Institute')
          if (this.state.institute) {
            return (
              <Switch>
                {/* pages for Institution Module */}

                <RouteWithSidebar
                  exact
                  path={Routes.nonCadInstitution.Dashboard.path}
                  component={Dashboard}
                  applicant={this.state.applicant}
                  institute={this.state.institute}
                  updateFunctions={{
                    applicationStatusUpdater: this.updateApplicationStatus,
                    choiceUpdater: this.updateChoiceList
                  }}
                  keycloak={this.state.keycloak}
                />

                <RouteWithSidebar
                  exact
                  path={Routes.nonCadInstitution.ViewUpdateSVG.path}
                  component={ViewUpdateSVG}
                  applicant={this.state.applicant}
                  institute={this.state.institute}
                  updateFunctions={{
                    applicationStatusUpdater: this.updateApplicationStatus,
                    choiceUpdater: this.updateChoiceList
                  }}
                  keycloak={this.state.keycloak}
                />
                <RouteWithSidebar
                  exact
                  path={Routes.nonCadInstitution.UploadAdmissionData.path}
                  component={UploadAdmissionData}
                  applicant={this.state.applicant}
                  institute={this.state.institute}
                  updateFunctions={{
                    applicationStatusUpdater: this.updateApplicationStatus,
                    choiceUpdater: this.updateChoiceList
                  }}
                  keycloak={this.state.keycloak}
                />
                <Route component={Unauthorized} />
              </Switch>
            )
          }
        } else if (this.state.keycloak.realmRole === 'board-admin') {
          console.log('This is a Board Admin')
          return (
            <Switch>
              {/* pages for Institution Module */}

              <RouteWithSidebar
                exact
                path={Routes.board.Configuration.PreRanking.path}
                component={PreRanking}
                //applicant={this.state.applicant}
                //institute={this.state.institute}
                //updateFunctions={{
                //  applicationStatusUpdater: this.updateApplicationStatus,
                //  choiceUpdater: this.updateChoiceList
                //}}
                category='pre-ranking'
                keycloak={this.state.keycloak}
              />

              <RouteWithSidebar
                exact
                path={Routes.board.StudentAllocation.PostRanking.path}
                component={PostRanking}
                //applicant={this.state.applicant}
                //institute={this.state.institute}
                //updateFunctions={{
                //  applicationStatusUpdater: this.updateApplicationStatus,
                //  choiceUpdater: this.updateChoiceList
                //}}
                category={'post-ranking'}
                keycloak={this.state.keycloak}
              />

              {/* <RouteWithSidebar
                exact path={Routes.board.Ranking.CriteriaView.path}
                component={Ranking}
                //applicant={this.state.applicant}
                //institute={this.state.institute}
                //updateFunctions={{
                //  applicationStatusUpdater: this.updateApplicationStatus,
                //  choiceUpdater: this.updateChoiceList
                //}}
                keycloak={this.state.keycloak}
              /> */}

              <RouteWithSidebar
                exact
                path={Routes.board.Configuration.Scheduling.path}
                component={CreateSchedule}
                //applicant={this.state.applicant}
                //institute={this.state.institute}
                //updateFunctions={{
                //  applicationStatusUpdater: this.updateApplicationStatus,
                //  choiceUpdater: this.updateChoiceList
                //}}
                keycloak={this.state.keycloak}
              />

              <Route component={Unauthorized} />
            </Switch>
          )
        }
      }
    } else return <div></div>
    return (
      <>Text</>
      /*
        <Switch>
          
                <Router
                  component={Unauthorized}
                />
      </Switch>
      */
    )
  }
}

export default HomePage
