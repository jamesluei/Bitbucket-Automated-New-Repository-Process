import axios from 'axios';
import {Config} from './config'
import qs from 'qs'
import {DefaultReadme, 
    // NodeReadme, 
    // HtmlJsCssReadme, 
    // PythonReadme
} from '../data-access/readme-files'

var api = axios.create({
    baseURL: "https://api.bitbucket.org/2.0/",
    timeout: 10000,
    headers: {"Content-Type": "application/json"}
})

const CatchAxiosError = ErrorObject => {
    if (ErrorObject.response) {
        return JSON.stringify({Error: `Api Responded with status code ${ErrorObject.response.status}`,
                 Message : ErrorObject.response.data})
    }else {
        return JSON.stringify({Error : "Error", Message: ErrorObject.message})
    }
}

const GetAccesTokenFromCode = code => {
    return api({
        baseURL: "https://bitbucket.org/site/oauth2/",
        method: "POST",
        url: Config.Bitbucket.Endpoints.GetAccesTokenFromCode,
        headers: {
            "Content-Type" : "application/x-www-form-urlencoded",
            "Authorization" : `Basic ${new Buffer(Config.Bitbucket.ClientId+":"+Config.Bitbucket.ClientSecret).toString("base64")}`
        },
        data: qs.stringify({
            grant_type : "authorization_code",
            code: code
        })
    }).then(response  => {
        console.log(`Setting new token : ${JSON.stringify(response.data)}`)
        window.localStorage.setItem(Config.Bitbucket.ClientId, JSON.stringify(response.data))
        return response.data
    }).catch(error => {
        throw CatchAxiosError(error)
    })
}

const RefreshToken = (CallbackFunction = null) => {
    return api({
        baseURL: "https://bitbucket.org/site/oauth2/",
        method: "POST",
        url: Config.Bitbucket.Endpoints.GetAccesTokenFromCode,
        headers: {
            "Content-Type" : "application/x-www-form-urlencoded",
            "Authorization" : `Basic ${new Buffer(Config.Bitbucket.ClientId+":"+Config.Bitbucket.ClientSecret).toString("base64")}`
        },
        data: qs.stringify({
            grant_type : "refresh_token",
            refresh_token: JSON.parse(window.localStorage.getItem(Config.Bitbucket.ClientId)).refresh_token
        })
    }).then(async response  => {
        console.log(`Refrshing token : ${JSON.stringify(response.data)}`)
        window.localStorage.setItem(Config.Bitbucket.ClientId, JSON.stringify(response.data))
        if(CallbackFunction)
            return await CallbackFunction()
        else
            return response.data
    }).catch(error => {
        throw CatchAxiosError(error)
    })
}

const GetTeamsOfUser = () => {
    return api({
        method: "GET",
        url: Config.Bitbucket.Endpoints.GetTeamsOfUser,
        headers: {
            "Authorization" : `Bearer ${JSON.parse(window.localStorage.getItem(Config.Bitbucket.ClientId)).access_token}`
        },
        params: {
            role: "admin"
        }
    }).then(response  => {
        return response.data
    }).catch(async error => {
        if(error.response.status === 401)
            return await RefreshToken(() => GetTeamsOfUser())
        else
            throw CatchAxiosError(error)
    })
}

const GetTeamById = teamId => {
    return api({
        method: "GET",
        url: `${Config.Bitbucket.Endpoints.GetTeamsOfUser}/${teamId}`,
        headers: {
            "Authorization" : `Bearer ${JSON.parse(window.localStorage.getItem(Config.Bitbucket.ClientId)).access_token}`
        },
        params: {
            role: "member"
        }
    }).then(response  => {
        return response.data
    }).catch(async error => {
        if(error.response.status === 401)
            return await RefreshToken(() => GetTeamById(teamId))
        else
            throw CatchAxiosError(error)
    })
}

const GetProjectsOfTeam = (teamId, pageNumber=1) => {
    return api({
        method: "GET",
        url: `${Config.Bitbucket.Endpoints.GetTeamsOfUser}/${teamId}/projects/`,
        headers: {
            "Authorization" : `Bearer ${JSON.parse(window.localStorage.getItem(Config.Bitbucket.ClientId)).access_token}`
        },
        params: {
            page: pageNumber
        },
    }).then(response  => {
        return response.data
    }).catch(async error => {
        if(error.response.status === 401)
            return await RefreshToken(() => GetProjectsOfTeam(teamId, pageNumber))
        else
            throw CatchAxiosError(error)
    })
}

