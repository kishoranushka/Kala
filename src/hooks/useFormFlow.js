import { useEffect, useRef, useState } from 'react';
import { sendErrorMessage } from '@/utils/sendForm';

/* Validate → send → done (or error), for the enquiry forms.
   `validate(values)` returns { field: message }; the first invalid control receives focus.
   `send(values)` is async and throws if the message didn't go through; `failMessage` says why. */
export function useFormFlow(validate, send) {
  const formRef = useRef(null);
  const alive = useRef(true);
  const busy = useRef(false); // guards a double submit before React re-renders
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [failMessage, setFailMessage] = useState(null);
  const [result, setResult] = useState(null);
  const [errorTick, setErrorTick] = useState(0);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    if (errorTick) formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
  }, [errorTick]);

  const submit = async (e) => {
    e.preventDefault();
    if (busy.current) return;
    const values = Object.fromEntries(new FormData(e.currentTarget));
    const found = validate(values);
    if (Object.keys(found).length) {
      setErrors(found);
      setStatus('idle'); // an earlier send failure no longer applies
      setFailMessage(null);
      setErrorTick((t) => t + 1);
      return;
    }
    busy.current = true;
    setErrors({});
    setFailMessage(null);
    setStatus('sending');
    try {
      await send(values);
      if (!alive.current) return;
      setResult(values);
      setStatus('done');
    } catch (err) {
      console.error('Form send failed:', err);
      if (!alive.current) return;
      setFailMessage(sendErrorMessage(err));
      setStatus('error');
    } finally {
      busy.current = false;
    }
  };

  const reset = () => {
    setErrors({});
    setResult(null);
    setFailMessage(null);
    setStatus('idle');
  };

  return { formRef, errors, sending: status === 'sending', failed: status === 'error', failMessage, done: status === 'done', result, submit, reset };
}
