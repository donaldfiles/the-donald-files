import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { hrefFor, type Article } from '../content/articles'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  post: Pick<Article, 'slug' | 'kind'>
  children?: ReactNode
}

/** Clips are static pages at /trump-videos/<slug>/ (outside the SPA), so they get a full page load. */
export function PostLink({ post, children, ...rest }: Props) {
  if (post.kind === 'clip') {
    return (
      <a href={hrefFor(post)} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link to={hrefFor(post)} {...rest}>
      {children}
    </Link>
  )
}
