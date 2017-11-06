import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class AddSportForm extends Component {
  constructor(props) {
    super(props);
    this.state = {sports : ["Futbol", "Basqueitbol", "Tenis"]}
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(e) {
    console.log("It's working!");
    e.preventDefault()
  }


  render() {
    const Sports = this.state.sports.map( (sport, i) => <option key={i}> {sport} </option> )
    return (
      <form onSubmit={this.onSubmit}>
        <select>
          {Sports}
        </select>
        <div className="inline">
          <input type="text" name="price" placeholder="Precio" />
        </div>
        <div className="inline">
          <input type="text" name="timeUnit" placeholder="Unidad de tiempo" />
        </div>
        <div className="inline">
          <input type="submit" name="add" value="Agregar Deporte" />
        </div>
      </form>
    );
  }
}
