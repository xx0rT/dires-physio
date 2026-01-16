import { useEffect, useState } from "react";
import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getMockCourses, getMockCourseById, getMockModulesByCourseId, type Course, type CourseModule } from "@/data/mock-data";

export const CoursePlayerPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (!user || !courseId) {
      setLoading(false);
      return;
    }

    loadCourseData();
  }, [courseId, user]);

  const loadCourseData = () => {
    if (!courseId || !user) return;

    const courseData = getMockCourseById(courseId);
    if (!courseData) {
      setLoading(false);
      return;
    }

    setCourse(courseData);

    const modulesData = getMockModulesByCourseId(courseId);
    setModules(modulesData);

    const storedEnrollments = localStorage.getItem(`enrollments_${user.id}`);
    if (storedEnrollments) {
      const enrollments = JSON.parse(storedEnrollments);
      const enrollment = enrollments.find((e: any) => e.course_id === courseId);
      setIsEnrolled(!!enrollment);
    }

    const storedProgress = localStorage.getItem(`progress_${user.id}_${courseId}`);
    if (storedProgress) {
      const progressData = JSON.parse(storedProgress);
      const completed = new Set<string>(
        progressData
          .filter((p: any) => p.is_completed)
          .map((p: any) => p.module_id as string)
      );
      setCompletedModules(completed);

      if (modulesData && completed.size === modulesData.length && completed.size > 0) {
        updateEnrollment(courseId, 100, new Date().toISOString());
      } else if (modulesData && modulesData.length > 0) {
        const progressPercentage = (completed.size / modulesData.length) * 100;
        updateEnrollment(courseId, progressPercentage, null);
      }
    }

    setLoading(false);
  };

  const updateEnrollment = (courseId: string, progressPercentage: number, completedAt: string | null) => {
    if (!user) return;

    const storedEnrollments = localStorage.getItem(`enrollments_${user.id}`);
    if (storedEnrollments) {
      const enrollments = JSON.parse(storedEnrollments);
      const enrollmentIndex = enrollments.findIndex((e: any) => e.course_id === courseId);

      if (enrollmentIndex >= 0) {
        enrollments[enrollmentIndex].progress_percentage = progressPercentage;
        if (completedAt) {
          enrollments[enrollmentIndex].completed_at = completedAt;
        }
        localStorage.setItem(`enrollments_${user.id}`, JSON.stringify(enrollments));
      }
    }
  };

  const markModuleComplete = (moduleId: string) => {
    if (!user || completedModules.has(moduleId) || !courseId) return;

    const currentModule = modules.find(m => m.id === moduleId);
    if (!currentModule) return;

    const storedProgress = localStorage.getItem(`progress_${user.id}_${courseId}`) || '[]';
    const progressData = JSON.parse(storedProgress);

    const moduleProgress = {
      user_id: user.id,
      module_id: moduleId,
      course_id: courseId,
      is_completed: true,
      completed_at: new Date().toISOString(),
    };

    const existingIndex = progressData.findIndex((p: any) => p.module_id === moduleId);
    if (existingIndex >= 0) {
      progressData[existingIndex] = moduleProgress;
    } else {
      progressData.push(moduleProgress);
    }

    localStorage.setItem(`progress_${user.id}_${courseId}`, JSON.stringify(progressData));
    setCompletedModules(prev => new Set([...prev, moduleId]));

    const totalModules = modules.length;
    const completedCount = completedModules.size + 1;
    const progressPercentage = (completedCount / totalModules) * 100;

    updateEnrollment(courseId, progressPercentage, null);

    toast.success("✅ Modul dokončen!", {
      description: currentModuleIndex < modules.length - 1
        ? "Přechod na další modul..."
        : "🎉 Gratulujeme! Dokončili jste kurz!"
    });

    if (currentModuleIndex < modules.length - 1) {
      setTimeout(() => {
        goToNextModule();
      }, 1500);
    } else {
      setTimeout(() => {
        unlockNextCourse();
      }, 2000);
    }
  };

  const unlockNextCourse = () => {
    if (!user || !course || !courseId) return;

    updateEnrollment(courseId, 100, new Date().toISOString());

    const allCourses = getMockCourses();
    const currentIndex = allCourses.findIndex(c => c.id === courseId);

    if (currentIndex >= 0 && currentIndex < allCourses.length - 1) {
      const nextCourse = allCourses[currentIndex + 1];

      const storedEnrollments = localStorage.getItem(`enrollments_${user.id}`);
      if (storedEnrollments) {
        const enrollments = JSON.parse(storedEnrollments);
        const existingEnrollment = enrollments.find((e: any) => e.course_id === nextCourse.id);

        if (!existingEnrollment) {
          const newEnrollment = {
            id: `enrollment-${Date.now()}`,
            course_id: nextCourse.id,
            progress_percentage: 0,
            completed_at: null
          };
          enrollments.push(newEnrollment);
          localStorage.setItem(`enrollments_${user.id}`, JSON.stringify(enrollments));

          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
          });

          toast.success("🎉 Kurz úspěšně dokončen!", {
            description: `Odemkli jste další kurz: ${nextCourse.title}`,
            duration: 5000,
          });
        } else {
          toast.success("🎉 Kurz úspěšně dokončen!", {
            description: `Přechod na další kurz: ${nextCourse.title}`,
            duration: 3000,
          });
        }

        setTimeout(() => {
          navigate(`/course/${nextCourse.id}`);
        }, 2000);
      }
    } else {
      toast.success("🏆 Kurz úspěšně dokončen!", {
        description: "Gratulujeme! Dokončili jste všechny dostupné kurzy!",
        duration: 5000,
      });

      setTimeout(() => {
        navigate("/courses");
      }, 2000);
    }
  };

  const goToNextModule = () => {
    if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
    }
  };

  const goToPreviousModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
    }
  };

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course || !isEnrolled) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Kurz nenalezen</h1>
          <p className="text-muted-foreground">
            Tento kurz neexistuje nebo k němu nemáte přístup.
          </p>
          <Link to="/courses">
            <Button className="mt-4">
              <Home className="h-4 w-4 mr-2" />
              Zpět na kurzy
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Žádné moduly</h1>
          <p className="text-muted-foreground">
            Tento kurz zatím neobsahuje žádné vzdělávací moduly.
          </p>
        </div>
      </div>
    );
  }

  const currentModule = modules[currentModuleIndex];

  if (!currentModule) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Modul nenalezen</h1>
          <p className="text-muted-foreground">
            Tento modul neexistuje.
          </p>
        </div>
      </div>
    );
  }

  const isCurrentModuleCompleted = completedModules.has(currentModule.id);
  const progressPercentage = (completedModules.size / modules.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/courses">
                      <Home className="h-4 w-4" />
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{course.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {completedModules.size} / {modules.length} modulů
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        Modul {currentModuleIndex + 1} / {modules.length}
                      </Badge>
                      {isCurrentModuleCompleted && (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Dokončeno
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl">{currentModule.title}</CardTitle>
                    <CardDescription>{currentModule.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentModule.video_url && (
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <iframe
                      src={currentModule.video_url.replace('watch?v=', 'embed/')}
                      title={currentModule.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                <div
                  className="prose prose-slate dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentModule.content }}
                />

                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    onClick={goToPreviousModule}
                    disabled={currentModuleIndex === 0}
                    variant="outline"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Předchozí modul
                  </Button>

                  {!isCurrentModuleCompleted ? (
                    <Button onClick={() => markModuleComplete(currentModule.id)} variant="default">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Označit jako dokončené
                    </Button>
                  ) : (
                    <Button
                      onClick={goToNextModule}
                      disabled={currentModuleIndex === modules.length - 1}
                      variant="default"
                    >
                      Další modul
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Obsah kurzu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {modules.map((module, index) => {
                  const isCompleted = completedModules.has(module.id);
                  const isCurrent = index === currentModuleIndex;

                  return (
                    <button
                      key={module.id}
                      onClick={() => setCurrentModuleIndex(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        isCurrent
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-current" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{module.title}</p>
                          <p className={`text-sm ${isCurrent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                            {module.duration_minutes} minut
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
