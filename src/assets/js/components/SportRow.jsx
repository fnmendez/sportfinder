import React from 'react'
import PropTypes from 'prop-types'

export default function SportRow(props) {
  return (
    <tr>
      <td> {props.sport} </td>
      <td> {props.price} </td>
      <td> {props.timeunit} </td>
    </tr>
  )
}
