'use client';
import { AidRequest, AidRequestItem, InventoryItem } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { BarChart as BarChartIcon, BedDouble, Box, GlassWater, Package, Pill, Tent, UtensilsCrossed, FileText, AlertTriangle, CheckCircle, PieChart as PieChartIcon, Loader2 } from "lucide-react";
import { Progress } from "../ui/progress";
import { useMemo } from "react";
import { ResponsiveContainer, Pie, Cell, Tooltip, Bar, XAxis, YAxis, CartesianGrid, Legend, BarChart, PieChart } from "recharts";
import { ChartContainer, ChartTooltipContent } from "../ui/chart";

interface InventoryDashboardProps {
    initialInventory: InventoryItem[];
    requests: AidRequest[];
    isLoading: boolean;
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export function InventoryDashboard({ initialInventory, requests, isLoading }: InventoryDashboardProps) {

    const stockVsDemandData = useMemo(() => {
        const needed = new Map<AidRequestItem, number>();
        requests.filter(r => r.status !== 'delivered').forEach(req => {
            req.items.forEach(item => {
                if (item in itemIcons) { // only track physical goods
                    needed.set(item, (needed.get(item) || 0) + 1);
                }
            })
        });

        return initialInventory.map(item => {
            const demand = needed.get(item.id) || 0;
            return { name: item.name, stock: item.quantity, demand };
        });
    }, [initialInventory, requests]);

    const demandDistributionData = useMemo(() => {
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
    
    if (isLoading) {
        return (
            <div className="container mx-auto p-4 md:p-8 space-y-8">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Inventory Dashboard</h1>
                <p className="text-muted-foreground">Manage and visualize your aid supplies in real-time.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Box /> Current Inventory Status</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {initialInventory.map(item => {
                        const isLow = item.quantity <= item.threshold;
                        const percentage = (item.quantity / (item.threshold * 3)) * 100;
                        return (
                            <Card key={item.id}>
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

            <div className="grid gap-8 lg:grid-cols-5">
                 <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChartIcon /> Stock vs. Demand</CardTitle>
                        <CardDescription>Comparing available inventory with outstanding victim requests.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px] w-full">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stockVsDemandData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{fontSize: 12}} />
                                    <YAxis />
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <Legend />
                                    <Bar dataKey="stock" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="demand" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><PieChartIcon /> Demand Distribution</CardTitle>
                        <CardDescription>Breakdown of all items currently requested by victims.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <ChartContainer config={{}} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={demandDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                        return (
                                        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                                            {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                        );
                                    }}>
                                        {demandDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
