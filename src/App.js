import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Chapter from './pages/chapter';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/chapter' element={<Chapter />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
