import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface VerificationCodeProps {
  email: string;
  title: string;
  message: string;
  onBack: () => void;
  onSuccess: () => void;
  onVerify: (email: string, code: string) => Promise<any>;
  onResendCode: (email: string) => Promise<void>;
}

const CodeInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const safe = (s: string) => s.replace(/[^0-9]/g, '').slice(0, 6);

  const handleChange = (idx: number, char: string) => {
    const next = (value.padEnd(6, ' ').split(''));
    next[idx] = char;
    const joined = safe(next.join(''));
    onChange(joined);
    if (char && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const chars = useMemo(() => {
    const v = safe(value);
    return [0, 1, 2, 3, 4, 5].map(i => v[i] || '');
  }, [value]);

  return (
    <div className="flex gap-2">
      {chars.map((c, i) => (
        <input
          key={i}
          ref={el => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={c}
          disabled={disabled}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onChange={(e) => handleChange(i, e.target.value.replace(/\D/g, '').slice(0, 1))}
          className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
        />
      ))}
    </div>
  );
};

const VerificationCode: React.FC<VerificationCodeProps> = ({
  email,
  title,
  message,
  onBack,
  onSuccess,
  onVerify,
  onResendCode,
}) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = code.replace(/\D/g, '');
    if (cleaned.length !== 6) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    setIsLoading(true);
    try {
      const result = await onVerify(email, cleaned);
      // Accept success by either a data.user object OR a success flag
      const isOk = (result && (result?.data?.user || result?.success));
      if (isOk) {
        toast.success('✅ Verification successful! Redirecting...');
        setTimeout(() => onSuccess(), 200);
        return;
      }
      const message = result?.message || result?.error || 'Verification failed';
      toast.error(`❌ ${message}`);
    } catch (err: any) {
      const message = err?.message || 'Invalid or expired verification code';
      toast.error(`❌ ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setIsResending(true);
    try {
      await onResendCode(email);
      toast.success('📧 New verification code sent! Check your email.');
      setCountdown(60);
    } catch (err: any) {
      toast.error(`❌ ${err?.message || 'Failed to resend code'}`);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <p className="text-sm font-medium text-ajira-primary">{email}</p>
      </div>



      <form onSubmit={handleVerification} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Verification Code</label>
          <div className="mt-2 flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <CodeInput value={code} onChange={setCode} disabled={isLoading} />
          </div>
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={isLoading || code.replace(/\D/g, '').length !== 6}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-ajira-primary to-ajira-secondary hover:from-ajira-secondary hover:to-ajira-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ajira-accent disabled:opacity-50 transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || countdown > 0}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ajira-accent disabled:opacity-50 transition-all duration-300"
          >
            {isResending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Sending...
              </>
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Resend Code
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ajira-accent transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
      </form>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Didn't receive the code? Check your spam folder or{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0}
            className="text-ajira-primary hover:text-ajira-primary/80 font-medium disabled:opacity-50"
          >
            request a new one
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerificationCode;



