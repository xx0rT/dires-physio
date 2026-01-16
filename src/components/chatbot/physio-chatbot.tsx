import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RiSendPlane2Line, RiQuestionLine, RiRobotLine } from '@remixicon/react'
import { motion, AnimatePresence } from 'framer-motion'
import { mockChatbotQA, type ChatMessage } from '@/lib/mock-data'

interface ConversationMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  category?: string
}

export function PhysioChatbot() {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: '0',
      type: 'bot',
      content: 'Ahoj! Jsem váš AI asistent pro fyzioterapii. Můžete se mě zeptat na cokoliv ohledně fyzioterapie, rehabilitace a péče o pacienty. Klikněte na některou z častých otázek níže nebo napište vlastní dotaz.'
    }
  ])
  const [input, setInput] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('všechny')

  const categories = ['všechny', 'páteř', 'sport', 'terapie', 'neurologie', 'obecné', 'akutní péče']

  const filteredQuestions = selectedCategory === 'všechny'
    ? mockChatbotQA
    : mockChatbotQA.filter(qa => qa.category === selectedCategory)

  const handleQuestionClick = (qa: ChatMessage) => {
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: qa.question
    }

    const botMessage: ConversationMessage = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: qa.answer,
      category: qa.category
    }

    setMessages(prev => [...prev, userMessage, botMessage])
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input
    }

    const matchedQA = mockChatbotQA.find(qa =>
      qa.question.toLowerCase().includes(input.toLowerCase()) ||
      input.toLowerCase().includes(qa.question.toLowerCase().split(' ').slice(0, 3).join(' '))
    )

    const botMessage: ConversationMessage = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: matchedQA
        ? matchedQA.answer
        : 'Omlouvám se, na tuto otázku momentálně nemám odpověď. Zkuste prosím přeformulovat dotaz nebo vyberte některou z připravených otázek níže. Pokud potřebujete konkrétní pomoc, konzultujte s odborníkem.',
      category: matchedQA?.category
    }

    setMessages(prev => [...prev, userMessage, botMessage])
    setInput('')
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <RiRobotLine className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">AI Asistent Fyzioterapeuta</CardTitle>
            <CardDescription>Zeptejte se na cokoliv ohledně fyzioterapie</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    {message.category && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {message.category}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Napište svou otázku..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <RiSendPlane2Line className="h-4 w-4" />
          </Button>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <RiQuestionLine className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Kategorie:</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-3">Často kladené otázky:</p>
          <div className="space-y-2">
            {filteredQuestions.slice(0, 5).map((qa) => (
              <button
                key={qa.id}
                onClick={() => handleQuestionClick(qa)}
                className="w-full text-left p-3 rounded-lg border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <RiQuestionLine className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{qa.question}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
