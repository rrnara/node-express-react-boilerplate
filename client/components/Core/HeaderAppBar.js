import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import AccountCircle from '@material-ui/icons/AccountCircle';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormHelperText from '@material-ui/core/FormHelperText';
import { getUser, userEntity } from '../Actions/User';
import { updateDarkTheme } from '../Actions/UiState';
import { drawerWidth } from './constants';

const useStyles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  appbarRight: {
    flexGrow: 1,
    display: 'flex',
    padding: theme.spacing(0, 1),
    minWidth: '350px',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  accountCircle: {
    marginRight: 5,
  }
});

const mapStateToProps = state => {
  return {
    user: state.entities.user,
    darkTheme: state.uiState.darkTheme,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    doUpdateDarkTheme: darkTheme => {
      dispatch(updateDarkTheme(darkTheme));
    },
  };
};

class HeaderAppBar extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.switchTheme = this.switchTheme.bind(this);
  }

  logout() {}

  handleDrawerOpen() {
    this.props.updateDrawerOpen(true);
  }

  switchTheme(event) {
    this.props.doUpdateDarkTheme(event.target.checked);
  }

  render() {
    const {
      drawerOpen,
      classes,
      user,
      darkTheme
    } = this.props;

    let rightDisplay = null;
    if (user) {
      const themeLabel = darkTheme ? 'Dark' : 'Light';
      rightDisplay = (
        <div className={classes.appbarRight}>
          <FormControlLabel
            control={<Switch checked={darkTheme} color="secondary" onChange={this.switchTheme} />}
            label={themeLabel}
            labelPlacement="top"
          />
          <AccountCircle className={classes.accountCircle} />
          <Typography variant="h6">{user.email}</Typography>
        </div>
      );
    }

    return (
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={this.handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: drawerOpen,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            TestService
          </Typography>
          {rightDisplay}
        </Toolbar>
      </AppBar>
    );
  }
}

HeaderAppBar.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  updateDrawerOpen: PropTypes.func.isRequired,
  user: PropTypes.instanceOf(Object),
  darkTheme: PropTypes.bool,
  theme: PropTypes.instanceOf(Object),
  classes: PropTypes.instanceOf(Object),
  doUpdateDarkTheme: PropTypes.func.isRequired
};

const HeaderAppBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(useStyles, { withTheme: true })(HeaderAppBar));

export default HeaderAppBarContainer;
