'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { t, Idioma } from './i18n'

type IdiomaContextType = {
  idioma: Idioma
  setIdioma: (i: Idioma) => void
  tr: typeof t['es']
}

const IdiomaContext = createContext<IdiomaContextType>({
  idioma: 'es',
  setIdioma: () => {},
  tr: t.es
})

export function IdiomaProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdiomaState] = useState<Idioma>('es')

  useEffect(() => {
    // Detectar idioma del navegador automáticamente
    const guardado = localStorage.getItem('habitade-idioma') as Idioma
    if (guardado && ['es', 'en', 'fr'].includes(guardado)) {
      setIdiomaState(guardado)
      return
    }
    const navegador = navigator.language.slice(0, 2)
    if (navegador === 'en') setIdiomaState('en')
    else if (navegador === 'fr') setIdiomaState('fr')
    else setIdiomaState('es')
  }, [])

  const setIdioma = (i: Idioma) => {
    setIdiomaState(i)
    localStorage.setItem('habitade-idioma', i)
  }

  return (
    <IdiomaContext.Provider value={{ idioma, setIdioma, tr: t[idioma] }}>
      {children}
    </IdiomaContext.Provider>
  )
}

export function useIdioma() {
  return useContext(IdiomaContext)
}