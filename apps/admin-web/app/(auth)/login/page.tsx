import { Alert } from '@/components';

interface Props {
  searchParams: Promise<{ reason?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const sessionExpired = params.reason === 'session-expired';

  return (
    <div>
      <h1>Owezy Admin — Login</h1>
      {sessionExpired ? (
        <Alert
          variant="warning"
          message="Your session has expired. Please sign in again."
        />
      ) : null}
      {/* Login form — implemented via /spec-build auth feature */}
    </div>
  );
}
