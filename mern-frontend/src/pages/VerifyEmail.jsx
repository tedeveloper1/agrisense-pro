import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, MailCheck } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { verifyEmail } = useAuth();
  const nav = useNavigate();
  const [state, setState] = useState({ status: 'loading', message: '' });

  useEffect(() => {
    if (!token) { setState({ status: 'error', message: 'Missing verification token.' }); return; }
    verifyEmail(token)
      .then((d) => {
        setState({ status: 'success', message: d.message || 'Email verified.' });
        setTimeout(() => nav('/app'), 1500);
      })
      .catch((e) => setState({ status: 'error', message: e?.response?.data?.message || 'Verification failed.' }));
  }, [token]);

  return (
    <AuthLayout title="Email verification" subtitle="Confirming your account…">
      <div className="surface p-6 text-center space-y-4">
        {state.status === 'loading' && (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-brand-500 mx-auto" />
            <p className="text-muted">Verifying your email…</p>
          </>
        )}
        {state.status === 'success' && (
          <>
            <CheckCircle2 className="h-12 w-12 text-brand-500 mx-auto" />
            <h2 className="font-semibold text-lg">You're all set!</h2>
            <p className="text-muted text-sm">{state.message}</p>
            <p className="text-xs text-muted">Redirecting to your dashboard…</p>
          </>
        )}
        {state.status === 'error' && (
          <>
            <XCircle className="h-12 w-12 text-rose-500 mx-auto" />
            <h2 className="font-semibold text-lg">Verification failed</h2>
            <p className="text-muted text-sm">{state.message}</p>
            <Link to="/login" className="btn-primary inline-flex">Back to sign in</Link>
          </>
        )}
        <div className="pt-2 text-xs text-muted flex items-center justify-center gap-1">
          <MailCheck className="h-3.5 w-3.5" /> Rwanda Beyond
        </div>
      </div>
    </AuthLayout>
  );
}
