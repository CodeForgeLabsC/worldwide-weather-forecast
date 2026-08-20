import { API_BASE_URL } from '@/lib/env'

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface ProblemDetails {
  title?: string
  detail?: string
  status?: number
}

type QueryParams = Record<string, string | number | undefined>

export async function apiGet<T>(path: string, params: QueryParams = {}, signal?: AbortSignal): Promise<T> {
  const url = new URL(path, API_BASE_URL)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  }

  let response: Response
  try {
    response = await fetch(url, { signal })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    throw new ApiError('Unable to reach the server. Check your connection.', 0)
  }

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}.`
    try {
      const problem = (await response.json()) as ProblemDetails
      detail = problem.detail ?? problem.title ?? detail
    } catch {
      // Response body wasn't JSON — fall back to the generic message above.
    }
    throw new ApiError(detail, response.status)
  }

  return (await response.json()) as T
}
