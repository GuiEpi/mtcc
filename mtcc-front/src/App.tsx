import { Routes, Route } from "react-router-dom";
import { Toaster } from '@/components/ui/sonner'
import Layout from "./routes/Layout";
import Home from "./routes/Home";
import About from "./routes/About";
import Pres from "./routes/Pres";
import Nfo from "./routes/Nfo";

export default function App() {
  return (
    <div>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/pres" element={<Pres />} />
          <Route path="/nfo" element={<Nfo />} />
        </Route>
      </Routes>
    </div>
  );
}