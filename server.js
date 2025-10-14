import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authroutes.js';
import jobAppRoutes from './routes/jobApproutes.js'; // ✅ fixed variable name
import JobListingRoutes from './routes/joblistingroutes.js';


dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());
// ✅ Connect to MongoDB

app.get('/', (req, res) => {
  res.send('Job Application Portal API is running ✅');
});

mongoose.connect(process.env.MONGO_CONN, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', jobAppRoutes); 
app.use('/api/jobs', JobListingRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
