import { lazy, type LazyExoticComponent } from "react"

// Tarmoq muammosi bo'lganda sahifani qayta yuklash uchun
export function lazyWithRetry<T extends React.ComponentType<any>>(
  fn: () => Promise<{ default: T }>,
  retries = 3,
): LazyExoticComponent<T> {
  return lazy(async () => {
    let attempt = 0

    while (true) {
      try {
        return await fn()
      } catch (error) {
        if (attempt >= retries) {
          throw error
        }

        attempt += 1
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }
  })
}
