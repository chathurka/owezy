import { LoginForm } from '@/features/auth/presentation/login-form';

interface Props {
  searchParams: Promise<{ reason?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const sessionExpired = params.reason === 'session-expired';
  return <LoginForm sessionExpired={sessionExpired} />;
}
