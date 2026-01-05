import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"

enum PopularPlan {
    NO = 0,
    YES = 1
}

interface PlanProps {
    title: string
    popular: PopularPlan
    price: number
    description: string
    buttonText: string
    benefitList: string[]
}

const plans: PlanProps[] = [
    {
        title: "Základní",
        popular: 0,
        price: 890,
        description:
            "Pro začínající fyzioterapeuty, kteří chtějí získat pevný základ.",
        buttonText: "Rezervovat místo",
        benefitList: [
            "✔️ Vyšetříte pacienta rychleji",
            "✔️ Zvládnete základní techniky",
            "✔️ Získáte uznávaný certifikát",
            "🎁 Bonus: Video knihovna",
            "🛡️ 14denní garance vrácení"
        ]
    },
    {
        title: "Profesionální",
        popular: 1,
        price: 1590,
        description:
            "Nejlepší volba pro praktikující fyzioterapeuty.",
        buttonText: "Získat certifikaci",
        benefitList: [
            "✔️ Zvládnete pokročilé techniky",
            "✔️ Buďte si jistí u každého pacienta",
            "✔️ Mezinárodní certifikát",
            "🎁 Bonus: Osobní konzultace",
            "🛡️ 14denní garance vrácení"
        ]
    },
    {
        title: "Mistrovský",
        popular: 0,
        price: 2890,
        description:
            "Pro pokročilé odborníky s ambicí stát se lektory.",
        buttonText: "Kontaktovat nás",
        benefitList: [
            "✔️ Staňte se odborníkem ve svém oboru",
            "✔️ Individuální mentoring",
            "✔️ Certifikace lektora",
            "🎁 Bonus: Síť absolventů",
            "🛡️ 14denní garance vrácení"
        ]
    }
]

export const PricingSection = () => {
    return (
        <section id="pricing" className="container mx-auto px-4 py-16 sm:py-20 relative">
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[55%] w-[80%] animate-pulse bg-gradient-to-r from-primary/25 via-purple-500/25 to-primary/25 blur-3xl" />
            </div>

            <h2 className="mb-2 text-center text-lg text-primary tracking-wider" data-aos="fade-up">
                Ceník Kurzů
            </h2>

            <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl" data-aos="fade-up" data-aos-delay="100">
                Vyberte Si Svůj Kurz
            </h2>

            <h3 className="mx-auto pb-2 text-center text-muted-foreground text-xl md:w-1/2" data-aos="fade-up" data-aos-delay="200">
                <span className="font-semibold text-foreground">⏳ Pouze 12 míst v každém kurzu.</span> Rezervujte si své místo ještě dnes.
            </h3>

            <div className="flex justify-center gap-4 pb-12 text-sm" data-aos="fade-up" data-aos-delay="300">
                <div className="flex items-center gap-2">
                    <span>🛡️ 14denní garance vrácení peněz</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>🎓 Certifikát uznávaný v ČR</span>
                </div>
            </div>

            <div className="grid space-x-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
                {plans.map(
                    ({
                        title,
                        popular,
                        price,
                        description,
                        buttonText,
                        benefitList
                    }, index) => (
                        <Card
                            key={title}
                            data-aos="fade-up"
                            data-aos-delay={index * 150}
                            className={
                                popular === PopularPlan?.YES
                                    ? "border-[1.5px] border-primary shadow-black/10 drop-shadow-xl lg:scale-[1.1] dark:shadow-white/10 relative"
                                    : "relative"
                            }
                        >
                            {popular === PopularPlan?.YES && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                                        ⭐ Nejlepší volba
                                    </Badge>
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="pb-2">{title}</CardTitle>

                                <CardDescription className="pb-4">
                                    {description}
                                </CardDescription>

                                <div>
                                    <span className="font-bold text-3xl">
                                        €{price}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {" "}
                                        /kurz
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="flex">
                                <div className="space-y-4">
                                    {benefitList.map((benefit) => (
                                        <span key={benefit} className="flex items-center gap-2">
                                            <svg width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 fill-current">
                                            <path d="M14.3589 2.6492H7.3756C4.34227 2.6492 2.53394 4.45753 2.53394 7.49087V14.4659C2.53394 17.5075 4.34227 19.3159 7.3756 19.3159H14.3506C17.3839 19.3159 19.1923 17.5075 19.1923 14.4742V7.49087C19.2006 4.45753 17.3923 2.6492 14.3589 2.6492ZM14.8506 9.06587L10.1256 13.7909C10.0089 13.9075 9.8506 13.9742 9.68394 13.9742C9.51727 13.9742 9.35894 13.9075 9.24227 13.7909L6.88394 11.4325C6.64227 11.1909 6.64227 10.7909 6.88394 10.5492C7.1256 10.3075 7.5256 10.3075 7.76727 10.5492L9.68394 12.4659L13.9673 8.18253C14.2089 7.94087 14.6089 7.94087 14.8506 8.18253C15.0923 8.4242 15.0923 8.81587 14.8506 9.06587Z" />
                                            </svg>
                                            <h3>{benefit}</h3>
                                        </span>
                                    ))}
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    asChild
                                    variant={
                                        popular === PopularPlan?.YES
                                            ? "default"
                                            : "secondary"
                                    }
                                    className="w-full"
                                >
                                    <Link to="/auth/sign-up">
                                        {buttonText}
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                )}
            </div>
        </section>
    )
}
