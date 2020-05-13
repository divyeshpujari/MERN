'use strict;'
// Public Modules
const express = require('express');
const app = express();
const csvParser = require('csv-parser');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
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
    const csvData = [];
    fs.createReadStream(uploadedFile.path)
    .on('error', (error) => {
        console.log("An error occurred while reading uploaded csv file");
        res.status(500).send(error.message);
    })
    .pipe(csvParser())
    .on('data', (dataRow) => {
        csvData.push(dataRow);
    })
    .on('end', () => {
        res.status(200).json(csvData);
    })
});

app.listen(PORT, (error) => {
    if (error) {
        console.log("An error occurred while starting the Node.js Application on port %d", PORT);
        process.exit(1); // Note: it will indicate that process has been exit with an error
    }
    console.log("Node.js Application successfully start on http://localhost:%d/", PORT);
});