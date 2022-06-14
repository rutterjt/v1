import React, { useState } from 'react';
import { navigate } from 'gatsby';

import { useForm } from 'react-hook-form';

import { sendData } from './api';

// components
import { Input, Spinner, PrimaryButton } from '@/components';

// types
export type FormDataType = {
  'your-name': string;
  'your-email': string;
  'your-subject': string;
  'your-message': string;
};

export type FieldName = keyof FormDataType;

// default form data
const defaultValues: FormDataType = {
  'your-name': '',
  'your-email': '',
  'your-subject': '',
  'your-message': '',
};

export const ContactForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const tabIndex = loading || sent ? -1 : 0;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const onSubmit = (data: FormDataType) => {
    if (loading || sent) return;
    setLoading(true);

    sendData(data)
      .then(() => {
        setError('');
        setSent(true);
        navigate('/sent');
      })
      .catch(() => {
        setError('Sorry, there was a problem sending your message.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      name="contact"
      className="w-full mx-auto relative text-left text-lg text-slate-900 dark:text-slate-50"
    >
      <div className="w-full grid grid-cols-1 gap-y-8 gap-x-4 mb-8 sm:grid-cols-2">
        <div className="col-span-1">
          <Input
            name="your-name"
            label="Name"
            register={register}
            error={errors['your-name']}
            required
            tabIndex={tabIndex}
          />
        </div>
        <div className="col-span-1">
          <Input
            name="your-email"
            label="Email"
            register={register}
            error={errors['your-email']}
            required
            tabIndex={tabIndex}
          />
        </div>
        <div className="col-span-full">
          <Input
            name="your-subject"
            label="Subject"
            register={register}
            error={errors['your-subject']}
            required
            tabIndex={tabIndex}
          />
        </div>
        <div className="col-span-full">
          <Input
            as="textarea"
            name="your-message"
            label="Message"
            register={register}
            error={errors['your-message']}
            required
            tabIndex={tabIndex}
          />
        </div>
      </div>
      {/* form error message */}
      {error && (
        <div>
          <h2 className="text-2xl text-center mb-2">Oops!</h2>
          <p className="mb-4">
            There was an error, and your message wasn't sent. Sorry about that!
            Please try again.
          </p>
        </div>
      )}
      {/* submit button */}
      <div className="flex justify-center items-center">
        {loading || sent ? (
          <Spinner />
        ) : (
          <PrimaryButton as="button" type="submit" tabIndex={tabIndex}>
            Send
          </PrimaryButton>
        )}
      </div>
    </form>
  );
};
