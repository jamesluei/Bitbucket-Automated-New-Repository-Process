import {KnownHosts} from './ssh-known-hosts'
export const Config = {
    Bitbucket:{
        ClientId: "", // Your consumer Client ID
        ClientSecret: "", // Your consumer secret
        Endpoints: {
            GetAccesTokenFromCode : "access_token",
            GetTeamsOfUser : "teams",
            GetRepo : "repositories",
        },
        DefaultReviewers: [], //Unique ID of user.Ex : {40b7d635-e121-4f04-8a7f-43bad1eddf47}
        SSHKeys: KnownHosts
    }
}