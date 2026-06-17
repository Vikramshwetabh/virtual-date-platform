"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { feedback } from "@/lib/api";

const feedbackSchema = z.object({
  enjoyedDate: z.enum(["yes", "no"], {
    required_error: "Please select an option.",
  }),
  secondDateChoice: z.enum(["yes", "maybe", "no"], {
    required_error: "Please select if you'd like a second date.",
  }),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

interface FeedbackModalProps {
  roomId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onFeedbackSubmitted: () => void;
}

export function FeedbackModal({
  roomId,
  isOpen,
  onOpenChange,
  onFeedbackSubmitted,
}: FeedbackModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    setIsLoading(true);
    try {
      await feedback.submit({
        roomId,
        enjoyedDate: data.enjoyedDate === "yes",
        secondDateChoice: data.secondDateChoice,
      });
      toast.success("Your feedback has been submitted!");
      onFeedbackSubmitted();
    } catch (error: any) {
      // API client will throw with a message, which sonner will display
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Rate Your Date</DialogTitle>
          <DialogDescription>
            Your feedback helps us improve and determines your match outcome.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="enjoyedDate"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Did you enjoy this date?</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                      <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secondDateChoice"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Would you like a second date?</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                      <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="maybe" /></FormControl><FormLabel className="font-normal">Maybe</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}