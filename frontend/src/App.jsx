import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/Home'
import CreatePage from './pages/Create'
import UpdatePage from './pages/updatePage'
import ShowBlog from './componets/showBlog'
import Loginpage from './pages/Loginpage'
import Navbar from './componets/Navbar'


function App() {
  


  return (
    <>
    
    
      <Navbar />
      <div className='bg-orange-200 pt-20 min-h-screen'>
        <Routes>
          <Route path='/' element ={<HomePage />} />
          <Route path='/create' element ={<CreatePage />} />
          <Route path='/blog/:id' element ={<ShowBlog />} />
          <Route path='/update/:id' element ={<UpdatePage />} />
          <Route path='/login' element={<Loginpage />} />
        </Routes>
        </div>
    </>
  )
}

export default App
