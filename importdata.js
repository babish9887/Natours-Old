const app=require('./app');
const mongoose=require('mongoose')
const fs=require('fs');
const Tour=require('./models/tourModel');


const DB="mongodb://localhost:27017/natours"
// const DB="mongodb+srv://babish9887:zSv5TDnxbCLfK56x@cluster0.mzljvwc.mongodb.net/natours?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(DB, {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  // useUnifiedTopology: true
}).then(()=>{
  // console.log(conn.connections)
  console.log('DB connection Successfull');
})


const tours=JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

const importData=async ()=>{
    try{
        await Tour.create(tours)
        console.log('data successfully loaded');
        process.exit();
    }catch(err){    
        console.log(err)
    }
};


const deleteData=async ()=>{
    try{
        await Tour.deleteMany()
        console.log('data successfully Deleted');
        process.exit();
    }catch(err){    
        console.log(err)
    }
};

if(process.argv[2]==='--import'){
    importData()
}else if(process.argv[2]==='--delete'){
    deleteData();
}

console.log(process.argv);