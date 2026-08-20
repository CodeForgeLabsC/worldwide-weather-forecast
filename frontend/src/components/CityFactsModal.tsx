import { useEffect } from 'react'
import { X, Users, ExternalLink, Loader2, Sparkles } from 'lucide-react'
import { useCityFacts } from '@/hooks/useCityFacts'
import { GlassPanel } from './GlassPanel'
import type { LocationSearchResult } from '@/types/location'

interface CityFactsModalProps {
  target: LocationSearchResult | null
  onClose: () => void
}

/**
 * "Alert"-style popup shown when a city marker is clicked. Only shows real, sourced data — a
 * population figure from the geocoding provider and an encyclopedic summary from Wikipedia — no
 * invented restaurant/landmark lists (see docs/architecture.md for why).
 */
export function CityFactsModal({ target, onClose }: CityFactsModalProps) {
  const { data, isPending, isError } = useCityFacts(target?.name ?? null, target?.countryCode ?? null)

  useEffect(() => {
    if (!target) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [target, onClose])

  if (!target) {
    return null
  }

  return (
    <div
      // Leaflet's own panes/controls use z-index up to 800 and share this stacking context
      // (nothing in the map's ancestor chain isolates one) — this has to clear that.
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-[backdrop-fade-in_0.2s_ease-out]"
      onClick={onClose}
      role="presentation"
    >
      <GlassPanel
        className="max-h-[85vh] w-full max-w-md overflow-y-auto p-6 animate-[modal-pop-in_0.25s_cubic-bezier(0.16,1,0.3,1)]"
        role="dialog"
        aria-modal="true"
        aria-label={`About ${target.name}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-strong/10">
              <Sparkles className="size-4 text-accent-strong" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-ink">{target.name}</h2>
              <p className="text-sm text-ink-muted">{target.country}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-1.5 text-ink-faint transition-colors hover:bg-slate-900/5 hover:text-ink"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {isPending ? (
          <div className="mt-6 flex items-center gap-2 text-sm text-ink-muted">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Loading city facts...
          </div>
        ) : isError ? (
          <p className="mt-6 text-sm text-amber-600">Couldn&apos;t load facts for this city right now.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {data?.thumbnailUrl && (
              <img
                src={data.thumbnailUrl}
                alt={`Photo of ${target.name}`}
                className="h-40 w-full rounded-xl object-cover"
              />
            )}

            <div className="flex items-center gap-2 text-sm text-ink">
              <Users className="size-4 text-accent-strong" aria-hidden="true" />
              <span>
                {data?.population != null
                  ? `${data.population.toLocaleString()} people`
                  : 'Population data unavailable'}
              </span>
            </div>

            {data?.summary ? (
              <p className="text-sm leading-relaxed text-ink-muted">{data.summary}</p>
            ) : (
              <p className="text-sm text-ink-muted">No encyclopedia summary is available for this city yet.</p>
            )}

            {data?.sourceUrl && (
              <a
                href={data.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-strong hover:underline"
              >
                Read more on Wikipedia
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        )}
      </GlassPanel>
    </div>
  )
}
