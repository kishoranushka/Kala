import { useEffect, useRef, useState } from 'react';

/* Validate → send → done (or error), for the enquiry forms.
   `validate(values)` returns { field: message }; the first invalid control receives focus.
   `send(values)` is async and throws if the message didn't go through. */
export function useFormFlow(validate, send) {
  const formRef = useRef(null);
  const alive = useRef(true);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
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
    if (status === 'sending') return;
    const values = Object.fromEntries(new FormData(e.currentTarget));
    const found = validate(values);
    if (Object.keys(found).length) {
      setErrors(found);
      setErrorTick((t) => t + 1);
      return;
    }
    setErrors({});
    setStatus('sending');
    try {
      await send(values);
      if (!alive.current) return;
      setResult(values);
      setStatus('done');
    } catch (err) {
      console.error('Form send failed:', err);
      if (alive.current) setStatus('error');
    }
  };

  const reset = () => {
    setErrors({});
    setResult(null);
    setStatus('idle');
  };

  return { formRef, errors, sending: status === 'sending', failed: status === 'error', done: status === 'done', result, submit, reset };
}
