const express = require('express');
const app = express();
const{json} = require('body-parser');
const mysql = require('mysql');

// yarn add cors xu ly cho cross port
app.listen('3000' , () => console.log("Server started"));