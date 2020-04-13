import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { CreateRepoProcess } from '../data-access/createRepoProcess'
import './css/createRepo.css'
import Paper from '@material-ui/core/Paper';
import ArrowBackTwoToneIcon from '@material-ui/icons/ArrowBackTwoTone';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function CreateRepo(props) {
    const [repoDetails, setRepoDetails] = useState({org : null, account:null, project:null})
    const [TextFieldError, setTextFieldError] = useState({
        org : false,
        account: false,
        project: false
    })
    const [status, setStatus] = useState({
        Message : [],
        Error: [],
        InProgress : false
    })

    const HandleStatusChange = Value => {
        let NewStatus = status[Value.type]
        NewStatus.push(Value.Message)
        setStatus({
            ...status,
            [Value.type] : NewStatus
        })
    }

    const handleInputChange = e => {
        setRepoDetails({...repoDetails, [e.target.id]: e.target.value})
    }
    const startRepoCreationProcess = async () => {
        try{
            if(!repoDetails.org) {setTextFieldError({...TextFieldError, org: true, InvalidInput: true}); return}
            if(!repoDetails.account) {setTextFieldError({...TextFieldError, account: true, InvalidInput: true}); return}
            if(!repoDetails.project) {setTextFieldError({...TextFieldError, project: true, InvalidInput: true}); return}
            setStatus({...status,InProgress:true})
            await CreateRepoProcess({
                teamId : props.match.params.teamId,
                ProjectName : `${repoDetails.project.replace(/ /g, "-").toLowerCase()}-${repoDetails.org}`,
                AccountName : `${repoDetails.account.toLowerCase(/ /g, " - ")}-${repoDetails.org}`,
                orgId : repoDetails.org,
                UpdateStatus: HandleStatusChange
            }).catch(e => {
                throw e
            }).finally(() => {
                setStatus({...status,InProgress:false})
            })
        }
        catch(e){
            let NewError = status.Error.push(e)
            setStatus({...status, Error: NewError, InProgress:false})
        }
    }

    const Message = props => {
        return (
            <p key={props.key} className={props.className}>{props.Value}</p>
        )
    }

    return (<>    
        <div className="repoInputs">
            <Paper elevation={2}>
                {/* <ArrowBackTwoToneIcon className="back-button"/> */}
                <TextField type="number" error={TextFieldError.org} id="org" onChange={handleInputChange} label="Enter Unique ID" helperText="Ex : 776" /> <br />
                <TextField type="text" error={TextFieldError.account} id="account" onChange={handleInputChange} label="Doing Project For?" helperText="Ex : Google" /><br />
                <TextField type="text" error={TextFieldError.project} id="project" onChange={handleInputChange} label="Enter Project Name" helperText="Integration With Google Maps" /><br />
                <Button disabled={status.InProgress} variant="contained" color="primary" onClick={startRepoCreationProcess}>{status.InProgress ? <CircularProgress size={20}/> : "Create Repo"}</Button>
                <div className="messages-panel">
                    {status.Message.map((e,v) => <Message className="statusMessage" Value={e} key={v}/>)}
                    {status.Error.map((e,v) => <Message className="errorMessage" Value={e} key={v}/>)}
                </div>
            </Paper>
        </div>
    </>
    );
}