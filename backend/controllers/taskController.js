const Task=require('../models/Task');

const getTasks=async (req,res)=>{
    try{
        const {title,description,priority,dueDate,assignedTo,attachements,todoChecklist}=req.body;
        if(!Array.isArray(assignedTo)){
            return res.status(400).json({message:'assignedTo should be an array of user ids'});
        }
        const task=await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy:req.user._id,
            todoChecklist,
            attachements
        })
        res.status(201).json({message:'Task Created',task});

    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server Error',error:error.message});
    }
}

const getTaskById=async (req,res)=>{
    try{

    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server Error',error:error.message});
    }
}


const createTask=async (req,res)=>{
    try{

    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server Error',error:error.message});
    }
}

const updateTask=async (req,res)=>{
    try{

    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server Error',error:error.message});
    }
}


const deleteTask=async (req,res)=>{
    try{

    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server Error',error:error.message});
    }
}


const updateTaskStatus=async (req,res)=>{
    try{

    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server Error',error:error.message});
    }
}


const updateTaskChecklist=async (req,res)=>{
    try{

    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server Error',error:error.message});
    }
}


const getDashboardData=async (req,res)=>{
    try{

    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server Error',error:error.message});
    }
}


const getUserDashboardData=async (req,res)=>{
    try{

    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server Error',error:error.message});
    }
}


module.exports={
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData

}