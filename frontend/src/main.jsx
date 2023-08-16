import React from 'react'
import ReactDOM from 'react-dom/client'

const Thing = () => {
  return <h1>Hello world!</h1>
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Thing/>);