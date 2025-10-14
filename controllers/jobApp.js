import Application from '../model/jobapplication.js';
import Job from '../model/joblisting.js';
import User from '../model/usermodel.js';


export const getAllJobListings = async (req, res) => {
  try {
    const jobs = await Job.find().populate("posted_by", "username email company");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job_listing", "title company location")
      .sort({ applied_at: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const createApplication = async (req, res) => {
    try{
        const { job_listing, resume_link, cover_letter }=req.body;
       
        const job = await Job.findById(job_listing);
        if(!job) {
            return res.status(404).json({message: "Job listing not found"});
        }

        const existingApp = await Application.findOne({
            job_listing,
            applicant: req.user._id,
        });
        if(existingApp){
            return res.status(400).json({message: "Application already exists"});

        }
        const application = new Application({
            job_listing,
            applicant: req.user._id,
            resume_link,
            cover_letter,
            status: "Pending",
        });
        
       const created = await application.save();
    res.status(201).json(created);
   
        } catch(err) {
            res.status(500).json({message: err.message});   

    }
};

export const updateApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    app.resume_link = req.body.resume_link || app.resume_link;
    app.cover_letter = req.body.cover_letter || app.cover_letter;
    app.status = req.body.status || app.status;

    const updated = await app.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    await app.deleteOne();
    res.json({ message: "Application deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};