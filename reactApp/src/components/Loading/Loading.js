import React from 'react';
import load from './loading.gif'
const Loading = (props) => {
   return (
      <img id="loadingImg" style={{ width: '30%', paddingTop: '99px' }} style={props.styleData} src={load} alt="Loading..." />
   );
}

export default Loading;


