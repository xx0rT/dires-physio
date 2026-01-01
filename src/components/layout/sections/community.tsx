import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useRef, useState } from "react"

interface Review {
    id: number
    name: string
    rating: number
    date: string
    text: string
    avatar: string
}

export const CommunitySection = () => {
    const [scrollY, setScrollY] = useState(0)
    const sectionRef = useRef<HTMLDivElement>(null)

    const reviews: Review[] = [
        {
            id: 1,
            name: "Sarah Mitchell",
            rating: 5,
            date: "2 weeks ago",
            text: "This platform has revolutionized how we handle our daily operations. The interface is intuitive and the features are exactly what we needed. Highly recommend to any growing business!",
            avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150&h=150&fit=crop"
        },
        {
            id: 2,
            name: "James Rodriguez",
            rating: 5,
            date: "1 month ago",
            text: "Excellent service! The team is responsive and the platform is incredibly reliable. We've seen a significant improvement in our workflow efficiency since we started using it.",
            avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150&h=150&fit=crop"
        },
        {
            id: 3,
            name: "Emily Parker",
            rating: 5,
            date: "3 weeks ago",
            text: "Great experience from start to finish. The onboarding was smooth and the customer support team has been fantastic. This tool has become essential for our business operations.",
            avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?w=150&h=150&fit=crop"
        },
        {
            id: 4,
            name: "Michael Chen",
            rating: 5,
            date: "2 months ago",
            text: "Best investment we've made this year! The platform is powerful yet easy to use. The analytics features have given us insights we never had before. Absolutely worth it!",
            avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=150&h=150&fit=crop"
        },
        {
            id: 5,
            name: "Amanda Foster",
            rating: 5,
            date: "1 week ago",
            text: "Amazing platform with a modern approach. I especially appreciate the attention to detail and the regular updates that keep improving the user experience. Very professional!",
            avatar: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?w=150&h=150&fit=crop"
        },
        {
            id: 6,
            name: "David Thompson",
            rating: 5,
            date: "3 months ago",
            text: "Outstanding service! The team really knows what they're doing. The documentation is clear and the features are top-notch. I highly recommend this to all my colleagues.",
            avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=150&h=150&fit=crop"
        },
        {
            id: 7,
            name: "Rachel Williams",
            rating: 5,
            date: "2 weeks ago",
            text: "Professional and user-friendly platform. The quality of service exceeded all my expectations. The support team has been incredibly helpful throughout our journey!",
            avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=150&h=150&fit=crop"
        },
        {
            id: 8,
            name: "Christopher Lee",
            rating: 5,
            date: "1 month ago",
            text: "Great investment in our business growth. The platform is well-structured and the team behind it are true experts with years of experience. Definitely coming back for more!",
            avatar: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?w=150&h=150&fit=crop"
        }
    ]

    useEffect(() => {
        const handleScroll = () => {
            if (sectionRef.current) {
                const rect = sectionRef.current.getBoundingClientRect()
                const sectionTop = rect.top
                const sectionHeight = rect.height
                const windowHeight = window.innerHeight

                if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
                    const scrollProgress = (windowHeight - sectionTop) / (windowHeight + sectionHeight)
                    setScrollY(scrollProgress)
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll()

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const row1Transform = scrollY * 300
    const row2Transform = scrollY * -300

    return (
        <section id="community" ref={sectionRef} className="container mx-auto py-12 overflow-hidden">
            <hr className="border-secondary" />
            <div className="container py-20 sm:py-20">
                <div className="mb-12 text-center">
                    <h2 className="mb-2 text-lg text-primary tracking-wider">
                        Reviews
                    </h2>
                    <h2 className="text-center font-bold text-3xl md:text-4xl mb-4">
                        What Our{" "}
                        <span className="bg-gradient-to-r from-[#da5319] to-primary bg-clip-text text-transparent">
                            Customers
                        </span>{" "}
                        Say
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-xl">
                        <span className="font-bold">5.0</span>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <span className="text-muted-foreground">on Google</span>
                    </div>
                </div>

                <div className="relative space-y-6">
                    <div
                        className="flex gap-6 transition-transform duration-100 ease-out"
                        style={{ transform: `translateX(-${row1Transform}px)` }}
                    >
                        {[...reviews.slice(0, 4), ...reviews.slice(0, 4)].map((review, index) => (
                            <Card key={`row1-${review.id}-${index}`} className="min-w-[350px] flex-shrink-0">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <img
                                            src={review.avatar}
                                            alt={review.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{review.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                                <span className="text-muted-foreground text-sm">{review.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {review.text}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div
                        className="flex gap-6 transition-transform duration-100 ease-out"
                        style={{ transform: `translateX(${row2Transform}px)` }}
                    >
                        {[...reviews.slice(4), ...reviews.slice(4)].map((review, index) => (
                            <Card key={`row2-${review.id}-${index}`} className="min-w-[350px] flex-shrink-0">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <img
                                            src={review.avatar}
                                            alt={review.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{review.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                                <span className="text-muted-foreground text-sm">{review.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {review.text}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
            <hr className="border-secondary" />
        </section>
    )
}
