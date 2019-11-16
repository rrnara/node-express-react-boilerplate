import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withRouter } from 'react-router-dom';

function ListItemLink(props) {
  const { icon, primary, to } = props;

  const openLink = () => {
    props.history.push(to);
  };

  return (
    <li>
      <ListItem button onClick={openLink} selected={props.location.pathname === props.to}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

ListItemLink.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  history: PropTypes.instanceOf(Object),
};

export default withRouter(ListItemLink);
