import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected',() => {
        console.log("✅ DB Connected");
    })

    mongoose.connection.on('error',(err) => {
        console.log("❌ DB Connection Error:", err.message);
    })

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`)
    } catch (error) {
        console.log("⚠️  Could not connect to database:", error.message);
        console.log("💡 Running in test mode without database");
    }
}

export default connectDB;