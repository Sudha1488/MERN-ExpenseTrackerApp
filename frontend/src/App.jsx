import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/ui/Login';
import Signup from './components/ui/Signup';
import Home from './components/ui/Home';
import { Toaster } from "@/components/ui/sonner";

const appRouter = createBrowserRouter([
  {
    path:"/",
    element:<Home/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/signup",
    element:<Signup/>
  }

])

function App() {

  return (
    <div>
      <RouterProvider router={appRouter}/>
      <Toaster/>
    </div>
  )
}

export default App;
