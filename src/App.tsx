import { Route, Routes } from 'react-router';
import LandingPage from './pages/landingpage';
import Reconciliation from './pages/reconciliation';
import Order from './pages/order';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/reconciliation" element={<Reconciliation />} />
      <Route path="/order" element={<Order />} />
    </Routes>
  );
}

export default App;
