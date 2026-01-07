import { useEffect, useState, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface VideoCourse {
  id: string;
  title: string;
  description: string;
  video_url: string;
  order_number: number;
  prerequisite_course_id: string | null;
}

export const CoursePlayerPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<VideoCourse | null>(null);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user && courseId) {
      fetchCourse();
      fetchProgress();
    }
  }, [user, courseId]);

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, []);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from("video_courses")
        .select("*")
        .eq("id", courseId)
        .maybeSingle();

      if (error) throw error;
      if (data) setCourse(data);
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from("user_video_progress")
        .select("*")
        .eq("user_id", user?.id)
        .eq("course_id", courseId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setProgress(Number(data.progress_percentage));
        setIsCompleted(data.is_completed);
      } else {
        await supabase.from("user_video_progress").insert({
          user_id: user?.id,
          course_id: courseId,
          progress_percentage: 0,
          is_completed: false,
        });
      }

      startProgressTracking();
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const startProgressTracking = () => {
    progressTimerRef.current = setInterval(() => {
      updateProgress();
    }, 10000);
  };

  const updateProgress = async () => {
    if (isCompleted) return;

    const newProgress = Math.min(progress + 2, 100);
    setProgress(newProgress);

    try {
      const { error } = await supabase
        .from("user_video_progress")
        .update({
          progress_percentage: newProgress,
          is_completed: newProgress >= 100,
          last_watched_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user?.id)
        .eq("course_id", courseId);

      if (error) throw error;

      if (newProgress >= 100 && !isCompleted) {
        setIsCompleted(true);
        setShowCompletion(true);
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
        }
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Kurz nenalezen</h1>
          <p className="text-muted-foreground">Tento kurz neexistuje nebo k němu nemáte přístup.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline">Kurz {course.order_number}</Badge>
              {isCompleted && (
                <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Dokončeno
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
          </div>
        </div>

        <div className="relative aspect-video w-full bg-muted rounded-lg overflow-hidden mb-6 shadow-2xl">
          <iframe
            ref={videoRef}
            src={course.video_url}
            title={course.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {!isCompleted && (
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pokrok kurzu</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              Pokračujte ve sledování pro odemknutí dalšího kurzu. Kurz musí být sledován do 100%.
            </p>
          </div>
        )}

        {showCompletion && (
          <div className="mb-6 p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-bold text-green-600">Gratulujeme!</h2>
            </div>
            <p className="text-muted-foreground">
              Úspěšně jste dokončili tento kurz. Můžete přejít na další kurz nebo si tento zopakovat.
            </p>
          </div>
        )}

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2 className="text-xl font-semibold mb-3">O kurzu</h2>
          <p className="text-muted-foreground leading-relaxed">{course.description}</p>
        </div>
      </div>
    </div>
  );
};
