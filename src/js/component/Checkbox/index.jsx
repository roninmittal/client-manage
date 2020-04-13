import React, { Component} from "react";

class Checkbox extends Component{
  constructor(props) {
    super(props);
  }

  render(){
    const {id, value, isChecked=false, onChange, field} = this.props
    return(
        <div className='form-check'>
            <input type='checkbox' className='form-check-input' id={id} value={value} onChange={onChange} checked={isChecked} field={field}/>
            <label className='form-check-label' htmlFor={id}>{value}</label>
        </div>
    );
  }
}

export default Checkbox;