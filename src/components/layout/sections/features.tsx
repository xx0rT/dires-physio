import {
    RiShieldKeyholeLine,
    RiDashboard3Line,
    RiUploadCloud2Line,
    RiDatabase2Line,
    RiFireFill,
    RiStackLine
} from "@remixicon/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeaturesProps {
    icon: React.ReactNode
    title: string
    description: string
}

const featureList: FeaturesProps[] = [
    {
        icon: <RiShieldKeyholeLine size={24} className="text-primary" />,
        title: "Certifikované Kurzy",
        description:
            "Uznávané české i mezinárodní certifikáty pro praxi po celé Evropě."
    },
    {
        icon: <RiDashboard3Line size={24} className="text-primary" />,
        title: "Praktická Výuka",
        description:
            "Reálná praxe se skutečnými pacienty v moderních zařízeních."
    },
    {
        icon: <RiUploadCloud2Line size={24} className="text-primary" />,
        title: "Online Přístup",
        description:
            "Video lekce a materiály dostupné kdykoli, odkudkoli."
    },
    {
        icon: <RiDatabase2Line size={24} className="text-primary" />,
        title: "Zkušení Lektoři",
        description:
            "Profesionálové s desetiletími praktických zkušeností."
    },
    {
        icon: <RiFireFill size={24} className="text-primary" />,
        title: "Malé Skupiny",
        description:
            "Maximálně 12 studentů pro individuální pozornost."
    },
    {
        icon: <RiStackLine size={24} className="text-primary" />,
        title: "Celoživotní Podpora",
        description:
            "Trvalý přístup k materiálům a síti absolventů."
    }
]

export const FeaturesSection = () => {
    return (
        <section id="features" className="container mx-auto px-4 py-16 sm:py-20">
            <div className="sticky top-24 z-10 bg-background/95 backdrop-blur-sm pb-6 -mx-4 px-4">
                <h2 className="mb-2 text-center text-lg text-primary tracking-wider" data-aos="fade-up">
                    Vlastnosti Kurzů
                </h2>

                <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl" data-aos="fade-up" data-aos-delay="100">
                    Jak To Probíhá
                </h2>

                <h3 className="mx-auto text-center text-muted-foreground text-xl md:w-1/2" data-aos="fade-up" data-aos-delay="200">
                    Praktický přístup - <span className="font-semibold text-foreground">od přihlášení po certifikát během měsíců.</span>
                </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                {featureList.map(({ icon, title, description }, index) => (
                    <div key={title} data-aos="fade-up" data-aos-delay={index * 100}>
                        <Card className="h-full border-0 bg-background shadow-none">
                            <CardHeader className="flex items-center justify-center gap-4 align-middle pb-2">
                                <div className="rounded-full bg-primary/20 p-2 ring-8 ring-primary/10">
                                    {icon}
                                </div>

                                <CardTitle>{title}</CardTitle>
                            </CardHeader>

                            <CardContent className="text-center text-muted-foreground">
                                {description}
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </section>
    )
}
