'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import type { DisasterAlert } from '@/lib/types';

const alertTypes = [
  { id: 'flood', label: 'Flood 🌊' },
  { id: 'earthquake', label: 'Earthquake 🌍' },
  { id: 'fire', label: 'Fire 🔥' },
  { id: 'heatwave', label: 'Heatwave ⚡' },
] as const;

const FormSchema = z.object({
  type: z.enum(['flood', 'earthquake', 'fire', 'heatwave']),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

interface BroadcastAlertFormProps {
    onAlertSent: (alert: Omit<DisasterAlert, 'id' | 'createdAt'>) => void;
}

export function BroadcastAlertForm({ onAlertSent }: BroadcastAlertFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: 'flood',
      message: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    
    onAlertSent(data);
    
    toast({
      title: 'Alert Broadcasted!',
      description: 'The disaster alert has been sent to all users.',
    });
    form.reset();
    
    // Simulate a delay to show loading state, but action is fire-and-forget
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disaster Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a disaster type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {alertTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alert Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., A major flood warning has been issued. Evacuate to higher ground."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Send className="mr-2 h-4 w-4" />
          Broadcast Now
        </Button>
      </form>
    </Form>
  );
}
