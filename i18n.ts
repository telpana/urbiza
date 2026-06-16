export const idiomas = ['es', 'en', 'fr'] as const
export type Idioma = typeof idiomas[number]

export const t = {
  es: {
    nav: { comprar: 'Comprar', alquilar: 'Alquilar', obraNueva: 'Obra nueva', entrar: 'Entrar', publicar: '+ Publicar gratis' },
    hero: { titulo: 'Encuentra tu próxima propiedad en República Dominicana', subtitulo: 'El portal inmobiliario líder del Caribe', buscar: 'Buscar', placeholder: 'Municipio, sector, barrio...' },
    idioma: { es: 'Español', en: 'English', fr: 'Français' }
  },
  en: {
    nav: { comprar: 'Buy', alquilar: 'Rent', obraNueva: 'New homes', entrar: 'Sign in', publicar: '+ List for free' },
    hero: { titulo: 'Find your next property in the Dominican Republic', subtitulo: 'The leading real estate portal in the Caribbean', buscar: 'Search', placeholder: 'City, neighborhood, area...' },
    idioma: { es: 'Español', en: 'English', fr: 'Français' }
  },
  fr: {
    nav: { comprar: 'Acheter', alquilar: 'Louer', obraNueva: 'Neuf', entrar: 'Connexion', publicar: '+ Publier gratuitement' },
    hero: { titulo: 'Trouvez votre prochaine propriété en République Dominicaine', subtitulo: 'Le premier portail immobilier des Caraïbes', buscar: 'Rechercher', placeholder: 'Ville, quartier, zone...' },
    idioma: { es: 'Español', en: 'English', fr: 'Français' }
  }
}