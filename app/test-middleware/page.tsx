export default function TestMiddleware() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">Middleware Test</h1>
        <p className="text-muted-foreground mb-8">
          If you can see this page, the middleware is not working properly.
        </p>
        <p className="text-sm text-muted-foreground">
          This page should be protected and redirect to login.
        </p>
      </div>
    </div>
  );
}
