import Register from './pages/Register';
import Login from './pages/Login';
import { Navigate, Route, Routes } from 'react-router-dom';

function App(){
    return(
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            </Routes>
    )
}

export default App;