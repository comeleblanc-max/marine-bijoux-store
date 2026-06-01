/**
 * Émet une balise <script type="application/ld+json"> avec un payload
 * sérialisé et durci contre l'injection (les avis clients peuvent contenir
 * `</script>` ou des chevrons). On échappe `<` en `<`.
 *
 * Utilisé pour le balisage Schema.org sur fiches produits, page Avis, accueil.
 */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return (
    <script
      type="application/ld+json"
      // dangerouslySetInnerHTML est nécessaire pour insérer du JSON pur dans
      // un <script> ; le payload est échappé juste au-dessus.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
