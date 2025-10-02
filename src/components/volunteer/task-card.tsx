'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AidRequest, AidRequestItem } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { BedDouble, Check, GlassWater, LifeBuoy, Loader2, MapPin, Pill, ScanLine, Ship, Stethoscope, Tent, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { useFirebaseApp } from "@/firebase";

interface TaskCardProps {
    request: AidRequest;
}

const itemIcons: Record<AidRequestItem, React.ReactNode> = {
    food: <UtensilsCrossed className="h-5 w-5" />,
    water: <GlassWater className="h-5 w-5" />,
    medicine: <Pill className="h-5 w-5" />,
    'medical help': <Stethoscope className="h-5 w-5" />,
    'boat transport': <Ship className="h-5 w-5" />,
    'life jackets': <LifeBuoy className="h-5 w-5" />,
    blankets: <BedDouble className="h-5 w-5" />,
    tents: <Tent className="h-5 w-5" />,
}

export function TaskCard({ request }: TaskCardProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const app = useFirebaseApp();
    const firestore = getFirestore(app);

    const handleScanAndDeliver = async () => {
        setIsSubmitting(true);
        
        // In a real app, you would use a QR scanner to get the request ID.
        // Here we simulate a successful scan.
        const requestDocRef = doc(firestore, 'requests', request.id);
        
        try {
            await updateDoc(requestDocRef, {
                status: 'delivered'
            });
            
            toast({
                title: "Request Verified & Completed",
                description: `Request from ${request.victimName} marked as delivered.`,
            });
        } catch (error) {
            console.error("Failed to update status:", error);
            toast({
                variant: 'destructive',
                title: "Update Failed",
                description: `Could not mark request as delivered.`,
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const isDelivered = request.status === 'delivered';

    return (
        <Card className="w-full flex flex-col">
            <CardHeader>
                <CardTitle>{request.victimName}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1">
                    <MapPin className="h-4 w-4"/>
                    {request.location}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
                <div>
                    <h4 className="font-semibold mb-2">Requested Items:</h4>
                    <div className="flex flex-wrap gap-2">
                        {request.items.map(item => (
                            <div key={item} className="flex items-center gap-2 capitalize text-muted-foreground p-2 border rounded-md bg-background">
                                {itemIcons[item]}
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
                 <p className="text-sm text-muted-foreground">
                    {request.createdAt ? `Assigned ${formatDistanceToNow(new Date(request.createdAt as any), { addSuffix: true })}` : ''}
                 </p>
            </CardContent>
            <CardFooter>
                {isDelivered ? (
                     <Badge variant="outline" className="border-2 text-green-500 border-green-500/50 text-base">
                        <Check className="mr-2 h-4 w-4"/>
                        Delivered
                    </Badge>
                ) : (
                    <Button onClick={handleScanAndDeliver} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ScanLine className="mr-2 h-4 w-4"/>}
                        Scan QR & Mark Delivered
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
