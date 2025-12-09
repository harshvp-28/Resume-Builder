import React, { useEffect, useState } from 'react'
import { useParams,Link } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import {  ArrowLeftIcon, Briefcase, ChevronLeft,ChevronRight, Download, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, icons, Share2Icon, Sparkles, User } from 'lucide-react'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceFrom from '../components/ExperienceFrom'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
const ResumeBuilder = () => {

  const {resumeId} = useParams()
  const {token} = useSelector(state=>state.auth)



  const [resumeData,setResumeData]=useState({
      _id:'',
      title:'',
      personal_info:{},
      professional_summary:"",
      experience:[],
      education:[],
      project:[],
      skills:[],
      template:"classic",
      accent_color:"#3B82F6",
      public:false,
  })

  const loadExistingResume=async()=>{
    try {
      const {data}=await api.get('/api/resumes/get/'+resumeId,{headers:{Authorization:token}})
      if(data.resume) {
        setResumeData(data.resume)
        document.title=data.resume.title;

      }

    } catch(error) {
      console.log(error.message)
    }
  }
  useEffect(()=>{
    loadExistingResume()
  },[])

  const [activeSectionIndex,setActiveSectionIndex]=useState(0)
  const [removeBackground,setRemoveBackgorund]=useState(false)

  const sections=[
    {id:"personal",name:"Personal info",icon:User},
    {id:"summary",name:"Summary",icon:FileText},
    {id:"experience",name:"Experience",icon:Briefcase},
    {id:"education",name:"Education",icon:GraduationCap},
    {id:"project",name:"Projects",icon:FolderIcon},
    {id:"skills",name:"Skills",icon:Sparkles},
  ]
  const activeSection=sections[activeSectionIndex]


  const changeResumeVisibility=async()=>{
    try {
      const formData=new FormData()
      formData.append("resumeId",resumeId)
      formData.append("resumeData",JSON.stringify({public:!resumeData.public}))

      const {data}=await api.put('/api/resumes/update',formData,{headers:{Authorization:token}})
      setResumeData({...resumeData,public:!resumeData.public})
      toast.success(data.message)

    } catch(error) {
      console.error("Error saving resume:",error)
    }
  }

  const handleShare=()=>{
    const frontendurl=window.location.href.split('/app')[0];
    const resumeurl=frontendurl+'/view/'+resumeId;

    if(navigator.share) {
      navigator.share({url:resumeurl, text:"My Resume",})
    } else {
      alert('Share not Supported on this Browser.')
    }
  }

  const downloadResume=()=> {
    window.print();
  }

  const saveResume=async()=>{
    try{
      let updatedResumeData=structuredClone(resumeData)

      if(typeof resumeData.personal_info.image === 'object') {
        delete updatedResumeData.personal_info.image
      }
      const formData=new FormData();
      formData.append("resumeId",resumeId)
      formData.append("resumeData",JSON.stringify(updatedResumeData))

      removeBackground && formData.append("Remove Background","yes");
      typeof resumeData.personal_info.image==='object' && formData.append("image",resumeData.personal_info.image)

      const {data}=await api.put('/api/resumes/update',formData, {headers:{Authorization:token}})
      setResumeData(data.resume)
      toast.success(data.message)
    }
    catch(error) {
      console.error("Error Saving Resume",error)
    }
  }

  return (
    <div>
      
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
          <ArrowLeftIcon className='size-4'></ArrowLeftIcon>Back To DashBoard
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='grid lg:grid-cols-12 gap-8'>
          {/* Left Panel */}
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
              <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200'></hr>
              <hr className='absolute top-0 left-0 h-1 bg-linear-to-r from-green-500 to green-700 border-none transition-all duration-2000' style={{width:`${activeSectionIndex*100/(sections.length-1)}%`}}></hr>

              {/* Section Navigation */}
              <div className='flex justify-between items-center gap-2'>


                <div className='flex items-center mb-6 border-b border-gray-300 py-1 gap-3'>
                  <TemplateSelector selectedTemplate={resumeData.template} onChange={(template)=>setResumeData(prev=>({...prev,template}))}></TemplateSelector>

                  <ColorPicker selectedColor={resumeData.accent_color} onChange={(color)=>setResumeData(prev=>({...prev,accent_color:color}))}></ColorPicker>
                </div>



                <div className='flex items-center'>
                  {activeSectionIndex!==0 && (
                    <button onClick={()=>setActiveSectionIndex((prevIndex)=>Math.max(prevIndex-1,0))} className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all' disabled={activeSectionIndex===0}>
                      <ChevronLeft></ChevronLeft> Previous
                    </button>
                  )}

                  <button onClick={()=>setActiveSectionIndex((prevIndex)=>Math.min(prevIndex+1,sections.length-1))} className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex===sections.length-1 && 'opacity-50'}`} disabled={activeSectionIndex===sections.length-1}>
                      <ChevronRight></ChevronRight> Next
                    </button>
                </div>
              </div>



              {/* {Form Content} */}

              <div className='space-y-6'>
                {activeSection.id==='personal' && (
                  <PersonalInfoForm data={resumeData.personal_info} onChange={(data)=>setResumeData(prev=>({...prev,personal_info:data}))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackgorund}></PersonalInfoForm>
                )}

                {activeSection.id==='summary' && (
                  <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data)=>setResumeData(prev=>({...prev,professional_summary:data}))} setResumeData={setResumeData}></ProfessionalSummaryForm>
                )}


                {activeSection.id==='experience' && (
                  <ExperienceFrom  data={resumeData.experience} onChange={(data)=>setResumeData(prev=>({...prev,experience:data}))} ></ExperienceFrom>
                )}


                {activeSection.id==='education' && (
                  <EducationForm  data={resumeData.education} onChange={(data)=>setResumeData(prev=>({...prev,education:data}))} ></EducationForm>
                )}

                {activeSection.id==='project' && (
                  <ProjectForm  data={resumeData.project} onChange={(data)=>setResumeData(prev=>({...prev,project:data}))} ></ProjectForm>
                )}

                {activeSection.id==='skills' && (
                  <SkillsForm  data={resumeData.skills} onChange={(data)=>setResumeData(prev=>({...prev,skills:data}))} ></SkillsForm>
                )}



              </div>

              <button onClick={()=>{toast.promise(saveResume,{loading:'Saving...'})}} className='bg-linear-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 text-sm mt-6'>
                  Save Changes
              </button>


            </div>
          </div>

          {/* Right Panel */}
          <div className='lg:col-span-7 max-lg:mt-6'>
              <div className='relative w-full'>
                {/* Buttons */}
                <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>
                  {resumeData.public && (
                    <button onClick={handleShare}  className='flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-blue-100 to-blue-300 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                      <Share2Icon className='size-4'></Share2Icon>Share
                    </button>
                  )}

                  <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-purple-100 to-purple-300 text-purple-600 rounded-lg ring-purple-300 hover:ring transition-colors'>
                      {resumeData.public ? <EyeIcon className='size-4'></EyeIcon> : <EyeOffIcon className='size-4'></EyeOffIcon>} 

                      {resumeData.public ? 'Public' : 'Private'}
                  </button>

                  <button onClick={downloadResume} className='flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-green-100 to-green-300 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors'>
                    <DownloadIcon className='size-4'></DownloadIcon> Download
                  </button>
                </div>


              </div>

              {/* Preview Resume */}
              <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}></ResumePreview>
          </div>


        </div>

      </div>

    </div>
  )
}

export default ResumeBuilder