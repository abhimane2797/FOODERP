import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Heart, Utensils } from 'lucide-react'
import { Button, Card, Textarea } from '../../components/ui'
import { useToast } from '../../hooks/useToast'
import { useQRContext } from '../../hooks/useQRContext'
import { getActiveQROrder, submitQROrderFeedback } from '../../services/qrOrderService'
import { clsx } from '../../utils'

function StarRating({ value, onChange, size = 'lg' }: {
  value: number
  onChange: (v: number) => void
  size?: 'sm' | 'lg'
}) {
  return (
    <div className="flex items-center gap-1.5 justify-center">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={clsx(
            'transition-all active:scale-90',
            size === 'lg' ? 'p-1' : 'p-0.5',
          )}
        >
          <Star
            className={clsx(
              size === 'lg' ? 'w-10 h-10' : 'w-6 h-6',
              s <= value ? 'text-amber-400 fill-amber-400' : 'text-surface-200 fill-surface-200',
            )}
          />
        </button>
      ))}
    </div>
  )
}

export function QRFeedbackPage() {
  const { restaurantId, tableId, restaurant, table, paths, go } = useQRContext()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [foodRating, setFoodRating] = useState(0)
  const [serviceRating, setServiceRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (foodRating === 0 || serviceRating === 0) {
      addToast({ type: 'warning', title: 'Please rate both', message: 'Give ratings for food and service' })
      return
    }
    setSubmitting(true)
    const order = await getActiveQROrder(restaurantId, tableId)
    if (order) {
      await submitQROrderFeedback(order.id, foodRating, serviceRating, comment)
    }
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-6 animate-scale-in">
          <Heart className="w-14 h-14 text-primary-600 fill-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900">Thank You!</h1>
        <p className="text-surface-500 mt-2 max-w-xs leading-relaxed">
          Your feedback means a lot to us. We're glad you enjoyed your experience at {restaurant.name}.
        </p>
        <div className="flex items-center gap-1 mt-4">
          {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} className={clsx('w-5 h-5', s <= Math.round((foodRating + serviceRating) / 2) ? 'text-amber-400 fill-amber-400' : 'text-surface-200')} />
          ))}
        </div>
        <div className="mt-8 space-y-3 w-full max-w-xs">
          <Button fullWidth onClick={() => navigate(paths.menu)}>
            Order Again
          </Button>
          <Button variant="outline" fullWidth onClick={() => navigate('/dashboard')}>
            <Utensils className="w-4 h-4 mr-1.5" />Back to Admin (Demo)
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-900 text-white px-4 pt-6 pb-10 text-center">
        <Utensils className="w-10 h-10 mx-auto mb-3 opacity-80" />
        <h1 className="text-xl font-bold">How was your experience?</h1>
        <p className="text-sm text-primary-200 mt-1">{restaurant.name} · {table.label}</p>
      </div>

      <div className="flex-1 px-4 py-6 -mt-4 space-y-5">
        {/* Food Rating */}
        <Card className="text-center">
          <p className="text-sm font-semibold text-surface-900 mb-4">Food Rating</p>
          <StarRating value={foodRating} onChange={setFoodRating} />
          <p className="text-xs text-surface-500 mt-3">
            {foodRating === 0 ? 'Tap to rate' :
             foodRating === 1 ? 'Poor' :
             foodRating === 2 ? 'Fair' :
             foodRating === 3 ? 'Good' :
             foodRating === 4 ? 'Very Good' : 'Excellent!'}
          </p>
        </Card>

        {/* Service Rating */}
        <Card className="text-center">
          <p className="text-sm font-semibold text-surface-900 mb-4">Service Rating</p>
          <StarRating value={serviceRating} onChange={setServiceRating} />
          <p className="text-xs text-surface-500 mt-3">
            {serviceRating === 0 ? 'Tap to rate' :
             serviceRating === 1 ? 'Poor' :
             serviceRating === 2 ? 'Fair' :
             serviceRating === 3 ? 'Good' :
             serviceRating === 4 ? 'Very Good' : 'Excellent!'}
          </p>
        </Card>

        {/* Comment */}
        <Card>
          <p className="text-sm font-semibold text-surface-900 mb-3">Additional Comments</p>
          <Textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Tell us about your experience..."
            rows={4}
          />
        </Card>

        <Button fullWidth size="lg" loading={submitting} onClick={handleSubmit}>
          Submit Feedback
        </Button>

        <button
          onClick={() => go.menu()}
          className="w-full text-center text-sm text-surface-500 hover:text-surface-700 py-2"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
