import mongoose from "mongoose"
const connectDB=async ()=>{
    try {
        mongoose.connection.on("connected",()=>{
            console.log("Database Connnected")
        })

        let mongoDbUri=process.env.MONGODB_URI;
        const projectName='resume-builder';
        if(!mongoDbUri) {
            throw new Error("MONGODB_URI env variable not set")
        }
        if(mongoDbUri.endsWith('/')) {
            mongoDbUri=mongoDbUri.slice(0,-1);
        }

        await mongoose.connect(`${mongoDbUri}/${projectName}`)
    } catch(error) {
        console.error("Error Connecting to MONGO DB", error);
    }
}
export default connectDB;