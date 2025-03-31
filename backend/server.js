require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connect } = require("http2");
const connectDB = require("./config/db");

const authRoutes=require("./routes/authRoutes")
const userRoutes=require("./routes/userRoutes")

const app =express();

app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    
}));

app.use(express.json());

connectDB();


app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
// app.use('/api/tasks',taskRoutes);
// app.use('api/reports',reportRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})