const CreateProject = (teamId, body) => {
    return api({
        method: "POST",
        url: `${Config.Bitbucket.Endpoints.GetTeamsOfUser}/${teamId}/projects/`,
        headers: {
            "Authorization" : `Bearer ${JSON.parse(window.localStorage.getItem(Config.Bitbucket.ClientId)).access_token}`
        },
        data: JSON.stringify(body),
    }).then(response  => {
        return response.data
    }).catch(async error => {
        if(error.response.status === 401)
            return await RefreshToken(() => CreateProject(teamId, body))
        else
            throw CatchAxiosError(error)
    })
}

const GetRepoOfTeam = (teamId, pageNumber=1) => {
    return api({
        method: "GET",
        url: `${Config.Bitbucket.Endpoints.GetRepo}/${teamId}`,
        headers: {
            "Authorization" : `Bearer ${JSON.parse(window.localStorage.getItem(Config.Bitbucket.ClientId)).access_token}`
        },
        params: {
            page: pageNumber
        },
    }).then(response  => {
        return response.data
    }).catch(async error => {
        if(error.response.status === 401)
            return await RefreshToken(() => GetRepoOfTeam(teamId, pageNumber))
        else
            throw CatchAxiosError(error)
    })
}

const CreateRepo = (teamId, projectName,  body) => {
    return api({
        method: "POST",
        url: `${Config.Bitbucket.Endpoints.GetRepo}/${teamId}/${projectName}`,
        headers: {
            "Authorization" : `Bearer ${JSON.parse(window.localStorage.getItem(Config.Bitbucket.ClientId)).access_token}`
        },
        data: JSON.stringify(body)
    }).then(response  => {
        return response.data
    }).catch(async error => {
        if(error.response.status === 401)
            return await RefreshToken(() => CreateRepo(teamId, projectName, body))
        else
            throw CatchAxiosError(error)
    })
}

const CreateBranch = (teamId, repoId,  body) => {
    return api({
        method: "POST",
        url: `${Config.Bitbucket.Endpoints.GetRepo}/${teamId}/${repoId}/refs/branches`,
        headers: {
            "Authorization" : `Bearer ${JSON.parse(window.localStorage.getItem(Config.Bitbucket.ClientId)).access_token}`
        },
        data: JSON.stringify(body)
    }).then(response  => {
        return response.data
    }).catch(async error => {
        if(error.response.status === 401)
            return await RefreshToken(() => CreateBranch(teamId, repoId, body))
        else
            throw CatchAxiosError(error)
    })
}

const GetBranch = (teamId, repoId, pageNumber) => {
    return api({
        method: "GET",
        url: `${Config.Bitbucket.Endpoints.GetRepo}/${teamId}/${repoId}/refs/branches`,
        headers: {
            "Authorization" : `Bearer ${JSON.parse(window.localStorage.getItem(Config.Bitbucket.ClientId)).access_token}`
        },
        params: {
            page: pageNumber
        }
    }).then(response  => {
        return response.data
    }).catch(async error => {
        if(error.response.status === 401)
            return await RefreshToken(() => GetBranch(teamId, repoId, pageNumber))
        else
            throw CatchAxiosError(error)
    })
}

const CommitReadmeFile = (teamId, repoId) => {
    // const blob = new Blob(['Created from automated process'], {type : 'text/markdown'})
    // const blob = new Blob(['Created from automated process'], {type : 'text/markdown'})
    // var formDataToPass = new FormData()
    // formDataToPass.append('file', blob, 'success.txt')
    return api({
        method: "POST",
        url: `${Config.Bitbucket.Endpoints.GetRepo}/${teamId}/${repoId}/src`,
        headers: {
            "Content-Type" : "application/x-www-form-urlencoded",
            "Authorization" : `Bearer ${JSON.parse(window.localStorage.getItem(Config.Bitbucket.ClientId)).access_token}`
        },
        data: qs.stringify({
            'README.MD' : DefaultReadme,
            'message': 'Created Using Automated Process - https://github.com/seanjin17/Bitbucket-Automated-New-Repository-Process',
        })
    }).then(response  => {
        return response
    }).catch(async error => {
        if(error.response.status === 401)
            return await RefreshToken(() => CommitReadmeFile(teamId, repoId))
        else
            throw CatchAxiosError(error)
    })
}

