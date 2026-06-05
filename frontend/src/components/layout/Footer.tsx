export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-2">Browse</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><a href="/?category=FOR_SALE" className="hover:text-primary">For Sale</a></li>
              <li><a href="/?category=HOUSING" className="hover:text-primary">Housing</a></li>
              <li><a href="/?category=JOBS" className="hover:text-primary">Jobs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Community</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><a href="/" className="hover:text-primary">About</a></li>
              <li><a href="/" className="hover:text-primary">Contact</a></li>
              <li><a href="/" className="hover:text-primary">Safety</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Account</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><a href="/login" className="hover:text-primary">Login</a></li>
              <li><a href="/register" className="hover:text-primary">Sign Up</a></li>
              <li><a href="/dashboard" className="hover:text-primary">Dashboard</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-4 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
