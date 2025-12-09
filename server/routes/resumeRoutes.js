import express from 'express'
import protect from '../middleware/auth.js'
import { createResume, deleteResume, getPublicResumebyId, getResumebyId, updateResume } from '../config/controllers/resumeController.js'
import upload from '../config/multer.js'

const resumeRouter  = express.Router()

resumeRouter.post('/create',protect, createResume)
resumeRouter.put('/update',upload.single('image'),protect, updateResume)
resumeRouter.delete('/delete/:resumeId',protect, deleteResume)
resumeRouter.get('/get/:resumeId',protect, getResumebyId)
resumeRouter.get('/public/:resumeId', getPublicResumebyId)

export default resumeRouter

