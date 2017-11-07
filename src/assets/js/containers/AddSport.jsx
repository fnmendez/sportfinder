import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AddSportForm from '../components/AddSportForm'
import SportsService from '../services/sports'

export default class AddSport extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: true }
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    this.fetchSports()
  }

  async onSubmit(e) {
    e.preventDefault()
  }

  async fetchSports() {
    const json = await SportsService.getSports()
    this.setState({ sports: json.sports, loading: false })
  }

  render() {
    if (this.state.loading) {
      return <p>Loading...</p>
    }
    return (
      <div>
        <AddSportForm onSubmit={this.onSubmit} sports={this.state.sports} />
      </div>
    )
  }
}
