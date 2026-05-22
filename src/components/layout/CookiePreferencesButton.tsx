'use client'

export function CookiePreferencesButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event('open-cookie-preferences'))}
      className="text-gray-400 hover:text-white text-xs transition-colors"
    >
      Préférences cookies
    </button>
  )
}
