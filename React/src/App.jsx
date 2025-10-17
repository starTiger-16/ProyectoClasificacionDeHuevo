//import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MonitorPage } from "./Pages/MonitorPage";
import { ProductosPage} from "./Pages/ProductosPage";
import { ProductosPageAdmin} from "./Pages/ProductosPageAdmin";
import { LoginPage } from "./Pages/LoginPage";
import { SinginPage } from "./Pages/SinginPage";
import { PedidosPage} from "./Pages/PedidosPage";
import { InformacionPage} from "./Pages/InformacionPage";
import { RegistrarGranjaPage} from "./Pages/RegistrarGranjaPage";
import { ReportePage } from "./Pages/ReportePage";
import { StockPage } from "./Pages/StockPage";
import { CarritoPage} from "./Pages/CarritoPage";
import { EditarPreciosPage } from "./Pages/EditarPreciosPage"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Singin" element={<SinginPage />} />
        <Route path="/Monitor" element={<MonitorPage />} />
        <Route path="/Productos" element={<ProductosPage />} />
        <Route path="/ProductosAdmin" element={<ProductosPageAdmin />} /> 
        <Route path="/Pedidos" element={<PedidosPage />} /> 
        <Route path="/Informacion" element={<InformacionPage />} /> 
        <Route path="/RegistrarGranja" element={<RegistrarGranjaPage />} /> 
        <Route path="/Reporte" element={<ReportePage />} /> 
        <Route path="/Stock" element={<StockPage />} />
        <Route path="/carrito" element={<CarritoPage />} />
        <Route path="/Precios" element={<EditarPreciosPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
