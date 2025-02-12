import {GetFormStats} from "@/actions/form";
import React, {ReactNode, Suspense} from "react";
import {LuView} from "react-icons/lu";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";


export default function Home() {
  return (
    <div className="container pt-4">
      <Suspense fallback={<StatsCards loading={true}/> }></Suspense>
    </div>
  );
}

async function CardStatsWrapper() {
  const stats = await GetFormStats();
  return <StatsCards loading={false} data={stats}/>
}

interface StatsCardProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>;
  loading: boolean;
}

function StatsCards(props: StatsCardProps) {
  const {data, loading} = props;

  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1">
      <StatsCard
          title="Total visits"
          icon={<LuView className="text-bleu-600"/>}
          helperText="All time form visits"
          value={data?.visits.toLocaleString() || ""}
          loading={loading}
          className="shadow-md shadow-blue-600"
      />
    </div>
  );
}

function StatsCard({ title, value, icon, helperText, loading, className }:{
  title: string;
  value: string;
  helperText: string;
  className: string;
  loading: boolean;
  icon: ReactNode;
}) {
  return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading && (
                <Skeleton>
                  <span>0</span>
                </Skeleton>
            )}
          </div>
        </CardContent>
      </Card>
  )
}
