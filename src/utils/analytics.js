import posthog from "posthog-js"

// No-op unless VITE_POSTHOG_KEY is set at build time
const key = import.meta.env.VITE_POSTHOG_KEY

if (key) {
    posthog.init(key, {
        api_host: "https://eu.i.posthog.com",
        persistence: "memory", // cookieless: no consent banner needed
        person_profiles: "identified_only",
        autocapture: true,
        // Hash routing: pageviews are sent from Router on every route change
        capture_pageview: false,
        disable_session_recording: true,
    })
}

export function capturePageview () {
    if (key) posthog.capture("$pageview")
}
