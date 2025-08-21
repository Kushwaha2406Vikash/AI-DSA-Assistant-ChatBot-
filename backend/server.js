import cors from 'cors';
import express from 'express';
import dotenv from "dotenv";
import chatRoute from './routes/chatRoute.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ 
    origin: "https://ai-dsa-assistant-chat-bot.vercel.app",
    methods:["GET","POST","PUT","DELETE"],
    credentials: true, 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use(cors({ origin: "https://ai-dsa-assistant-chat-bot.vercel.app", credentials: true, }));



app.use("/api",chatRoute);

app.listen(PORT,()=>{
    console.log("port is listening 3000 port");
})
