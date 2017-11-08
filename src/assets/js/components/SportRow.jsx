import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class SportRow extends Component {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(e) {
    this.props.onSubmitDelete('Hola!!!')
    e.preventDefault()
  }

  render() {
    return (
      <tr>
        <td> {this.props.sport} </td>
        <td> {this.props.price} </td>
        <td> {this.props.timeunit} </td>
        {this.props.isAdmin && (
          <td className="actions">
            <form onSubmit={this.onSubmit}>
              <input type="submit" value="Borrar" />
            </form>
          </td>
        )}
      </tr>
    )
  }
}
// <input
//   type="hidden"
//   name="sportid"
//   value="<%= clubSport.sport.id %>"
// />
