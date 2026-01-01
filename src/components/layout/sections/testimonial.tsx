import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import Marquee from "@/components/ui/marquee"

interface ReviewProps {
    image: string
    name: string
    userName: string
    comment: string
    rating: number
}

const reviewList: ReviewProps[] = [
    {
        image: "",
        name: "Zuzana Hykyšová",
        userName: "Před 2 měsíci",
        comment:
            "Honza Kottas mi opět pomohl od problému, který mě měsíc trápil a se kterým mi nepomohly ani masáže, ani akupunktura. Honzova jemná, citlivá práce mi přinesla znatelnou úlevu a zlepšení ne úplně okamžitě, ale za pár hodin jsem zjistila, že už mě to nebolí, netáhne v zádech, nebrní v ruce, nepálí na hrudi. Honzu považuji za šamana, léčitele.",
        rating: 5.0
    },
    {
        image: "",
        name: "Lukáš Lebeda",
        userName: "Před 7 měsíci",
        comment:
            "Velice doporučuji pana Kottase, se kterým řeším dlouhodobý neurologický problém. Docházel jsem na různá fyzio cvičení/terapie a poprvé cítím, že problému někdo opravdu rozumí a používá správnou cestu a techniku.",
        rating: 5.0
    },
    {
        image: "",
        name: "Veronika Harapátová",
        userName: "Před rokem",
        comment:
            "Nevěřila jsem, že moje 3 letá dcera dokáže být hodinu v klidu, ale z pana Kottase vyzařuje takový klid, že se jí celá návštěva líbila a i když se jí hned ulevilo, tak by tam chtěla jezdit znovu, jak jí bylo celé ošetření příjemné.",
        rating: 5.0
    },
    {
        image: "",
        name: "Hanka Ježková",
        userName: "Před rokem",
        comment:
            "Děkuju za skvělý přístup! Pan Kottas byl úžasný a hned po první návštěvě se mi dost ulevilo. Co ještě oceňuji je dostupnost do Diresu - tramvajová zastávka je kousíček :)",
        rating: 5.0
    },
    {
        image: "",
        name: "Žaneta Kárová",
        userName: "Před rokem",
        comment:
            "Skvělý osobní přístup, velice doporučuji a děkuji 🙏",
        rating: 5.0
    }
]

const ReviewCard = ({ review }: { review: ReviewProps }) => {
    return (
        <Card className="flex h-full w-[350px] flex-col bg-muted/50 backdrop-blur-sm border-muted">
            <CardContent className="flex flex-grow flex-col pt-6">
                <div className="flex gap-1 pb-4">
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                </div>
                <div className="flex flex-1 items-start pb-4">
                    <p className="text-sm leading-relaxed line-clamp-6">{`"${review.comment}"`}</p>
                </div>
            </CardContent>

            <CardHeader>
                <div className="flex flex-row items-center gap-4">
                    <Avatar>
                        <AvatarImage
                            src={review.image}
                            alt={review.name}
                        />
                        <AvatarFallback>
                            {review.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                        <CardTitle className="text-lg">
                            {review.name}
                        </CardTitle>
                        <CardDescription>
                            {review.userName}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}

export const TestimonialSection = () => {
    return (
        <section id="testimonials" className="relative overflow-hidden py-16 sm:py-20">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10 animate-gradient-shift" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary-rgb,59,130,246),0.1),transparent_50%)] animate-pulse-slow" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(var(--primary-rgb,59,130,246),0.08),transparent_50%)] animate-pulse-slower" />

            <div className="container relative z-10 mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-2 text-center text-lg text-primary tracking-wider" data-aos="fade-up">
                        Reference
                    </h2>

                    <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl" data-aos="fade-up" data-aos-delay="100">
                        Co říkají naši klienti
                    </h2>

                    <div className="mt-4 flex items-center justify-center gap-2" data-aos="fade-up" data-aos-delay="200">
                        <div className="flex gap-1">
                            <Star className="size-5 fill-primary text-primary" />
                            <Star className="size-5 fill-primary text-primary" />
                            <Star className="size-5 fill-primary text-primary" />
                            <Star className="size-5 fill-primary text-primary" />
                            <Star className="size-5 fill-primary text-primary" />
                        </div>
                        <span className="font-semibold text-2xl">5.0</span>
                        <span className="text-muted-foreground">na Google</span>
                    </div>
                </div>

                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                    <Marquee className="[--duration:40s]" pauseOnHover={true}>
                        {reviewList.map((review, idx) => (
                            <ReviewCard key={`${review.name}-${idx}`} review={review} />
                        ))}
                    </Marquee>
                    <Marquee className="[--duration:40s] mt-4" pauseOnHover={true} reverse>
                        {reviewList.map((review, idx) => (
                            <ReviewCard key={`${review.name}-reverse-${idx}`} review={review} />
                        ))}
                    </Marquee>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent" />
                </div>
            </div>
        </section>
    )
}
