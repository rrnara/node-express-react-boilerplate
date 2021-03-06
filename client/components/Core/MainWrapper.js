import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormLabel from '@material-ui/core/FormLabel';
import { routes, routeTypes } from './constants';
import HeaderAppBar from './HeaderAppBar';
import SideDrawer from './SideDrawer';
import { getUser, userEntity } from '../Actions/User';
import { HTTP_GET, getRequestState } from '../../utils/api';
import Copyright from './Copyright';

const useStyles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: Object.assign({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexBasis: 'auto',
    flexGrow: 0,
    flexShrink: 0,
    padding: theme.spacing(0, 1),
  }, theme.mixins.toolbar),
  parentContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '100vh',
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  content: {
    minHeight: '0px',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    overflow: 'auto',
  },
});

const mapStateToProps = state => {
  return {
    user: state.entities.user,
    bearerToken: state.auth.bearerToken,
    requestState: getRequestState(state, HTTP_GET, userEntity)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    doGetUser: () => {
      dispatch(getUser());
    }
  };
};

class MainWrapper extends Component {
  constructor(props) {
    super(props);
    this.updateDrawerOpen = this.updateDrawerOpen.bind(this);
    this.state = { open: false };
  }

  componentDidMount() {
    this.fetchUser();
  }

  componentDidUpdate(prevProps) {
    const { bearerToken } = this.props;
    if (bearerToken !== prevProps.bearerToken) {
      this.fetchUser();
    }
  }

  fetchUser() {
    // If we have a bearer token, fetch the user
    if (this.props.bearerToken) {
      this.props.doGetUser();
    }
  }

  updateDrawerOpen(open) {
    this.setState({ open });
  }

  render() {
    const { open } = this.state;
    const {
      classes,
      requestState,
      bearerToken,
      type
    } = this.props;

    let childComponent = this.props.children;
    if (type === routeTypes.loggedIn) {
      if (!bearerToken) {
        return (
          <Redirect
            to={routes.loggedOut.root.path}
          />
        );
      }

      if (!requestState.done) {
        childComponent = <CircularProgress />;
      } else if (requestState.error) {
        childComponent = (
          <FormLabel error>
            Error occured: {requestState.error.error}
          </FormLabel>
        );
      }
    } else if (type === routeTypes.loggedOut) {
      if (bearerToken) {
        return (
          <Redirect
            to={routes.loggedIn.root.path}
          />
        );
      }
    }

    return (
      <div className={classes.root}>
        <CssBaseline />
        <HeaderAppBar
          updateDrawerOpen={this.updateDrawerOpen}
          drawerOpen={open}
        />
        <SideDrawer
          open={open}
          updateDrawerOpen={this.updateDrawerOpen}
          toolbarClass={classes.toolbar}
        />
        <main className={classes.parentContainer}>
          <div className={classes.toolbar} />
          <div className={classes.content}>
            {childComponent}
            <Copyright />
          </div>
        </main>
      </div>
    );
  }
}

MainWrapper.propTypes = {
  requestState: PropTypes.instanceOf(Object),
  theme: PropTypes.instanceOf(Object),
  classes: PropTypes.instanceOf(Object),
  doGetUser: PropTypes.func.isRequired
};

const MainWrapperContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(useStyles, { withTheme: true })(MainWrapper));

export default MainWrapperContainer;
