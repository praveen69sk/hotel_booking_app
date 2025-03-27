import express, { Request, Response } from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.get("/api/test", async (req: Request, resp: Response)=>{
    resp.send({message: "Hello from express endpoint!"});
});

app.listen(7000, ()=>{
    console.log("Server running on localhost:7000");
});