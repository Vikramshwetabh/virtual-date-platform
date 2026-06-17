"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, User, Meh, Frown } from "lucide-react";

interface MatchOutcomeModalProps {
  outcome: {
    mutualMatch: boolean;
    user1Choice?: "yes" | "maybe" | "no";
    user2Choice?: "yes" | "maybe" | "no";
  } | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  otherUser?: { id: string; name: string };
}

export function MatchOutcomeModal({
  outcome,
  isOpen,
  onOpenChange,
  otherUser,
}: MatchOutcomeModalProps) {
  const router = useRouter();

  if (!outcome) return null;

  const renderContent = () => {
    if (outcome.mutualMatch) {
      return (
        <>
          <DialogHeader className="text-center items-center">
            <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-full w-fit mb-4">
              <Heart className="w-10 h-10 text-green-500" fill="currentColor" />
            </div>
            <DialogTitle className="text-2xl">It's a Mutual Match!</DialogTitle>
            <DialogDescription>
              You and {otherUser?.name || "your match"} both want to see each other again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
            <Button onClick={() => router.push(`/dashboard/messages`)}>
              <MessageCircle className="mr-2 h-4 w-4" /> Send a Message
            </Button>
            <Button variant="outline" onClick={() => router.push(`/dashboard/settings`)}>
              <User className="mr-2 h-4 w-4" /> View Profile
            </Button>
          </DialogFooter>
        </>
      );
    }

    const isMaybe = outcome.user1Choice === 'maybe' || outcome.user2Choice === 'maybe';
    if (isMaybe && outcome.user1Choice !== 'no' && outcome.user2Choice !== 'no') {
        return (
            <>
              <DialogHeader className="text-center items-center">
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900/50 rounded-full w-fit mb-4">
                  <Meh className="w-10 h-10 text-yellow-500" />
                </div>
                <DialogTitle className="text-2xl">Still Deciding...</DialogTitle>
                <DialogDescription>
                  Your match is still thinking it over. We'll let you know their final decision!
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={() => onOpenChange(false)} className="w-full">Got it</Button>
              </DialogFooter>
            </>
        );
    }

    return (
      <>
        <DialogHeader className="text-center items-center">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-fit mb-4">
            <Frown className="w-10 h-10 text-gray-500" />
          </div>
          <DialogTitle className="text-2xl">Not a Match This Time</DialogTitle>
          <DialogDescription>
            Thanks for trying Virtual Date. There are plenty of other connections to be made!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Back to Dashboard
          </Button>
        </DialogFooter>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">{renderContent()}</DialogContent>
    </Dialog>
  );
}