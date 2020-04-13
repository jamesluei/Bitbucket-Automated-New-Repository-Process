export const KnownHosts = [
    {
      "type": "pipeline_known_host",
      "hostname": "127.0.0.1",
      "public_key": {
        "type": "pipeline_ssh_public_key",
        "key_type": "ssh-rsa",
        "key": "", // Key to access the server
        "md5_fingerprint": "",
        "sha256_fingerprint": ""
      }
    }
  ]

  // You can try adding 1 ssh server manually to a repo and then get the 
  // configuration from bitbucket get pipelines api youll find the proper format of this