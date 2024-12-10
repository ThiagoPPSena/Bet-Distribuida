import {  BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../Layout";
import MyEvents from "../screens/MyEvents";
import AllEvents from "../screens/AllEvents";


function RoutesBet() {

  return (

    <Router>
      <Routes>
        {/* Rota Pai com o Layout */}
        <Route path="/" element={<Layout />}>
          {/* Rotas Filhas */}
          <Route index element={<AllEvents />} /> {/* Rota padrão */}
          <Route path="/myEvents" element={<MyEvents />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default RoutesBet
