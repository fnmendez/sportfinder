import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ClubSportsTable from '../components/ClubSportsTable'
import SportsService from '../services/sports'

export default class AddSport extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: true, success: false, error: undefined }
    this.onSubmit = this.onSubmit.bind(this)
    this.onSubmitDelete = this.onSubmitDelete.bind(this)
  }

  componentDidMount() {
    console.log('Fetching')
    this.fetchSports()
  }

  async onSubmit(data) {
    this.setState({ loading: true, success: undefined })
    try {
      const json = await SportsService.putSport(this.props.clubId, data)
      if (json.sport) {
        this.state.clubSports.push(json.clubSport)
        this.state.sports.push(json.sport)
      }
      this.setState({
        loading: false,
        success: true,
      })
    } catch (error) {
      this.setState({ error: error.message, loading: false, success: false })
    }
  }

  async onSubmitDelete(data) {
    console.log(data)
    this.setState({ loading: true, success: undefined })
    try {
      const json = await SportsService.deleteSport(
        this.props.clubId,
        data.sportId
      )
      this.fetchSports()
      console.log(this.state.clubSports)
      console.log(this.state.sports)
      this.setState({ success: true })
    } catch (error) {
      this.setState({ error: error.message, loading: false, success: false })
    }
  }

  async fetchSports() {
    const json = await SportsService.getSports(this.props.clubId)
    this.setState({
      sports: json.sports,
      clubSports: json.clubSports,
      loading: false,
    })
    console.log(this.state.sports)
    console.log(this.state.clubSports)
  }

  render() {
    if (this.state.loading) {
      return <p>Loading...</p>
    }
    return (
      <div>
        <ClubSportsTable
          onSubmit={this.onSubmit}
          onSubmitDelete={this.onSubmitDelete}
          sports={this.state.sports}
          clubSports={this.state.clubSports}
          isAdmin={this.props.isAdmin}
        />
      </div>
    )
  }
}
