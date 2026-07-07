import { Route, Routes } from 'react-router';
import LandingPage from './pages/landingpage';
import Reconciliation from './pages/reconciliation';
import Order from './pages/order';
import Testing from './pages/testing';
import Testing2 from './pages/testing2';
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/reconciliation" element={<Reconciliation />} />
      <Route path="/order" element={<Order />} />
      <Route path="/testing" element={<Testing/>} />
       <Route path="/testing2" element={<Testing2/>} />
    </Routes>
  );
}

export default App;
