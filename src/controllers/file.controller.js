const httpStatus = require('http-status');
const { pick, pickGTE, pickLTE, pickLike } = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { fileService } = require('../services');
const fs = require('fs');
const { json2csvAsync } = require('json-2-csv');
const axios = require('axios');
const FormData = require('form-data');
const config = require('../config/config');
const AdmZip = require('adm-zip');
const json2xls = require('json2xls');
const { base64encode, base64decode } = require('nodejs-base64');


const createFile = catchAsync((req, res) => {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    const length = req.files;
    if (length.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Please Select Your File');
    }
    req.files.map(async item => {
        const payload = {
            name: item.originalname,
            type: item.mimetype,
            size: item.size,
            userId: req.query.userId,
            scanStatus: false,
            fileName: item.filename,
            fileType: req.body.fileType,
        };
        const file = await fileService.createFile(payload);
        const Form_Data = new FormData();
        const div = `documents/${req.query.userId}/${year}/${month + 1}/${item.filename}`;
        Form_Data.append('file', fs.createReadStream(div));
        var result = await axios.post(config.ocrUrl, Form_Data, { headers: Form_Data.getHeaders() })
        if (result.data && result.data.status === 'OK') {
            const xls = JSON.stringify(result.data.text)
            fs.writeFileSync('file', xls, 'binary');
            const data = 'file'
            let buff = new Buffer(data);
            let base64data = buff.toString('base64');
            let buff1 = new Buffer(base64data, 'base64');
            let text1 = buff1.toString('ascii');
            let buff2 = fs.readFileSync((`${data}`));
            let base64data2 = buff2.toString('base64');
            let buff3 = new Buffer(base64data2, 'base64');
            fs.writeFileSync(`./upload/${Date.now()}_${payload.name}`, buff3, 'binary');
            const files = fs.readFileSync(`./upload/${Date.now()}_${payload.name}`, { encoding: "base64" });
            
            updateFile(file.dataValues.id, { scanStatus: true, Values: result.data.text, decode: files });
        }
    });
    // res.download('file');
    res.status(httpStatus.CREATED).send({ 'success': true });
});

const updateFile = (async (fileId, data, decod) => {
    const file = await fileService.updateFileById(fileId, data, decod);
    return file;
});

const getFiles = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'scanStatus', 'fileType']);
    let lteFilter = {};
    let gteFilter = {};
    let name1 = {};
    if (req.query.fromDate && req.query.fromDate !== '') {
        const data1 = pickGTE(req.query, ['fromDate']);
        gteFilter = { createdAt: data1.fromDate }
    }
    if (req.query.toDate && req.query.toDate !== '') {
        const data2 = pickLTE(req.query, ['toDate']);
        lteFilter = { updatedAt: data2.toDate }
    }
    if (req.query.name && req.query.name !== '') {
        const data3 = pickLike(req.query, ['name']);
        name1 = { name: data3.name }
    }
    const payload = { ...filter, ...gteFilter, ...lteFilter, ...name1 }
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await fileService.queryFiles(payload, options);
    res.send(result)
    // const xls = JSON.stringify(result);
    // fs.writeFileSync('jsonfile', xls, 'binary');
    // await res.download('jsonfile', () => {
    //     fs.unlinkSync('jsonfile');
    // })
});

const convertdownload = catchAsync(async (req, res) => {
    const { body } = req;
    const zip = new AdmZip();
    const download = await body.map(async (body) => {
        const { downloadType, fileId } = body;
        const file = await fileService.getfileById(fileId);
        if (file) {
            switch (downloadType) {
                case "xls":
                    {
                        excelOutput = `upload/xls/${Date.now()}.xls`;
                        const xls = await json2xls(file);
                        fs.writeFileSync(excelOutput, xls, 'binary');
                        zip.addLocalFile(excelOutput);
                        break;
                    }
                case "csv":
                    {
                        csvOutput = `upload/csv/${Date.now()}.csv`;
                        const xls = await json2csvAsync(file);
                        fs.writeFileSync(csvOutput, xls, 'binary');
                        zip.addLocalFile(csvOutput);
                        break;
                    }
                case "json":
                    {
                        jsonOutput = `upload/json/${Date.now()}.json`;
                        const xls = JSON.stringify(file);
                        fs.writeFileSync(jsonOutput, xls, 'binary');
                        zip.addLocalFile(jsonOutput);
                        break;
                    }
                default:
                    throw new ApiError(httpStatus.NOT_FOUND, ` Please Check downloadType :"${downloadType}" And FileId : ${fileId}`)
            }
        }
    });
    await Promise.all(download);
    res.set('Content-Disposition', `attachment; filename=${Date.now()}.zip`);
    res.send(zip.toBuffer());
});
const deleteFiles = catchAsync(async (req, res) => {
    const files = await fileService.deleteFiles(req.query.ids);
    return res.status(httpStatus.OK).send({ 'deletedFiles': files });
});
const getBase64 = catchAsync(async (req, res) => {
    const fileId = req.query.ids
    const file = await fileService.getfileById(fileId);
    let decoded = base64decode(file.decode);
    res.json({
        message: decoded,
    })
})

module.exports = {
    createFile,
    getFiles,
    convertdownload,
    deleteFiles,
    getBase64,
};