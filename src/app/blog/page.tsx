'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/ui/ChatWidget';
import BlogCard from '@/components/blog/BlogCard';
import { Search } from 'lucide-react';

function BlogContent() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    fetch('/api/blog/categories').then(r => r.json()).then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search) p.set('search', search);
    if (category) p.set('category', category);
    p.set('page', String(page));
    fetch(`/api/blog/posts?${p}`)
      .then(r => r.json())
      .then(d => { setPosts(d.posts || []); setTotal(d.total || 0); setTotalPages(d.totalPages || 1); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search, category, page]);

  return (
    <>
      <Header />
      <main className="min-h-screen" style={{ background: '#f8fafc' }}>
        <div style={{ background: 'linear-gradient(135deg,#0e1c38 0%,#1e3a6e 100%)', padding: '56px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,166,35,.15)', border: '1px solid rgba(245,166,35,.3)', color: '#f7ca58', fontSize: 13, padding: '6px 16px', borderRadius: 20, marginBottom: 16 }}>
              📚 مقالات آموزشی
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 12 }}>وبلاگ شایا چاپگر آریا</h1>
            <p style={{ color: '#a5b4d4', fontSize: 15, lineHeight: 1.8 }}>راهنماها، آموزش‌ها و اخبار حوزه تجهیزات اداری</p>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
          {/* Filters */}
          <div className="card" style={{ padding: 16, marginBottom: 28, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="جستجو در مقالات..." className="input-field" style={{ paddingRight: 36 }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[{ id: '', slug: '', name: 'همه', color: '#1e3a6e' }, ...categories].map((cat: any) => (
                <button key={cat.slug} onClick={() => { setCategory(cat.slug); setPage(1); }}
                  style={{ padding: '7px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s',
                    background: category === cat.slug ? cat.color : '#f3f4f6', color: category === cat.slug ? '#fff' : '#4b5563' }}>
                  {cat.name}
                  {cat._count && <span style={{ marginRight: 6, opacity: .7 }}>({cat._count.posts})</span>}
                </button>
              ))}
            </div>
          </div>

          {!loading && <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>{total} مقاله یافت شد</p>}

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
              {[...Array(6)].map((_, i) => <div key={i} style={{ background: '#fff', borderRadius: 16, height: 320 }} className="animate-pulse" />)}
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#374151' }}>مقاله‌ای یافت نشد</h3>
              <p style={{ color: '#6b7280', marginTop: 8 }}>فیلترها را تغییر دهید</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
              {posts.map((post: any) => <BlogCard key={post.id} post={post} />)}
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => { setPage(i + 1); window.scrollTo(0, 0); }}
                  style={{ width: 40, height: 40, borderRadius: 12, fontSize: 14, fontWeight: 600, border: page === i + 1 ? 'none' : '1px solid #e5e7eb', cursor: 'pointer', fontFamily: 'inherit',
                    background: page === i + 1 ? '#1e3a6e' : '#fff', color: page === i + 1 ? '#fff' : '#4b5563', transition: 'all .2s' }}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="animate-spin" style={{ width: 36, height: 36, border: '4px solid #1e3a6e', borderTopColor: 'transparent', borderRadius: '50%' }} /></div>}>
      <BlogContent />
    </Suspense>
  );
}
