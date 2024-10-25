const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
        <p className="text-gray-600">You do not have permission to access this page.</p>
        <a href="/" className="mt-4 inline-block text-blue-500 hover:text-blue-600">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;