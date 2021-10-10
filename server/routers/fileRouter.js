const express = require("express");
const { Readable } = require("stream");

const { uploadfileToS3, deleteFileFromS3, getfileFromS3 } = require("../middlewares/s3-handlers");
const { userAuth, confirmAuthByToken } = require("../middlewares/userAuth");

const File = require("../models/fileModel");

const router = new express.Router();
// 
router.post("/upload-file", userAuth, uploadfileToS3, async (req, res) => {

    if (req.file == null) {
        return res.status(422).send({
            code: 422,
            message: "File was not uploaded"
        })
    }

    const fileData = {
        userId: req.user.id,
        type: req.file.originalname.split(".")[1],
        originalName: req.file.originalname,
        storageName: req.file.key.split("/")[1],
        bucket: process.env.S3_BUCKET,
        region: process.env.AWS_REGION,
        key: req.file.key
    }
    try {
        const file = await File.create(fileData)
        return res.status(201).send(file)
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: err.message
        })
    }

})

router.get("/files", userAuth, async (req, res) => {
    try {

        const files = await File.findAll({
            where: {
                userId: req.user.id
            }
        })
        // console.log({ files });
        if (files == null || files.length === 0) {
            return res.status(404).send({
                status: 404,
                message: "None files matches"
            })
        }
        res.send(files);
    } catch (err) {
        res.status(500).send(err.file)
    }
})

router.get("/get-file", getfileFromS3, async (req, res) => {
    await confirmAuthByToken(req, req.query.token)
    const fileName = req.query.name
    const stream = Readable.from(req.fileBuffer)
    console.log({ fileName, isBufferExist: req.fileBuffer != null });
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + fileName
    )
    stream.pipe(res)
})



router.delete("/delete-file", deleteFileFromS3, async (req, res) => {
    const id = req.body.id;

    try {
        const deletedFile = await File.destroy({ where: { id } });
        if (deletedFile === 0) {
            return res.status(404).send({
                message: "File not found."
            })
        }
        res.send();
    } catch (err) {
        res.status(500).send()
    }
})



module.exports = router;