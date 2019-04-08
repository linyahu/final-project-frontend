import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { BrowserRouter as Router } from 'react-router-dom';


// default initial state:
// navbar: true,
// dashboards: [],
// user_id: null
const initialState = {
  navbar: true,
  dashboards: [],
  user_id: 2,
  // dashboardEquities: [], ?? probably don't have access to this
  hasPortfolio: false,
  portfolioEquities: []
}

function reducer(state = initialState, action) {
  // console.log('%c reducer:', 'color: orange', state, action);

  switch (action.type) {
    case "TOGGLE_NAVBAR":
      return { ...state, navbar: !state.navbar }
    case "SET_DASHBOARDS":
      return { ...state, dashboards: action.payload }
    case "SET_USER":
      return { ...state, user_id: action.payload }
    case "SET_PORTFOLIO_EQUITIES":
      return { ...state, portfolioEquities: action.payload }
    default:
      // console.log('default case', state);
      return state;
  }
}

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
