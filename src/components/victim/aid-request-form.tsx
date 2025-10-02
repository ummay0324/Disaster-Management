'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BedDouble, GlassWater, LifeBuoy, Loader2, LocateFixed, MapPin, Pill, Ship, Stethoscope, Tent, UtensilsCrossed } from 'lucide-react';
import { useState, useMemo } from 'react';
import { AidRequestItem, DisasterType } from '@/lib/types';

const allItems: { id: AidRequestItem; label: string; icon: React.ReactNode, disaster: DisasterType[] }[] = [
  { id: 'food', label: 'Food', icon: <UtensilsCrossed className="h-5 w-5" />, disaster: ['flood', 'earthquake', 'fire', 'heatwave'] },
  { id: 'water', label: 'Water', icon: <GlassWater className="h-5 w-5" />, disaster: ['flood', 'earthquake', 'fire', 'heatwave'] },
  { id: 'medicine', label: 'Medicine', icon: <Pill className="h-5 w-5" />, disaster: ['flood', 'earthquake', 'fire', 'heatwave'] },
  { id: 'medical help', label: 'Medical Help', icon: <Stethoscope className="h-5 w-5" />, disaster: ['flood', 'earthquake', 'fire', 'heatwave'] },
  { id: 'boat transport', label: 'Boat Transport', icon: <Ship className="h-5 w-5" />, disaster: ['flood'] },
  { id: 'life jackets', label: 'Life Jackets', icon: <LifeBuoy className="h-5 w-5" />, disaster: ['flood'] },
  { id: 'blankets', label: 'Blankets', icon: <BedDouble className="h-5 w-5" />, disaster: ['flood', 'earthquake', 'fire', 'heatwave']},
  { id: 'tents', label: 'Tents', icon: <Tent className="h-5 w-5" />, disaster: ['flood', 'earthquake', 'fire', 'heatwave']}
] as const;

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
  location: z.string().min(1, { message: 'Location is required.'}),
});

interface AidRequestFormProps {
  onSubmitSuccess: () => void;
  activeDisaster: DisasterType;
}

export function AidRequestForm({ onSubmitSuccess, activeDisaster }: AidRequestFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const availableItems = useMemo(() => {
    return allItems.filter(item => item.disaster.includes(activeDisaster));
  }, [activeDisaster]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
      location: '',
    },
  });
  
  const fetchLocation = async () => {
    setIsFetchingLocation(true);
    // Simulate fetching location
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockLocation = "123 Disaster Ave, Emergency City";
    form.setValue("location", mockLocation);
    setIsFetchingLocation(false);
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Request Submitted',
      description: 'Your aid request has been sent. Help is on the way.',
    });
    form.reset({ items: [], location: form.getValues('location') });
    onSubmitSuccess();
    setIsSubmitting(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Aid or Evacuation</CardTitle>
        <CardDescription>Fill out the form below to request assistance. Your location will be automatically detected.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Location</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                        <div className="relative w-full">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Click to fetch location" {...field} disabled={true} />
                        </div>
                    </FormControl>
                    <Button type="button" variant="outline" onClick={fetchLocation} disabled={isFetchingLocation}>
                        {isFetchingLocation ? <Loader2 className="h-4 w-4 animate-spin"/> : <LocateFixed className="h-4 w-4" />}
                    </Button>
                   </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="items"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">I need...</FormLabel>
                    <FormDescription>
                      Select all the items you require. Options are based on the current disaster type: <span className="font-bold capitalize">{activeDisaster}</span>.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                  {availableItems.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="items"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 has-[[data-state=checked]]:bg-accent/20"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center gap-2 w-full cursor-pointer">
                                {item.icon} {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Request
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
