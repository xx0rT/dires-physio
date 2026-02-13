import { useAuth } from '@/lib/auth-context'
import { useSubscription } from '@/lib/use-subscription'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CreditCard, Calendar, RefreshCw, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useState } from 'react'
import { SubscriptionCard } from '@/components/subscription/subscription-card'

const planFeatures: Record<string, string[]> = {
  free_trial: [
    'Pristup k vybranemu obsahu',
    'Casove omezene',
    'Zakladni podpora',
  ],
  monthly: [
    'Plny pristup ke vsem kurzum',
    'Mesicni aktualizace obsahu',
    'Prioritni podpora',
    'Moznost zrusit kdykoliv',
  ],
  lifetime: [
    'Dozivotni pristup ke vsem kurzum',
    'Vsechny budouci aktualizace',
    'VIP podpora',
    'Exkluzivni bonusovy obsah',
  ],
}

const planLabels: Record<string, string> = {
  free_trial: 'Zkusebni verze',
  monthly: 'Mesicni predplatne',
  lifetime: 'Dozivotni predplatne',
}

export default function SubscriptionPage() {
  const { user } = useAuth()
  const { subscription, hasActiveSubscription, refetch } = useSubscription()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refetch()
      toast.success('Predplatne aktualizovano')
    } catch {
      toast.error('Nepodarilo se aktualizovat')
    } finally {
      setRefreshing(false)
    }
  }

  const planType = subscription?.plan_type || 'free_trial'
  const features = planFeatures[planType] || planFeatures.free_trial

  return (
    <div className="space-y-8 mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold">Predplatne</h1>
        <p className="text-muted-foreground mt-1">
          Spravujte sve predplatne a pristup ke kurzum
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {user && <SubscriptionCard userId={user.id} />}
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Detaily planu
              </CardTitle>
              <CardDescription>
                Informace o vasem aktualnim planu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <Badge variant={hasActiveSubscription ? 'default' : 'secondary'}>
                  {planLabels[planType] || planType}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <div className="flex items-center gap-1.5">
                  {hasActiveSubscription ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                  <span className="text-sm font-medium">
                    {hasActiveSubscription ? 'Aktivni' : 'Neaktivni'}
                  </span>
                </div>
              </div>
              {subscription?.current_period_end && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Platnost do</span>
                    <span className="text-sm font-medium">
                      {new Date(subscription.current_period_end).toLocaleDateString('cs-CZ', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </>
              )}
              <Separator />
              <Button
                variant="outline"
                className="w-full"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Aktualizovat stav
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Vyhody vaseho planu
              </CardTitle>
              <CardDescription>
                Co vase predplatne zahrnuje
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historie predplatneho
            </CardTitle>
            <CardDescription>
              Prehled zmen vaseho predplatneho
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subscription ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{planLabels[planType]}</p>
                      <p className="text-xs text-muted-foreground">
                        Aktivovano: {new Date(subscription.created_at).toLocaleDateString('cs-CZ')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                    {subscription.status === 'active' ? 'Aktivni' : subscription.status}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Zadna historie predplatneho</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
