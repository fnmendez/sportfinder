import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AddSportForm from '../components/AddSportForm'
import SportRow from './SportRow'

function priceDisplay(price) {
  if (price) {
    return '$' + price
  }
  return 'No definido'
}

export default class ClubSportsTable extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const rows = this.props.clubSports.map((tuple, i) => (
      <SportRow
        key={i}
        sport={tuple.sport.name}
        price={priceDisplay(tuple.price)}
        timeunit={tuple.timeUnit}
      />
    ))
    return (
      <div>
        <table className="index">
          <tbody>
            <tr>
              <th>Deporte</th>
              <th>Precio</th>
              <th>Unidad de tiempo</th>
            </tr>
            {rows}
          </tbody>
        </table>
        <AddSportForm
          onSubmit={this.props.onSubmit}
          sports={this.props.sports}
        />
      </div>
    )
  }
}
