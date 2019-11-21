import React, { useState } from 'react';
import { get as getAtPath, isEmpty } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import FacebookIcon from '@material-ui/icons/Facebook';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { validator, errors as passwordErrors } from '../../../utils/passwordValidator';
import MultilineString from '../../Core/MultilineString';

const useStyles = makeStyles(theme => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  submitFacebook: {
    margin: theme.spacing(0, 0, 2),
    backgroundColor: '#3578E5'
  },
  submitProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
}));

function validatePasswords(password, confirmPassword) {
  const errors = validator.validate(password, { list: true });
  if (password != confirmPassword) {
    errors.unshift('match');
  }
  if (isEmpty(errors)) {
    return null;
  }
  return errors.map((err) => passwordErrors[err]).join("\n");
}

export default function AuthForm({ link1, link2, password, updatePasswordFor, error, facebookCallback, submit, submitting, onSubmit }) {
  const classes = useStyles();

  const facebookAppId = process.env.FACEBOOK_CLIENT_ID;
  const emailProps = { autoFocus: true };
  const updatingPassword = !!updatePasswordFor;
  const updateSelfPassword = updatePasswordFor === 'self';
  const showPassword = updatingPassword || password;
  const passwordProps = {};
  if (updatingPassword) {
    emailProps.defaultValue = updatePasswordFor;
    emailProps.disabled = true;
    emailProps.autoFocus = false;
    passwordProps.autoFocus = true;
  }

  const requestError = getAtPath(error, 'error', null);
  const [updatePasswordError, setUpdatePasswordError] = useState(null);

  const [passwordString, setPasswordString] = useState('');
  const [confirmPasswordString, setConfirmPasswordString] = useState('');

  const handlePasswordChange = event => {
    if (updatingPassword) {
      setPasswordString(event.target.value);
      setUpdatePasswordError(validatePasswords(event.target.value, confirmPasswordString));
    }
  };
  const handleConfirmPasswordChange = event => {
    if (updatingPassword) {
      setConfirmPasswordString(event.target.value);
      setUpdatePasswordError(validatePasswords(passwordString, event.target.value));
    }
  };

  return (
    <form
      className={classes.form}
      noValidate
      onSubmit={onSubmit}
    >
      {!updateSelfPassword && <TextField
        {...emailProps}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
      />}
      {updateSelfPassword && (
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="oldPassword"
          label="Old Password"
          type="password"
          id="oldPassword"
          autoComplete="old-password"
        />
      )}
      {showPassword && (
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={handlePasswordChange}
        />
      )}
      {updatingPassword && (
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          autoComplete="confirm-password"
          onChange={handleConfirmPasswordChange}
        />
      )}
      {(updatePasswordError || requestError) && (
        <FormLabel error>Error occured: {MultilineString(updatePasswordError || requestError, 'err')}</FormLabel>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        disabled={submitting || !!updatePasswordError}
      >
        {submit}
        {submitting && <CircularProgress size={24} className={classes.submitProgress} />}
      </Button>
      {!!facebookCallback && <FacebookLogin
        appId={facebookAppId}
        autoLoad={false}
        fields="name,email"
        callback={facebookCallback}
        render={renderProps => (
          <Button
            onClick={renderProps.onClick}
            startIcon={<FacebookIcon />}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submitFacebook}
            disabled={submitting}
          >
            Login With Facebook
          </Button>
        )}
      />}
      {(link1 || link2) && <Grid container>
        {link1 && <Grid item xs>
          <RouterLink to={link1.path} variant="body2">
            {link1.label}
          </RouterLink>
        </Grid>}
        {link2 && <Grid item>
          <RouterLink to={link2.path} variant="body2">
            {link2.label}
          </RouterLink>
        </Grid>}
      </Grid>}
    </form>
  );
}
