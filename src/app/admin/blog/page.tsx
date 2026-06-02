'use client';
import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, X, Search, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

const EMPTY = { title:'', slug:'', excerpt:'', content:'', coverImage:'', categoryId:'', tags:'', isPublished:false, isFeatured:false };

function TB({ label, onClick }: { label:string; onClick:()=>void }) {
  return (
    <button type="button" onClick={onClick} title={label}
      style={{padding:'5px 9px',borderRadius:7,border:'none',cursor:'pointer',fontFamily:'inherit',fontSize:13,fontWeight:600,background:'#f3f4f6',color:'#374151',transition:'all .15s'}}
      onMouseEnter={e=>(e.currentTarget.style.background='#e5e7eb')}
      onMouseLeave={e=>(e.currentTarget.style.background='#f3f4f6')}>
      {label}
    </button>
  );
}

export default function AdminBlog() {
  const [posts, setPosts]       = useState<any[]>([]);
  const [cats, setCats]         = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState<any>(null);
  const [form, setForm]         = useState({...EMPTY});
  const [saving, setSaving]     = useState(false);
  const [showCat, setShowCat]   = useState(false);
  const [newCat, setNewCat]     = useState({name:'', color:'#1e3a6e'});
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const [pr, cr] = await Promise.all([
      fetch('/api/blog/posts?admin=true'), fetch('/api/blog/categories'),
    ]);
    const pd = await pr.json(); const cd = await cr.json();
    setPosts(pd.posts || []); setCats(Array.isArray(cd) ? cd : []);
    setLoading(false);
  };

  const openNew = () => {
    setEditPost(null); setForm({...EMPTY}); setShowForm(true);
    setTimeout(() => { if (editorRef.current) editorRef.current.innerHTML = ''; }, 80);
  };
  const openEdit = (p: any) => {
    setEditPost(p);
    setForm({ title:p.title||'', slug:p.slug||'', excerpt:p.excerpt||'', content:p.content||'',
      coverImage:p.coverImage||'', categoryId:p.categoryId||'', tags:(p.tags||[]).join(', '),
      isPublished:p.isPublished||false, isFeatured:p.isFeatured||false });
    setShowForm(true);
    setTimeout(() => { if (editorRef.current) editorRef.current.innerHTML = p.content||''; }, 80);
  };

  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    sync();
  };
  const sync = () => { if (editorRef.current) setForm(f=>({...f, content: editorRef.current!.innerHTML})); };
  const ins  = (html: string) => { editorRef.current?.focus(); document.execCommand('insertHTML', false, html); sync(); };

  const save = async () => {
    if (!form.title.trim()) { toast.error('عنوان مقاله الزامی است'); return; }
    const content = editorRef.current?.innerHTML || '';
    if (!content.trim() || content === '<br>') { toast.error('محتوای مقاله الزامی است'); return; }
    setSaving(true);
    const payload = { ...form, content, tags: form.tags.split(',').map((t:string)=>t.trim()).filter(Boolean) };
    const url    = editPost ? `/api/blog/posts/${editPost.id}` : '/api/blog/posts';
    const method = editPost ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) { toast.success(editPost ? 'مقاله ویرایش شد' : 'مقاله ذخیره شد'); setShowForm(false); load(); }
    else { const e = await res.json(); toast.error(e.error||'خطا'); }
  };

  const del = async (id: string) => {
    if (!confirm('حذف مقاله؟')) return;
    await fetch(`/api/blog/posts/${id}`, {method:'DELETE'});
    toast.success('مقاله حذف شد'); load();
  };

  const togglePub = async (p: any) => {
    await fetch(`/api/blog/posts/${p.id}`, { method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({isPublished: !p.isPublished}) });
    toast.success(p.isPublished ? 'پنهان شد' : 'منتشر شد'); load();
  };

  const addCat = async () => {
    if (!newCat.name.trim()) { toast.error('نام الزامی است'); return; }
    const r = await fetch('/api/blog/categories', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(newCat) });
    if (r.ok) { toast.success('دسته‌بندی افزوده شد'); setNewCat({name:'',color:'#1e3a6e'}); setShowCat(false); load(); }
  };

  const filtered = posts.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()));
  const SI: any = { padding:'0 14px', borderRadius:12, border:'1px solid #e5e7eb', outline:'none',
    fontFamily:'inherit', fontSize:13, background:'#fff', width:'100%', height:40, transition:'all .2s' };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>

      {/* ── Header ── */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:800,color:'#1f2937'}}>مدیریت وبلاگ</h1>
          <p style={{color:'#6b7280',fontSize:13,marginTop:3}}>{posts.length} مقاله · {posts.filter(p=>p.isPublished).length} منتشر شده</p>
        </div>
        <div style={{display:'flex',gap:10}}>
          <button onClick={()=>setShowCat(true)} className="btn-outline" style={{fontSize:13,padding:'9px 18px'}}>🏷️ دسته‌بندی جدید</button>
          <button onClick={openNew} className="btn-navy" style={{fontSize:13,padding:'9px 20px',display:'flex',alignItems:'center',gap:7}}>
            <Plus size={16}/>مقاله جدید
          </button>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="card" style={{padding:14,display:'flex',gap:12,alignItems:'center'}}>
        <div style={{flex:1,position:'relative'}}>
          <Search size={15} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',color:'#9ca3af'}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="جستجو در مقالات..."
            style={{...SI,paddingRight:36}} />
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {cats.map((c:any) => (
            <span key={c.id} style={{display:'inline-flex',alignItems:'center',gap:5,background:c.color,color:'#fff',
              fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:8}}>
              {c.name} <span style={{opacity:.75}}>({c._count?.posts||0})</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="card" style={{overflow:'hidden'}}>
        {loading ? (
          <div style={{padding:48,textAlign:'center'}}>
            <div className="animate-spin" style={{width:32,height:32,border:'4px solid #1e3a6e',borderTopColor:'transparent',borderRadius:'50%',margin:'0 auto'}}/>
          </div>
        ) : (
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:'#f9fafb'}}>
                  {['مقاله','دسته','بازدید','وضعیت','تاریخ','عملیات'].map(h=>(
                    <th key={h} style={{textAlign:'right',padding:'12px 16px',fontSize:12,fontWeight:700,color:'#6b7280',borderBottom:'1px solid #f3f4f6'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(post => (
                  <tr key={post.id} style={{borderBottom:'1px solid #f9fafb',transition:'background .15s'}}
                    onMouseEnter={e=>(e.currentTarget.style.background='#f9fafb')}
                    onMouseLeave={e=>(e.currentTarget.style.background='')}>
                    <td style={{padding:'12px 16px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <div style={{width:52,height:40,borderRadius:10,overflow:'hidden',background:'#f3f4f6',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>
                          {post.coverImage ? <img src={post.coverImage} style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/> : '📄'}
                        </div>
                        <div>
                          <div style={{fontWeight:700,fontSize:13,color:'#1f2937',maxWidth:260,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{post.title}</div>
                          <div style={{fontSize:11,color:'#9ca3af',marginTop:2}}>/{post.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{padding:'12px 16px'}}>
                      {post.category ? (
                        <span style={{background:post.category.color||'#1e3a6e',color:'#fff',fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:8,display:'inline-block'}}>
                          {post.category.name}
                        </span>
                      ) : <span style={{color:'#9ca3af',fontSize:12}}>—</span>}
                    </td>
                    <td style={{padding:'12px 16px',fontSize:13,color:'#6b7280'}}>{post.viewCount||0}</td>
                    <td style={{padding:'12px 16px'}}>
                      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                        <span style={{display:'inline-flex',alignItems:'center',padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:600,
                          background:post.isPublished?'#dcfce7':'#f3f4f6',color:post.isPublished?'#16a34a':'#6b7280'}}>
                          {post.isPublished ? '✓ منتشر' : 'پیش‌نویس'}
                        </span>
                        {post.isFeatured && <span style={{display:'inline-flex',alignItems:'center',padding:'3px 8px',borderRadius:20,fontSize:11,fontWeight:600,background:'#fef9c3',color:'#a16207'}}>⭐ ویژه</span>}
                      </div>
                    </td>
                    <td style={{padding:'12px 16px',fontSize:11,color:'#9ca3af'}}>{formatDate(post.createdAt)}</td>
                    <td style={{padding:'12px 16px'}}>
                      <div style={{display:'flex',gap:6}}>
                        <button onClick={()=>openEdit(post)} title="ویرایش"
                          style={{width:30,height:30,background:'#dbeafe',color:'#2563eb',border:'none',borderRadius:8,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <Edit size={13}/>
                        </button>
                        <button onClick={()=>togglePub(post)} title={post.isPublished?'پنهان':'منتشر'}
                          style={{width:30,height:30,background:post.isPublished?'#fef9c3':'#dcfce7',color:post.isPublished?'#a16207':'#16a34a',border:'none',borderRadius:8,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          {post.isPublished ? <EyeOff size={13}/> : <Eye size={13}/>}
                        </button>
                        {post.isPublished && (
                          <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                            style={{width:30,height:30,background:'#f3f4f6',color:'#6b7280',border:'none',borderRadius:8,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}>
                            <ExternalLink size={13}/>
                          </a>
                        )}
                        <button onClick={()=>del(post.id)} title="حذف"
                          style={{width:30,height:30,background:'#fee2e2',color:'#dc2626',border:'none',borderRadius:8,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filtered.length && !loading && (
                  <tr><td colSpan={6} style={{padding:48,textAlign:'center',color:'#9ca3af'}}>
                    <div style={{fontSize:40,marginBottom:12}}>📝</div>
                    <div style={{fontWeight:600,marginBottom:14}}>هنوز مقاله‌ای ثبت نشده</div>
                    <button onClick={openNew} style={{background:'#1e3a6e',color:'#fff',border:'none',borderRadius:12,padding:'9px 20px',cursor:'pointer',fontFamily:'inherit',fontSize:13,fontWeight:600}}>
                      اولین مقاله را بنویسید
                    </button>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Category Modal ── */}
      {showCat && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.45)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}
          onClick={e=>e.target===e.currentTarget&&setShowCat(false)}>
          <div className="card animate-fade-in" style={{width:380,padding:28}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <h3 style={{fontSize:17,fontWeight:800,color:'#1f2937'}}>دسته‌بندی جدید</h3>
              <button onClick={()=>setShowCat(false)} style={{width:30,height:30,border:'none',background:'#f3f4f6',borderRadius:8,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><X size={16}/></button>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{display:'block',fontSize:13,fontWeight:600,color:'#4b5563',marginBottom:6}}>نام *</label>
              <input value={newCat.name} onChange={e=>setNewCat(c=>({...c,name:e.target.value}))} className="input-field" placeholder="مثلاً: آموزش، اخبار"/>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:13,fontWeight:600,color:'#4b5563',marginBottom:6}}>رنگ</label>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <input type="color" value={newCat.color} onChange={e=>setNewCat(c=>({...c,color:e.target.value}))}
                  style={{width:44,height:38,borderRadius:10,border:'1px solid #e5e7eb',cursor:'pointer',padding:3}}/>
                <div style={{display:'flex',gap:6}}>
                  {['#1e3a6e','#f5a623','#16a34a','#dc2626','#7c3aed','#0891b2'].map(c=>(
                    <button key={c} onClick={()=>setNewCat(n=>({...n,color:c}))}
                      style={{width:26,height:26,borderRadius:8,background:c,border:newCat.color===c?'3px solid #fff':'2px solid transparent',
                        outline:newCat.color===c?`2px solid ${c}`:'none',cursor:'pointer',transition:'all .15s'}}/>
                  ))}
                </div>
              </div>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>setShowCat(false)} className="btn-outline" style={{flex:1,fontSize:13}}>انصراف</button>
              <button onClick={addCat} className="btn-navy" style={{flex:1,fontSize:13}}>افزودن</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Editor Modal ── */}
      {showForm && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:200,overflowY:'auto',padding:'20px 16px'}}>
          <div className="animate-fade-in" style={{background:'#fff',borderRadius:24,maxWidth:900,margin:'0 auto',overflow:'hidden'}}>

            {/* Modal Header */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 28px',borderBottom:'1px solid #f3f4f6'}}>
              <h2 style={{fontSize:18,fontWeight:800,color:'#1f2937'}}>{editPost ? 'ویرایش مقاله' : 'نوشتن مقاله جدید'}</h2>
              <button onClick={()=>setShowForm(false)} style={{width:34,height:34,border:'none',background:'#f3f4f6',borderRadius:10,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><X size={18}/></button>
            </div>

            <div style={{padding:28,display:'flex',flexDirection:'column',gap:18}}>

              {/* Title */}
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:700,color:'#374151',marginBottom:7}}>عنوان مقاله *</label>
                <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}
                  className="input-field" placeholder="یک عنوان جذاب بنویسید..." style={{fontSize:16,fontWeight:600}}/>
              </div>

              {/* Slug + Category */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div>
                  <label style={{display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:7}}>Slug (آدرس)</label>
                  <input value={form.slug} onChange={e=>setForm(f=>({...f,slug:e.target.value}))} className="input-field" placeholder="post-url" dir="ltr"/>
                </div>
                <div>
                  <label style={{display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:7}}>دسته‌بندی</label>
                  <select value={form.categoryId} onChange={e=>setForm(f=>({...f,categoryId:e.target.value}))} className="input-field">
                    <option value="">بدون دسته‌بندی</option>
                    {cats.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:7}}>خلاصه مقاله</label>
                <textarea value={form.excerpt} onChange={e=>setForm(f=>({...f,excerpt:e.target.value}))}
                  className="input-field" style={{height:72,resize:'none'}} placeholder="یک جمله کوتاه خلاصه..."/>
              </div>

              {/* Cover Image */}
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:7}}>تصویر بندانگشتی (URL)</label>
                <div style={{display:'flex',gap:10}}>
                  <input value={form.coverImage} onChange={e=>setForm(f=>({...f,coverImage:e.target.value}))}
                    className="input-field" placeholder="https://example.com/image.jpg" dir="ltr" style={{flex:1}}/>
                  {form.coverImage && (
                    <img src={form.coverImage} alt="" style={{width:56,height:40,objectFit:'cover',borderRadius:8,border:'1px solid #e5e7eb',flexShrink:0}}
                      onError={e=>(e.currentTarget.style.display='none')}/>
                  )}
                </div>
              </div>

              {/* Rich Editor */}
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:700,color:'#374151',marginBottom:8}}>محتوای مقاله *</label>

                {/* Toolbar */}
                <div style={{background:'#f8fafc',border:'1px solid #e5e7eb',borderBottom:'none',borderRadius:'12px 12px 0 0',padding:'10px 12px',display:'flex',flexWrap:'wrap',gap:5}}>
                  <div style={{display:'flex',gap:4,paddingLeft:8,borderLeft:'1px solid #e5e7eb'}}>
                    <TB label="B" onClick={()=>exec('bold')}/>
                    <TB label="I" onClick={()=>exec('italic')}/>
                    <TB label="U" onClick={()=>exec('underline')}/>
                    <TB label="S̶" onClick={()=>exec('strikeThrough')}/>
                  </div>
                  <div style={{display:'flex',gap:4,paddingLeft:8,borderLeft:'1px solid #e5e7eb'}}>
                    <TB label="H1" onClick={()=>exec('formatBlock','h1')}/>
                    <TB label="H2" onClick={()=>exec('formatBlock','h2')}/>
                    <TB label="H3" onClick={()=>exec('formatBlock','h3')}/>
                    <TB label="¶" onClick={()=>exec('formatBlock','p')}/>
                  </div>
                  <div style={{display:'flex',gap:4,paddingLeft:8,borderLeft:'1px solid #e5e7eb'}}>
                    <TB label="≡" onClick={()=>exec('insertUnorderedList')}/>
                    <TB label="1≡" onClick={()=>exec('insertOrderedList')}/>
                    <TB label="❝" onClick={()=>exec('formatBlock','blockquote')}/>
                  </div>
                  <div style={{display:'flex',gap:4,paddingLeft:8,borderLeft:'1px solid #e5e7eb'}}>
                    <TB label="⇤" onClick={()=>exec('justifyRight')}/>
                    <TB label="⇔" onClick={()=>exec('justifyCenter')}/>
                    <TB label="⇥" onClick={()=>exec('justifyLeft')}/>
                  </div>
                  <div style={{display:'flex',gap:4,paddingLeft:8,borderLeft:'1px solid #e5e7eb'}}>
                    <TB label="🔗" onClick={()=>{ const u=prompt('آدرس لینک:'); if(u) exec('createLink',u); }}/>
                    <TB label="🖼" onClick={()=>{ const u=prompt('آدرس تصویر:'); if(u) ins(`<img src="${u}" alt="" style="max-width:100%;border-radius:12px;margin:12px 0">`); }}/>
                    <TB label="—" onClick={()=>ins('<hr style="border:none;border-top:2px solid #eef2f7;margin:24px 0">')}/>
                    <TB label="📋" onClick={()=>ins('<table border="1" style="width:100%;border-collapse:collapse;margin:16px 0"><tr><th style="padding:10px;background:#1e3a6e;color:#fff">ستون ۱</th><th style="padding:10px;background:#1e3a6e;color:#fff">ستون ۲</th></tr><tr><td style="padding:10px;border:1px solid #e5e7eb">سلول ۱</td><td style="padding:10px;border:1px solid #e5e7eb">سلول ۲</td></tr></table>')}/>
                    <TB label="</>" onClick={()=>ins('<pre style="background:#1a1a2e;color:#e2e8f0;padding:16px;border-radius:10px;margin:14px 0;font-size:13px;overflow:auto"><code>// کد اینجا</code></pre>')}/>
                  </div>
                  <div style={{display:'flex',gap:5,alignItems:'center'}}>
                    {['#1e3a6e','#f5a623','#16a34a','#dc2626','#7c3aed'].map(c=>(
                      <button key={c} type="button" title={`رنگ ${c}`} onClick={()=>exec('foreColor',c)}
                        style={{width:22,height:22,background:c,borderRadius:6,border:'2px solid #fff',boxShadow:'0 0 0 1px #e5e7eb',cursor:'pointer'}}/>
                    ))}
                    <button type="button" onClick={()=>exec('removeFormat')}
                      style={{padding:'4px 8px',borderRadius:7,border:'none',background:'#fee2e2',color:'#dc2626',fontSize:11,cursor:'pointer',fontFamily:'inherit',fontWeight:600}}>
                      پاک
                    </button>
                  </div>
                </div>

                {/* Editor Area */}
                <div ref={editorRef} contentEditable suppressContentEditableWarning onInput={sync}
                  style={{border:'1px solid #e5e7eb',borderRadius:'0 0 12px 12px',minHeight:320,padding:'20px 24px',
                    outline:'none',fontSize:14,lineHeight:2,color:'#374151',fontFamily:'Vazirmatn,sans-serif',direction:'rtl',textAlign:'right'}}
                  data-placeholder="محتوای مقاله را اینجا بنویسید..."/>
                <style>{`
                  [contenteditable]:empty:before{content:attr(data-placeholder);color:#9ca3af;pointer-events:none}
                  [contenteditable] h1{font-size:24px;font-weight:800;color:#162b54;margin:20px 0 10px}
                  [contenteditable] h2{font-size:20px;font-weight:700;color:#1e3a6e;margin:18px 0 8px;padding-bottom:6px;border-bottom:2px solid #eef2f7}
                  [contenteditable] h3{font-size:17px;font-weight:700;color:#264d88;margin:14px 0 6px}
                  [contenteditable] blockquote{border-right:4px solid #f5a623;background:#fef9ee;padding:12px 18px;border-radius:0 12px 12px 0;margin:16px 0;color:#6b7280;font-style:italic}
                  [contenteditable] a{color:#1e3a6e;font-weight:600}
                  [contenteditable] ul,[contenteditable] ol{padding-right:20px;margin:12px 0}
                  [contenteditable] li{margin-bottom:6px}
                `}</style>
              </div>

              {/* Tags */}
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:7}}>
                  تگ‌ها <span style={{color:'#9ca3af',fontWeight:400}}>(با کاما جدا کنید)</span>
                </label>
                <input value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))}
                  className="input-field" placeholder="پرینتر، HP، آموزش، تعمیر"/>
              </div>

              {/* Options */}
              <div style={{display:'flex',gap:28,padding:'14px 18px',background:'#f8fafc',borderRadius:14,flexWrap:'wrap'}}>
                <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:14,fontWeight:600}}>
                  <input type="checkbox" checked={form.isPublished} onChange={e=>setForm(f=>({...f,isPublished:e.target.checked}))}
                    style={{width:16,height:16,accentColor:'#1e3a6e',cursor:'pointer'}}/>
                  منتشر شود
                </label>
                <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:14,fontWeight:600}}>
                  <input type="checkbox" checked={form.isFeatured} onChange={e=>setForm(f=>({...f,isFeatured:e.target.checked}))}
                    style={{width:16,height:16,accentColor:'#f5a623',cursor:'pointer'}}/>
                  ⭐ مقاله ویژه (در صفحه اصلی نشان داده شود)
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{padding:'16px 28px',borderTop:'1px solid #f3f4f6',display:'flex',gap:12,justifyContent:'flex-end'}}>
              <button onClick={()=>setShowForm(false)} className="btn-outline" style={{fontSize:13,padding:'10px 22px'}}>انصراف</button>
              <button onClick={save} disabled={saving} className="btn-navy"
                style={{fontSize:13,padding:'10px 24px',display:'flex',alignItems:'center',gap:8,opacity:saving?.7:1}}>
                {saving && <span className="animate-spin" style={{width:14,height:14,border:'2px solid #fff',borderTopColor:'transparent',borderRadius:'50%',display:'inline-block'}}/>}
                {saving ? 'در حال ذخیره...' : editPost ? 'ذخیره تغییرات' : 'انتشار مقاله'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