const ConfigureBranchingModel = (teamId, repoId, body) => {
    return api({
        method: "PUT",
        url: `${Config.Bitbucket.Endpoints.GetRepo}/${teamId}/${repoId}/branching-model/settings`,
        headers: {
            "Authorization" : `Bearer ${JSON.parse(window.localStorage.getItem(Config.Bitbucket.ClientId)).access_token}`
        },
        data: JSON.stringify(body)
    }).then(response  => {
        return response
    }).catch(async error => {
        if(error.response.status === 401)
            return await RefreshToken(() => ConfigureBranchingModel(teamId, repoId, body))
        else
            throw CatchAxiosError(error)
    })
}

const CreateBranchRestrictions = (teamId, repoId, body) => {
    return api({
        method: "POST",
        url: `${Config.Bitbucket.Endpoints.GetRepo}/${teamId}/${repoId}/branch-restrictions`,
        headers: {
            "Authorization" : `Bearer ${JSON.parse(window.localStorage.getItem(Config.Bitbucket.ClientId)).access_token}`
        },
        data: JSON.stringify(body)
    }).then(response  => {
        return response
    }).catch(async error => {
        if(error.response.status === 401)
            return await RefreshToken(() => CreateBranchRestrictions(teamId, repoId, body))
        else
            throw CatchAxiosError(error)
    })
}

const AssignDefaultReviewers = (teamId, repoId, userName) => {
    return api({
        method: "PUT",
        url: `${Config.Bitbucket.Endpoints.GetRepo}/${teamId}/${repoId}/default-reviewers/${userName}`,
        headers: {
            "Authorization" : `Bearer ${JSON.parse(window.localStorage.getItem(Config.Bitbucket.ClientId)).access_token}`
        },
    }).then(response  => {
        return response
    }).catch(async error => {
        if(error.response.status === 401)
            return await RefreshToken(() => AssignDefaultReviewers(teamId, repoId, userName))
        else
            throw CatchAxiosError(error)
    })
}

const EnablePipelines = (teamId, repoId, body) => {
    return api({
        method: "PUT",
        url: `${Config.Bitbucket.Endpoints.GetRepo}/${teamId}/${repoId}/pipelines_config`,
        headers: {
            "Authorization" : `Bearer ${JSON.parse(window.localStorage.getItem(Config.Bitbucket.ClientId)).access_token}`
        },
        data: JSON.stringify(body)
    }).then(response  => {
        return response
    }).catch(async error => {
        if(error.response.status === 401)
            return await RefreshToken(() => EnablePipelines(teamId, repoId, body))
        else
            throw CatchAxiosError(error)
    })
}

const AddKnownHosts = (teamId, repoId, body) => {
    return api({
        method: "POST",
        url: `${Config.Bitbucket.Endpoints.GetRepo}/${teamId}/${repoId}/pipelines_config/ssh/known_hosts/`,
        headers: {
            "Authorization" : `Bearer ${JSON.parse(window.localStorage.getItem(Config.Bitbucket.ClientId)).access_token}`
        },
        data: JSON.stringify(body)
    }).then(response  => {
        return response
    }).catch(async error => {
        if(error.response.status === 401)
            return await RefreshToken(() => EnablePipelines(teamId, repoId, body))
        else
            throw CatchAxiosError(error)
    })
}

export {
    GetAccesTokenFromCode, 
    GetTeamsOfUser, 
    RefreshToken, 
    GetTeamById, 
    GetProjectsOfTeam, 
    CreateProject, 
    GetRepoOfTeam, 
    CreateRepo, 
    CreateBranch, 
    GetBranch, 
    CommitReadmeFile, 
    ConfigureBranchingModel, 
    CreateBranchRestrictions, 
    AssignDefaultReviewers, 
    EnablePipelines, 
    AddKnownHosts
}