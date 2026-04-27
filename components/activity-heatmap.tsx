import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatEth } from "@/lib/utils";
import type { HeatmapDay } from "@/lib/types";

const levelClasses = [
  "bg-[#111]",
  "bg-[#003300]",
  "bg-[#006600]",
  "bg-[#009900]",
  "bg-[#00ff00]"
];

export function ActivityHeatmap({ days }: { days: HeatmapDay[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>52-Week Log</CardTitle>
        <CardDescription>Darker cells mean no activity. Brighter cells mean more Base transactions that day.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-4">
          <div className="grid w-max grid-flow-col grid-rows-7 gap-[2px]">
            {days.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} tx, ${formatEth(day.valueEth)}`}
                className={cn("h-3 w-3 border border-[#222]", levelClasses[day.level])}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-[#666] border-t border-[#1a1a1a] pt-4">
          <span>MINIMAL</span>
          <div className="flex items-center gap-[2px]">
            {levelClasses.map((level) => (
              <span key={level} className={cn("h-3 w-3 border border-[#222]", level)} />
            ))}
          </div>
          <span>MAXIMAL</span>
        </div>
      </CardContent>
    </Card>
  );
}
