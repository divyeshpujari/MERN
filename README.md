## How to start backend service?
-> Hit the `npm start` at the root of the folder `GlanceAI`.

## PORT which has been used by application?
-> `3001` you can change it from `config.json`

## Folders/Files and description?
1. `uploads`:- Upload folder which holds the uploaded csv.
2. `config.json`:- Use to store the configuration json object.
    Note:- later you can use the `config` node module from npm to handle that betterly in large application. To avoid extra module from demo application I haven't used that.
3. `index.js`:- Main js or Index file of the node application.
4. `multerMiddleware`:- Move the multer middleware to seprate file. Reason behind it is, we can reuse at other place easily or in any other project.
5. `package.json`:- Mainifest file of node js application
6. `Sceenshots`:- Random screenshot of working application