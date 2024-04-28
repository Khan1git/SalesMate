import mongoose from 'mongoose'

const ConnectDB = async() =>{
    try {
        await mongoose.connect(process.env.DATABSE_URL).then(()=>{
            console.log("COnnected To The Database SuccessFully")
        })
    } catch (error) {
        console.log(error)
    }
}

export default ConnectDB;