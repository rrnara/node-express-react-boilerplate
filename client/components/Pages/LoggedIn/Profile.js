import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { authEntity, setPassword } from '../../Actions/Auth';
import { createUser, userEntity } from '../../Actions/User';
import { HTTP_POST, HTTP_PUT, getRequestState } from '../../../utils/api';
import { formToObject } from '../Auth/utils';
import AuthForm from '../Auth/AuthForm';
import MultilineString from '../../Core/MultilineString';

const setPasswordType = 'oldPassword';

const mapStateToProps = state => {
  return {
    user: state.entities.user,
    passwordRequestState: getRequestState(state, HTTP_PUT, authEntity, setPasswordType),
    createUserRequestState: getRequestState(state, HTTP_POST, userEntity)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    doSetPasswordRequest: data => dispatch(setPassword(data)),
    doCreateUser: data => dispatch(createUser(data))
  };
};

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.submitPassword = this.submitPassword.bind(this);
    this.submitCreateUser = this.submitCreateUser.bind(this);
  }

  submitPassword(event) {
    event.preventDefault();
    const data = Object.assign(formToObject(event, ['oldPassword', 'password']), { email: this.props.user.email });
    data.type = setPasswordType;
    data.token = data.oldPassword;
    return this.props.doSetPasswordRequest(data);
  }

  submitCreateUser(event) {
    event.preventDefault();
    const data = formToObject(event, ['email']);
    return this.props.doCreateUser(data);
  }

  render () {
    const { passwordRequestState, createUserRequestState, user } = this.props;
    const updatedPassword = passwordRequestState.done === true;
    return (
      <div>
        <Typography variant="h2" gutterBottom>Profile!</Typography>
        <Typography variant="subtitle1" gutterBottom>
          {MultilineString(JSON.stringify(user))}
        </Typography>
        <Typography variant="h2" gutterBottom>Update password</Typography>
        {updatedPassword && <Typography variant="subtitle1" gutterBottom>Updated!</Typography>}
        {!updatedPassword && <AuthForm
          submit="Update Password"
          onSubmit={this.submitPassword}
          updatePasswordFor="self"
          submitting={passwordRequestState.done === false}
          error={passwordRequestState.error}
        />}
        {user.isSuperAdmin &&
          <div>
            <Typography variant="h2" gutterBottom>Add User</Typography>
            <AuthForm
              submit="Create User"
              onSubmit={this.submitCreateUser}
              submitting={createUserRequestState.done === false}
              error={createUserRequestState.error}
            />
          </div>
        }
      </div>
    );
  }
}

const ProfileContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);

export { ProfileContainer as default };
