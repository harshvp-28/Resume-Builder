import { Plus, Trash2, Trash2Icon } from 'lucide-react';
import React from 'react'

const ProjectForm = ({ data = [],onChange}) => {

    const addProject=()=>{
        const newProject = {
            name:"",
            type:"",
            description:"",
            
            
        };
        onChange([...data,newProject])
    }
    const removeProject=(idx)=>{
        const updated=data.filter((_,i)=> i!==idx);
        onChange(updated)
        
    }
    const updateProject=(idx,field,value)=>{
        const updated=[...data];
        updated[idx]={...updated[idx],[field]:value}
        onChange(updated)
        
    }
  return (
    <div>
        <div>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Projects</h3>
                    <p className='text-sm text-gray-500'>Add your Project Details</p>
                </div>


                <button onClick={()=>addProject()} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-g hover:bg-purple-200 transition-colors '>
                    <Plus className='size-4'></Plus>
                    Add Project
                </button>
            </div>
        </div>

        

        
        <div className='space-y-4'>
            {data.map((project,index)=>(
                <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
                    <div className='flex justify-between items-start'>
                        <h4>Project #{index+1}</h4>
                        <button onClick={()=>removeProject(index)} className='text-red-500 hover:text-red-800 transition-colors'>
                            <Trash2Icon className='size-4'></Trash2Icon>
                        </button>
                    </div>

                    <div>
                        <div className='grid md:grid-cols-2 gap-3'>
                            <input value={project.name || ""} onChange={(e)=>updateProject(index,"name",e.target.value)} type='text' placeholder='Project Name' className='px-3 py-2 text-sm rounded-lg '></input>

                            <input value={project.type || ""} onChange={(e)=>updateProject(index,"type",e.target.value)} type='text' placeholder='Project Type' className='px-3 py-2 text-sm rounded-lg '></input>

                            


                            
                        </div>
                        <textarea rows={4} value={project.description || ""} onChange={(e)=>updateProject(index,"description",e.target.value)} type='text' placeholder='Project Description...' className='w-full px-3 py-2 text-sm rounded-lg resize-none mt-5'></textarea>


                    </div>
                    
                    


                </div>
            ))}
        </div>
    
        
    </div>
  )
}

export default ProjectForm