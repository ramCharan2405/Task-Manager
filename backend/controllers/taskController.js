const Task=require('../models/Task');

const getTasks=async (req,res)=>{
    try{
        const {status}=req.query;
        let filter={};
        if(status){
            filter.status=status;
        }
        let tasks;
        if (req.user.role==='admin'){
            tasks=await Task.find(filter).populate('assignedTo','name email profileImageUrl')
        }
        else{
            tasks=await Task.find({...filter,assignedTo:req.user._id}).populate('assignedTo','name email profileImageUrl')
        };

        
        tasks=await Promise.all(
            tasks.map(async (task)=>{
                const completedCount=await task.todoChecklist.filter(
                    (item)=>item.completed).length;
                    return {...task._doc,completedCount};
                })
                
            );
        const allTasks=await Task.countDocuments(
                req.user.role==='admin' ? {} : {assignedTo:req.user._id}
            )
        const pendingTasks=await Task.countDocuments({
            ...filter,
            status:'pending',
            ...(req.user.role==='admin' ? {} : {assignedTo:req.user._id})
        })

        const inProgressTasks=await Task.countDocuments({
            ...filter,
            status:"In Progress",
            ...(req.user.role!=='admin'&& {assignedTo:req.user._id})
        })


        const completedTasks=await Task.countDocuments({
            ...filter,
            status:"completed",
            ...(req.user.role!=='admin'&& {assignedTo:req.user._id})
        })
        res.json({
            tasks,
            statusSummary:{all:allTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks,},
        })

    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server Error',error:error.message});
    }
}

const getTaskById=async (req,res)=>{
    try{
        const task=await Task.findById(req.params.id).populate(
            "assignedTo",
            "name,email profileImageUrl",
        )
        if (!task) return res.status(404).json({message:"Task not found "})
        res.json(task);
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server Error',error:error.message});
    }
}


const createTask=async (req,res)=>{
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

const updateTask=async (req,res)=>{
    try{
        const task =await Task.findById(req.params.id)
        if(!task) return res.status(404).json({message:"Task not found"})
        
        task.title=req.body.title|| task.title;
        task.description=req.body.description||task.description;
        task.priority=req.body.priority || task.priority;
        task.todoChecklist=req.body.todoChecklist||task.todoChecklist;
        task.attachments=req.body.attachements||task.attachments;

        if (req.body.assignedTo){
            if(!Array.isArray(req.body.assignedTo)){
                return res.status(400).json({
                    message:"assignedTo must be an array of user IDs"
                })
            }
        }
        const updatedTask=await task.save()
        res.json({message:"Task updated successfully",updatedTask})

    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server Error',error:error.message});
    }
}


const deleteTask=async (req,res)=>{
    try{
        const task= await Task.findById(req.params.id);

        if(!task) return res.status(404).json({message:"Task not found"});
         
        await task.deleteOne();
        res.json({message:"Task deleted successfully    "})


    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server Error',error:error.message});
    }
}


const updateTaskStatus=async (req,res)=>{
    try{
        const task=await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message:"Task not found"})
        
        const isAssigned = task.assignedTo.some(
        (userId)=>userId.toString()===req.user._id.toString()
        )

        if(!isAssigned && req.user.role!=="admin"){
            return res.status(403).json({message:"Not authorized"})
        }
        task.status=req.body.status || task.status;
        if(task.status=="Completed"){
            task.todoChecklist.forEach((item)=>(item.completed=ture));
            task.progress=100
        }
        await task.save();
        res.json({message:"Task status updated", task})

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