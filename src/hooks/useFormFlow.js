import { useEffect, useRef, useState } from 'react';

/* Validate → "sending" pause → done, for the enquiry forms (not yet connected to a backend).
   `validate(values)` returns { field: message }; the first invalid control receives focus. */
export function useFormFlow(validate, { delay = 900 } = {}) {
  const formRef = useRef(null);
  const timer = useRef(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [errorTick, setErrorTick] = useState(0);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (errorTick) formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
  }, [errorTick]);

  const submit = (e) => {
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
    timer.current = setTimeout(() => {
      setResult(values);
      setStatus('done');
    }, delay);
  };

  const reset = () => {
    setErrors({});
    setResult(null);
    setStatus('idle');
  };

  return { formRef, errors, sending: status === 'sending', done: status === 'done', result, submit, reset };
}
