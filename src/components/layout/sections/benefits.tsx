import type { icons } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

interface BenefitsProps {
    icon: string
    title: string
    description: string
}

const benefitList: BenefitsProps[] = [
    {
        icon: "CheckCircle2",
        title: "Vyšetříte pacienta do 15 minut",
        description:
            "Naučíte se efektivní diagnostické postupy, které ihned použijete v ambulanci."
    },
    {
        icon: "Target",
        title: "Přestanete si být nejistí",
        description:
            "Zvládnete manuální techniky s jistotou a bez strachu z chyby."
    },
    {
        icon: "TrendingUp",
        title: "Zvýšíte svou hodnotu na trhu",
        description:
            "S mezinárodním certifikátem získáte lepší pozice a vyšší plat."
    },
    {
        icon: "Clock",
        title: "Použijete hned druhý den",
        description:
            "100% praktické techniky bez zbytečné teorie - přímo do praxe."
    }
]

export const BenefitsSection = () => {
    return (
        <section id="benefits" className="container mx-auto px-4 py-16 sm:py-20 relative">
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[50%] w-[70%] animate-pulse bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 blur-3xl" />
            </div>

            <div className="grid place-items-start lg:grid-cols-2 lg:gap-24">
                <div className="sticky top-32 self-start" data-aos="fade-right">
                    <h2 className="mb-2 text-lg text-primary tracking-wider">
                        Výhody
                    </h2>

                    <h2 className="mb-4 font-bold text-3xl md:text-4xl">
                        Co Díky Kurzu Budete UMĚT
                    </h2>
                    <p className="mb-8 text-muted-foreground text-xl">
                        Ne jenom teorie - <span className="font-semibold text-foreground">reálné dovednosti pro praxi.</span> Výsledky, které změní vaši kariéru.
                    </p>
                    <Button asChild size="lg" className="group/arrow rounded-full text-base">
                        <Link to="/auth/sign-up">
                            Chci se zlepšit v praxi
                            <ArrowRight className="ml-2 size-5 transition-transform group-hover/arrow:translate-x-1" />
                        </Link>
                    </Button>
                </div>

                <div className="grid w-full gap-4 lg:grid-cols-2" data-aos="fade-left">
                    {benefitList.map(({ icon, title, description }, index) => (
                        <Card
                            key={title}
                            className="group/number transition-all delay-75 hover:bg-sidebar"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <CardHeader>
                                <div className="flex justify-between">
                                    <Icon
                                        name={icon as keyof typeof icons}
                                        size={32}
                                        color="var(--primary)"
                                        className="mb-6 text-primary"
                                    />
                                    <span className="font-medium text-5xl text-muted-foreground/15 transition-all delay-75 group-hover/number:text-muted-foreground/30">
                                        0{index + 1}
                                    </span>
                                </div>

                                <CardTitle>{title}</CardTitle>
                            </CardHeader>

                            <CardContent className="text-muted-foreground">
                                {description}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
