import { lazy, type LazyExoticComponent } from "react"

const isChunkLoadError = (error: unknown) =>
  error instanceof Error &&
  /failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed|loading chunk/i.test(
    error.message,
  )

// Tarmoq muammosi bo'lganda sahifani qayta yuklash uchun
export function lazyWithRetry<T extends React.ComponentType>(
  fn: () => Promise<{ default: T }>,
  retries = 3,
): LazyExoticComponent<T> {
  return lazy(async () => {
    let attempt = 0

    while (true) {
      let module: { default: T }
      try {
        module = await fn()
      } catch (error) {
        if (attempt >= retries) {
          if (isChunkLoadError(error) && sessionStorage.getItem("origin-hotel:chunk-reload") !== "1") {
            sessionStorage.setItem("origin-hotel:chunk-reload", "1")
            window.location.reload()
          }
          throw error
        }

        attempt += 1
        await new Promise((resolve) => setTimeout(resolve, 500))
        continue
      }

      sessionStorage.removeItem("origin-hotel:chunk-reload")
      return module
    }
  })
}
