import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import LoginPage from "./features/auth/pages/LoginPage";
import AppHome from "./pages/AppHome";


// function Placeholder({ label }: { label: string }) {
//   return (
//     <div className="grid min-h-screen place-items-center bg-black text-white">
//       <h1 className="text-2xl">{label}</h1>
//     </div>
//   );
// }

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/app" element={<Placeholder label="Dashboard" />} /> */}
          <Route path="/app" element={<AppHome />} />

      </Routes>
    </BrowserRouter>
  );
}


// function Placeholder({ label }: { label: string }) {
//   return (
//     <div className="grid min-h-screen place-items-center bg-black text-white">
//       <div className="text-center">
//         <h1 className="mb-3 text-3xl font-semibold">{label}</h1>
//         <p className="text-white/60">Trang này sẽ được xây sau.</p>
//       </div>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/login" element={<Placeholder label="Đăng nhập" />} />
//         <Route path="/register" element={<Placeholder label="Đăng ký" />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }




// import './App.css'
// import hackathonGraphic from './assets/hackathon-graphic.svg'
// import naverLogo from './assets/naver-logo.svg'

// function App() {
//   return (
//     <div className="container">
//       <div className="content">
//         <img src={naverLogo} alt="NAVER Vietnam AI Hackathon" className="logo" />
        
//         <div className="greeting">
//           <p className="hello">Xin chào! 안녕하세요!</p>
//           <p className="subtitle">Hello World</p>
//         </div>
//       </div>
      
//       <img className="graphic" src={hackathonGraphic} alt="" />
//     </div>
//   )
// }

// export default App