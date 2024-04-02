import express, {ErrorRequestHandler} from 'express'
import multer from "multer";
import path from "path";
import fs from 'fs/promises';
import scanner from "../scan/Scanner"

const fileHandler = multer({
    dest: "files/"
})

const app = express()
const port = 3000
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500)
        .send({errors: [{message: "Something went wrong"}]});
}

app
    .get('/', (req, res) => {
        res.sendFile(path.join(__dirname, "/form.html"))
    })
    .post('/submit-file', fileHandler.single("file"), async (req, res, next) => {
        try {
            const {file} = req
            if (!file) {
                res.sendStatus(400)
                return
            }

            const {filename, destination, originalname} = file
            const filepath = path.join(destination, filename)
            const result = await scanner.scanFile(filepath, originalname)

            await fs.unlink(filepath)

            res.json({result})
        } catch (e) {
            next(e)
        }
    })
    .use(errorHandler)


const startApp = () => {
    app.listen(port, () => {
        console.log(`Web app listening on port ${port}`)
    })
    return app
}

export default startApp