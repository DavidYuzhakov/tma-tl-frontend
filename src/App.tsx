import { Route, Routes, useNavigate } from 'react-router'
import { HomePage } from './pages/HomePage'
import { ProjectPage } from './pages/ProjectPage'

function App() {
  const navigate = useNavigate()

  return (
    <div className="container">
      <h1
        onClick={() => navigate('/')}
        className="bg-green-600 absolute top-0 left-0 w-full py-2.5 text-2xl uppercase  tracking-wide text-white text-center rounded-bl rounded-br"
      >
        Todo list
      </h1>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
      </Routes>
    </div>
  )
}

export default App
