// src/pages/NotFoundPage.jsx
import { Link } from "react-router-dom";
export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy-50 px-6">
      <div className="text-[120px] font-black bg-brand-gradient bg-clip-text text-transparent leading-none">404</div>
      <p className="text-navy-500 mb-6">Page not found</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}