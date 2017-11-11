import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './components/App'

const render = function render(Component, reactAppContainer, componentName) {
  ReactDOM.render(
    <AppContainer>
      <Component {...reactAppContainer.dataset} />
    </AppContainer>,
    reactAppContainer
  )
  if (module.hot) {
    module.hot.accept(`./components/${componentName}`, () => {
      render(App, ClubSportContainer)
    })
  }
}
const ClubSportContainer = document.getElementById('react-club')

if (ClubSportContainer) {
  render(App, ClubSportContainer, 'App')
}
