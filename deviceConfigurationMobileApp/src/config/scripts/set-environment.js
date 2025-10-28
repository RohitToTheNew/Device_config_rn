const sc = require('./script-constants');
const fs = require('fs');
//Obtain the environment string passed to the node script
const environment = process.argv[2];
//read the content of the json file
const envFileContent = require(`../envs/${environment}.json`);
//copy the json inside the env.json file
try {
  fs.writeFileSync(
    './src/config/envs/env.json',
    JSON.stringify(envFileContent, undefined, 2),
  );
  console.log(
    sc.successTag,
    `Environment change success! Selected: ${environment}`,
  );
} catch (e) {
  console.log(sc.errorTag, e);
}
