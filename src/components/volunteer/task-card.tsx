'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { AidRequest } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Check, GlassWater, Loader2, MapPin, Pill, Stethoscope, Upload, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface TaskCardProps {
    request: AidRequest;
}

const itemIcons = {
    food: <UtensilsCrossed className="h-5 w-5" />,
    water: <GlassWater className="h-5 w-5" />,
    medicine: <Pill className="h-5 w-5" />,
    'medical help': <Stethoscope className="h-5 w-5" />,
}

export function TaskCard({ request }: TaskCardProps) {
    const { toast } = useToast();
    const [isDelivered, setIsDelivered] = useState(request.status === 'delivered');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const proofImage = PlaceHolderImages.find(img => img.id === 'proof');

    const handleMarkAsDelivered = async () => {
        setIsSubmitting(true);
        // Simulate image upload and status update
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsDelivered(true);
        setIsSubmitting(false);
        toast({
            title: "Task Completed",
            description: `Request from ${request.victimName} marked as delivered.`,
        });
    }

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle>{request.victimName}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1">
                    <MapPin className="h-4 w-4"/>
                    {request.location}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold mb-2">Requested Items:</h4>
                    <div className="flex flex-wrap gap-4">
                        {request.items.map(item => (
                            <div key={item} className="flex items-center gap-2 capitalize text-muted-foreground p-2 border rounded-md">
                                {itemIcons[item]}
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
                 <p className="text-sm text-muted-foreground">
                    Assigned {formatDistanceToNow(request.createdAt, { addSuffix: true })}
                </p>
            </CardContent>
            <CardFooter>
                {isDelivered ? (
                     <Badge variant="outline" className="border-2 text-green-500 border-green-500/50 text-base">
                        <Check className="mr-2 h-4 w-4"/>
                        Delivered
                    </Badge>
                ) : (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Mark as Delivered</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Proof of Delivery</DialogTitle>
                                <DialogDescription>
                                    Please upload an image as proof of delivery for the request from {request.victimName}.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="picture">Picture</Label>
                                    <Input id="picture" type="file" />
                                </div>
                                {proofImage && (
                                     <div className="w-full aspect-video overflow-hidden rounded-lg border relative">
                                        <Image
                                            src={proofImage.imageUrl}
                                            alt={proofImage.description}
                                            data-ai-hint={proofImage.imageHint}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button onClick={handleMarkAsDelivered} disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Upload className="mr-2 h-4 w-4"/>}
                                    Submit Proof
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </CardFooter>
        </Card>
    )
}
