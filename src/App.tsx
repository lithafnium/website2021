import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Router } from 'react-router'
import history from '@app/shared/utils/history'

import Home from '@app/pages/home/home'
import routes from '@app/shared/constants/routes'

function App () {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path={routes.ABOUT} component={Home} />
      </Switch>
    </Router>
  )
}

export default App
