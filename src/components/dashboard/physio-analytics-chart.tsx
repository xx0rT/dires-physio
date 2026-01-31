import { useState, useMemo } from "react";
import { format, subDays, startOfDay, addDays, differenceInDays } from "date-fns";
import { cs } from "date-fns/locale";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { CalendarIcon, TrendingUp, BookOpen, Award, Clock, Target, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { useAuth } from "@/lib/auth-context";
import { mockDatabase, mockCourses, mockModules } from "@/lib/mock-data";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PhysioAnalyticsChartProps {
  className?: string;
}

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateDataForRange = (from: Date, to: Date) => {
  const data = [];
  let currentDate = new Date(from);

  while (currentDate <= to) {
    const seed = currentDate.getTime() / 86400000;
    const baseProgress = 45 + Math.sin(seed / 7) * 15;
    const baseMinutes = 60 + Math.sin(seed / 5) * 30;

    data.push({
      date: new Date(currentDate),
      dateStr: format(currentDate, "d. MMM", { locale: cs }),
      progress: Math.floor(baseProgress + seededRandom(seed * 1) * 10),
      minutesStudied: Math.floor(baseMinutes + seededRandom(seed * 2) * 20),
      lessonsCompleted: Math.floor(seededRandom(seed * 3) * 3) + 1,
    });

    currentDate = addDays(currentDate, 1);
  }
  return data;
};

const chartConfig = {
  progress: { label: "Pokrok (%)", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

export const PhysioAnalyticsChart = ({ className }: PhysioAnalyticsChartProps) => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const filteredData = useMemo(() => {
    if (!dateRange?.from) {
      return generateDataForRange(subDays(new Date(), 29), new Date());
    }
    const from = startOfDay(dateRange.from);
    const to = dateRange.to ? startOfDay(dateRange.to) : from;
    return generateDataForRange(from, to);
  }, [dateRange]);

  const { courseDetails, stats } = useMemo(() => {
    if (!user) {
      return { courseDetails: [], stats: { totalMinutes: 0, totalLessons: 0, avgProgress: 0 } };
    }

    const enrollmentsData = mockDatabase.getEnrollments(user.id);
    const progressData = mockDatabase.getModuleProgress(user.id);

    const courseDetailsData = enrollmentsData.map(enrollment => {
      const course = mockCourses.find(c => c.id === enrollment.course_id);
      const courseModules = mockModules.filter(m => m.course_id === enrollment.course_id);
      const courseProgress = progressData.filter(p => {
        return courseModules.some(m => m.id === p.module_id);
      });
      const completedLessons = courseProgress.filter(p => p.is_completed).length;
      const totalLessons = courseModules.length;

      return {
        id: enrollment.id,
        title: course?.title || 'Unknown Course',
        progress: enrollment.progress_percentage,
        completedLessons,
        totalLessons,
        isCompleted: enrollment.completed_at !== null,
        enrolledAt: enrollment.enrolled_at,
      };
    });

    const totalMinutes = filteredData.reduce((sum, item) => sum + item.minutesStudied, 0);
    const totalLessons = filteredData.reduce((sum, item) => sum + item.lessonsCompleted, 0);
    const avgProgress = enrollmentsData.length > 0
      ? Math.round(enrollmentsData.reduce((sum, e) => sum + e.progress_percentage, 0) / enrollmentsData.length)
      : 0;

    return {
      courseDetails: courseDetailsData,
      stats: { totalMinutes, totalLessons, avgProgress }
    };
  }, [user, filteredData]);

  const daysDiff = dateRange?.from && dateRange?.to
    ? differenceInDays(dateRange.to, dateRange.from) + 1
    : 30;

  const navigateRange = (direction: "prev" | "next") => {
    if (!dateRange?.from || !dateRange?.to) return;
    const shift = direction === "prev" ? -daysDiff : daysDiff;
    setDateRange({
      from: addDays(dateRange.from, shift),
      to: addDays(dateRange.to, shift),
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Přehled Studia</h2>
          <p className="text-muted-foreground">
            {daysDiff} {daysDiff === 1 ? "den" : daysDiff < 5 ? "dny" : "dní"}
            {dateRange?.from && ` · ${format(dateRange.from, "d. MMM", { locale: cs })} - ${format(dateRange.to || dateRange.from, "d. MMM yyyy", { locale: cs })}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border">
            <Button variant="ghost" size="icon" className="rounded-r-none" onClick={() => navigateRange("prev")}>
              <ChevronLeft className="size-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="rounded-none border-x px-3">
                  <CalendarIcon className="mr-2 size-4" />
                  {dateRange?.from ? format(dateRange.from, "d. MMM", { locale: cs }) : "Začátek"} - {dateRange?.to ? format(dateRange.to, "d. MMM", { locale: cs }) : "Konec"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="range"
                  numberOfMonths={2}
                  selected={dateRange}
                  onSelect={setDateRange}
                  locale={cs}
                />
              </PopoverContent>
            </Popover>
            <Button variant="ghost" size="icon" className="rounded-l-none" onClick={() => navigateRange("next")}>
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Váš Pokrok ve Studiu</CardTitle>
          <CardDescription>Denní aktivita v nastaveném období</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-72 w-full">
            <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="dateStr"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                fontSize={11}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                fontSize={11}
                domain={[0, 100]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="progress"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#progressGrad)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Aktivní Kurzy</p>
                <p className="text-2xl font-bold">{courseDetails.filter(c => !c.isCompleted).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Award className="size-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Dokončené Kurzy</p>
                <p className="text-2xl font-bold">{courseDetails.filter(c => c.isCompleted).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Clock className="size-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Minut Studia</p>
                <p className="text-2xl font-bold">{stats.totalMinutes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Target className="size-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Průměrný Pokrok</p>
                <p className="text-2xl font-bold">{stats.avgProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {courseDetails.map((course) => (
          <Card key={course.id} className={cn(
            "transition-all hover:shadow-lg",
            course.isCompleted && "border-green-500/50 bg-green-50/50 dark:bg-green-950/20"
          )}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <CardTitle className="text-base font-semibold">{course.title}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Zapsáno {format(new Date(course.enrolledAt), "d. MMM yyyy", { locale: cs })}
                  </CardDescription>
                </div>
                {course.isCompleted ? (
                  <Badge className="bg-green-600 hover:bg-green-700">
                    <Award className="mr-1 size-3" />
                    Dokončeno
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <TrendingUp className="mr-1 size-3" />
                    V průběhu
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Celkový pokrok</span>
                  <span className="font-bold text-primary">{Math.round(course.progress)}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Lekce</p>
                    <p className="font-semibold">{course.completedLessons}/{course.totalLessons}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Zbývá</p>
                    <p className="font-semibold">{course.totalLessons - course.completedLessons}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
