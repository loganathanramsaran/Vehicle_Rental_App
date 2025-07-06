// src/pages/Contact.jsx
function Contact() {
  return (
    <div className="px-10 pb-16 mx-auto dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4 text-center text-orange-600">Contact Us</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Have questions or feedback? Reach out to us and we’ll get back to you soon.</p>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input type="text" className="w-full p-2 border rounded focus:outline-none dark:bg-gray-600 focus:border-orange-500" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" className="w-full p-2 border rounded focus:outline-none dark:bg-gray-600 focus:border-orange-500" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium">Message</label>
          <textarea className="w-full p-2 border rounded h-32 focus:outline-none dark:bg-gray-600 focus:border-orange-500" placeholder="Your message..." />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

export default Contact;
