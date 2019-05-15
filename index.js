const express = require('express');
const app = express();
const {json} = require('body-parser');
const mysql = require('mysql');


app.use(json());

const con = mysql.createPool({
  connectionLimit : 50,
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'quanlytuvung',
});  

app.get('/words' , function(req,res){
    con.getConnection((error , connection) =>{
        if(error){
            connection.release();
            res.send({success : false , message : error})
        }else{
            connection.query("SELECT * FROM tuvung" , function (error, rows, fields) {
                connection.release();
                if (error) return res.send({success : false , message : "ERROR VALUE"});
                res.send({success : true , words : rows});
            });
        }
    })
});
app.post('/word' ,(req,res) =>{
    con.getConnection((error , connection) =>{
        if(error){
            connection.release();
            res.send({success : false , message : error})
        }else{
            const {en , vn} = req.body;  
            const word = {Id : null , en , vn , isMemorized : 0}
            connection.query("INSERT INTO tuvung SET ?",word, function (error, result, fields) {
                connection.release();
                if (!!error){
                    res.send({success : false , message : error.message});
                }else{
                    res.send({success : true , row : result.affectedRows})
                }
            });
        }

    });
})
app.put('/word/:id',(req,res) => {
    con.getConnection((error , connection) =>{
        if(error){
            connection.release();
            res.send({success : false , message : error})
        }else{
            const {id} = req.params;
            const{isMemorized} = req.body;  
            connection.query("UPDATE tuvung SET isMemorized = ? WHERE Id = ?", [isMemorized,id] , function (error, result, fields) {
                connection.release();
                if (!!error){
                    res.send({success : false , message : error.message});
                }else{
                    res.send({success : true , row : result.affectedRows})
                }
            });
        }
    });
});
app.delete('/word/:id' , (req,res)=>{
    con.getConnection((error , connection) =>{
        if(error){
            connection.release();
            res.send({success : false , message : error})
        }else{
            const{id} = req.params;  
            connection.query("DELETE FROM tuvung WHERE Id = ?", [id] , function (error, result, fields) {
                connection.release();
                if (!!error) return res.send({success : false , message : error.message});
                res.send({success : true , row : result.affectedRows})
            });
        }
      
    });


});

app.listen('3000', () => console.log("Server started"));
