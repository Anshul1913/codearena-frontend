import { useRef } from 'react'
import './App.css'
import RoutesComponent from './routes/RouteComponent'
import { ToastContainer } from 'react-toastify'

function App() {

  const contentRef = useRef(null);
  return (
    <div className="app" ref={contentRef}>
      
        <RoutesComponent />
        <ToastContainer />
    </div>
  )
}

export default App
