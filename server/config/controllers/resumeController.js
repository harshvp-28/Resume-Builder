//Controller for new Resume
//POST: /api/resumes/create

import Resume from "../../models/resume.js";
import imagekit from "../imageKit.js";

import fs from 'fs'

export const createResume=async(req,res)=> {
    try {
        const userId=req.userId;
        const {title} =req.body;

        const newResume=await Resume.create({userId,title})
        return res.status(201).json({message:'Resume Created Successfully',resume:newResume})


    } catch(error) {
        return res.status(400).json({message:error.message})
    }
}

//Controller for delete Resume
//POST: /api/resumes/delete

export const deleteResume=async(req,res)=> {
    try {
        const userId=req.userId;
        const {resumeId}=req.params;

        await Resume.findOneAndDelete({userId,_id:resumeId})

        return res.status(200).json({message:'Resume Deleted Successfully'})


    } catch(error) {
        return res.status(400).json({message:error.message})
    }
}

//Controller for get resume by id
//POST: /api/resumes/get
export const getResumebyId=async(req,res)=> {
    try {
        const userId=req.userId;
        const {resumeId} =req.params;

        const resume=await Resume.findOne({userId,_id:resumeId})

        if(!resume) {
            return res.status(404).json({message:error.message})
        }

        resume.__v=undefined;
        resume.createdAt=undefined;
        resume.updatedAt=undefined;
        return res.status(200).json({resume})


    } catch(error) {
        return res.status(400).json({message:error.message})
    }
}


//Controller for get resume by id public
//POST: /api/resumes/public
export const getPublicResumebyId=async(req,res)=> {
    try {
        
        const {resumeId} =req.params;

        const resume=await Resume.findOne({public:true,_id:resumeId})

        if(!resume) {
            return res.status(404).json({message:"Resume Not Found"})
        }

        return res.status(200).json({resume})


    } catch(error) {
        return res.status(400).json({message:error.message})
    }
}

//Controller for update resume 
//POST: /api/resumes/update

export const updateResume=async(req,res)=> {
    try {
        const userId=req.userId;
        const {resumeId,resumeData,removeBackGround} =req.body;
        const image=req.file;

        let resumeDataCopy;
        if(typeof resumeData==='string') {
            resumeDataCopy=await JSON.parse(resumeData)
        } else {
            resumeDataCopy=structuredClone(resumeData)
        }
        if(image) {

            const imageBufferData=fs.createReadStream(image.path)
            
            const response = await imagekit.files.upload({
            file: imageBufferData,
            fileName: 'resume.jpg',
            folder:'user-resumes',
            transformation: {
                pre:'w-300 h-300,fo-face,z-0.75 ' + (removeBackGround ? ',e-bgremove':'')
            }
            });

            resumeDataCopy.personal_info.image=response.url
        }

        const resume=await Resume.findOneAndUpdate({userId,_id:resumeId},resumeDataCopy,{new:true})
        return res.status(200).json({message:'Saved Successfully',resume})


    } catch(error) {
        return res.status(400).json({message:error.message})
    }
}



