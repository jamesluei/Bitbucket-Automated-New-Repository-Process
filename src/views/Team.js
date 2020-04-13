import React, { useState, useEffect } from 'react';
import { GetTeamById } from '../data-access/request-layer'
import TeamListPaper from '../components/team-list-paper'
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import './css/Home.css';

export default function Team(props) {
  const [teamDetails, setTeamDetails] = useState(null)
  const [apiError, setApiError] = useState(null)

  useEffect(() => {
    try{
      GetTeamById(props.match.params.teamId).then(data => {
        setTeamDetails(data)
      }).catch(e => {throw e})
    }catch(e) {
      setApiError(e)
    }
  }, [props, setTeamDetails])
  const info = {
    CreateRepo: {
        links:{
          avatar:{
            href: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRg4i08EuAeoPVS3EVs91aU3_E1eSKTECTo-57BRlrJM9t2fZSf"
          }
        }
      },
      ViewProject: {
        links:{
          avatar:{
            href: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQba4NBe1pHvyeEuALzd0ODAjbvQ6wYSQBnwGsafGMaSot3rorH"
          }
        }
      },
      ViewTeam: {
        links:{
          avatar:{
            href: "https://cdn1.iconfinder.com/data/icons/business-management-set-2-6/64/blue-83-512.png"
          }
        }
      },
    }
  return (
  <>
  <Paper elevation={2}>
    {
      !apiError ?
        teamDetails
          ? <div className="teams-list">
            <div className="home-heading">{teamDetails.display_name ? teamDetails.display_name : ""}</div>
            <TeamListPaper url={teamDetails.links.html.href} display_name="View Team" info={info.ViewTeam}/>
            <TeamListPaper url={`/team/${props.match.params.teamId}/projects`} display_name="View Projects" info={info.ViewProject}/>
            <TeamListPaper url={`/createRepo/${props.match.params.teamId}`} display_name="Create Repo" info={info.CreateRepo}/>
          </div>
          : <div className="Home-Loader"><span><CircularProgress /></span><br/><br/><span>Loading Team Details</span></div>
        : <div className="Api-Error">{apiError}</div>
    }
  </Paper>
</>
  );
}