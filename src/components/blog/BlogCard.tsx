'use client';
import Link from 'next/link';
import { Clock, Eye, Tag } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function BlogCard({ post, featured = false }: { post: any; featured?: boolean }) {
  const readTime = Math.max(1, Math.ceil((post.content?.length || 0) / 1200));

  return (
    <Link href={`/blog/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
      <article className="card" style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}
        onMouseEnter={e => { (e.currentTarget as any).style.transform = 'translateY(-4px)'; }}
        onMouseLeave={e => { (e.currentTarget as any).style.transform = 'translateY(0)'; }}>
        {/* Cover Image */}
        <div style={{ position: 'relative', aspectRatio: featured ? '2/1' : '16/9', overflow: 'hidden', background: 'linear-gradient(135deg,#eef2f7,#d5e0ee)', flexShrink: 0 }}>
          {post.coverImage ? (
            <img src={post.coverImage} alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }}
              onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)'; }}
              onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }}>
              📄
            </div>
          )}
          {post.category && (
            <span style={{ position: 'absolute', top: 12, right: 12, background: post.category.color || '#1e3a6e', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>
              {post.category.name}
            </span>
          )}
          {post.isFeatured && (
            <span style={{ position: 'absolute', top: 12, left: 12, background: '#f5a623', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 8 }}>
              ⭐ ویژه
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '18px 18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Tags */}
          {post.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              {post.tags.slice(0, 3).map((tag: string) => (
                <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#f3f4f6', color: '#6b7280', fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <h3 style={{ fontSize: featured ? 18 : 15, fontWeight: 800, color: '#162b54', lineHeight: 1.5, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {post.title}
          </h3>

          {post.excerpt && (
            <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1, marginBottom: 16 }}>
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: '#9ca3af', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #f3f4f6' }}>
            {post.author?.name && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 22, height: 22, background: '#1e3a6e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700 }}>
                  {post.author.name.charAt(0)}
                </div>
                <span>{post.author.name}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} />
              <span>{readTime} دقیقه مطالعه</span>
            </div>
            {post.viewCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Eye size={12} />
                <span>{post.viewCount}</span>
              </div>
            )}
            <span style={{ marginRight: 'auto', fontSize: 11 }}>
              {post.publishedAt ? formatDate(post.publishedAt) : ''}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
