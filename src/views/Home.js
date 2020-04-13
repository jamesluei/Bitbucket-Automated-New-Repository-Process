import React, { useState, useEffect, useContext } from 'react';
import { userContext } from '../context/userContext'
import { GetAccesTokenFromCode, GetTeamsOfUser, RefreshToken } from '../data-access/request-layer'
import { Config } from '../data-access/config'
import TeamListPaper from '../components/team-list-paper'
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import './css/Home.css';

export default function Home() {
  const { user, setUser } = useContext(userContext)
  const [apiError, setApiError] = useState(null)
  useEffect(() => {
    const GetIntialInformation = async () => {
      try {
        !window.localStorage.getItem(Config.Bitbucket.ClientId)
          ? await GetAccesTokenFromCode(new URLSearchParams(window.location.search).get('code')).then(data => {
            setUser({ userData: data })
          }).catch(e => { throw e })
          : await RefreshToken().then(data => {
            setUser({ userData: data })
          }).catch(e => { throw e })
        await GetTeamsOfUser().then(data => {
          setUser(user => ({ ...user, userTeams: data }))
        }).catch(e => { throw e })
      } catch (e) {
        setApiError(e)
      }
    }
    GetIntialInformation()
  }, [setUser, setApiError])
  return (<>
    <Paper elevation={2}>
      {
        !apiError ?
          user ?.userTeams
            ? <div className="teams-list">
              <div className="home-heading">{user.userTeams.size ? "Please select a Team from the list" : "You don't belong to any team"}</div>
              {user.userTeams.values.map(e => <TeamListPaper key={e.uuid} url={`/team/${e.uuid}`} display_name={e.display_name} info={e} />)}
            </div>
            : <div className="Home-Loader"><span><CircularProgress /></span><br/><br/><span>Loading Your Teams</span></div>
          : <div className="Api-Error">{apiError}</div>
      }
    </Paper>
  </>
  );
}