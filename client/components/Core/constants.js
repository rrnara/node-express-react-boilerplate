import About from '../Pages/About';
import Hello from '../Pages/LoggedIn/Hello';
import LoginForm from '../Pages/Auth/LoginForm';
import RequestEmailConfirmation from '../Pages/Auth/RequestEmailConfirmation';
import RequestResetPassword from '../Pages/Auth/RequestResetPassword';
import InfoIcon from '@material-ui/icons/Info';
import TableChartIcon from '@material-ui/icons/TableChart';
import AssessmentIcon from '@material-ui/icons/Assessment';
import LoginIcon from '@material-ui/icons/ExitToApp';

export const drawerWidth = 280;

export const routes = {
  common: {
    about: { path: '/about', label: 'About', component: About, drawerMenuIcon: InfoIcon }
  },
  loggedIn: {
    root:  { path: '/hello1', label: 'Hello 1', component: Hello, drawerMenuIcon: TableChartIcon },
    page2: { path: '/hello2', label: 'Hello 2', component: Hello, drawerMenuIcon: AssessmentIcon }
  },
  loggedOut: {
    root:          { path: '/login', label: 'Login', component: LoginForm, drawerMenuIcon: LoginIcon },
    resetPassword: { path: '/resetPassword', label: 'Forgot Password?', component: RequestResetPassword },
    confirmEmail:  { path: '/confirmEmail', label: 'Resend confirmation', component: RequestEmailConfirmation },
    verifyReset:   { path: '/verifyReset', label: 'Reset Password', component: RequestResetPassword },
    verifyEmail:   { path: '/verifyEmail', label: 'Complete Registration', component: RequestEmailConfirmation }
  }
};
