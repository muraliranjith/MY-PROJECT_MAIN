const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const enterpriseValidation = require('../../validations/enterprise.validation');
const enterpriseController = require('../../controllers/enterprise.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageenterprise'), validate(enterpriseValidation.createEnterprise), enterpriseController.createEnterprise)
  .get(auth('getEnterprises'), validate(enterpriseValidation.getenterprises), enterpriseController.getEnterprises);


module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Enterprise
 *   description: Enterprise management and retrieval
 */

/**
 * @swagger
 * path:
 *  /enterprise:
 *    post:
 *      summary: Create a enterprise
 *      description: can create other enterprises.
 *      tags: [Enterprise]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - name
 *                - email
 *                - password
 *                - role
 *              properties:
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *                  description: must be unique
 *                password:
 *                  type: string
 *                  format: password
 *                  minLength: 8
 *                  description: At least one number and one letter
 *                role:
 *                   type: string
 *                   enum: [user, admin,emplpoyee]
 *              example:
 *                name: fake name
 *                email: fake@example.com
 *                password: password1
 *                role: employee
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/User'
 *        "400":
 *          $ref: '#/components/responses/DuplicateEmail'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 * 
 *    get:
 *      summary: Get all enterprises
 *      description: can retrieve all enterprises.
 *      tags: [Enterprise]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: name
 *          schema:
 *            type: string
 *          description: Enterprise name
 *        - in: query
 *          name: role
 *          schema:
 *            type: string
 *          description: Enterprise role
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
 *          description: Maximum number of enterprises
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
 */