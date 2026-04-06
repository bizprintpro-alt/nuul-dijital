// @ts-nocheck
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Globe, Eye, Loader2, Code, Layout } from "lucide-react";
import { trpc } from "@/lib/trpc-client";

const TEMPLATES: Record<string, string> = {
  blank: `<!DOCTYPE html>
<html lang="mn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Миний вэбсайт</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    header { background: #1a1a2e; color: white; padding: 20px 0; }
    main { padding: 60px 0; }
    footer { background: #1a1a2e; color: #aaa; padding: 30px 0; text-align: center; font-size: 14px; }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <h1>Миний вэбсайт</h1>
    </div>
  </header>
  <main>
    <div class="container">
      <h2>Тавтай морил!</h2>
      <p>Энд контентоо оруулна уу.</p>
    </div>
  </main>
  <footer>
    <div class="container">
      <p>&copy; 2026 Миний вэбсайт. Бүх эрх хуулиар хамгаалагдсан.</p>
    </div>
  </footer>
</body>
</html>`,

  business: `<!DOCTYPE html>
<html lang="mn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Бизнес вэбсайт</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    header { background: linear-gradient(135deg, #6C63FF, #4B47B7); color: white; padding: 20px 0; }
    header nav { display: flex; align-items: center; justify-content: space-between; }
    header nav a { color: white; text-decoration: none; margin-left: 24px; font-size: 14px; }
    .hero { background: linear-gradient(135deg, #6C63FF, #4B47B7); color: white; padding: 100px 0; text-align: center; }
    .hero h1 { font-size: 48px; margin-bottom: 16px; }
    .hero p { font-size: 18px; opacity: 0.9; margin-bottom: 30px; }
    .hero .btn { display: inline-block; background: white; color: #6C63FF; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: bold; }
    .services { padding: 80px 0; }
    .services h2 { text-align: center; font-size: 32px; margin-bottom: 50px; }
    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; }
    .service-card { padding: 30px; border-radius: 12px; border: 1px solid #eee; text-align: center; }
    .service-card h3 { margin: 16px 0 8px; }
    .service-card p { color: #666; font-size: 14px; }
    .service-icon { width: 60px; height: 60px; background: #6C63FF15; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto; font-size: 28px; }
    .contact { background: #f8f9fa; padding: 80px 0; text-align: center; }
    .contact h2 { font-size: 32px; margin-bottom: 16px; }
    .contact p { color: #666; margin-bottom: 30px; }
    .contact .btn { display: inline-block; background: #6C63FF; color: white; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: bold; }
    footer { background: #1a1a2e; color: #aaa; padding: 30px 0; text-align: center; font-size: 14px; }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <nav>
        <h2>КОМПАНИ</h2>
        <div>
          <a href="#services">Үйлчилгээ</a>
          <a href="#about">Бидний тухай</a>
          <a href="#contact">Холбогдох</a>
        </div>
      </nav>
    </div>
  </header>
  <section class="hero">
    <div class="container">
      <h1>Бизнесээ дараагийн түвшинд</h1>
      <p>Мэргэжлийн баг, инновацлаг шийдэл, найдвартай үйлчилгээ</p>
      <a href="#contact" class="btn">Холбогдох</a>
    </div>
  </section>
  <section class="services" id="services">
    <div class="container">
      <h2>Үйлчилгээ</h2>
      <div class="services-grid">
        <div class="service-card">
          <div class="service-icon">🚀</div>
          <h3>Вэб хөгжүүлэлт</h3>
          <p>Орчин үеийн, хурдан, responsive вэбсайт бүтээх</p>
        </div>
        <div class="service-card">
          <div class="service-icon">📱</div>
          <h3>Апп хөгжүүлэлт</h3>
          <p>iOS, Android аппликейшн хөгжүүлэлт</p>
        </div>
        <div class="service-card">
          <div class="service-icon">🎯</div>
          <h3>Дижитал маркетинг</h3>
          <p>SEO, SEM, SMM — бизнесийг тань хүмүүст хүргэх</p>
        </div>
      </div>
    </div>
  </section>
  <section class="contact" id="contact">
    <div class="container">
      <h2>Холбогдох</h2>
      <p>Бидэнтэй холбогдоод төслөө эхлүүлээрэй</p>
      <a href="mailto:info@company.mn" class="btn">И-мэйл бичих</a>
    </div>
  </section>
  <footer>
    <div class="container">
      <p>&copy; 2026 Компани. Бүх эрх хуулиар хамгаалагдсан.</p>
    </div>
  </footer>
</body>
</html>`,

  shop: `<!DOCTYPE html>
<html lang="mn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Онлайн дэлгүүр</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; background: #fafafa; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    header { background: white; border-bottom: 1px solid #eee; padding: 16px 0; position: sticky; top: 0; z-index: 10; }
    header .inner { display: flex; align-items: center; justify-content: space-between; }
    header h1 { font-size: 22px; color: #6C63FF; }
    header nav a { margin-left: 20px; color: #555; text-decoration: none; font-size: 14px; }
    .banner { background: linear-gradient(135deg, #00C9A7, #00B4D8); color: white; padding: 60px 0; text-align: center; margin-bottom: 40px; }
    .banner h2 { font-size: 36px; margin-bottom: 12px; }
    .banner p { font-size: 16px; opacity: 0.9; }
    .products { padding: 0 0 60px; }
    .products h2 { text-align: center; font-size: 28px; margin-bottom: 30px; }
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }
    .product-card { background: white; border-radius: 12px; overflow: hidden; border: 1px solid #eee; transition: box-shadow 0.2s; }
    .product-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .product-img { height: 200px; background: linear-gradient(135deg, #e0e0e0, #f5f5f5); display: flex; align-items: center; justify-content: center; font-size: 48px; }
    .product-info { padding: 16px; }
    .product-info h3 { font-size: 16px; margin-bottom: 6px; }
    .product-info .price { color: #6C63FF; font-size: 18px; font-weight: bold; }
    .product-info .btn { display: block; text-align: center; background: #6C63FF; color: white; padding: 10px; border-radius: 8px; text-decoration: none; margin-top: 12px; font-size: 14px; font-weight: bold; }
    footer { background: #1a1a2e; color: #aaa; padding: 30px 0; text-align: center; font-size: 14px; }
  </style>
</head>
<body>
  <header>
    <div class="container inner">
      <h1>ДЭЛГҮҮР</h1>
      <nav>
        <a href="#">Бүтээгдэхүүн</a>
        <a href="#">Хямдрал</a>
        <a href="#">Холбогдох</a>
      </nav>
    </div>
  </header>
  <section class="banner">
    <div class="container">
      <h2>Шинэ цуглуулга ирлээ!</h2>
      <p>Хамгийн сүүлийн үеийн бүтээгдэхүүнүүд</p>
    </div>
  </section>
  <section class="products">
    <div class="container">
      <h2>Бүтээгдэхүүнүүд</h2>
      <div class="products-grid">
        <div class="product-card">
          <div class="product-img">📦</div>
          <div class="product-info">
            <h3>Бүтээгдэхүүн 1</h3>
            <div class="price">₮45,000</div>
            <a href="#" class="btn">Сагсанд нэмэх</a>
          </div>
        </div>
        <div class="product-card">
          <div class="product-img">📦</div>
          <div class="product-info">
            <h3>Бүтээгдэхүүн 2</h3>
            <div class="price">₮89,000</div>
            <a href="#" class="btn">Сагсанд нэмэх</a>
          </div>
        </div>
        <div class="product-card">
          <div class="product-img">📦</div>
          <div class="product-info">
            <h3>Бүтээгдэхүүн 3</h3>
            <div class="price">₮32,000</div>
            <a href="#" class="btn">Сагсанд нэмэх</a>
          </div>
        </div>
        <div class="product-card">
          <div class="product-img">📦</div>
          <div class="product-info">
            <h3>Бүтээгдэхүүн 4</h3>
            <div class="price">₮120,000</div>
            <a href="#" class="btn">Сагсанд нэмэх</a>
          </div>
        </div>
      </div>
    </div>
  </section>
  <footer>
    <div class="container">
      <p>&copy; 2026 Дэлгүүр. Бүх эрх хуулиар хамгаалагдсан.</p>
    </div>
  </footer>
</body>
</html>`,

  restaurant: `<!DOCTYPE html>
<html lang="mn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ресторан</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, 'Times New Roman', serif; color: #333; }
    .container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
    header { background: #1a0f0a; color: white; padding: 20px 0; text-align: center; }
    header h1 { font-size: 36px; letter-spacing: 4px; }
    header p { color: #c9a96e; font-size: 14px; margin-top: 4px; }
    .hero { background: linear-gradient(135deg, #1a0f0a, #3a2518); color: white; padding: 100px 0; text-align: center; }
    .hero h2 { font-size: 42px; margin-bottom: 16px; }
    .hero p { font-size: 18px; color: #c9a96e; }
    .menu { padding: 80px 0; }
    .menu h2 { text-align: center; font-size: 32px; margin-bottom: 50px; color: #1a0f0a; }
    .menu-category { margin-bottom: 40px; }
    .menu-category h3 { font-size: 22px; color: #c9a96e; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 16px; }
    .menu-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dotted #ddd; }
    .menu-item .name { font-size: 16px; }
    .menu-item .desc { font-size: 13px; color: #888; margin-top: 2px; }
    .menu-item .price { font-weight: bold; color: #c9a96e; white-space: nowrap; }
    .gallery { background: #f8f4f0; padding: 60px 0; }
    .gallery h2 { text-align: center; font-size: 28px; margin-bottom: 30px; }
    .gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .gallery-item { height: 200px; background: linear-gradient(135deg, #ddd, #eee); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 40px; }
    .contact { padding: 60px 0; text-align: center; }
    .contact h2 { font-size: 28px; margin-bottom: 16px; }
    .contact p { color: #666; font-size: 16px; }
    footer { background: #1a0f0a; color: #888; padding: 30px 0; text-align: center; font-size: 14px; }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <h1>РЕСТОРАН</h1>
      <p>Уламжлалт амт, орчин үеийн орчин</p>
    </div>
  </header>
  <section class="hero">
    <div class="container">
      <h2>Амтат хоолны ертөнцөд тавтай морил</h2>
      <p>Шинэлэг хоолны цэс, дулаахан орчин</p>
    </div>
  </section>
  <section class="menu">
    <div class="container">
      <h2>Хоолны цэс</h2>
      <div class="menu-category">
        <h3>Гол хоол</h3>
        <div class="menu-item"><div><div class="name">Монгол хуушуур</div><div class="desc">Уламжлалт махтай хуушуур</div></div><div class="price">₮8,000</div></div>
        <div class="menu-item"><div><div class="name">Цуйван</div><div class="desc">Гурилтай шарсан мах</div></div><div class="price">₮12,000</div></div>
        <div class="menu-item"><div><div class="name">Стейк</div><div class="desc">Үхрийн филе, хажуу хоолтой</div></div><div class="price">₮35,000</div></div>
      </div>
      <div class="menu-category">
        <h3>Ундаа</h3>
        <div class="menu-item"><div><div class="name">Сүүтэй цай</div><div class="desc">Монгол уламжлалт</div></div><div class="price">₮3,000</div></div>
        <div class="menu-item"><div><div class="name">Капучино</div><div class="desc">Итали кофе</div></div><div class="price">₮6,000</div></div>
      </div>
    </div>
  </section>
  <section class="gallery">
    <div class="container">
      <h2>Зурагнууд</h2>
      <div class="gallery-grid">
        <div class="gallery-item">🍽️</div>
        <div class="gallery-item">🥘</div>
        <div class="gallery-item">🍷</div>
      </div>
    </div>
  </section>
  <section class="contact">
    <div class="container">
      <h2>Холбогдох</h2>
      <p>Утас: +976 9999 8888</p>
      <p>Хаяг: УБ хот, СБД, 1-р хороо</p>
    </div>
  </section>
  <footer>
    <div class="container">
      <p>&copy; 2026 Ресторан. Бүх эрх хуулиар хамгаалагдсан.</p>
    </div>
  </footer>
</body>
</html>`,

  blog: `<!DOCTYPE html>
<html lang="mn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Блог</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; background: #fafafa; }
    .container { max-width: 800px; margin: 0 auto; padding: 0 20px; }
    header { background: white; border-bottom: 1px solid #eee; padding: 20px 0; }
    header .inner { display: flex; align-items: center; justify-content: space-between; }
    header h1 { font-size: 24px; }
    header nav a { margin-left: 20px; color: #555; text-decoration: none; font-size: 14px; }
    .hero { background: linear-gradient(135deg, #FF6B9D, #FF3366); color: white; padding: 60px 0; text-align: center; margin-bottom: 40px; }
    .hero h2 { font-size: 36px; margin-bottom: 12px; }
    .hero p { font-size: 16px; opacity: 0.9; }
    .posts { padding-bottom: 60px; }
    .post-card { background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; border: 1px solid #eee; }
    .post-card .meta { font-size: 12px; color: #888; margin-bottom: 8px; }
    .post-card h3 { font-size: 20px; margin-bottom: 8px; }
    .post-card h3 a { color: #333; text-decoration: none; }
    .post-card h3 a:hover { color: #FF3366; }
    .post-card p { color: #666; font-size: 14px; line-height: 1.6; }
    .post-card .tags { margin-top: 12px; }
    .post-card .tag { display: inline-block; background: #f0f0f0; padding: 4px 10px; border-radius: 12px; font-size: 12px; color: #666; margin-right: 6px; }
    footer { background: #1a1a2e; color: #aaa; padding: 30px 0; text-align: center; font-size: 14px; }
  </style>
</head>
<body>
  <header>
    <div class="container inner">
      <h1>БЛОГ</h1>
      <nav>
        <a href="#">Нүүр</a>
        <a href="#">Нийтлэл</a>
        <a href="#">Тухай</a>
      </nav>
    </div>
  </header>
  <section class="hero">
    <div class="container">
      <h2>Миний блог</h2>
      <p>Технологи, амьдрал, бодол санаа</p>
    </div>
  </section>
  <section class="posts">
    <div class="container">
      <div class="post-card">
        <div class="meta">2026.04.01 &bull; 5 мин</div>
        <h3><a href="#">Хиймэл оюун ухааны ирээдүй</a></h3>
        <p>AI технологи хурдацтай хөгжиж байна. Энэ нийтлэлд бид хиймэл оюун ухааны ирээдүйн чиг хандлагын талаар авч хэлэлцэнэ...</p>
        <div class="tags"><span class="tag">AI</span><span class="tag">Технологи</span></div>
      </div>
      <div class="post-card">
        <div class="meta">2026.03.28 &bull; 3 мин</div>
        <h3><a href="#">Вэб хөгжүүлэлтийн шинэ чиг хандлага</a></h3>
        <p>2026 онд вэб хөгжүүлэлтийн салбарт ямар шинэ технологиуд гарч ирж байна вэ? Next.js, Remix болон бусад...</p>
        <div class="tags"><span class="tag">Вэб</span><span class="tag">Next.js</span></div>
      </div>
      <div class="post-card">
        <div class="meta">2026.03.20 &bull; 7 мин</div>
        <h3><a href="#">Монголд IT салбар</a></h3>
        <p>Монгол улсын IT салбарын өнөөгийн байдал, боломж, сорилтуудын талаар дэлгэрэнгүй...</p>
        <div class="tags"><span class="tag">Монгол</span><span class="tag">IT</span></div>
      </div>
    </div>
  </section>
  <footer>
    <div class="container">
      <p>&copy; 2026 Блог. Бүх эрх хуулиар хамгаалагдсан.</p>
    </div>
  </footer>
</body>
</html>`,
};

