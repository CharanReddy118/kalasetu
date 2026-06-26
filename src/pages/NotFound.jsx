import { Link } from "react-router";

function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-kala-orange mb-4">404</h1>
      <p className="text-kala-charcoal mb-6">This page doesn't exist.</p>
      <Link to="/" className="text-kala-green font-medium underline">
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;