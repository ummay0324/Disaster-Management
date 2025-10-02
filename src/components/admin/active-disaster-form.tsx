'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import type { DisasterType } from '@/lib/types';

const disasterTypes: { id: DisasterType; label: string }[] = [
  { id: 'flood', label: 'Flood 🌊' },
  { id: 'earthquake', label: 'Earthquake 🌍' },
  { id: 'fire', label: 'Fire 🔥' },
  { id: 'heatwave', label: 'Heatwave ⚡' },
] as const;

const FormSchema = z.object({
  type: z.enum(['flood', 'earthquake', 'fire', 'heatwave']),
});

interface ActiveDisasterFormProps {
    currentDisaster: DisasterType;
    onDisasterChange: (type: DisasterType) => void;
}

export function ActiveDisasterForm({ currentDisaster, onDisasterChange }: ActiveDisasterFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: currentDisaster,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    // Simulate API call to set global disaster type
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onDisasterChange(data.type);
    
    toast({
      title: 'Active Disaster Updated',
      description: `The platform is now configured for a ${data.type} scenario.`,
    });
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
              <FormLabel>Set Active Disaster Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a disaster type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {disasterTypes.map((type) => (
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
        <Button type="submit" disabled={isSubmitting || form.getValues('type') === currentDisaster} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Set Active Disaster
        </Button>
      </form>
    </Form>
  );
}
