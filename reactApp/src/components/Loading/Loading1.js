import React from 'react';
import "./Loading1.css";
import load from './loading.gif'
class Loading1 extends React.Component {
   render() {
      return (
        <div className="app-content-loading">
            <img id="loadingImg" height="112px" className="loading-spinner"  src={load} alt="Loading..." />
        </div>
      );
   }
}

export default Loading1;