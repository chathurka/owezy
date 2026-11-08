import { Suspense } from 'react';
import { ResetPasswordForm } from '@/features/auth/presentation/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
