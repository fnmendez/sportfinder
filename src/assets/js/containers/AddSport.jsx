import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ClubSportsTable from '../components/ClubSportsTable'
import SportsService from '../services/sports'

export default class AddSport extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: true, success: false, error: undefined }
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    this.fetchSports()
  }

  async onSubmit(data) {
    this.setState({ loading: true, error: undefined, showThanks: false })
    try {
      const json = await SportsService.putSport(this.props.clubId, data)
      this.setState({
        loading: false,
        success: true,
      })
    } catch (error) {
      this.setState({ error: error.message, loading: false })
    }
  }

  async fetchSports() {
    const json = await SportsService.getSports(this.props.clubId)
    this.setState({
      sports: json.sports,
      clubSports: json.clubSports,
      loading: false,
    })
  }

  render() {
    if (this.state.loading) {
      return <p>Loading...</p>
    }
    return (
      <div>
        <ClubSportsTable
          onSubmit={this.onSubmit}
          sports={this.state.sports}
          clubSports={this.state.clubSports}
        />
      </div>
    )
  }
}
