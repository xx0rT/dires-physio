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
    },
    {
        image: "",
        name: "Martin Novák",
        userName: "Před 3 měsíci",
        comment:
            "Profesionální přístup a rychlé výsledky. Po několika sezeních s panem Kottasem se můj stav výrazně zlepšil. Velmi doporučuji!",
        rating: 5.0
    }
]

const firstRow = reviewList.slice(0, Math.ceil(reviewList.length / 2))
const secondRow = reviewList.slice(Math.ceil(reviewList.length / 2))

const ReviewCard = ({ review }: { review: ReviewProps }) => {
    return (
        <Card className="w-[350px] flex-shrink-0 flex flex-col bg-muted/50 mx-2">
            <CardContent className="flex flex-grow flex-col pt-6">
                <div className="flex gap-1 pb-4">
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                </div>
                <div className="flex flex-1 items-start pb-4">
                    <p className="text-sm leading-relaxed">{`"${review.comment}"`}</p>
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
        <section id="testimonials" className="container mx-auto px-4 py-16 sm:py-20">
            <div className="mb-12 text-center">
                <h2 className="mb-2 text-center text-lg text-primary tracking-wider" data-aos="fade-up">
                    Recenze
                </h2>

                <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl" data-aos="fade-up" data-aos-delay="100">
                    Co říkají naši studenti
                </h2>

                <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="flex gap-0.5">
                        <Star className="size-6 fill-primary text-primary" />
                        <Star className="size-6 fill-primary text-primary" />
                        <Star className="size-6 fill-primary text-primary" />
                        <Star className="size-6 fill-primary text-primary" />
                        <Star className="size-6 fill-primary text-primary" />
                    </div>
                    <span className="text-2xl font-bold">5.0</span>
                    <span className="text-muted-foreground">na Google</span>
                </div>
            </div>

            <div className="relative flex flex-col gap-4 overflow-hidden">
                <Marquee pauseOnHover className="[--duration:40s]">
                    {firstRow.map((review) => (
                        <ReviewCard key={review.name} review={review} />
                    ))}
                </Marquee>
                <Marquee reverse pauseOnHover className="[--duration:40s]">
                    {secondRow.map((review) => (
                        <ReviewCard key={review.name} review={review} />
                    ))}
                </Marquee>
            </div>
        </section>
    )
}
