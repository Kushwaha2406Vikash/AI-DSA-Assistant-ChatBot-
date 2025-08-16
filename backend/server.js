import cors from 'cors';
import express from 'express';
import dotenv from "dotenv";
import chatRoute from './routes/chatRoute.js'

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  credentials: true, 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api",chatRoute);

app.listen(3000,()=>{
    console.log("port is listening 3000 port");
})
