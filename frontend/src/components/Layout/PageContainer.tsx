import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

function PageContainer({ children }: Props) {
  return <main className="page-container">{children}</main>
}

export default PageContainer
