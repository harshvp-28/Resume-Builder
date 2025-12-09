import express from 'express'
import protect from '../middleware/auth.js';
import { enhanceJobDesc, enhanceProSummary,uploadResume } from '../config/controllers/aiController.js';


const aiRouter=express.Router();

aiRouter.post('/enhance-pro-sum',protect,enhanceProSummary)
aiRouter.post('/enhance-job-desc',protect,enhanceJobDesc)
aiRouter.post('/upload-resume',protect,uploadResume)

export default aiRouter