import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion"

interface FAQProps {
    question: string
    answer: string
    value: string
}

const FAQList: FAQProps[] = [
    {
        question: "Jsou kurzy mezinárodně uznávané?",
        answer: "Ano! Všechny naše certifikáty jsou uznávané českými lékařskými asociacemi a splňují evropské standardy fyzioterapie, což vám umožňuje praktikovat v celé EU.",
        value: "item-1"
    },
    {
        question: "Co je zahrnuto v ceně kurzu?",
        answer: "Cena kurzu zahrnuje všechny výukové lekce, komplexní studijní materiály, přístup k video knihovnám, užívání praktického vybavení, certifikační zkoušku a průběžný přístup ke zdrojům.",
        value: "item-2"
    },
    {
        question: "Jak dlouho trvá absolvování kurzu?",
        answer: "Délka kurzu se liší podle úrovně. Základní kurzy trvají 2-3 týdny, Profesionální programy zabírají 4-6 týdnů a Mistrovské kurzy trvají 8-12 týdnů s flexibilními možnostmi rozvrhu.",
        value: "item-3"
    },
    {
        question: "Potřebuji předchozí zkušenosti?",
        answer: "Základní kurzy jsou otevřené licencovaným zdravotnickým profesionálům. Profesionální a Mistrovské úrovně vyžadují předchozí fyzioterapeutickou certifikaci a klinické zkušenosti.",
        value: "item-4"
    },
    {
        question: "V jakých jazycích se kurzy vyučují?",
        answer: "Kurzy se primárně vyučují v češtině a angličtině. Překladatelské služby a materiály v dalších evropských jazycích lze domluvit pro skupinové rezervace.",
        value: "item-5"
    }
]

export const FAQSection = () => {
    return (
        <section id="faq" className="container mx-auto px-4 py-16 sm:py-20 md:w-[700px]">
            <div className="mb-8 text-center">
                <h2 className="mb-2 text-center text-lg text-primary tracking-wider">
                    Časté Dotazy
                </h2>

                <h2 className="text-center font-bold text-3xl md:text-4xl">
                    Běžné Otázky
                </h2>
            </div>

            <Accordion type="single" collapsible className="AccordionRoot">
                {FAQList.map(({ question, answer, value }) => (
                    <AccordionItem key={value} value={value}>
                        <AccordionTrigger className="text-left">
                            {question}
                        </AccordionTrigger>

                        <AccordionContent>{answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    )
}
