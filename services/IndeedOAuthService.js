
const { Issuer, TokenSet } = require('openid-client');

class IndeedOAuthService {
    constructor(config, session) {
        this.config = config;
        this.session = session;
    }
  
    async getTokenSetFromServer() {
        try {
            const issuer = await Issuer.discover(this.config.oauthDiscovery);
            const client = new issuer.Client({
                client_id: this.config.oauthClientId,
                client_secret: this.config.oauthClientSecret,
            });

            return await client.grant({
                grant_type: 'client_credentials',
                scope: 'employer_access',
                employer: this.config.employer
            });
        } catch (err) {
            console.dir(err.response.data, {depth: null});
        }
    }

    async getTokenSet() {
        let tokenSet;

        // attempt to get token set from session state
        if (this.session.tokenSet) {
            console.info('got token set from session state');
            tokenSet = new TokenSet(this.session.tokenSet);

            // check if token set is expired
            if (tokenSet.expired()) {
                console.info('token set expired, getting token set from server');
                tokenSet = await this.getTokenSetFromServer();
                this.session.tokenSet = tokenSet;
            }

        // otherwise, get token set from server
        } else {
            console.log('getting token set from server');
            tokenSet = await this.getTokenSetFromServer();
            this.session.tokenSet = tokenSet;
        } 
        return tokenSet;
    }
}

module.exports = IndeedOAuthService;

