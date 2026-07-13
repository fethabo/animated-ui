import { Navigate, useParams, type RouteObject } from 'react-router-dom'
import { Layout } from './layout/Layout'
import { HomePage } from './pages/HomePage'
import { ComponentPage } from './pages/ComponentPage'
import { isLang, preferredLang } from './i18n/lang'

/** Redirige `/` (o un idioma inválido) al idioma preferido conservando el resto de la ruta. */
function LangRedirect() {
  const { '*': rest } = useParams()
  return <Navigate to={`/${preferredLang()}${rest ? `/${rest}` : ''}`} replace />
}

/** Valida el segmento de idioma antes de renderizar el layout. */
function LangGate() {
  const { lang } = useParams()
  if (!isLang(lang)) return <LangRedirect />
  return <Layout />
}

export const routes: RouteObject[] = [
  { path: '/', element: <LangRedirect /> },
  {
    path: '/:lang',
    element: <LangGate />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'components/:slug', element: <ComponentPage /> },
    ],
  },
  { path: '*', element: <LangRedirect /> },
]
