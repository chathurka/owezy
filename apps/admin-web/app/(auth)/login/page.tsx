import { LoginForm } from '@/features/auth/presentation/login-form';

interface Props {
  searchParams: Promise<{ reason?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <LoginForm sessionExpired={params.reason === 'session-expired'} />
  );
}
