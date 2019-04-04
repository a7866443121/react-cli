import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { createStore } from 'redux';


var action = {
  type: 'user',
  payload: {
    sex:'男'
  }
}
var action1 = {
  type: 'user',
  payload: {
    age: '24'
  }
}
var action2 = {
  type: 'user',
  payload: {
    name:'李四'
  }
}

const store = createStore(reducer);
store.dispatch(action);
store.dispatch(action1);
store.dispatch(action2);
function reducer(state, action) {
  switch (action.type) {
    case 'create':
      return state ? state + '爱吃饭' : action.payload;
    case 'user':
      return state ? Object.assign(state, action.payload) : action.payload;
    default: 
    return state;
  }
};

// const state = reducer('wo', action);

store.subscribe(() =>
  console.log(store.getState())
);




console.log(store.getState());
console.log()




class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
