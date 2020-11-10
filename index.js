const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
var multer = require('multer');
const fs = require('fs');
var filename;
const helmet = require('helmet');
const compression = require('compression');

//MIDDLEWARE.......................
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
//MIDDLEWARE.......................


//FILE TYPE CLASSIFICATION........................
function fileType(){
    let namedir = "public";
    let fileext = "";
    let files = fs.readdirSync(namedir);
    filename = files[0];
    fileext = files[0].split('.').pop();
    return fileext;
};
//FILE TYPE CLASSIFICATION........................


//DELETE FILE FUNCTION................................
function deleteFile(){
    fs.unlink(`public/${filename}`,function(error){
        console.log(error);
    });
};
//DELETE FILE FUNCTION................................

//CLASSIFY CONTARR DATA.............................
function classify(){
    var phone = false;
    var id = false;
    var email = false;
    var carreg = false;
    const phonenumdata = [+2,01,02,03,04,05,06,07,08,09];

    for(index=0; index<contarr.length; index++){
        let contents = contarr[index];

        for(count=0; count<phonenumdata.length; count++)
        if(contents[0]+contents[1] == phonenumdata[count]) phone = true;
        
        classjson = {"phone":phone, "id":id, "email": email, "carreg":carreg};
    }
};
//CLASSIFY CONTARR DATA.............................


var contarr = [];
var classjson = {};
//TEXT FILE PARSE INTO CONTARR VARIABLE......................
function txtParser(){
let directory = `public/${filename}`;
fs.readFile(directory,'utf8', function(error, data){
    contarr = data.split('\n');
});
};
//TEXT FILE PARSE INTO CONTARR VARIABLE......................


//MONGODB ATLAS CONECTION AND SCHEMA..............
mongoose.connect('mongodb+srv://Hannovdw1998:Hannovdw1998@hannocluster.6soqj.mongodb.net/Proj2_MetaData?retryWrites=true&w=majority',{ useUnifiedTopology: true,useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
.then(()=> console.log('Conected to MongoDB Atlas...'))
.catch(err => console.error('could not connect to MongoDB Atlass',err));

const metaSchema = new mongoose.Schema({
    empid: String,
    doctype:String,
    id: Boolean,
    email: Boolean,
    telnr: Boolean,
    carreg: Boolean
});
const MetaData = mongoose.model('MetaData', metaSchema);
//MONGODB ATLAS CONECTION..............


//MULTER INSTANCE...........................
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname )
  }
});
var upload = multer({ storage: storage }).single('file');
//MULTER INSTANCE...........................



//GET REQUEST...........................
app.get('/api/getdata',(req,res)=>{

    const meta = new MetaData({
        empid: 'WadePrinloo1995',
        doctype: 'Excell Document',
        id: true,
        email: true,
        telnr: true,
        carreg: false
            });
    meta.save();
    res.send(meta);
});
//GET REQUEST...........................




//POST REQUEST.........................
app.post('/api/postfile',function(req, res) {
     
    upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
    })
    
    setTimeout(myFunction, 1000)

    function myFunction(){
        let type = fileType();
        if(type == 'txt'){
            txtParser();
            console.log(contarr[0]);
            deleteFile();
            classify()
        }
    }
    res.send(classjson);
});
//POST REQUEST.........................


//CREATE SERVER..........................
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port}...`));
//CREATE SERVER..........................
