import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { routes } from './constants';
import { updateDarkTheme } from '../Actions/UiState';
import { logout } from '../Actions/Auth';
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
    darkTheme: state.uiState.darkTheme
  };
};

const mapDispatchToProps = dispatch => {
  return {
    doLogout: () => {
      dispatch(logout());
    },
    doUpdateDarkTheme: darkTheme => {
      dispatch(updateDarkTheme(darkTheme));
    },
  };
};

class HeaderAppBar extends Component {
  constructor(props) {
    super(props);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.openProfile = this.openProfile.bind(this);
    this.logout = this.logout.bind(this);
    this.switchTheme = this.switchTheme.bind(this);
    this.state = { menuAnchor: null };
  }

  handleDrawerOpen() {
    this.props.updateDrawerOpen(true);
  }

  handleMenuOpen(event) {
    this.setState({ menuAnchor: event.currentTarget });
  }

  handleMenuClose() {
    this.setState({ menuAnchor: null });
  }

  openProfile() {
    this.handleMenuClose();
    this.props.history.push(routes.loggedIn.profile.path);
  }

  logout() {
    this.handleMenuClose();
    this.props.doLogout();
  }

  switchTheme(event) {
    this.props.doUpdateDarkTheme(event.target.checked);
  }

  render() {
    const { menuAnchor } = this.state;
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
          <MenuItem onClick={this.handleMenuOpen}>
            <AccountCircle className={classes.accountCircle} />
            <Typography variant="h6">{user.email}</Typography>
          </MenuItem>
          <Menu
            anchorEl={menuAnchor}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={!!menuAnchor}
            onClose={this.handleMenuClose}
          >
            <MenuItem onClick={this.openProfile}>Profile</MenuItem>
            <MenuItem onClick={this.logout}>Logout</MenuItem>
          </Menu>
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
)(withRouter(withStyles(useStyles, { withTheme: true })(HeaderAppBar)));

export default HeaderAppBarContainer;
