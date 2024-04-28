import express from 'express'
const app = express()
const PORT = 5000
import cors from 'cors'
import 'dotenv/config'
import dotenv from 'dotenv'

import ConnectDB from './db/Connect.js'
import router from './routes/routes.js'

ConnectDB();
dotenv.config()
app.use(cors())
app.use(express.json())


app.use('/api', router)


app.listen(PORT, ()=>{
    console.log(`The Server Is Running At PORT ${PORT}`)
})