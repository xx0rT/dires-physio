import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Download } from "lucide-react"
import { useState } from "react"

export const LeadMagnetSection = () => {
    const [email, setEmail] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
    }

    return (
        <section className="container mx-auto px-4 py-16 sm:py-20">
            <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                <div className="absolute inset-0 -z-10">
                    <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[60%] w-[80%] animate-pulse bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 blur-3xl" />
                </div>

                <CardContent className="p-8 md:p-12">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2">
                            <span className="font-semibold text-primary">🎁 Zdarma ke stažení</span>
                        </div>

                        <h2 className="mb-4 font-bold text-3xl md:text-4xl" data-aos="fade-up">
                            Získejte Zdarma: Praktický Checklist
                        </h2>

                        <p className="mb-8 text-lg text-muted-foreground" data-aos="fade-up" data-aos-delay="100">
                            <span className="font-semibold text-foreground">10 klíčových technik vyšetření</span> pro fyzioterapeuty -
                            PDF průvodce v češtině, který můžete použít už dnes.
                        </p>

                        <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row" data-aos="fade-up" data-aos-delay="200">
                            <Input
                                type="email"
                                placeholder="Váš email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 text-base"
                                required
                            />
                            <Button type="submit" size="lg" className="rounded-full text-base">
                                <Download className="mr-2 size-5" />
                                Stáhnout zdarma
                            </Button>
                        </form>

                        <p className="mt-4 text-muted-foreground text-sm">
                            💬 Máte dotaz? <a href="#" className="text-primary underline">Napište nám na WhatsApp</a>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}
