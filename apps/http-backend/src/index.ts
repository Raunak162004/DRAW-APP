import express from 'express';
import authRoutes from './routes/auth.routes';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth/api/v1', authRoutes);
app.use('/', ()=>{
    console.log("Inside http-backend");
})

app.listen(4000, ()=>{
    console.log("Server is running on port 4000");
})