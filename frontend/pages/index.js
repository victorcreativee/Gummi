// frontend/pages/index.js
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Gummi Platform</h1>
        <p className="text-lg">Connect. Grow. Become Somebody.</p>
      </header>

      <main className="flex flex-col items-center mt-10">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Get Started
        </button>
      </main>
    </div>
  );
}
