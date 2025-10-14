import Job from '../model/joblisting.js';


export const getJobs = async (req,res)=> {
    try{
        const jobs = await Job.find({posted_by: req.user._id});
        res.json(jobs);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

export const createJob = async(req,res) => {
    try{
        const {title, description, company, location} = req.body;
        const job= await Job.create({
            title,
            description,
            company,
            location,
           posted_by: req.user._id,
        });

        res.send(job)
    }catch(err){
        res.status(500).json({message:err.message});
    }
};

export const updateJob = async(req,res) => {
    try{
        const job = await Job.findById(req.params.id);
        if(!job) return res.status(404).json({message: "Job not found"});
        job.title = req.body.title || job.title;
        job.description = req.body.description || job.description;
        job.company = req.body.company || job.company;
        job.location = req.body.location || job.location
        const updated = await job.save();
        res.json(updated);

    }catch(err){
        res.status(500).json({message:err.message});
    }
};
 export const deleteJob = async(req,res) =>{
    try{
        const job =await Job.findById(req.params.id);
        if(!job)return res.status(404).json({message:"job not found"});
        await job.deleteOne();
        res.json({message:"Job deleted successfully"});

    }catch(err){
        res.status(500).json({message:err.message});
    }
 };

