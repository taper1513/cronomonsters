import React, { PureComponent } from "react";
 
class Box extends PureComponent {
  render() {
    const size = 100;
    const x = this.props.x - size / 2;
    const y = this.props.y - size / 2;
    return (
      <div style={{ position: "absolute", width: size, height: size, backgroundColor: "red", left: x, top: y }} />
    );
  }
}

class BoxSet extends PureComponent {
  constructor(props) {
    super(props);
  }
  
  render() {
    let size = 20;
    let boxSet = this.props.elements.map((el, idx)=> {
      return   <div id={idx} style={{ position: "absolute", width: size, height: size, backgroundColor: "red", left: this.props.x, top: this.props.y }} /> 
    })
    
    return (
        <div>
          {boxSet}
        </div>
      );
  }
}
 
class ArrayCreator extends PureComponent {
  render() {
    const musicArray =  [0, 234, 0 ,123 ];
    return (
     musicArray
    );
  }
}

export { Box, ArrayCreator, BoxSet };