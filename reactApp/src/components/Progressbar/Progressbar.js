import React from 'react';
import ReactDOM from 'react-dom';

function degsToRadians(degs) {
  return (degs / 360) * (2 * Math.PI)
}

class ProgressBar extends React.Component {

//   static propTypes = {
//     colors: React.PropTypes.array,
//     data: React.PropTypes.array.isRequired,
//     size: React.PropTypes.number,
//     lineWidth: React.PropTypes.number
//   };

  static defaultProps = {
    colors: ['RGB(68, 212, 59)', '#f5f5f5', '#ef7b45', '#d84727'],
    size: 145,
    lineWidth: 19
  };

  componentDidMount() {
    this.draw();
  }

  draw() {
    const canvas = ReactDOM.findDOMNode(this);
    const c = canvas.getContext('2d');
    const center = this.props.size / 2;
    const lineWidth = this.props.lineWidth;
    const radius = center - (lineWidth / 2);
    c.lineWidth = lineWidth;
    c.font = "bolder 32px Roboto";
    c.fillStyle = "black";
    c.textAlign = "center";
    c.fillText(this.props.text,center,65);

    const dataTotal = this.props.data.reduce((r, dataPoint) => r + dataPoint, 0);
    
    let startAngle = degsToRadians(180);
    let colorIndex = 0;
    this.props.data.forEach((dataPoint, i) => {
      const section = dataPoint / dataTotal * 180;
      const endAngle = startAngle + degsToRadians(section);
      const color = this.props.colors[colorIndex];
      colorIndex++;
      if (colorIndex >= this.props.colors.length) {
        colorIndex = 0;
      }
      c.strokeStyle = color;
      c.beginPath();
      c.arc(center, center, radius, startAngle, endAngle);
      c.stroke();
      startAngle = endAngle;
    });
  }

  render() {
    console.log("ProgressBar....");
    
    return (
      <canvas
        height={'68px'}
        width={'147px'}
      />
    );
  }
}

export default ProgressBar