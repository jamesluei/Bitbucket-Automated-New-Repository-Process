import { GetProjectsOfTeam, GetRepoOfTeam, CreateProject, CreateRepo, CreateBranch, GetBranch, CommitReadmeFile, ConfigureBranchingModel, CreateBranchRestrictions, AssignDefaultReviewers, EnablePipelines, AddKnownHosts } from './request-layer'
import { CreateProjectBody, CreateRepoBody, CreateBranchBody, BranchingModelBody, BranchRestrictionsBody, EnablePipelineBody } from './bitbucket-api-helper'
import { Config } from './config'

const ShuffleString = s => {
    var arr = s.split('');
    arr.sort(function () {
        return 0.5 - Math.random();
    });
    s = arr.join('');
    return s;
}

const CheckIfProjectExists = async (data) => {
    try {
        var TeamProjects = []
        await GetProjectsOfTeam(data.teamId).then(async data1 => {
            data1.values.map(e => TeamProjects.push(e))
            if (data1.size > 10) {
                for (let x = 2; x <= Math.ceil(parseFloat(data1.size / 10)); x++) {
                    await GetProjectsOfTeam(data.teamId, x).then(data2 => {
                        data2.values.map(e => TeamProjects.push(e))
                    }).catch(e => {
                        console.log(e)
                    })
                }
            }
        }).then(() => {
            console.log(TeamProjects)
        }).catch(e => {
            console.log(e)
        })
        let ProjectDetails = TeamProjects.reduce((a, c) => {
            if (c.name.includes(data.AccountName) || c.name.includes(data.orgId))
                a.push(c)
            return a
        }, [])
        return ProjectDetails
    }
    catch (e) {
        throw e
    }
}

const CreateNewProject = async data => {
    try {
        CreateProjectBody.name = data.AccountName
        CreateProjectBody.key = data.AccountName.slice(0, 2).toUpperCase() + "_" + ShuffleString(data.AccountName + Math.random()).toUpperCase().slice(0, 4)
        let CreateProjectData = await CreateProject(data.teamId, CreateProjectBody)
        return CreateProjectData
    }
    catch (e) {
        throw e
    }
}

const CreateRepository = async (data, projectData) => {
    CreateRepoBody.project.uuid = projectData.uuid
    CreateRepoBody.project.key = projectData.key
    let create = await CreateRepo(data.teamId, data.ProjectName, CreateRepoBody)
    return create
}


export const CreateRepoProcess = async data => {
    try {
        var Project = await CheckIfProjectExists(data).then(val => {
            data.UpdateStatus({ type: "Message", Message: `Checking If Project Exists : Success` })
            return val
        }).catch(e => {
            data.UpdateStatus({ type: "Error", Message: `Checking If Project Exists : Failed with error ${e}` })
            return e
        })
        if (Project.length == 0)
            Project = await CreateNewProject(data).then(val => {
                data.UpdateStatus({ type: "Message", Message: `Create New Project : Success` })
                return val
            }).catch(e => {
                data.UpdateStatus({ type: "Error", Message: `Create New Project : Failed with error ${e}` })
                return e
            })
        else Project = Project[0]
        let repoCreateData = await CreateRepository(data, Project).then(val => {
            data.UpdateStatus({ type: "Message", Message: `Create Repository : Success` })
            return val
        }).catch(e => {
            data.UpdateStatus({ type: "Error", Message: `Create Repository : Failed with error ${e}, Can't Continue Further` })
            return e
        })
        if (repoCreateData.type === "error")
            throw JSON.stringify(repoCreateData.error)
        await CommitReadmeFile(data.teamId, repoCreateData.uuid).then(val => {
            data.UpdateStatus({ type: "Message", Message: `Create Readme File : Success` })
            return val
        }).catch(e => {
            data.UpdateStatus({ type: "Error", Message: `Create Readme File : Failed with error ${e}` })
            return e
        })
        let RepoBranchesDetails = await GetBranch(data.teamId, repoCreateData.uuid).then(val => {
            data.UpdateStatus({ type: "Message", Message: `Getting Repository Branches : Success` })
            return val
        }).catch(e => {
            data.UpdateStatus({ type: "Error", Message: `Getting Repository Branches : Failed with error ${e}` })
            return e
        })
        if (RepoBranchesDetails.size === 0)
            throw new Error("No Branches Found")
        CreateBranchBody.name = "development"
        CreateBranchBody.target.hash = RepoBranchesDetails.values[0].target.hash
        await CreateBranch(data.teamId, repoCreateData.uuid, CreateBranchBody).then(val => {
            data.UpdateStatus({ type: "Message", Message: `Creating Development Branch : Success` })
            return val
        }).catch(e => {
            data.UpdateStatus({ type: "Error", Message: `Creating Development Branch : Failed with error ${e}` })
            return e
        })
        await ConfigureBranchingModel(data.teamId, repoCreateData.uuid, BranchingModelBody).then(val => {
            data.UpdateStatus({ type: "Message", Message: `Configuring Branching Model : Success` })
            return val
        }).catch(e => {
            data.UpdateStatus({ type: "Error", Message: `Configuring Branching Model : Failed with error ${e}` })
            return e
        })
        BranchRestrictionsBody.map(e => {
            return CreateBranchRestrictions(data.teamId, repoCreateData.uuid, e).then(val => {
                data.UpdateStatus({ type: "Message", Message: `Adding Branch Restriction - Kind : ${e.kind}, branch type : ${e.branch_type} : Success` })
                return val
            }).catch(e => {
                data.UpdateStatus({ type: "Error", Message: `Adding Branch Restriction - Kind : ${e.kind}, branch type : ${e.branch_type} : Failed with error ${e}` })
                return e
            })
        })
        Config.Bitbucket.DefaultReviewers.map(e => {
            return AssignDefaultReviewers(data.teamId, repoCreateData.uuid, e).then(val => {
                data.UpdateStatus({ type: "Message", Message: `Adding Default Reviewer ${e} : Success` })
                return val
            }).catch(e => {
                data.UpdateStatus({ type: "Error", Message: `Adding Default Reviewer ${e} : Failed with error ${e}` })
                return e
            })
        })
        await EnablePipelines(data.teamId, repoCreateData.uuid, EnablePipelineBody).then(val => {
            data.UpdateStatus({ type: "Message", Message: `Enabling Pipelines : Success` })
            return val
        }).catch(e => {
            data.UpdateStatus({ type: "Error", Message: `Enabling Pipelines : Failed with error ${e}` })
            return e
        })
        Config.Bitbucket.SSHKeys.map(e => {
            return AddKnownHosts(data.teamId, repoCreateData.uuid, e).then(val => {
                data.UpdateStatus({ type: "Message", Message: `Adding Known SSH Host - ${e.hostname} : Success` })
                return val
            }).catch(e => {
                data.UpdateStatus({ type: "Error", Message: `Adding Known SSH Host - ${e.hostname} : Failed with error ${e}` })
                return e
            })
        })
    }
    catch (e) {
        throw e
    }
}   