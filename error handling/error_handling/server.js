const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const mongoose = require('mongoose');
const app = require('./app');

//console.log(app.get('env'));
console.log(process.env);

mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true
}).then((conn) => {
    //console.log(conn);
    console.log('DB Connection Successful');
})
    


const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log('server has started...');
})
//if password is wrong then give error message which connect to conn_str
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('Unhandled rejection occured! Shutting down...');
 
    server.close(() => {
     process.exit(1);
    })
 })