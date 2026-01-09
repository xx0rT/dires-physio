import { useEffect, useState, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import { CheckCircle2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  price: number;
  order_index: number;
}

interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content: string;
  video_url: string | null;
  order_index: number;
  duration_minutes: number;
}

export const CoursePlayerPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (user && courseId) {
      loadCourseData();
    }
  }, [user, courseId]);

  const loadCourseData = async () => {
    try {
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .maybeSingle();

      if (courseError) throw courseError;
      if (!courseData) {
        setLoading(false);
        return;
      }

      setCourse(courseData);

      const { data: modulesData, error: modulesError } = await supabase
        .from("course_modules")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true });

      if (modulesError) throw modulesError;
      if (modulesData) setModules(modulesData);

      const { data: enrollmentData } = await supabase
        .from("user_course_enrollments")
        .select("*")
        .eq("user_id", user?.id)
        .eq("course_id", courseId)
        .maybeSingle();

      setIsEnrolled(!!enrollmentData);

      const { data: progressData } = await supabase
        .from("user_module_progress")
        .select("*")
        .eq("user_id", user?.id)
        .eq("course_id", courseId);

      if (progressData) {
        const completed = new Set(
          progressData
            .filter(p => p.is_completed)
            .map(p => p.module_id)
        );
        setCompletedModules(completed);
      }
    } catch (error) {
      console.error("Error loading course data:", error);
    } finally {
      setLoading(false);
    }
  };

  const markModuleComplete = async (moduleId: string) => {
    if (!user || completedModules.has(moduleId)) return;

    try {
      await supabase.from("user_module_progress").upsert({
        user_id: user.id,
        module_id: moduleId,
        course_id: courseId,
        is_completed: true,
        completed_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,module_id'
      });

      setCompletedModules(prev => new Set([...prev, moduleId]));

      const totalModules = modules.length;
      const completedCount = completedModules.size + 1;
      const progressPercentage = (completedCount / totalModules) * 100;

      await supabase
        .from("user_course_enrollments")
        .update({
          progress_percentage: progressPercentage,
          completed_at: progressPercentage === 100 ? new Date().toISOString() : null,
        })
        .eq("user_id", user.id)
        .eq("course_id", courseId);
    } catch (error) {
      console.error("Error marking module complete:", error);
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
  const isCurrentModuleCompleted = completedModules.has(currentModule.id);
  const courseProgress = (completedModules.size / modules.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline">Kurz {course.order_index + 1}</Badge>
            <Badge variant="outline">
              Modul {currentModuleIndex + 1} z {modules.length}
            </Badge>
            {courseProgress === 100 && (
              <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Kurz dokončen
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <h2 className="text-xl text-muted-foreground">{currentModule.title}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {currentModule.video_url && (
              <div className="relative aspect-video w-full bg-muted rounded-lg overflow-hidden shadow-2xl">
                <iframe
                  ref={videoRef}
                  src={currentModule.video_url}
                  title={currentModule.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">O tomto modulu</h3>
                  {!isCurrentModuleCompleted && (
                    <Button
                      onClick={() => markModuleComplete(currentModule.id)}
                      variant="default"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Označit jako dokončené
                    </Button>
                  )}
                  {isCurrentModuleCompleted && (
                    <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Dokončeno
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">{currentModule.description}</p>
                {currentModule.content && (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: currentModule.content }} />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <Button
                onClick={goToPreviousModule}
                disabled={currentModuleIndex === 0}
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Předchozí modul
              </Button>
              <Button
                onClick={goToNextModule}
                disabled={currentModuleIndex === modules.length - 1}
              >
                Další modul
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Pokrok kurzu</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Dokončeno</span>
                    <span className="font-medium">
                      {completedModules.size} / {modules.length} modulů
                    </span>
                  </div>
                  <Progress value={courseProgress} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    {Math.round(courseProgress)}% dokončeno
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Moduly kurzu</h3>
                <div className="space-y-2">
                  {modules.map((module, index) => (
                    <button
                      key={module.id}
                      onClick={() => setCurrentModuleIndex(index)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        index === currentModuleIndex
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            completedModules.has(module.id)
                              ? "bg-green-500/20 text-green-600"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {completedModules.has(module.id) ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{module.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {module.duration_minutes} min
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
