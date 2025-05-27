import { useState, useEffect } from 'react';
import { toast } from '@/lib/toast';
import emailjs from '@emailjs/browser';

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const STORAGE_KEY = 'demo_request_sent';
const SUPPORT_EMAIL = 'perezbenzif@gmail.com';
const IS_PRODUCTION = import.meta.env.PROD;

const RegisterDemo = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  useEffect(() => {
    const hasSentRequest =
      localStorage.getItem(STORAGE_KEY);
    if (hasSentRequest) {
      setHasRequested(true);
    }
  }, []);

  const validateEmail = (email: string) => {
    return EMAIL_REGEX.test(email);
  };

  const handleEmailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(validateEmail(newEmail));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (hasRequested) {
      toast.error(
        'You have already requested a demo. Please contact support for assistance.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      if (IS_PRODUCTION) {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            to_email: SUPPORT_EMAIL,
            from_email: email,
            message: `New demo request from ${email}`,
          }
        );
      } else {
        await new Promise(resolve =>
          setTimeout(resolve, 1000)
        );
        console.log(
          'Development mode: Simulating email send to',
          SUPPORT_EMAIL,
          'from',
          email
        );
      }

      localStorage.setItem(STORAGE_KEY, 'true');
      setHasRequested(true);
      setIsSubmitted(true);
      toast.success('Request sent successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error(
        'Failed to send request. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasRequested && !isSubmitted) {
    return (
      <div className="flex items-center justify-center h-[100dvh] bg-background">
        <div className="w-full max-w-md px-4">
          <div className="rounded-xl overflow-hidden shadow-lg bg-card p-8 text-center">
            <div className="mb-6">
              <svg
                className="w-16 h-16 text-primary mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4">
              Demo Already Requested
            </h2>
            <p className="mb-6">
              You have already requested a demo. If you need
              any assistance or have questions, please
              contact us at:
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center h-[100dvh] bg-background">
        <div className="w-full max-w-md px-4">
          <div className="rounded-xl overflow-hidden shadow-lg bg-card p-8 text-center">
            <div className="mb-6">
              <svg
                className="w-16 h-16 text-primary mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4">
              Request Received!
            </h2>
            <p className="mb-6">
              Thank you for your interest in Global Pocket.
              We've received your demo request and will
              contact you shortly to schedule a personalized
              walkthrough of our platform.
            </p>
            <p className="text-sm">
              We typically respond within 24-48 business
              hours.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-[100dvh] bg-background">
      <div className="w-full max-w-md px-4">
        <div className="rounded-xl overflow-hidden shadow-lg bg-card">
          <div className="bg-primary p-5">
            <h2 className="text-xl font-bold text-primary-foreground">
              Request a Demo
            </h2>
          </div>
          <div className="p-8">
            <p className="mb-6">
              Global Pocket is currently in private beta.
              Fill out the form below to request a demo and
              learn how our platform can help you manage
              your finances more effectively.
            </p>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="example@email.com"
                  className="w-full p-3 border border-input rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  required
                />
                {email && !isValidEmail && (
                  <p className="mt-1 text-sm text-destructive">
                    Please enter a valid email address
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !isValidEmail ||
                  hasRequested
                }
                className="w-full py-3 px-5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? 'Sending...'
                  : 'Request Demo'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterDemo;
