import express from "express";
import{
    getJobs,
    createJob,
    updateJob,
    deleteJob,
} from "../controllers/jobController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getJobs);
router.post("/", protect, createJob);
router.put("/:id", protect, updateJob);
router.patch("/:id", protect, updateJob);
router.delete("/:id", protect,  deleteJob);

export default router;