import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider as StoreProvider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { PersistGate } from 'redux-persist/integration/react';
import { createBrowserHistory } from 'history';
import { initPersistantStore } from './components/Setup/store';
import theme from './components/Setup/theme';
import Routes from './components/Core/Routes';

import './css/app.scss';

const mapStateToProps = state => {
  return {
    darkTheme: state.uiState.darkTheme,
  };
};

/* eslint max-classes-per-file: ["error", 2] */

class ThemedApp extends Component {
  constructor(props) {
    super(props);
    this.state = { muiTheme: ThemedApp.getMuiTheme(props) };
  }

  componentDidUpdate(prevProps) {
    if (this.props.darkTheme !== prevProps.darkTheme) {
      this.setState({ muiTheme: ThemedApp.getMuiTheme(this.props) });
    }
  }

  static getMuiTheme(props) {
    const newTheme = Object.assign({}, theme);
    newTheme.palette.type = props.darkTheme ? 'dark' : 'light';
    return createMuiTheme(newTheme);
  }

  render() {
    return (
      <StyledComponentsThemeProvider theme={theme}>
        <ThemeProvider theme={this.state.muiTheme}>
          <Routes />
        </ThemeProvider>
      </StyledComponentsThemeProvider>
    );
  }
}

const ThemedAppDecorated = connect(
  mapStateToProps,
  null,
)(ThemedApp);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { store: null };
  }

  componentDidMount() {
    const { store, persistor } = initPersistantStore();
    this.setState({ store, persistor });
  }

  render() {
    const { store, persistor } = this.state;
    return (
      store != null && (
        <StoreProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router history={createBrowserHistory()}>
              <ThemedAppDecorated />
            </Router>
          </PersistGate>
        </StoreProvider>
      )
    );
  }
}

const rootElement = document.getElementById('app');
ReactDOM.render(<App />, rootElement);

module.hot.accept();
