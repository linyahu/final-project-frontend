import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import storage from 'redux-persist/lib/storage'

// import rootReducer from './reducers'

import { BrowserRouter as Router } from 'react-router-dom';

const initialState = {
  user_id: null,
  navbar: true,
  dashboards: [],
  dashboardEquities: [],
  portfolio: {},
  portfolioEquities: [],
  search: "",
  accountBalance: 0,
}

const persistConfig = {
  key: 'root',
  storage,
  // whitelist: ["user_id"]
}

const persistedReducer = persistReducer(persistConfig, reducer)

function reducer(state = initialState, action) {
  switch (action.type) {
    case "TOGGLE_NAVBAR":
      return { ...state, navbar: !state.navbar }
    case "SET_DASHBOARDS": // returns the dashboards in the order by id
      return { ...state, dashboards: action.payload.sort( (a, b) => {
        if (a.id < b.id){
          return -1
        } else if (b.id < a.id) {
          return 1
        }
        return 0
      }) }
      // return {...state, dashboards: action.payload }
    case "SET_USER":
      return { ...state, user_id: action.payload }
    case "SET_PORTFOLIO":
      return { ...state, portfolio: action.payload }
    case "SET_PORTFOLIO_EQUITIES":
      return { ...state, portfolioEquities: action.payload }
    case "SET_DASHBOARD_EQUITIES":
      return { ...state, dashboardEquities: action.payload }
    case "SET_ACCOUNT_BALANCE":
      return { ...state, accountBalance: action.payload }
    case "SEARCH_EQUITY":
      return { ...state, search: action.payload }
    default:
      // console.log('default case', state);
      return state;
  }
}

const store = createStore(persistedReducer);
const persistor = persistStore(store)

// export default () => {
//   let store = createStore(persistedReducer)
//   let persistor = persistStore(store)
//   return { store, persistor }
// }

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <App />
      </Router>
    </PersistGate>
  </Provider>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
