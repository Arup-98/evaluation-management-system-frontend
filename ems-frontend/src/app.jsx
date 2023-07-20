

import { Route, Routes } from 'react-router-dom'
import AllBatch from './Pages/Batch/AllBatches/AllBatch'
import BatchCreate from './Pages/Batch/BatchCreate/BatchCreate'
import Header from './Pages/Header/Header'
import UserLogin from './Pages/Login/UserLogin'
import Trainee from './Pages/Registration/Trainee/Trainee'
import Trainer from './Pages/Registration/Trainer/Trainer'
import './app.css'
import Home from './Pages/Home/Home'
import Batch from './Pages/Batch/Batch/Batch'
import TaskCreate from './Pages/Task/TaskCreate'
import ViewTasks from './Pages/Task/ViewTasks'

export function App() {
 return (
    <>
    
      <Header></Header>
    <Routes >
        <Route path="/" element={<UserLogin></UserLogin>}></Route>
        <Route path="/home" element={<Home></Home>}></Route>
        <Route path="/createBatch" element={<BatchCreate></BatchCreate>}></Route>
        <Route path="/allBatch" element={<AllBatch></AllBatch>}></Route>
        <Route path="/traineeRegister" element={<Trainee></Trainee>}></Route>
        <Route path="/trainerRegister" element={<Trainer></Trainer>}></Route>
        <Route path="/batch/:batchId" element={<Batch></Batch>}></Route>
        <Route path="/task" element={<TaskCreate></TaskCreate>}></Route>
        <Route path="/viewTask/:batchId" element={<ViewTasks></ViewTasks>}></Route>

        
    </Routes>
      
      
      
    </>
  )
}

// box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
