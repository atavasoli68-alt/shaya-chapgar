import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new (PrismaClient as any)();

async function main() {
  console.log('🌱 شروع seed پایگاه داده...');

  // ──────── Admin ────────
  const pw = await bcrypt.hash('admin1234', 10);
  await prisma.user.upsert({
    where: { email: 'admin@shaya.ir' },
    update: {},
    create: { email: 'admin@shaya.ir', name: 'مدیر سیستم', password: pw, role: 'admin', phone: '09123456789' },
  });
  console.log('✅ ادمین: admin@shaya.ir / admin1234');

  // ──────── Categories ────────
  const printer     = await prisma.category.upsert({ where:{slug:'printer'},     update:{}, create:{name:'پرینتر',      slug:'printer',      sortOrder:1} });
  const copier      = await prisma.category.upsert({ where:{slug:'copier'},      update:{}, create:{name:'کپی‌مشین',   slug:'copier',       sortOrder:2} });
  const scanner     = await prisma.category.upsert({ where:{slug:'scanner'},     update:{}, create:{name:'اسکنر',       slug:'scanner',      sortOrder:3} });
  const accessories = await prisma.category.upsert({ where:{slug:'accessories'}, update:{}, create:{name:'لوازم جانبی', slug:'accessories',  sortOrder:4} });
  await prisma.category.upsert({ where:{slug:'hp-printer'},    update:{}, create:{name:'پرینتر HP',     slug:'hp-printer',    parentId:printer.id, sortOrder:1} });
  await prisma.category.upsert({ where:{slug:'laser-printer'}, update:{}, create:{name:'پرینتر لیزری', slug:'laser-printer', parentId:printer.id, sortOrder:2} });
  console.log('✅ دسته‌بندی‌های محصول');

  // ──────── Products ────────
  const products = [
    { name:'پرینتر لیزری HP LaserJet Pro M404n', slug:'hp-laserjet-pro-m404n', description:'پرینتر لیزری تک‌رنگ حرفه‌ای با سرعت ۳۸ صفحه در دقیقه.', price:8500000, comparePrice:9200000, sku:'HP-M404N', stock:15, images:['/images/products/hp-m404n.jpg'], categoryId:printer.id, brand:'HP', isFeatured:true },
    { name:'پرینتر جوهرافشان HP DeskJet 2720e', slug:'hp-deskjet-2720e', description:'پرینتر چندکاره با قابلیت چاپ، کپی و اسکن.', price:3200000, comparePrice:3500000, sku:'HP-DJ2720E', stock:25, images:['/images/products/hp-deskjet.jpg'], categoryId:printer.id, brand:'HP', isFeatured:true },
    { name:'کپی‌مشین دیجیتال Canon iR2625i', slug:'canon-ir2625i', description:'کپی‌مشین چندکاره با سرعت ۲۵ صفحه در دقیقه.', price:42000000, comparePrice:45000000, sku:'CAN-IR2625I', stock:5, images:['/images/products/canon-ir2625i.jpg'], categoryId:copier.id, brand:'Canon', isFeatured:true },
    { name:'اسکنر Epson Perfection V39', slug:'epson-perfection-v39', description:'اسکنر تخت ۴۸۰۰ dpi.', price:2800000, sku:'EPS-V39', stock:12, images:['/images/products/epson-v39.jpg'], categoryId:scanner.id, brand:'Epson', isFeatured:false },
    { name:'کارتریج HP 85A', slug:'hp-85a-ce285a', description:'کارتریج اورجینال HP ۸۵A، ظرفیت ۱۶۰۰ صفحه.', price:1200000, sku:'HP-85A', stock:50, images:['/images/products/hp-85a.jpg'], categoryId:accessories.id, brand:'HP', isFeatured:false },
    { name:'پرینتر لیزری رنگی HP Color LaserJet Pro M255dw', slug:'hp-color-laserjet-m255dw', description:'پرینتر لیزری رنگی با Wi-Fi و چاپ دوطرفه.', price:14500000, comparePrice:15800000, sku:'HP-M255DW', stock:8, images:['/images/products/hp-m255dw.jpg'], categoryId:printer.id, brand:'HP', isFeatured:true },
  ];
  for (const p of products) {
    await prisma.product.upsert({ where:{slug:p.slug}, update:{}, create:{...p, images: p.images || []} });
  }
  console.log('✅ محصولات');

  // ──────── Settings ────────
  const settings = [
    {key:'storeName',    value:'شایا چاپگر آریا'},
    {key:'storeNameEn',  value:'Shaya Chapgar Aria'},
    {key:'phone',        value:'۰۲۱-۸۸۱۲۳۴۵۶'},
    {key:'mobile',       value:'۰۹۱۲-۳۴۵-۶۷۸۹'},
    {key:'email',        value:'info@shayachapgar.ir'},
    {key:'address',      value:'تهران، خیابان ولیعصر، پلاک ۱۲۳'},
    {key:'instagram',    value:'https://instagram.com/shayachapgar'},
    {key:'telegram',     value:'https://t.me/shayachapgar'},
    {key:'whatsapp',     value:'09123456789'},
    {key:'primaryColor', value:'#1e3a6e'},
    {key:'accentColor',  value:'#f5a623'},
    {key:'footerText',   value:'شایا چاپگر آریا - ارائه دهنده تجهیزات اداری'},
    {key:'heroTitle',    value:'تخصصی‌ترین مرکز فروش و خدمات تجهیزات اداری'},
    {key:'heroSubtitle', value:'پرینتر، کپی‌مشین، اسکنر با بهترین قیمت'},
    {key:'workingHours', value:'شنبه تا چهارشنبه ۸ تا ۱۷ - پنجشنبه ۸ تا ۱۳'},
  ];
  for (const s of settings) {
    await prisma.setting.upsert({ where:{key:s.key}, update:{}, create:s });
  }
  console.log('✅ تنظیمات');

  // ──────── Banners ────────
  const b1 = await prisma.banner.findFirst();
  if (!b1) {
    await prisma.banner.createMany({ data: [
      {title:'بهترین قیمت پرینترهای HP', subtitle:'تضمین اصالت + گارانتی رسمی', link:'/shop/products?category=printer', isActive:true, sortOrder:1},
      {title:'خدمات تعمیر تخصصی', subtitle:'تعمیر پرینتر در محل', link:'/forms/repair', isActive:true, sortOrder:2},
    ]});
  }
  console.log('✅ بنرها');

  // ──────── Blog Categories ────────
  const tutCat  = await prisma.blogCategory.upsert({ where:{slug:'tutorial'}, update:{}, create:{name:'آموزش',          slug:'tutorial', color:'#1e3a6e'} });
  const tipsCat = await prisma.blogCategory.upsert({ where:{slug:'tips'},     update:{}, create:{name:'نکات کاربردی', slug:'tips',      color:'#16a34a'} });
  const revCat  = await prisma.blogCategory.upsert({ where:{slug:'review'},   update:{}, create:{name:'بررسی محصول', slug:'review',    color:'#7c3aed'} });
  await prisma.blogCategory.upsert({ where:{slug:'news'}, update:{}, create:{name:'اخبار', slug:'news', color:'#f5a623'} });
  console.log('✅ دسته‌بندی‌های وبلاگ');

  // ──────── Blog Posts ────────
  const admin = await prisma.user.findFirst({ where:{role:'admin'} });

  const posts = [
    {
      title:'راهنمای جامع انتخاب پرینتر مناسب برای دفتر کار',
      slug:'printer-guide-office',
      excerpt:'انتخاب پرینتر مناسب چالش‌برانگیز است. عوامل کلیدی مانند حجم چاپ، نوع کاربری و بودجه را بررسی می‌کنیم.',
      content:'<h2>چرا انتخاب پرینتر مهم است؟</h2><p>پرینتر یکی از تجهیزات اساسی دفتر است. انتخاب نادرست هزینه‌ها را بالا می‌برد.</p><h2>عوامل کلیدی</h2><ul><li><strong>زیر ۵۰ صفحه:</strong> جوهرافشان کافی است</li><li><strong>۵۰ تا ۲۰۰ صفحه:</strong> لیزری تک‌رنگ</li><li><strong>بیش از ۲۰۰ صفحه:</strong> لیزری حرفه‌ای</li></ul><blockquote>برای چاپ رنگی، لیزری رنگی بهتر از جوهرافشان است.</blockquote><h2>برندهای پرطرفدار</h2><p>HP و Canon بهترین پشتیبانی را دارند. Epson برای چاپ با حجم متوسط مقرون‌به‌صرفه‌تر است.</p>',
      categoryId:tutCat.id, tags:['پرینتر','راهنمای خرید','دفتر کار'],
      isPublished:true, isFeatured:true, authorId:admin?.id, publishedAt:new Date(),
    },
    {
      title:'چگونه کارتریج پرینتر را بیشتر دوام بیاوریم؟',
      slug:'extend-printer-cartridge-life',
      excerpt:'با چند نکته ساده عمر کارتریج را افزایش داده و در هزینه‌ها صرفه‌جویی کنید.',
      content:'<h2>صرفه‌جویی در کارتریج</h2><h3>۱. کیفیت چاپ</h3><p>برای اسناد داخلی از حالت Draft استفاده کنید. تا ۵۰٪ جوهر کمتر مصرف می‌شود.</p><h3>۲. چاپ دو طرفه</h3><p>Duplex مصرف کاغذ را ۵۰٪ کاهش می‌دهد.</p><blockquote>هرگز از کارتریج تقلبی استفاده نکنید؛ پرینتر را خراب می‌کند.</blockquote><h3>۳. نگهداری</h3><ul><li>پرینتر را در محیط خشک نگه دارید</li><li>هفته‌ای یک‌بار چند صفحه چاپ کنید</li><li>سرهای چاپ را تمیز کنید</li></ul>',
      categoryId:tipsCat.id, tags:['کارتریج','صرفه‌جویی','نگهداری'],
      isPublished:true, isFeatured:true, authorId:admin?.id, publishedAt:new Date(Date.now()-2*86400000),
    },
    {
      title:'بررسی کامل HP LaserJet Pro M404n',
      slug:'hp-laserjet-m404n-review',
      excerpt:'HP LaserJet Pro M404n محبوب‌ترین پرینتر اداری است. همه چیز از مشخصات تا تجربه کاربری.',
      content:'<h2>مشخصات فنی</h2><ul><li>سرعت: ۳۸ صفحه در دقیقه</li><li>رزولوشن: ۱۲۰۰ dpi</li><li>اتصال: USB و Ethernet</li><li>ظرفیت کارتریج: ۳۰۰۰ صفحه</li></ul><h2>مزایا</h2><ul><li>سرعت بالا برای دفاتر پرکار</li><li>هزینه نگهداری پایین</li><li>اتصال شبکه</li></ul><h2>معایب</h2><ul><li>تک‌رنگ است</li><li>فاقد Wi-Fi</li></ul><blockquote>بهترین انتخاب برای چاپ حجم بالا با بودجه معقول.</blockquote>',
      categoryId:revCat.id, tags:['HP','لیزری','بررسی محصول'],
      isPublished:true, isFeatured:false, authorId:admin?.id, publishedAt:new Date(Date.now()-5*86400000),
    },
  ];

  for (const post of posts) {
    const exists = await prisma.blogPost.findUnique({ where:{slug:post.slug} });
    if (!exists) await prisma.blogPost.create({ data:post });
  }
  console.log('✅ مقالات وبلاگ');

  console.log('\n🎉 Seed کامل شد!');
}

main()
  .catch(e => { console.error('❌ خطا در seed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
