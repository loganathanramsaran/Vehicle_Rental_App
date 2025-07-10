function Footer() {
  return (
    <footer className="bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700 py-4 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-2">
        {/* Company Info */}
        <div>
          <h3 className="text-orange-400 text-xl font-semibold mb-3">GoRent</h3>
          <p className="text-sm leading-relaxed">
            GoRent is your premium partner for vehicle rentals. Discover luxury, comfort, and convenience with just a few clicks.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-orange-600">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-orange-400">Home</a></li>
            <li><a href="/vehicles" className="hover:text-orange-400">Vehicles</a></li>
            <li><a href="/about" className="hover:text-orange-400">About</a></li>
            <li><a href="/contact" className="hover:text-orange-400">Contact</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-orange-600">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-orange-400">Terms of Service</a></li>
            <li><a className="hover:text-orange-400">FAQs</a></li>
            <li><a className="hover:text-orange-400">Privacy Policy</a></li>
            <li><a className="hover:text-orange-400">Help Center</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-orange-600">Contact Us</h4>
          <p className="text-sm">📍 123 Drive Avenue, Chennai, India</p>
          <p className="text-sm mt-2">📞 +91 98765 43210</p>
          <p className="text-sm mt-2">✉️ support@gorent.com</p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-orange-400">🌐</a>
            <a href="#" className="hover:text-orange-400">🐦</a>
            <a href="#" className="hover:text-orange-400">📘</a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700  text-center pt-3 text-sm text-orange-600">
        © {new Date().getFullYear()} GoRent. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
