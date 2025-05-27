import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-[100dvh] bg-background">
      <div className="w-full max-w-md px-4 text-center">
        <div className="rounded-xl overflow-hidden shadow-lg bg-card p-12">
          <h1 className="text-9xl font-bold text-primary mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold mb-4">
            Page Not Found
          </h2>
          <p className="mb-8">
            The page you're looking for doesn't exist or has
            been moved.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-md transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
