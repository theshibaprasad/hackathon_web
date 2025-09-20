import GoogleDataTest from '@/components/auth/GoogleDataTest';

export default function TestGooglePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Google Data Capture Test
          </h1>
          <p className="text-gray-600">
            Test what data we can capture from Google OAuth
          </p>
        </div>
        <GoogleDataTest />
      </div>
    </div>
  );
}