const templateButtons = [
  { key: "blank", label: "Хоосон" },
  { key: "business", label: "Бизнес" },
  { key: "shop", label: "Дэлгүүр" },
  { key: "restaurant", label: "Ресторан" },
  { key: "blog", label: "Блог" },
];

export default function WebsiteEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [html, setHtml] = useState("");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { data: website, isLoading } = trpc.website.getWebsite.useQuery({ id });
  const saveMutation = trpc.website.saveWebsite.useMutation();
  const publishMutation = trpc.website.publishWebsite.useMutation();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (website) {
      if (website.publishedHtml) {
        setHtml(website.publishedHtml);
      } else if (website.template && TEMPLATES[website.template]) {
        setHtml(TEMPLATES[website.template]);
      } else {
        setHtml(TEMPLATES.blank);
      }
    }
  }, [website]);

  // Update preview when html changes
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = html;
    }
  }, [html]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await saveMutation.mutateAsync({ id, htmlContent: html });
      utils.website.getWebsite.invalidate({ id });
    } catch (e) {
      // error handled by trpc
    }
    setSaving(false);
  }, [id, html, saveMutation, utils]);

  const handlePublish = useCallback(async () => {
    setPublishing(true);
    try {
      await saveMutation.mutateAsync({ id, htmlContent: html });
      await publishMutation.mutateAsync({ id });
      utils.website.getWebsite.invalidate({ id });
    } catch (e) {
      // error handled by trpc
    }
    setPublishing(false);
  }, [id, html, saveMutation, publishMutation, utils]);

  const insertTemplate = (key: string) => {
    if (html.trim() && html !== TEMPLATES.blank) {
      if (!confirm("Одоогийн контентыг загвараар солих уу?")) return;
    }
    setHtml(TEMPLATES[key] || TEMPLATES.blank);
  };

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSave]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-v" />
      </div>
    );
  }

  if (!website) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-3">
        <p className="text-txt-3">Вэбсайт олдсонгүй</p>
        <button onClick={() => router.push("/dashboard/website-builder")} className="text-v hover:underline">
          Буцах
        </button>
      </div>
    );
  }

  return (
    <div className="-m-8 flex h-[calc(100vh-64px)] flex-col">
      {/* Top bar */}
      <div className="flex h-12 items-center justify-between border-b border-white/[0.04] bg-bg-2 px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/website-builder")}
            className="flex items-center gap-1.5 text-[12px] text-txt-3 transition-colors hover:text-txt"
          >
            <ArrowLeft size={14} />
            Буцах
          </button>
          <div className="h-4 w-px bg-white/[0.06]" />
          <span className="text-[13px] font-semibold text-txt">{website.name}</span>
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
            website.status === "PUBLISHED" ? "bg-t/15 text-t" : "bg-white/[0.06] text-txt-3"
          }`}>
            {website.status === "PUBLISHED" ? "Нийтлэгдсэн" : "Ноорог"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Template presets */}
          <div className="mr-2 flex items-center gap-1">
            {templateButtons.map((t) => (
              <button
                key={t.key}
                onClick={() => insertTemplate(t.key)}
                className="rounded-md px-2 py-1 text-[10px] font-medium text-txt-3 transition-all hover:bg-white/[0.04] hover:text-txt-2"
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-white/[0.06]" />

          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all ${
              showPreview ? "bg-v/10 text-v-soft" : "text-txt-3 hover:bg-white/[0.04] hover:text-txt-2"
            }`}
          >
            {showPreview ? <Code size={13} /> : <Eye size={13} />}
            {showPreview ? "Код" : "Урьдчилан үзэх"}
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[12px] font-medium text-txt-2 transition-all hover:bg-white/[0.04] disabled:opacity-50"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Хадгалах
          </button>

          <button
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-1.5 rounded-lg bg-v px-3 py-1.5 text-[12px] font-bold text-white shadow-[0_0_12px_rgba(108,99,255,0.2)] transition-all hover:shadow-[0_0_20px_rgba(108,99,255,0.35)] disabled:opacity-50"
          >
            {publishing ? <Loader2 size={13} className="animate-spin" /> : <Globe size={13} />}
            Нийтлэх
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex flex-1 overflow-hidden">
        {showPreview ? (
          /* Full preview mode */
          <div className="flex-1 bg-white">
            <iframe
              ref={iframeRef}
              srcDoc={html}
              className="h-full w-full border-0"
              title="Preview"
              sandbox="allow-scripts"
            />
          </div>
        ) : (
          <>
            {/* Code editor */}
            <div className="flex flex-1 flex-col">
              <div className="flex items-center gap-2 border-b border-white/[0.04] bg-[#0d0d14] px-4 py-2">
                <Code size={13} className="text-txt-3" />
                <span className="text-[11px] text-txt-3">HTML</span>
                <span className="text-[10px] text-txt-3/50">Ctrl+S хадгалах</span>
              </div>
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                spellCheck={false}
                className="flex-1 resize-none border-0 bg-[#0d0d14] p-4 font-mono text-[13px] leading-6 text-[#e0def4] outline-none placeholder:text-txt-3 selection:bg-v/30"
                placeholder="HTML код оруулна уу..."
              />
            </div>

            {/* Live preview */}
            <div className="flex w-1/2 flex-col border-l border-white/[0.04]">
              <div className="flex items-center gap-2 border-b border-white/[0.04] bg-bg-2 px-4 py-2">
                <Layout size={13} className="text-txt-3" />
                <span className="text-[11px] text-txt-3">Урьдчилсан харагдац</span>
              </div>
              <div className="flex-1 bg-white">
                <iframe
                  ref={iframeRef}
                  srcDoc={html}
                  className="h-full w-full border-0"
                  title="Preview"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
