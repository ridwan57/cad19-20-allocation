import React, { useState } from 'react'
import SimpleBar from 'simplebar-react'
import { useLocation } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import { CSSTransition } from 'react-transition-group'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBook,
  faBoxOpen,
  faChartPie,
  faClipboardList,
  faCog,
  faFileAlt,
  faHandHoldingUsd,
  faInbox,
  faMapMarkedAlt,
  faSignOutAlt,
  faTable,
  faThLarge,
  faTimes,
  faUserCheck
} from '@fortawesome/free-solid-svg-icons'
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import {
  Nav,
  Badge,
  Image,
  Button,
  Dropdown,
  Accordion,
  Navbar
} from '@themesberg/react-bootstrap'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { Routes } from '../routes'
import ReactHero from '../assets/img/technologies/react-hero-logo.svg'
import ProfilePicture from '../assets/img/team/profile-picture-3.jpg'

import { sideBarOptions } from './../data/SidebarOptions'
import { RouterSharp } from '@material-ui/icons'

function Sidebar (props) {
  function logout () {
    props.history.push('/')
    props.keycloak.logout()
  }

  const location = useLocation()
  const { pathname } = location
  const [show, setShow] = useState(false)
  const contracted = props.contracted ? 'contracted' : ''
  const showClass = show ? 'show' : ''

  const onCollapse = () => setShow(!show)
  const onMouseEnter = () => props.onMouseEnter && props.onMouseEnter()
  const onMouseLeave = () => props.onMouseLeave && props.onMouseLeave()

  const events = isMobile ? {} : { onMouseEnter, onMouseLeave }

  const CollapsableNavItem = props => {
    const { eventKey, title, icon, children = null } = props
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : ''

    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
        <Accordion.Item eventKey={eventKey}>
          <Accordion.Button
            as={Nav.Link}
            className='d-flex justify-content-between align-items-center'
          >
            <span>
              <span className='sidebar-icon'>
                <FontAwesomeIcon icon={icon} />{' '}
              </span>
              <span className='sidebar-text'>{title}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className='multi-level'>
            <Nav className='flex-column'>{children}</Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    )
  }

  const NavItem = props => {
    const {
      title,
      link,
      target,
      icon,
      image,
      badgeText,
      badgeBg,
      badgeColor = 'white'
    } = props
    const classNames = badgeText
      ? 'd-flex justify-content-between align-items-center'
      : ''
    const navItemClassName = link === pathname ? 'active' : ''

    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link as={Link} to={link} target={target} className={classNames}>
          <span>
            {icon ? (
              <span className='sidebar-icon'>
                <FontAwesomeIcon icon={icon} />{' '}
              </span>
            ) : null}
            {image ? (
              <Image
                src={image}
                width={20}
                height={20}
                className='sidebar-icon svg-icon'
              />
            ) : null}

            {!show && contracted && !icon && !image ? (
              <span className='sidebar-text-contracted'>{title[0]}</span>
            ) : null}

            <span className='sidebar-text'>{title}</span>
          </span>
          {badgeText ? (
            <Badge
              pill
              bg={badgeBg}
              text={badgeColor}
              className='badge-md notification-count'
            >
              {badgeText}
            </Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    )
  }

  return (
    <>
      <Navbar
        expand={false}
        collapseOnSelect
        variant='dark'
        className='navbar-theme-primary px-4 d-md-none'
      >
        <Navbar.Brand as={Link} className='me-lg-5' to={'/'}>
          <Image src={ReactHero} className='navbar-brand-light' />
        </Navbar.Brand>
        <Navbar.Toggle
          as={Button}
          aria-controls='main-navbar'
          onClick={onCollapse}
        >
          <span className='navbar-toggler-icon' />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={500} in={show} classNames='sidebar-transition'>
        <SimpleBar
          {...events}
          className={`${contracted} collapse ${showClass} sidebar d-md-block bg-primary text-white`}
        >
          <div className='sidebar-inner px-4 py-3 overflow-hidden'>
            <div className='user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4'>
              <div className='d-flex align-items-center'>
                <div className='user-avatar lg-avatar me-4'>
                  <Image
                    src={ProfilePicture}
                    className='card-img-top rounded-circle border-white'
                  />
                </div>
                <div className='d-block'>
                  <h6>Hi, Jane</h6>
                  <Button
                    as={Link}
                    variant='secondary'
                    size='xs'
                    to={'/'}
                    className='text-dark'
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className='me-2' />{' '}
                    Sign Out
                  </Button>
                </div>
              </div>
              <Nav.Link
                className='collapse-close d-md-none'
                onClick={onCollapse}
              >
                <FontAwesomeIcon icon={faTimes} />
              </Nav.Link>
            </div>
            <Nav className='flex-column pt-3 pt-md-0'>
              <NavItem
                styl={{ paddingTop: '70px' }}
                link={'/'}
                title='IEIMS'
                image={ReactHero}
              />
              <br />
              <br />

              {sideBarOptions[props.keycloak.realmRole].map(
                element =>
                  (element.type === 'single' && (
                    <NavItem
                      key={element.title}
                      title={element.title}
                      link={element.link}
                      multiLinks={element.multiLinks}
                      icon={element.icon}
                    />
                  )) ||
                  (element.type === 'collapsable' && (
                    <CollapsableNavItem
                      key={element.eventKey}
                      eventKey={element.eventKey}
                      title={element.title}
                      icon={element.icon}
                    >
                      {props.applicant &&
                        element.items[props.applicant.applicationStatus].map(
                          subElement => (
                            <NavItem
                              title={subElement.title}
                              link={subElement.link}
                            />
                          )
                        )}
                      {!props.applicant &&
                        element.items.map(subElement => (
                          <NavItem
                            key={subElement.title}
                            title={subElement.title}
                            link={subElement.link}
                          />
                        ))}
                    </CollapsableNavItem>
                  ))
              )}
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  )
}

export default withRouter(Sidebar)
