const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const http = require('http');

const routes = require('./api/routes');

const port = process.env.PORT || 1111;
let app = express();
let server = http.createServer(app);

//body-parser middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// cors
app.use(cors())

//API ROUTES 
app.use(routes);

// Connect to server
server.listen(port,()=>{
   console.log(`Server is up on port ${port}`); 
});