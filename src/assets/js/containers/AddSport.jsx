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
    console.log(this.state.sports[0])
    this.setState({ loading: true, success: undefined })
    try {
      // const json = await SportsService.deleteSport(this.props.clubId, data)
      // Eliminar el deporte del state
      const newSports = this.state.sports.filter(
        item => item.id != data.sportId
      )
      const newClubSports = this.state.clubSports.filter(
        item => item.sport.id != data.sportId
      )
      this.setState({
        loading: false,
        sports: newSports,
        clubSports: newClubSports,
      })
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
