const handler = require('serve-handler');
const https = require('http');
const fs = require("fs");

const server = https.createServer(
    {
        key: fs.readFileSync("server.key"),
        cert: fs.readFileSync("server.cert"),
    },
    (request, response) => handler(request, response, {
        public: "dist",
    }),
);

server.listen(3000, () => {
  console.log('Running at https://localhost:3000');
});
