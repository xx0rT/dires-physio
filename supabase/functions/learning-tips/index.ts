import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.47.10";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface UserProgress {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalWatchTime: number;
  averageProgress: number;
  strugglingCourses: Array<{ title: string; progress: number }>;
  recentActivity: boolean;
}

function generatePersonalizedTips(progress: UserProgress): string[] {
  const tips: string[] = [];

  if (progress.completedCourses === 0) {
    tips.push("🎯 **Začněte malými krůčky**: Dokončete první video ještě dnes. Začátek je nejdůležitější!");
    tips.push("📅 **Naplánujte si čas**: Vyhraďte si 20-30 minut denně pro studium. Konzistence je klíčem k úspěchu.");
    tips.push("📝 **Dělejte si poznámky**: Aktivní učení zvyšuje zapamatování až o 70%. Zkuste si psát klíčové body.");
  } else if (progress.completedCourses < 2) {
    tips.push("💪 **Skvělý začátek!** Už jste dokončili první kurz. Tempo je perfektní, pokračujte!");
    tips.push("🔄 **Opakování je matka moudrosti**: Občas se vraťte k předchozím videím pro upevnění znalostí.");
    tips.push("🎨 **Praktikujte**: Vyzkoušejte naučené koncepty na vlastních projektech. Praxe dělá mistra.");
  } else {
    tips.push("🌟 **Pokročilý student!** Už jste na skvělé cestě. Udržte si momentum!");
    tips.push("🤝 **Sdílejte své znalosti**: Učení druhých je nejlepší způsob jak si upevnit vlastní znalosti.");
    tips.push("🚀 **Pokročilé techniky**: Zkuste experimentovat s vlastními nápady a variacemi na naučené koncepty.");
  }

  if (progress.averageProgress > 0 && progress.averageProgress < 30) {
    tips.push("⏰ **Tip na produktivitu**: Použijte techniku Pomodoro - 25 minut studia, 5 minut pauza.");
  } else if (progress.averageProgress >= 30 && progress.averageProgress < 70) {
    tips.push("📊 **Polovinu máte za sebou!** Teď je důležité nevzdávat se. Nejlepší je teprve přijde.");
  } else if (progress.averageProgress >= 70) {
    tips.push("🏆 **Jste téměř u cíle!** Zbývá jen pár kroků k dokončení. Můžete na to!");
  }

  if (progress.strugglingCourses.length > 0) {
    tips.push(`💡 **Potřebujete pomoc?** Pokud vám dělá problémy kurz "${progress.strugglingCourses[0].title}", zkuste si ho rozdělit na menší části.`);
  }

  if (!progress.recentActivity) {
    tips.push("🔔 **Dlouho jste nebyli**: Vítejte zpět! I krátká 10minutová lekce vám pomůže dostat se zpět do tempa.");
  }

  if (progress.totalWatchTime > 120) {
    tips.push("👀 **Péče o oči**: Nezapomeňte na pravidelné pauzy. Každých 20 minut se podívejte 20 sekund na něco vzdáleného.");
  }

  tips.push("💬 **Potřebujete radu?** Nebojte se ptát! Komunita je tu, aby vám pomohla.");
  tips.push("🎯 **Cíle jsou důležité**: Stanovte si konkrétní cíl - například dokončit jeden modul týdně.");

  return tips.slice(0, 5);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { data: enrollments } = await supabase
      .from("user_course_enrollments")
      .select("*, courses(title)")
      .eq("user_id", user.id);

    const { data: moduleProgress } = await supabase
      .from("user_module_progress")
      .select("watch_time_seconds, last_watched_at")
      .eq("user_id", user.id);

    const totalCourses = enrollments?.length || 0;
    const completedCourses = enrollments?.filter((e) => e.completed_at)?.length || 0;
    const inProgressCourses = totalCourses - completedCourses;

    const totalWatchTime = moduleProgress?.reduce(
      (acc, m) => acc + (m.watch_time_seconds || 0),
      0
    ) || 0;

    const averageProgress = totalCourses > 0
      ? enrollments?.reduce((acc, e) => acc + (e.progress_percentage || 0), 0)! / totalCourses
      : 0;

    const strugglingCourses = enrollments
      ?.filter((e) => e.progress_percentage > 0 && e.progress_percentage < 30 && !e.completed_at)
      .map((e) => ({
        title: (e.courses as any)?.title || "Unknown",
        progress: e.progress_percentage,
      })) || [];

    const lastActivity = moduleProgress?.[0]?.last_watched_at;
    const recentActivity = lastActivity
      ? new Date(lastActivity).getTime() > Date.now() - 24 * 60 * 60 * 1000
      : false;

    const userProgress: UserProgress = {
      totalCourses,
      completedCourses,
      inProgressCourses,
      totalWatchTime: Math.floor(totalWatchTime / 60),
      averageProgress: Math.round(averageProgress),
      strugglingCourses,
      recentActivity,
    };

    const tips = generatePersonalizedTips(userProgress);

    return new Response(
      JSON.stringify({
        tips,
        progress: userProgress,
        message: "Personalized learning tips generated successfully",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
