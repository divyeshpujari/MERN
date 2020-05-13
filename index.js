'use strict;'
// Public Modules
const express = require('express');
const app = express();
const csvParser = require('csv-parser');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');
// Public modules end

// Internal module or file import
const config = require('./config.json');
const { upload } = require('./multerMiddleware');
// Internal module or file import end

// Variables
const PORT = config['APPLICATION_PORT'];
// variables end

//middleware starts
app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
//middleware ends

app.get("/", (req, res) => {
    res.status(200).send("System working fine at " + new Date());
});

app.post('/upload_csv_and_list', upload.single('csvFile'), (req, res) => {
    let uploadedFile = req.file;
    
    if (!uploadedFile) {
        console.log("File not correctly Uploaded");
        res.status(500).send(new Error("Something went wrong while uploading a file, Please try again"));
    }
    const sourceNameFilter = req.body['sourcename'] || undefined;
    const ndaysFilter = +(req.body['ndays']) || 7;
    const csvData = [];

    fs.createReadStream(uploadedFile.path)
    .on('error', (error) => {
        console.log("An error occurred while reading uploaded csv file");
        res.status(500).send(error.message);
    })
    .pipe(csvParser())
    .on('data', (dataRow) => {
        const rowDate = moment(dataRow.date, "DD-MM-YY");
        const todayDate = moment(new Date(), "DD-MM-YY");
        const ndaysBeforeDate = moment(new Date(), "DD-MM-YY").subtract(ndaysFilter,'d');

        if (rowDate.isBetween(ndaysBeforeDate, todayDate) &&
           (!sourceNameFilter || dataRow.name == sourceNameFilter)
        ) {
            csvData.push(dataRow);          
        }
    })
    .on('end', () => {
        res.status(200).json(csvData)
    });
});

app.listen(PORT, (error) => {
    if (error) {
        console.log("An error occurred while starting the Node.js Application on port %d", PORT);
        process.exit(1); // Note: it will indicate that process has been exit with an error
    }
    console.log("Node.js Application successfully start on http://localhost:%d/", PORT);
});