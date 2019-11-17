import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';

const mapStateToProps = state => {
  return {
    user: state.entities.user
  };
};

class Profile extends React.Component {
  render () {
    return (
      <div>
        <Typography variant="h2" gutterBottom>Profile!</Typography>
        <Typography variant="subtitle1" gutterBottom>
          {JSON.stringify(this.props.user)}
        </Typography>
      </div>
    );
  }
}

const ProfileContainer = connect(
  mapStateToProps,
  null
)(Profile);

export { ProfileContainer as default };
