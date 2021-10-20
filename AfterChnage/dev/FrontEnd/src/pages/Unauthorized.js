import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import unauthorizedImage from '../assets/img/401.svg';
import { Image } from '@themesberg/react-bootstrap';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import '../styles/Rashed.css';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function Unauthorized() {
  const classes = useStyles();
  let history = useHistory();

  const redirect = () => {
    history.push('/')
  }

  return (
    <div className={classes.root}>

      <div className="unauth">
        <div>
          <Image src={unauthorizedImage} />
        </div>
        <div className="header">
          No Authorization Found for This Page.
        </div>
        <div className="message">
          Click below to get back to your HomePage.<br />
        </div>
        <div className="button" style={{textAlign:'center'}}>
          <div>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              disabled={false}
              onClick={redirect}
            >
              RETURN HOME
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

