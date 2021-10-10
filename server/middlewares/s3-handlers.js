const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new AWS.S3({ region: process.env.AWS_REGION })
const bucket = process.env.S3_BUCKET
const fileStorage = multerS3({
    s3,
    acl: "private", // "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: "attachment",
    bucket,
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname })
    },
    key: (req, file, callback) => {
        const userFolder = "User" + req.user.id;
        const fileName = `${userFolder}/Files/${new Date().getTime()}-${file.originalname}`;
        callback(null, fileName)
    }
})

const uploadfileToS3 = multer({
    storage: fileStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|pdf|doc|docx)$/)) {           //Option 2 using expression
            return cb(new Error("Please upload either a jpg, pdf, doc or docx file."))
        }
        cb(undefined, true);
    }
}).single("file");

const getfileFromS3 = async (req, res, next) => {
    const Key = req.query.key;
    try {
        const { Body } = await s3.getObject({
            Key,
            Bucket: bucket
        }).promise()

        req.fileBuffer = Body;
        next();
    } catch (err) {
        console.log({ err });
    }
}

const deleteFileFromS3 = async (req, res, next) => {
    const Key = req.body.key;
    try {
        await s3.deleteObject({
            Key,
            Bucket: bucket
        }).promise();
        next()
    } catch (err) {
        res.status(404).send({
            message: "File not found"
        })
    }
}

module.exports = {
    uploadfileToS3,
    deleteFileFromS3,
    getfileFromS3
};