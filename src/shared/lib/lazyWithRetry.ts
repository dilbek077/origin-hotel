import { lazy } from "react"

// Tarmoq muammosi bo'lganda sahifani qayta yuklash uchun
export function lazyWithRetry(fn: () => Promise<any>, retries = 3) {
  return lazy(() =>
    fn().catch((error) => {
      if (retries > 0) {
        return new Promise((resolve) => setTimeout(resolve, 500)).then(() =>
          lazyWithRetry(fn, retries - 1)()
        )
      }
      throw error
    })
  )
}
