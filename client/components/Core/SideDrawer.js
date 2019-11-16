import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { routes } from './constants';
import ListItemLink from './ListItemLink';
import { drawerWidth } from './constants';

const useStyles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  }
});

const mapStateToProps = state => {
  return {
    user: state.entities.user
  };
};

const generateList = (type) => {
  const listItems = [];
  const routesForType = routes[type];
  Object.keys(routesForType).forEach(key => {
    const route = routesForType[key];
    if (route.drawerMenuIcon) {
      listItems.push(
        <ListItemLink
        key={`sidebar_${type}_${key}`}
          to={route.path}
          primary={route.label}
          icon={React.createElement(route.drawerMenuIcon)}
        />
      )
    }
  });
  return (
    <List>
      {listItems}
    </List>
  );
};

class SideDrawer extends Component {
  constructor(props) {
    super(props);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
  }

  handleDrawerOpen() {
    this.props.updateDrawerOpen(true);
  }

  handleDrawerClose() {
    this.props.updateDrawerOpen(false);
  }

  render() {
    const {
      open,
      classes,
      theme,
      user,
      toolbarClass
    } = this.props;

    return (
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        open={open}
      >
        <div className={toolbarClass}>
          <IconButton onClick={this.handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        {generateList(user ? 'loggedIn' : 'loggedOut')}
        <Divider />
        {generateList('common')}
      </Drawer>
    );
  }
}

SideDrawer.propTypes = {
  user: PropTypes.instanceOf(Object),
  theme: PropTypes.instanceOf(Object),
  classes: PropTypes.instanceOf(Object),
  open: PropTypes.bool.isRequired,
  updateDrawerOpen: PropTypes.func.isRequired,
  toolbarClass: PropTypes.string
};

const SideDrawerContainer = connect(
  mapStateToProps,
  null,
)(withStyles(useStyles, { withTheme: true })(SideDrawer));

export default SideDrawerContainer;
