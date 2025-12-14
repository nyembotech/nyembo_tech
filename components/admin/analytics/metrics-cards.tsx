import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Ticket, TrendingUp } from "lucide-react";

export function AnalyticsMetrics() {
    const metrics = [
        {
            title: "Active Customers",
            value: "142",
            change: "+12% from last month",
            icon: Users,
            color: "text-blue-400"
        },
        {
            title: "Active Projects",
            value: "28",
            change: "+4 new this week",
            icon: Briefcase,
            color: "text-nyembo-sky"
        },
        {
            title: "Support Tickets",
            value: "12",
            change: "4 requires attention",
            icon: Ticket,
            color: "text-yellow-400"
        },
        {
            title: "Revenue",
            value: "$45.2k",
            change: "+8.1% vs last month",
            icon: TrendingUp,
            color: "text-green-400"
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
                <Card key={metric.title} className="bg-card/30 border-white/5 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {metric.title}
                        </CardTitle>
                        <metric.icon className={`h-4 w-4 ${metric.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{metric.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {metric.change}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
