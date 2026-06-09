/* Contenu des pages légales & informatives du site.
 * Modèle : chaque page possède un slug, un titre, une intro et des sections. */

export interface ContentSection {
  heading?: string
  body?: string[]
  list?: string[]
}

export interface ContentPage {
  slug: string
  title: string
  intro: string
  updatedAt: string
  sections: ContentSection[]
}

const SOCIETE = 'Marine et la douceur de l\'été'
const EMAIL = 'contact@marineetladouceurdelete.com'

export const CONTENT_PAGES: ContentPage[] = [
  /* ---------------------------------------------------------------- */
  {
    slug: 'livraison',
    title: 'Livraison & expédition',
    intro:
      'Toutes les informations sur l\'expédition de votre commande, les délais et les tarifs.',
    updatedAt: '15 mai 2026',
    sections: [
      {
        heading: 'Délais de préparation',
        body: [
          'Chaque commande est préparée avec soin dans notre atelier sous 2 à 3 jours ouvrés. Vous recevez un email de confirmation dès que votre colis est expédié, accompagné d\'un numéro de suivi.',
        ],
      },
      {
        heading: 'Délais et tarifs de livraison',
        list: [
          'France métropolitaine — Colissimo suivi : 2 à 4 jours ouvrés — 4,90 €',
          'France métropolitaine — Point relais : 2 à 5 jours ouvrés — 3,90 €',
          'Belgique, Luxembourg, Suisse : 4 à 7 jours ouvrés — 8,90 €',
          'Union européenne : 5 à 10 jours ouvrés — 12,90 €',
        ],
      },
      {
        heading: 'Livraison offerte',
        body: [
          'La livraison est entièrement offerte en France métropolitaine pour toute commande d\'un montant égal ou supérieur à 60 €. La réduction s\'applique automatiquement au moment du paiement.',
        ],
      },
      {
        heading: 'Suivi de commande',
        body: [
          'Dès l\'expédition, un lien de suivi vous est transmis par email. Vous pouvez également retrouver l\'état de vos commandes à tout moment depuis votre espace client.',
        ],
      },
      {
        heading: 'Colis perdu ou endommagé',
        body: [
          `En cas de problème lors de la livraison, contactez-nous sous 14 jours à l'adresse ${EMAIL}. Nous trouverons une solution rapidement : renvoi ou remboursement.`,
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: 'remboursement',
    title: 'Politique de remboursement & retours',
    intro:
      'Vous disposez de 14 jours pour changer d\'avis. Les retours sont gratuits et faciles.',
    updatedAt: '15 mai 2026',
    sections: [
      {
        heading: 'Droit de rétractation',
        body: [
          'Conformément à la législation en vigueur, vous disposez d\'un délai de 14 jours à compter de la réception de votre commande pour exercer votre droit de rétractation, sans avoir à justifier de motif.',
        ],
      },
      {
        heading: 'Conditions de retour',
        list: [
          'L\'article doit être non porté, non endommagé et dans son état d\'origine.',
          'L\'emballage et la pochette d\'origine doivent être conservés.',
          'Pour des raisons d\'hygiène, les boucles d\'oreilles ne sont reprises que si leur emballage scellé n\'a pas été ouvert.',
        ],
      },
      {
        heading: 'Comment effectuer un retour',
        body: [
          `Contactez-nous à l'adresse ${EMAIL} en indiquant votre numéro de commande. Nous vous transmettons sous 24 h une étiquette de retour prépayée. Les retours sont gratuits en France métropolitaine.`,
        ],
      },
      {
        heading: 'Remboursement',
        body: [
          'Dès réception et vérification de l\'article retourné, le remboursement est effectué sous 5 à 7 jours ouvrés sur le moyen de paiement utilisé lors de la commande. Vous recevez une confirmation par email.',
        ],
      },
      {
        heading: 'Échanges',
        body: [
          'Vous souhaitez une autre taille ou un autre modèle ? Indiquez-le lors de votre demande de retour : nous préparons l\'échange dès réception de l\'article initial.',
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: 'confidentialite',
    title: 'Politique de confidentialité',
    intro:
      'Nous attachons une grande importance à la protection de vos données personnelles.',
    updatedAt: '15 mai 2026',
    sections: [
      {
        heading: 'Responsable du traitement',
        body: [
          `Les données collectées sur ce site sont traitées par ${SOCIETE}. Pour toute question relative à vos données, écrivez-nous à ${EMAIL}.`,
        ],
      },
      {
        heading: 'Données collectées',
        list: [
          'Identité et coordonnées : nom, prénom, adresse e-mail, adresse postale, téléphone.',
          'Données de commande : historique d\'achats, montants, moyens de paiement (jamais le numéro complet de carte).',
          'Données de navigation : pages consultées, cookies, adresse IP.',
        ],
      },
      {
        heading: 'Finalités du traitement',
        list: [
          'Traiter et expédier vos commandes.',
          'Gérer votre compte client et le service après-vente.',
          'Vous adresser, avec votre accord, notre newsletter.',
          'Améliorer notre site et nos services.',
        ],
      },
      {
        heading: 'Durée de conservation',
        body: [
          'Vos données sont conservées le temps nécessaire à la gestion de la relation commerciale, puis archivées conformément aux obligations légales (notamment comptables).',
        ],
      },
      {
        heading: 'Vos droits',
        body: [
          `Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et d'opposition concernant vos données. Pour exercer ces droits, contactez-nous à ${EMAIL}.`,
        ],
      },
      {
        heading: 'Sécurité',
        body: [
          'Toutes les transactions sont sécurisées par cryptage SSL. Les paiements sont gérés par des prestataires certifiés et nous n\'avons jamais accès à vos données bancaires complètes.',
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: 'cgv',
    title: 'Conditions générales de vente',
    intro:
      'Les présentes conditions régissent les ventes réalisées sur le site Marine et la douceur de l\'été.',
    updatedAt: '15 mai 2026',
    sections: [
      {
        heading: 'Article 1 — Objet',
        body: [
          `Les présentes conditions générales de vente régissent les relations contractuelles entre ${SOCIETE} et tout client effectuant un achat sur le site. Toute commande implique l'acceptation pleine et entière des présentes conditions.`,
        ],
      },
      {
        heading: 'Article 2 — Produits',
        body: [
          'Les produits proposés sont décrits et présentés avec la plus grande exactitude possible. De légères variations de teinte peuvent apparaître selon les écrans. Nos bijoux étant fabriqués avec soin, chaque pièce peut présenter de subtiles singularités.',
        ],
      },
      {
        heading: 'Article 3 — Prix',
        body: [
          'Les prix sont indiqués en euros, toutes taxes comprises. Les frais de livraison sont précisés avant la validation de la commande. Nous nous réservons le droit de modifier nos prix à tout moment, le prix applicable étant celui en vigueur au moment de la commande.',
        ],
      },
      {
        heading: 'Article 4 — Commande',
        body: [
          'La commande est validée après acceptation du paiement. Un email récapitulatif vous est adressé. Nous nous réservons le droit d\'annuler toute commande en cas de litige de paiement ou de rupture de stock.',
        ],
      },
      {
        heading: 'Article 5 — Paiement',
        body: [
          'Le règlement s\'effectue en ligne par carte bancaire (Visa, Mastercard, American Express, Carte Bleue) ou via Klarna. Toutes les transactions sont sécurisées.',
        ],
      },
      {
        heading: 'Article 6 — Livraison & rétractation',
        body: [
          'Les modalités de livraison et le droit de rétractation sont détaillés dans les pages dédiées « Livraison & expédition » et « Politique de remboursement & retours ».',
        ],
      },
      {
        heading: 'Article 7 — Garantie',
        body: [
          'Tous nos produits bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés.',
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: 'mentions-legales',
    title: 'Mentions légales',
    intro: 'Informations légales relatives au site et à son éditeur.',
    updatedAt: '15 mai 2026',
    sections: [
      {
        heading: 'Éditeur du site',
        body: [
          `Le site est édité par ${SOCIETE}, micro-entreprise. Contact : ${EMAIL}.`,
        ],
      },
      {
        heading: 'Directeur de la publication',
        body: ['La représentante légale de l\'entreprise.'],
      },
      {
        heading: 'Hébergement',
        body: [
          'Le site est hébergé par un prestataire d\'hébergement cloud assurant la disponibilité et la sécurité des données.',
        ],
      },
      {
        heading: 'Propriété intellectuelle',
        body: [
          'L\'ensemble des contenus présents sur le site (textes, visuels, logo, photographies) est protégé par le droit de la propriété intellectuelle. Toute reproduction sans autorisation est interdite.',
        ],
      },
      {
        heading: 'Médiation de la consommation',
        body: [
          'Conformément à la réglementation, le client peut recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d\'un litige.',
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: 'conditions-utilisation',
    title: 'Conditions d\'utilisation',
    intro: 'Règles d\'utilisation du site Marine et la douceur de l\'été.',
    updatedAt: '15 mai 2026',
    sections: [
      {
        heading: 'Acceptation',
        body: [
          'En naviguant sur ce site, vous acceptez les présentes conditions d\'utilisation. Si vous n\'y adhérez pas, nous vous invitons à ne pas utiliser le site.',
        ],
      },
      {
        heading: 'Utilisation du site',
        list: [
          'Le site est destiné à un usage personnel et non commercial.',
          'Vous vous engagez à fournir des informations exactes lors de vos commandes.',
          'Toute tentative de nuire au bon fonctionnement du site est interdite.',
        ],
      },
      {
        heading: 'Compte client',
        body: [
          'Vous êtes responsable de la confidentialité de vos identifiants. Toute activité réalisée depuis votre compte est réputée effectuée par vous.',
        ],
      },
      {
        heading: 'Disponibilité',
        body: [
          'Nous nous efforçons d\'assurer la disponibilité du site 24h/24 mais ne pouvons être tenus responsables d\'une interruption liée à une maintenance ou à un cas de force majeure.',
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: 'entretien',
    title: 'Entretien de vos bijoux',
    intro:
      'Quelques gestes simples pour préserver l\'éclat de vos bijoux saison après saison.',
    updatedAt: '15 mai 2026',
    sections: [
      {
        heading: 'Les bons réflexes au quotidien',
        list: [
          'Mettez vos bijoux en dernier, après le parfum, la crème et le maquillage.',
          'Retirez-les avant la douche, la piscine ou une séance de sport.',
          'Évitez le contact prolongé avec l\'eau salée et la crème solaire.',
        ],
      },
      {
        heading: 'Nettoyage',
        body: [
          'Nettoyez délicatement vos bijoux avec un chiffon doux et sec. Pour les bijoux argentés, un chiffon microfibre suffit à raviver l\'éclat. N\'utilisez jamais de produits abrasifs.',
        ],
      },
      {
        heading: 'Rangement',
        body: [
          'Conservez chaque bijou dans sa pochette individuelle, à l\'abri de la lumière et de l\'humidité. Ranger les pièces séparément évite les rayures et les nœuds de chaînes.',
        ],
      },
      {
        heading: 'Nos matières',
        list: [
          'Acier inoxydable doré : résistant à l\'eau, idéal au quotidien.',
          'Acier inoxydable argenté : éclat lumineux qui ne ternit pas.',
          'Nacre et perles naturelles : fragiles, à manipuler avec douceur.',
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: 'cookies',
    title: 'Politique de cookies',
    intro:
      'Comment nous utilisons les cookies et comment gérer vos préférences.',
    updatedAt: '15 mai 2026',
    sections: [
      {
        heading: 'Qu\'est-ce qu\'un cookie ?',
        body: [
          'Un cookie est un petit fichier déposé sur votre appareil lors de la visite d\'un site. Il permet de mémoriser des informations relatives à votre navigation.',
        ],
      },
      {
        heading: 'Les cookies que nous utilisons',
        list: [
          'Cookies essentiels : nécessaires au fonctionnement du site (panier, session). Toujours actifs.',
          'Cookies de mesure d\'audience : nous aident à comprendre l\'usage du site de façon anonyme.',
          'Cookies marketing : permettent de vous proposer des contenus pertinents.',
        ],
      },
      {
        heading: 'Gérer vos préférences',
        body: [
          'Vous pouvez à tout moment modifier vos choix via le bandeau de consentement affiché lors de votre première visite, ou en réinitialisant les cookies depuis les réglages de votre navigateur.',
        ],
      },
    ],
  },
]

export function getContentPage(slug: string): ContentPage | undefined {
  return CONTENT_PAGES.find((p) => p.slug === slug)
}
