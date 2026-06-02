'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BlogCard from '@/components/blog/BlogCard';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function BlogSection() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog/posts?limit=3')
      .then(r => r.json())
      .then(d => { setPosts(d.posts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section style={{ padding: '60px 24px', background: '#fff', borderTop: '1px solid #f3f4f6' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#eef2f7', color: '#1e3a6e', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 20, marginBottom: 10 }}>
              <BookOpen size={13} />
              آخرین مطالب
            </div>
            <h2 style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, color: '#162b54', marginBottom: 6 }}>
              وبلاگ و مقالات آموزشی
            </h2>
            <p style={{ color: '#6b7280', fontSize: 14 }}>راهنماها و نکات کاربردی در حوزه تجهیزات اداری</p>
          </div>
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#1e3a6e', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            مشاهده همه مقالات <ArrowLeft size={15} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ background: '#f3f4f6', borderRadius: 16, height: 300 }} className="animate-pulse" />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
            {posts.map(post => <BlogCard key={post.id} post={post} />)}
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div style={{ marginTop: 36, background: 'linear-gradient(135deg,#0e1c38,#1e3a6e)', borderRadius: 20, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ color: '#f5a623', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>📚 محتوای آموزشی رایگان</div>
              <p style={{ color: '#a5b4d4', fontSize: 14, lineHeight: 1.7 }}>راهنمای انتخاب پرینتر، نگهداری و رفع مشکلات رایج</p>
            </div>
            <Link href="/blog" style={{ background: '#f5a623', color: '#fff', padding: '11px 24px', borderRadius: 14, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              مشاهده همه مقالات ←
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
