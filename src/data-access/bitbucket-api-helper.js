var CreateProjectBody = {
    "name": "",
    "key": "",
    "description": "Automated Creation",
    "links": {
        "avatar": {
            "href": "https://pbs.twimg.com/profile_images/984172509544120320/b6-a5wIm_400x400.jpg"
        }
    },
    "is_private": true
}

var CreateRepoBody = {
                        "scm": "git",
                        "website": null,
                        "has_wiki": false,
                        "fork_policy": "no_public_forks",
                        "project": {
                            "key": "",
                            "uuid": "",
                        },
                        "is_private": true,
                        "description": "Automated Creation"
                    }

var CreateBranchBody = {
    "name" : "",
    "target" : {
        "hash" : "",
    }
}

var BranchingModelBody = {
                        "development": {
                        "is_valid": true,
                        "enabled" : true,
                        "name": "development",
                        "use_mainbranch": false
                        },
                        "branch_types": [
                        {
                            "kind": "release",
                            "enabled": false,
                            "prefix": "release/"
                        },
                        {
                            "kind": "hotfix",
                            "enabled": false,
                            "prefix": "hotfix/"
                        },
                        {
                            "kind": "feature",
                            "enabled": false,
                            "prefix": "feature/"
                        },
                        {
                            "kind": "bugfix",
                            "enabled": false,
                            "prefix": "bugfix/"
                        }
                        ],
                        "production": {
                        "is_valid": true,
                        "enabled": true,
                        "name": "master",
                        "use_mainbranch": false
                        },
                        "type": "branching_model_settings"
                    }

const BranchRestrictionsBody = [
	{
		"kind": "require_default_reviewer_approvals_to_merge",
		"users": [],
		"pattern": "",
		"value": 1,
		"branch_match_kind": "branching_model",
		"groups": [],
		"branch_type": "production",
		"type": "branchrestriction"
	},
	{
		"kind": "require_approvals_to_merge",
		"users": [],
		"pattern": "",
		"value": 1,
		"branch_match_kind": "branching_model",
		"groups": [],
		"branch_type": "production",
		"type": "branchrestriction"
	},
	{
		"kind": "force",
		"users": [],
		"pattern": "",
		"value": null,
		"branch_match_kind": "branching_model",
		"groups": [],
		"branch_type": "production",
		"type": "branchrestriction"
	},
	{
		"kind": "delete",
		"users": [],
		"pattern": "",
		"value": null,
		"branch_match_kind": "branching_model",
		"groups": [],
		"branch_type": "production",
		"type": "branchrestriction"
	},
	{
		"kind": "push",
		"users": [],
		"pattern": "",
		"value": null,
		"branch_match_kind": "branching_model",
		"groups": [],
		"branch_type": "production",
		"type": "branchrestriction"
	},
	{
		"kind": "force",
		"users": [],
		"pattern": "",
		"value": null,
		"branch_match_kind": "branching_model",
		"groups": [],
		"branch_type": "development",
		"type": "branchrestriction"
	},
	{
		"kind": "delete",
		"users": [],
		"pattern": "",
		"value": null,
		"branch_match_kind": "branching_model",
		"groups": [],
		"branch_type": "development",
		"type": "branchrestriction"
	}
]

const EnablePipelineBody = {
    "enabled": true,
    "type": "repository_pipelines_configuration"
  }

export { CreateProjectBody, CreateRepoBody, CreateBranchBody, BranchingModelBody, BranchRestrictionsBody, EnablePipelineBody}