import InfoIcon from '@material-ui/icons/Info';
import TableChartIcon from '@material-ui/icons/TableChart';
import AssessmentIcon from '@material-ui/icons/Assessment';
import LoginIcon from '@material-ui/icons/ExitToApp';
import Home from './Home';
import About from '../Pages/About';
import Hello from '../Pages/LoggedIn/Hello';
import Profile from '../Pages/LoggedIn/Profile';
import LoginForm from '../Pages/Auth/LoginForm';
import RequestEmailConfirmation from '../Pages/Auth/RequestEmailConfirmation';
import RequestResetPassword from '../Pages/Auth/RequestResetPassword';

export const drawerWidth = 280;

export const routeTypes = {
  common: 'common',
  loggedIn: 'loggedIn',
  loggedOut: 'loggedOut'
};

export const routes = {
  [routeTypes.common]: {
    about: { path: '/about', label: 'About', component: About, drawerMenuIcon: InfoIcon }
  },
  [routeTypes.loggedIn]: {
    home:    { path: '/', label: 'Home', component: Home },
    profile: { path: '/profile', label: 'Profile', component: Profile },
    root:    { path: '/hello1', label: 'Hello 1', component: Hello, drawerMenuIcon: TableChartIcon },
    page2:   { path: '/hello2', label: 'Hello 2', component: Hello, drawerMenuIcon: AssessmentIcon }
  },
  [routeTypes.loggedOut]: {
    root:          { path: '/login', label: 'Login', component: LoginForm, drawerMenuIcon: LoginIcon },
    resetPassword: { path: '/resetPassword', label: 'Forgot Password?', component: RequestResetPassword },
    confirmEmail:  { path: '/confirmEmail', label: 'Resend confirmation', component: RequestEmailConfirmation },
    verifyReset:   { path: '/verifyReset', label: 'Reset Password', component: RequestResetPassword },
    verifyEmail:   { path: '/verifyEmail', label: 'Complete Registration', component: RequestEmailConfirmation }
  }
};
