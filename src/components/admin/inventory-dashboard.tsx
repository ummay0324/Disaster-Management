'use client';
import { AidRequest, AidRequestItem, InventoryItem } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { BarChart, BedDouble, Box, GlassWater, Package, Pill, Tent, UtensilsCrossed, FileText, AlertTriangle, CheckCircle, PieChart } from "lucide-react";
import { Progress } from "../ui/progress";
import { useMemo } from "react";
import { ResponsiveContainer, Pie, Cell, Tooltip, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltipContent } from "../ui/chart";

interface InventoryDashboardProps {
    initialInventory: InventoryItem[];
    requests: AidRequest[];
}

const itemIcons: Record<AidRequestItem, React.ReactNode> = {
    food: <UtensilsCrossed className="h-6 w-6" />,
    water: <GlassWater className="h-6 w-6" />,
    medicine: <Pill className="h-6 w-6" />,
    blankets: <BedDouble className="h-6 w-6" />,
    tents: <Tent className="h-6 w-6" />,
    'medical help': <Package className="h-6 w-6" />,
    'boat transport': <Package className="h-6 w-6" />,
    'life jackets': <Package className="h-6 w-6" />,
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function InventoryDashboard({ initialInventory, requests }: InventoryDashboardProps) {

    const needEstimation = useMemo(() => {
        const needed = new Map<AidRequestItem, number>();
        requests.filter(r => r.status !== 'delivered').forEach(req => {
            req.items.forEach(item => {
                if (item in itemIcons) { // only track physical goods
                    needed.set(item, (needed.get(item) || 0) + 1);
                }
            })
        });

        return initialInventory.map(item => {
            const numNeeded = needed.get(item.id) || 0;
            const available = item.quantity;
            const shortage = Math.max(0, numNeeded - available);
            return { ...item, needed: numNeeded, shortage };
        });
    }, [initialInventory, requests]);

    const mostRequestedData = useMemo(() => {
        const counts = new Map<AidRequestItem, number>();
        requests.forEach(req => {
            req.items.forEach(item => {
                 if (item in itemIcons) {
                    counts.set(item, (counts.get(item) || 0) + 1);
                }
            })
        });
        return Array.from(counts.entries()).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
    }, [requests]);

    const inventoryChartData = initialInventory.map(item => ({ name: item.name, value: item.quantity }));
    
    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <div className="glassmorphic-header">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Inventory Dashboard</h1>
                <p className="text-muted-foreground">Manage and visualize your aid supplies in real-time.</p>
            </div>
            
            <Card className="bg-card/60 backdrop-blur-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Box /> Current Stock Levels</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {initialInventory.map(item => {
                        const isLow = item.quantity <= item.threshold;
                        const percentage = (item.quantity / (item.threshold * 3)) * 100;
                        return (
                            <Card key={item.id} className="bg-background/80">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium capitalize">{item.name}</CardTitle>
                                    {itemIcons[item.id]}
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{item.quantity}</div>
                                    <p className="text-xs text-muted-foreground">units available</p>
                                    <Progress value={percentage} className="mt-4 h-2" />
                                    {isLow && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Low stock alert</p>}
                                </CardContent>
                            </Card>
                        )
                    })}
                </CardContent>
            </Card>

            <div className="grid gap-8 lg:grid-cols-3">
                 <Card className="lg:col-span-2 bg-card/60 backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileText /> Need Estimation</CardTitle>
                        <CardDescription>Comparing pending victim requests against available inventory.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {needEstimation.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-2 rounded-md bg-background/80">
                                <span className="font-medium capitalize">{item.name}</span>
                                <div className="flex items-center gap-4">
                                     <span>Needed: {item.needed}</span>
                                     <span>Available: {item.quantity}</span>
                                    {item.shortage > 0 ? (
                                        <span className="flex items-center gap-1 text-destructive font-bold"><AlertTriangle className="h-4 w-4" /> Shortage: {item.shortage}</span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-green-500 font-bold"><CheckCircle className="h-4 w-4" /> Sufficient</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card className="bg-card/60 backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart /> Most Requested Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[250px] w-full">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={mostRequestedData} layout="vertical" margin={{ left: 20, right: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12}}/>
                                    <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
             <Card className="bg-card/60 backdrop-blur-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><PieChart /> Inventory Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <ChartContainer config={{}} className="h-[300px] w-full max-w-lg">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={inventoryChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                                    {inventoryChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<ChartTooltipContent />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}

const GlassmorphicCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white/30 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20 ${className}`}>
        {children}
    </div>
);
