import React, { useState } from 'react';
import { get as getAtPath, isEmpty } from 'lodash';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Link as RouterLink } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { validator, errors as passwordErrors } from '../../../utils/passwordValidator';
import MultilineString from '../../Core/MultilineString';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://images.pexels.com/photos/775907/pexels-photo-775907.jpeg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
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
    errors.unshift('Passwords do not match');
  }
  if (isEmpty(errors)) {
    return null;
  }
  errors.map((err) => passwordErrors[err]).join("\n");
}

export default function AuthPage(formElements) {
  const classes = useStyles();

  const emailProps = { autoFocus: true };
  const updatingPassword = !!formElements.updatePasswordFor;
  const showPassword = updatingPassword || formElements.password;
  const passwordProps = {};
  if (updatingPassword) {
    emailProps.defaultValue = formElements.updatePasswordFor;
    emailProps.disabled = true;
    emailProps.autoFocus = false;
    passwordProps.autoFocus = true;
  }

  const requestError = getAtPath(formElements, 'error.error', null);
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
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {formElements.title}
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={formElements.onSubmit}
          >
            <TextField
              {...emailProps}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
            />
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
                label="Password"
                type="confirmPassword"
                id="confirmPassword"
                autoComplete="confirm-password"
                onChange={handleConfirmPasswordChange}
              />
            )}
            {(updatePasswordError || requestError) && (
              <FormHelperText error>Error occured: {MultilineString(updatePasswordError || requestError)}</FormHelperText>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={formElements.submitting || !!updatePasswordError}
            >
              {formElements.submit}
              {formElements.submitting && <CircularProgress size={24} className={classes.submitProgress} />}
            </Button>
            <Grid container>
              <Grid item xs>
                <RouterLink to={formElements.link1.path} variant="body2">
                  {formElements.link1.label}
                </RouterLink>
              </Grid>
              <Grid item>
                <RouterLink to={formElements.link2.path} variant="body2">
                  {formElements.link2.label}
                </RouterLink>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
