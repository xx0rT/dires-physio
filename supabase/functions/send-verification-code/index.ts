import { createClient } from "npm:@supabase/supabase-js@2.90.1";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  email: string;
  password: string;
}

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return false;
    }

    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: "noreply@yourdomain.com",
      to: email,
      subject: "Ověřovací kód pro registraci",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; color: #667eea; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Ověřovací kód</h1>
              </div>
              <div class="content">
                <p>Děkujeme za registraci!</p>
                <p>Váš ověřovací kód je:</p>
                <div class="code">${code}</div>
                <p>Tento kód vyprší za 15 minut.</p>
                <p>Pokud jste nepožádali o tento kód, můžete tento email ignorovat.</p>
              </div>
              <div class="footer">
                <p>Tento email byl odeslán automaticky. Neodpovídejte na něj.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, password }: RequestBody = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 6 characters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const verificationCode = generateVerificationCode();

    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    const encodedPassword = btoa(String.fromCharCode(...new Uint8Array(passwordData)));

    const { error: deleteError } = await supabase
      .from("pending_registrations")
      .delete()
      .eq("email", email);

    if (deleteError && deleteError.code !== "PGRST116") {
      console.error("Error deleting old registration:", deleteError);
    }

    const { error: insertError } = await supabase
      .from("pending_registrations")
      .insert({
        email,
        password_hash: encodedPassword,
        verification_code: verificationCode,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create verification request" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const emailSent = await sendVerificationEmail(email, verificationCode);

    if (!emailSent) {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║   EMAIL SERVICE NOT CONFIGURED - VERIFICATION CODE         ║
╠════════════════════════════════════════════════════════════╣
║  Email: ${email.padEnd(45)} ║
║  Code:  ${verificationCode.padEnd(45)} ║
╠════════════════════════════════════════════════════════════╣
║  Configure RESEND_API_KEY to enable email sending         ║
╚════════════════════════════════════════════════════════════╝
      `);
    } else {
      console.log(`Verification email sent to ${email}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification code sent to your email",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
