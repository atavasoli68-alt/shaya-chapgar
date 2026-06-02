'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/ui/ChatWidget';
import BlogCard from '@/components/blog/BlogCard';
import { Clock, Eye, ChevronLeft, Calendar, User, Tag, Share2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function BlogPostPage() {
  const { slug } = useParams() as { slug: string };
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/posts?slug=${slug}`)
      .then(r => r.json())
      .then(d => {
        // find by slug from list
        if (d.posts?.length) setData({ post: d.posts[0], related: [] });
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Proper single post fetch
    fetch(`/api/blog/posts/by-slug/${slug}`)
      .then(r => r.json())
      .then(d => { if (!d.error) { setData(d); setLoading(false); } })
      .catch(() => {});
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: data?.post?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('لینک کپی شد');
    }
  };

  if (loading) return (
    <>
      <Header />
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin" style={{ width: 40, height: 40, border: '4px solid #1e3a6e', borderTopColor: 'transparent', borderRadius: '50%' }} />
      </div>
    </>
  );

  const post = data?.post;
  const related = data?.related || [];

  if (!post) return (
    <>
      <Header />
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ fontSize: 56 }}>😔</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#374151' }}>مقاله یافت نشد</h2>
        <Link href="/blog" className="btn-primary">بازگشت به وبلاگ</Link>
      </div>
      <Footer />
    </>
  );

  const readTime = Math.max(1, Math.ceil((post.content?.length || 0) / 1200));

  return (
    <>
      <Header />
      <main style={{ background: '#f8fafc', minHeight: '100vh' }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,#0e1c38,#1e3a6e)', padding: '48px 24px 64px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6b8bc0', marginBottom: 20 }}>
              <Link href="/" style={{ color: '#6b8bc0', textDecoration: 'none' }}>خانه</Link>
              <ChevronLeft size={14} />
              <Link href="/blog" style={{ color: '#6b8bc0', textDecoration: 'none' }}>وبلاگ</Link>
              <ChevronLeft size={14} />
              {post.category && (
                <>
                  <Link href={`/blog?category=${post.category.slug}`} style={{ color: '#6b8bc0', textDecoration: 'none' }}>{post.category.name}</Link>
                  <ChevronLeft size={14} />
                </>
              )}
              <span style={{ color: '#a5b4d4' }}>{post.title}</span>
            </div>

            {post.category && (
              <span style={{ display: 'inline-block', background: post.category.color || '#f5a623', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 8, marginBottom: 14 }}>
                {post.category.name}
              </span>
            )}

            <h1 style={{ color: '#fff', fontSize: 'clamp(22px,4vw,34px)', fontWeight: 900, lineHeight: 1.4, marginBottom: 16 }}>
              {post.title}
            </h1>

            {post.excerpt && (
              <p style={{ color: '#a5b4d4', fontSize: 15, lineHeight: 1.9, marginBottom: 20 }}>{post.excerpt}</p>
            )}

            {/* Meta */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, fontSize: 13, color: '#8ba3cc' }}>
              {post.author?.name && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 28, height: 28, background: '#f5a623', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>
                    {post.author.name.charAt(0)}
                  </div>
                  <span>{post.author.name}</span>
                </div>
              )}
              {post.publishedAt && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Calendar size={14} />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Clock size={14} />
                <span>{readTime} دقیقه مطالعه</span>
              </div>
              {post.viewCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Eye size={14} />
                  <span>{post.viewCount} بازدید</span>
                </div>
              )}
              <button onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: '#8ba3cc', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
                <Share2 size={14} />
                <span>اشتراک‌گذاری</span>
              </button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, marginTop: -24 }}>
            {/* Main Content */}
            <div>
              {/* Cover Image */}
              {post.coverImage && (
                <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 28, boxShadow: '0 8px 40px rgba(0,0,0,.12)' }}>
                  <img src={post.coverImage} alt={post.title} style={{ width: '100%', maxHeight: 420, objectFit: 'cover' }} />
                </div>
              )}

              {/* Article Content */}
              <div className="card" style={{ padding: '36px 40px' }}>
                <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }}
                  style={{ color: '#374151', lineHeight: 2, fontSize: 15 }} />
              </div>

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="card" style={{ padding: '20px 24px', marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <Tag size={16} style={{ color: '#9ca3af', flexShrink: 0 }} />
                  {post.tags.map((tag: string) => (
                    <Link key={tag} href={`/blog?tag=${tag}`}
                      style={{ background: '#f3f4f6', color: '#4b5563', fontSize: 12, padding: '4px 12px', borderRadius: 20, textDecoration: 'none', fontWeight: 500, transition: 'all .2s' }}>
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Related */}
              {related.length > 0 && (
                <div style={{ marginTop: 40 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: '#162b54', marginBottom: 20 }}>مقالات مرتبط</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
                    {related.map((r: any) => <BlogCard key={r.id} post={r} />)}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div style={{ marginTop: 0 }}>
              <div style={{ position: 'sticky', top: 90, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* About box */}
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#162b54', marginBottom: 14 }}>درباره شایا چاپگر</div>
                  <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.9 }}>
                    ارائه‌دهنده تخصصی انواع پرینتر، کپی‌مشین و اسکنر با بیش از ۱۵ سال سابقه
                  </p>
                  <Link href="/forms/consultation"
                    style={{ display: 'block', background: '#1e3a6e', color: '#fff', textAlign: 'center', padding: '10px', borderRadius: 12, marginTop: 14, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                    مشاوره رایگان
                  </Link>
                </div>

                {/* Share */}
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#162b54', marginBottom: 14 }}>اشتراک‌گذاری</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { label: 'تلگرام', bg: '#0088cc', href: `https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}` },
                      { label: 'واتساپ', bg: '#25d366', href: `https://wa.me/?text=${encodeURIComponent(post.title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}` },
                    ].map(s => (
                      <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                        style={{ flex: 1, background: s.bg, color: '#fff', textAlign: 'center', padding: '8px', borderRadius: 10, textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div style={{ background: 'linear-gradient(135deg,#1e3a6e,#264d88)', borderRadius: 16, padding: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 8 }}>🔧 نیاز به تعمیر دارید؟</div>
                  <p style={{ fontSize: 12, color: '#a5b4d4', lineHeight: 1.8, marginBottom: 14 }}>تکنسین‌های ما در محل شما حاضرند</p>
                  <Link href="/forms/repair"
                    style={{ display: 'block', background: '#f5a623', color: '#fff', textAlign: 'center', padding: '10px', borderRadius: 12, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                    ثبت درخواست تعمیر
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ChatWidget />

      <style>{`
        .blog-content h1,.blog-content h2,.blog-content h3{color:#162b54;font-weight:800;margin:28px 0 12px;line-height:1.4}
        .blog-content h1{font-size:26px}.blog-content h2{font-size:22px;padding-bottom:8px;border-bottom:2px solid #eef2f7}
        .blog-content h3{font-size:18px}
        .blog-content p{margin-bottom:18px}
        .blog-content ul,.blog-content ol{padding-right:24px;margin-bottom:18px}
        .blog-content li{margin-bottom:8px;line-height:1.9}
        .blog-content blockquote{border-right:4px solid #f5a623;background:#fef9ee;padding:16px 20px;border-radius:0 12px 12px 0;margin:24px 0;color:#6b7280;font-style:italic}
        .blog-content img{max-width:100%;border-radius:12px;margin:20px 0;box-shadow:0 4px 20px rgba(0,0,0,.1)}
        .blog-content a{color:#1e3a6e;font-weight:600;text-decoration:underline}
        .blog-content code{background:#f3f4f6;padding:2px 8px;border-radius:6px;font-size:13px;font-family:monospace}
        .blog-content pre{background:#1a1a2e;color:#e2e8f0;padding:20px;border-radius:12px;overflow-x:auto;margin:20px 0;font-size:13px}
        .blog-content table{width:100%;border-collapse:collapse;margin:20px 0;border-radius:12px;overflow:hidden}
        .blog-content th{background:#1e3a6e;color:#fff;padding:12px 16px;text-align:right;font-weight:700}
        .blog-content td{padding:10px 16px;border-bottom:1px solid #f3f4f6}
        .blog-content tr:hover td{background:#f9fafb}
        .blog-content strong{color:#162b54;font-weight:700}
        .blog-content hr{border:none;border-top:2px solid #eef2f7;margin:32px 0}
        @media(max-width:768px){
          .blog-content{padding:20px!important}
          div[style*="grid-template-columns: 1fr 280px"]{grid-template-columns:1fr!important}
          div[style*="position: sticky"]{position:static!important}
        }
      `}</style>
    </>
  );
}
