const express = require('express');
const multer = require('multer');
const fs = require('fs');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const fileValidation = require('../../validations/file.validation');
const fileController = require('../../controllers/file.controller');


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const today = new Date();
    const month = today.getMonth();  // 10 (Month is 0-based, so 10 means 11th Month)
    const year = today.getFullYear();
    const dir = `documents/${req.query.userId}/${year}/${month + 1}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return cb(null, dir);
  }

});
const upload = multer({ storage }).array('files');

router
  .route('/')
  .post(auth('manageFiles'), validate(fileValidation.createFile), upload,fileController.createFile)
  .get(auth('getFiles'), validate(fileValidation.getFiles), fileController.getFiles)
  .delete(auth('manageFiles'),validate(fileValidation.deleteFiles), fileController.deleteFiles);

router
  .route('/download')
  .post(auth('download'), validate(fileValidation.downfiles), fileController.convertdownload)
  .get(auth('getBase'), validate(fileValidation.downfiles), fileController.getBase64)


module.exports = router;

/**
 * @swagger
 * tags: 
 *   name: Files
 *   description: File management and retrieval
 */

/**
 * @swagger
 * path:
 *  /files:
 *    post:
 *      summary: Create a file
 *      tags: [Files]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: userId
 *          schema:
 *           type: integer
 *          required: true
 *          description: Numeric ID of the user to get
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              required:
 *                - files
 *                - fileType
 *              properties:
 *                files:
 *                  type: array
 *                  items:
 *                    type: string 
 *                    format: binary
 *                fileType:
 *                    type: string
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/User'
 *        "400":
 *          $ref: '#/components/responses/NotFound'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *
 *    get:
 *      summary: Get all files
 *      tags: [Files]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: name
 *          schema:
 *            type: string
 *          description: File name
 *        - in: query
 *          name: scanStatus
 *          schema:
 *            type: boolean
 *          description: Scan Status
 *        - in: query
 *          name: fileName
 *          schema:
 *            type: string
 *          description: File Name
 *        - in: query
 *          name: fromDate
 *          schema:
 *            type: string
 *          description: From Date
 *        - in: query
 *          name: toDate
 *          schema:
 *            type: string
 *          description: To Date
 *        - in: query
 *          name: fileType
 *          schema:
 *            type: string
 *          description: File Type
 *        - in: query
 *          name: sortBy
 *          schema:
 *            type: string
 *          description: sort by query in the form of field:desc/asc (ex. name:asc)
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *            minimum: 1
 *          default: 10
 *          description: Maximum number of files
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            minimum: 1
 *            default: 1
 *          description: Page number
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  results:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/User'
 *                  page:
 *                    type: integer
 *                    example: 1
 *                  limit:
 *                    type: integer
 *                    example: 10
 *                  totalPages:
 *                    type: integer
 *                    example: 1
 *                  totalResults:
 *                    type: integer
 *                    example: 1
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 * 
 *    delete:
 *      summary: Delete files
 *      tags: [Files]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: ids
 *          required: true
 *          schema:
 *            type: array
 *          description: File ids
 *      responses:
 *        "200":
 *          description: No content
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 * 
 */

/**
 * @swagger
 * path:
 *  /files/download:
 *    post:
 *      summary: Download File
 *      tags: [Files]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - fileId
 *                - downloadType
 *              properties:
 *                fileId:
 *                  type: integer
 *                downloadType:
 *                  type: string
 *              example:
 *                fileId: 1
 *                downloadType: 'csv'
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  files:
 *                    $ref: '#/components/schemas/User'
 *        "401":
 *          description: File not found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *              example:
 *                code: 401
 *                message: File not found
 *    
 *    get:
 *      summary: Get a base64
 *      tags: [Files]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: ids
 *          required: true
 *          schema:
 *            type: string
 *          description: file Ids
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
