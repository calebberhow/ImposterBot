USAGE = 'cozy'; // "cozy" or "test"
IDs = require('./ids_' + USAGE + '.json');
module.exports = IDs;
module.exports.USAGE = USAGE