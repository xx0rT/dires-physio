const site_url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const site = {
  name: "Dires",
  description: "Profesionální fyzioterapeutické kurzy od certifikovaných českých odborníků",
  url: site_url,
  ogImage: `${site_url}/og.jpg`,
  logo: "/logo.svg",
  mailSupport: "info@dires.cz",
  mailFrom: process.env.MAIL_FROM || "noreply@dires.cz",
  links: {
    twitter: "https://twitter.com/dires",
    github: "https://github.com/dires",
    linkedin: "https://www.linkedin.com/company/dires/",
  }
} as const;