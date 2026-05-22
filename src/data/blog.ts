export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readingTime: string
  emoji: string
  content: { heading?: string; paragraphs: string[] }[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'comment-entretenir-ses-bijoux-en-ete',
    title: 'Comment entretenir ses bijoux cet été',
    excerpt:
      'Soleil, sel, crème solaire... L\'été met vos bijoux à rude épreuve. Voici nos conseils pour préserver leur éclat.',
    category: 'Conseils',
    date: '12 mai 2026',
    readingTime: '4 min',
    emoji: '☀️',
    content: [
      {
        paragraphs: [
          'L\'été est la saison où l\'on porte le plus nos bijoux — et paradoxalement celle où ils sont le plus exposés. Entre la baignade, la crème solaire et la transpiration, quelques précautions simples suffisent à préserver leur beauté.',
        ],
      },
      {
        heading: 'Avant la plage : on retire',
        paragraphs: [
          'L\'eau de mer et le chlore sont les pires ennemis de vos bijoux, en particulier ceux en argent et ceux ornés de perles ou de nacre. Le réflexe à adopter : retirer ses bijoux avant chaque baignade et les ranger dans une petite pochette.',
          'Nos pièces en acier inoxydable doré tolèrent mieux l\'eau, mais un rinçage à l\'eau claire après une journée à la plage reste recommandé.',
        ],
      },
      {
        heading: 'La crème solaire, en dernier',
        paragraphs: [
          'La crème solaire peut ternir le métal et encrasser les chaînes fines. Appliquez toujours votre crème avant de mettre vos bijoux, et laissez-la bien pénétrer.',
        ],
      },
      {
        heading: 'Le nettoyage de fin de journée',
        paragraphs: [
          'Un simple passage avec un chiffon doux et sec suffit à enlever les traces de sel et de sébum. Pour l\'argent 925, un chiffon spécial argenterie ravivera l\'éclat en quelques gestes.',
        ],
      },
    ],
  },
  {
    slug: 'tendances-bijoux-ete-2026',
    title: 'Les tendances bijoux de l\'été 2026',
    excerpt:
      'Coquillages, dorés chauds, superpositions délicates : tour d\'horizon des tendances qui font l\'été.',
    category: 'Tendances',
    date: '5 mai 2026',
    readingTime: '5 min',
    emoji: '🐚',
    content: [
      {
        paragraphs: [
          'Chaque été a son vocabulaire de bijoux. Celui de 2026 puise dans la mer, la lumière et une certaine idée de la liberté. Voici les trois grandes tendances à adopter.',
        ],
      },
      {
        heading: '1. L\'esprit balnéaire',
        paragraphs: [
          'Coquillages, étoiles de mer, perles d\'eau douce : les motifs marins reviennent en force, traités avec finesse et délicatesse. On les porte près du corps, comme un souvenir de vacances que l\'on garderait toute l\'année.',
        ],
      },
      {
        heading: '2. Les dorés chauds',
        paragraphs: [
          'Exit l\'or froid et clinquant : place aux dorés chauds, légèrement cuivrés, qui rappellent la lumière de fin de journée. Ils flattent tous les teints, surtout les peaux hâlées.',
        ],
      },
      {
        heading: '3. L\'art de la superposition',
        paragraphs: [
          'On ne choisit plus : on superpose. Plusieurs colliers de longueurs différentes, des bracelets qui s\'accumulent... La règle ? Mélanger les épaisseurs tout en gardant une cohérence de teinte.',
        ],
      },
    ],
  },
  {
    slug: 'choisir-la-bonne-longueur-de-collier',
    title: 'Choisir la bonne longueur de collier',
    excerpt:
      'Ras-de-cou, sautoir, longueur princesse... Un petit guide pour trouver la longueur qui vous va.',
    category: 'Guide',
    date: '28 avril 2026',
    readingTime: '3 min',
    emoji: '📿',
    content: [
      {
        paragraphs: [
          'La longueur d\'un collier change tout : elle met en valeur le décolleté, équilibre la silhouette et s\'accorde — ou non — avec votre tenue. Voici comment choisir sans se tromper.',
        ],
      },
      {
        heading: 'Les longueurs de référence',
        paragraphs: [
          '38–40 cm — le ras-de-cou : il souligne la base du cou, idéal sur un col bateau ou une encolure dégagée.',
          '42–45 cm — la longueur princesse : la plus polyvalente, elle tombe juste sous la clavicule et se porte avec presque tout.',
          '50–60 cm — le sautoir : il allonge la silhouette et fonctionne à merveille en superposition.',
        ],
      },
      {
        heading: 'Notre conseil',
        paragraphs: [
          'En cas de doute, optez pour la longueur princesse (42–45 cm) : c\'est la valeur sûre. Et pour celles qui aiment varier, plusieurs de nos colliers sont proposés en deux longueurs ajustables.',
        ],
      },
    ],
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}
