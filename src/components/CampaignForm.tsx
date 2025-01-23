import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import type { List } from '../types';
import { RichTextEditor } from './RichTextEditor';
import { Mail, Send } from 'lucide-react';

const campaignSchema = z.object({
  sender_email: z.string().email('Invalid email address'),
  list_ids: z.array(z.string()).min(1, 'Select at least one list'),
  subject: z.string().min(1, 'Subject is required').max(100, 'Subject is too long'),
  content: z.string().min(1, 'Content is required'),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CampaignFormProps {
  lists: List[];
  onSubmit: (data: CampaignFormData) => Promise<void>;
}

export function CampaignForm({ lists, onSubmit }: CampaignFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      list_ids: [],
      content: '<p>Write your email content here...</p>',
    },
  });

  const content = watch('content');

  const onSubmitForm = async (data: CampaignFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div>
        <label htmlFor="sender_email" className="block text-sm font-medium text-gray-700">
          Sender Email
        </label>
        <div className="mt-1 relative">
          <input
            type="email"
            id="sender_email"
            {...register('sender_email')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="your@email.com"
          />
          <Mail className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        {errors.sender_email && (
          <p className="mt-1 text-sm text-red-600">{errors.sender_email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="list_ids" className="block text-sm font-medium text-gray-700">
          Select Lists
        </label>
        <select
          multiple
          id="list_ids"
          {...register('list_ids')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {lists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name} ({list.subscriber_count} subscribers)
            </option>
          ))}
        </select>
        {errors.list_ids && (
          <p className="mt-1 text-sm text-red-600">{errors.list_ids.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          {...register('subject')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter email subject"
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content
        </label>
        <RichTextEditor
          value={content}
          onChange={(value) => setValue('content', value)}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            'Sending...'
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Campaign
            </>
          )}
        </button>
      </div>
    </form>
  );
}