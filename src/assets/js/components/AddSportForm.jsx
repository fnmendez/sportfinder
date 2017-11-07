import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class AddSportForm extends Component {
  constructor(props) {
    super(props)
    this.state = { sports: ['Futbol', 'Basqueitbol', 'Tenis'] }
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(e) {
    this.props.onSubmit(e)
  }

  render() {
    const sportsTags = this.props.sports.map((sport, i) => (
      <option key={i}> {sport.name} </option>
    ))
    return (
      <form onSubmit={this.onSubmit}>
        <select>{sportsTags}</select>
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
    )
  }
}
