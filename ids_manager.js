import testIds from './ids_test.json' assert { type: "json" };
import cozyIds from './ids_cozy.json' assert { type: "json" };
const USAGE = 'test'; // "cozy" or "test"
var IDs;
if (USAGE == 'test')
{
    IDs = testIds;
}
else {
    IDs = cozyIds;
}

export default {IDs, USAGE}
