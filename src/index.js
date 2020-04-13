import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import Home from './views/Home';
import Team from './views/Team';
import CreateRepo from './views/CreateRepo';
import TeamProjects from './views/TeamProjects';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { userContext } from './context/userContext'
import './index.css'

const Base = () => {
    const [user, setUser] = useState(null)

    return (
        <Router>
            <userContext.Provider value={{user, setUser}}>
            <Route exact path="/" component={Home} />
            <Route exact path="/team/:teamId" component={Team} />
            <Route exact path="/team/:teamId/projects" component={TeamProjects} />
            <Route exact path="/createRepo/:teamId" component={CreateRepo} />
            </userContext.Provider>
        </Router>
    )
}

ReactDOM.render(<Base />, document.getElementById('root'));
serviceWorker.unregister();
