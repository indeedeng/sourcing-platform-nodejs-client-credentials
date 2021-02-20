var express = require('express');
var router = express.Router();

const config = require('../config');
const IndeedOAuthService = require('../services/IndeedOAuthService');
const CandidateService = require('../services/CandidateService');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const city = req.query.city;
  const keywords = req.query.keywords;
  let results;

  if (keywords) {
    const indeedOAuth = new IndeedOAuthService(config, req.session);
    const tokenSet = await indeedOAuth.getTokenSet();
    console.dir(tokenSet);

    const candidates = new CandidateService(config, tokenSet);
    results = await candidates.findCandidates(city, keywords);
    console.dir(results, { depth: null });
  }
  res.render('index', { 
    city, keywords, results 
  });
});

module.exports = router;
