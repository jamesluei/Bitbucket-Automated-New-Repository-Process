import {KnownHosts} from './ssh-known-hosts'
export var Config = {
    Bitbucket:{
        ClientId: process.env.REACT_APP_CLIENT_CONSUMER_ID, // Your consumer Client ID
        ClientSecret: process.env.REACT_APP_CLIENT_CONSUMER_SECRET, // Your consumer secret
        Endpoints: {
            GetAccesTokenFromCode : "access_token",
            GetTeamsOfUser : "teams",
            GetRepo : "repositories",
        },
        DefaultReviewers: [], //Unique ID of user.Ex : {40b7d635-e121-4f04-8a7f-43bad1eddf47}
        SSHKeys: KnownHosts
    }
}