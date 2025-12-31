import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel"

interface ReviewProps {
    image: string
    name: string
    userName: string
    comment: string
    rating: number
}

const reviewList: ReviewProps[] = [
    {
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "Martin Novák",
        userName: "Sportovní Fyzioterapeut",
        comment:
            "Techniky manuální terapie, které jsem se zde naučil, transformovaly mou praxi. Moji pacienti vidí výsledky rychleji a moje důvěra enormně vzrostla.",
        rating: 5.0
    },
    {
        image: "https://images.unsplash.com/photo-1658281097220-eb7672eed00b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fHByb2ZpbGUlMjBwaG90b3xlbnwwfDJ8MHx8fDA%3D",
        name: "Anna Schmidt",
        userName: "Klinická Fyzioterapeutka, Německo",
        comment:
            "Výjimeční lektoři s hlubokými znalostmi českých metod. Praktické lekce byly neocenitelné pro zvládnutí pokročilých technik.",
        rating: 4.8
    },

    {
        image: "https://images.unsplash.com/photo-1618018352910-72bdafdc82a6?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "David Williams",
        userName: "Specialista na Rehabilitaci, UK",
        comment:
            "Kurz neurologické rehabilitace překonal mé očekávání. Výuka Vojtovy metody byla komplexní a výsledky pacientů mluví samy za sebe.",
        rating: 4.9
    },
    {
        image: "https://images.unsplash.com/photo-1584999734482-0361aecad844?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGV8ZW58MHwyfDB8fHww",
        name: "Elena Popescu",
        userName: "Dětská Fyzioterapeutka, Rumunsko",
        comment:
            "Nejlepší investice do mé kariéry! Pediatrický kurz mi dal specializované dovednosti, které jsou velmi žádané. Nyní léčím děti se složitými vývojovými potřebami.",
        rating: 5.0
    },
    {
        image: "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHByb2ZpbGUlMjBwaG90b3xlbnwwfDJ8MHx8fDA%3D",
        name: "Marie Dubois",
        userName: "Majitelka Soukromé Praxe, Francie",
        comment:
            "Certifikace mi otevřela dveře po celé Evropě. Praktický přístup a celoživotní přístup k materiálům znamená, že se stále učím a zlepšuji.",
        rating: 5.0
    },
    {
        image: "https://images.unsplash.com/photo-1623517006691-00db997b4c58?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTUwfHxwcm9maWxlJTIwcGhvdG98ZW58MHwyfDB8fHww",
        name: "Jakub Kowalski",
        userName: "Nemocniční Fyzioterapeut, Polsko",
        comment:
            "Malé třídy a odborné mentorství udělaly velký rozdíl. Dostal jsem osobní zpětnou vazbu, která mi pomohla rychle zdokonalit mou techniku.",
        rating: 4.9
    }
]

export const TestimonialSection = () => {
    return (
        <section id="testimonials" className="container mx-auto px-4 py-16 sm:py-20">
            <div className="mb-8 text-center">
                <h2 className="mb-2 text-center text-lg text-primary tracking-wider" data-aos="fade-up">
                    Reference
                </h2>

                <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl" data-aos="fade-up" data-aos-delay="100">
                    Příběhy Úspěchu Našich Studentů
                </h2>
            </div>

            <Carousel
                opts={{
                    align: "start"
                }}
                className="relative mx-auto w-[80%] sm:w-[90%] lg:max-w-screen-xl"
            >
                <CarouselContent>
                    {reviewList.map((review) => (
                        <CarouselItem
                            key={review.name}
                            className="md:basis-1/2 lg:basis-1/3"
                        >
                            <Card className="flex h-full flex-col bg-muted/50">
                                <CardContent className="flex flex-grow flex-col">
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

                                <CardHeader >
                                    <div className="flex flex-row items-center gap-4">
                                        <Avatar>
                                            <AvatarImage
                                                src={review.image}
                                                alt="radix"
                                            />
                                            <AvatarFallback>SV</AvatarFallback>
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
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </section>
    )
}
