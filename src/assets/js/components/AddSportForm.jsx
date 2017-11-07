import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class AddSportForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sportId: this.props.sports[0].id, // defaul select option.
      price: '', // default price.
      timeUnit: '', // default time unit.
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
  }

  onInputChange(event) {
    console.log(event)
    this.setState({ [event.target.name]: event.target.value })
  }

  onSubmit(e) {
    e.preventDefault()
    this.props.onSubmit(this.state)
  }

  render() {
    const sportsTags = this.props.sports.map((sport, i) => (
      <option key={i} value={sport.id}>
        {' '}
        {sport.name}{' '}
      </option>
    ))
    return (
      <form onSubmit={this.onSubmit}>
        <select name="sportId" onChange={this.onInputChange}>
          {sportsTags}
        </select>
        <div className="inline">
          <input
            type="text"
            name="price"
            placeholder="Precio"
            onChange={this.onInputChange}
          />
        </div>
        <div className="inline">
          <input
            type="text"
            name="timeUnit"
            placeholder="Unidad de tiempo"
            onChange={this.onInputChange}
          />
        </div>
        <div className="inline">
          <input type="submit" name="add" value="Agregar Deporte" />
        </div>
      </form>
    )
  }
}
