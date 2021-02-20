const axios = require('axios');

class CandidateService {
    constructor(config, tokenSet) {
        this.config = config;
        this.tokenSet = tokenSet;
    }

    async findCandidates(city, keywords) {
        try {
            let results = await axios.post(
                this.config.resumeSearchURI, 
                {
                    searchArea: {
                        country: 'US',
                        freeformLocation: city,
                    },
                    keywords
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.tokenSet.access_token}`
                    }
                }
            );
            return results.data;
        } catch (err) {
            console.dir(err.response.data, {depth: null});
            throw err;
        }
    }
}

module.exports = CandidateService;
