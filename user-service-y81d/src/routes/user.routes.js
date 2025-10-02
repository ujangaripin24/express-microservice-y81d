import express from 'express'
import * as userController from './../controllers/user.controller.js'
import { CreateUserValidator, UpdateUserValidator } from './../validators/user.validator.js'
import { validationResult } from 'express-validator'
import { authenticate } from '../middleware/guard.middleware.js'
const router = express.Router()

router.get('/get-all', authenticate, userController.GetAllUsers)
router.post('/create', CreateUserValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        next()
    }
}, userController.CreateUser);
router.get('/detail/:uuid', userController.GetUserByUUID);
router.get('/email/:email', userController.GetUserByEmail);
router.put('/update/:uuid', authenticate, UpdateUserValidator, (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    } else {
        next()
    }
}, userController.UpdateUser)
router.delete('/delete/:uuid', authenticate, userController.DeleteUser);

export default router;