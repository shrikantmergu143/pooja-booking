import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Spin } from 'antd';
import { FilePlus2, ExternalLink, Save } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { api } from '../../services/api.ts';
import { ContentPage } from '../../types/index.ts';
import { useLanguage } from '../../hooks/useLanguage.tsx';
import { useToaster } from '../../hooks/useToaster.ts';

const DEFAULT_PAGE_SLUGS = new Set(['about-us', 'privacy-policy', 'terms-and-conditions']);
const EDITOR_MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'link'],
    ['clean'],
  ],
};
const EDITOR_FORMATS = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'blockquote',
  'link',
];
export const AdminContentPagesPage: React.FC = () => {
  const toaster = useToaster();
  const { t } = useLanguage();
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [selected, setSelected] = useState<ContentPage | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [status, setStatus] = useState<ContentPage['status']>('DRAFT');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isNew = selected?.id === 'new';

  const loadPages = async (selectSlug?: string) => {
    setLoading(true);
    try {
      const items = await api.getAdminContentPages();
      setPages(items);
      const page = items.find((item) => item.slug === selectSlug) || items[0];
      if (page) selectPage(page);
    } catch (error) {
      toaster.error(error instanceof Error ? error.message : t('adminContent.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPages();
  }, []);

  const selectPage = (page: ContentPage) => {
    setSelected(page);
    setTitle(page.title);
    setSlug(page.slug);
    setContentHtml(page.contentHtml);
    setStatus(page.status);
    setSeoTitle(page.seoTitle || '');
    setSeoDescription(page.seoDescription || '');
  };

  const startNewPage = () => {
    setSelected({
      id: 'new',
      slug: '',
      title: '',
      contentHtml: '',
      status: 'DRAFT',
      createdAt: '',
      updatedAt: '',
    });
    setTitle('');
    setSlug('');
    setContentHtml('');
    setStatus('DRAFT');
    setSeoTitle('');
    setSeoDescription('');
  };

  const savePage = async () => {
    if (!title.trim() || !slug.trim()) {
      toaster.error(t('adminContent.required'));
      return;
    }
    setSaving(true);
    try {
      const saved = isNew
        ? await api.createContentPage({
            slug: slug.trim(),
            title: title.trim(),
            contentHtml,
            status,
            seoTitle: seoTitle.trim() || undefined,
            seoDescription: seoDescription.trim() || undefined,
          })
        : await api.updateContentPage(slug, {
            title: title.trim(),
            contentHtml,
            status,
            seoTitle: seoTitle.trim() || undefined,
            seoDescription: seoDescription.trim() || undefined,
          });
      toaster.success(status === 'PUBLISHED' ? t('adminContent.published') : t('adminContent.draftSaved'));
      await loadPages(saved.slug);
    } catch (error) {
      toaster.error(error instanceof Error ? error.message : t('adminContent.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const deletePage = async () => {
    if (!selected || DEFAULT_PAGE_SLUGS.has(selected.slug)) return;
    try {
      await api.deleteContentPage(selected.slug);
      toaster.success(t('adminContent.deleted'));
      await loadPages();
    } catch (error) {
      toaster.error(error instanceof Error ? error.message : t('adminContent.deleteFailed'));
    }
  };

  if (loading && pages.length === 0) {
    return <div className="min-h-[40vh] flex items-center justify-center"><Spin size="large" /></div>;
  }

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div>
          <h1 className="font-serif-title text-2xl font-bold text-stone-900">{t('adminContent.title')}</h1>
          <p className="text-xs text-stone-500 mt-1">{t('adminContent.description')}</p>
        </div>
        <Button icon={<FilePlus2 className="w-4 h-4" />} onClick={startNewPage}>{t('adminContent.newPage')}</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
        <aside className="bg-white rounded-xl border border-stone-200 p-3 h-fit">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wide px-2 py-2">{t('adminContent.pages')}</div>
          <div className="space-y-1">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => selectPage(page)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                  selected?.id === page.id ? 'bg-amber-50 text-[#7A1C24] font-semibold' : 'hover:bg-stone-50'
                }`}
              >
                <span className="block">{page.title}</span>
                <span className="text-[10px] text-stone-400">/{page.slug} · {page.status.toLowerCase()}</span>
              </button>
            ))}
          </div>
        </aside>

        {selected && (
          <section className="bg-white rounded-xl border border-stone-200 p-5 sm:p-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="text-xs font-semibold text-stone-700">
                {t('adminContent.pageTitle')}
                <Input className="mt-1" value={title} maxLength={180} onChange={(event) => setTitle(event.target.value)} />
              </label>
              <label className="text-xs font-semibold text-stone-700">
                {t('adminContent.slug')}
                <Input
                  className="mt-1"
                  value={slug}
                  disabled={!isNew}
                  maxLength={100}
                  placeholder={t('adminContent.slugPlaceholder')}
                  onChange={(event) => setSlug(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                />
              </label>
              <label className="text-xs font-semibold text-stone-700">
                {t('adminContent.seoTitle')}
                <Input className="mt-1" value={seoTitle} maxLength={255} onChange={(event) => setSeoTitle(event.target.value)} />
              </label>
              <label className="text-xs font-semibold text-stone-700">
                {t('adminContent.seoDescription')}
                <Input className="mt-1" value={seoDescription} maxLength={500} onChange={(event) => setSeoDescription(event.target.value)} />
              </label>
            </div>
            <label className="flex items-center gap-3 text-xs font-semibold text-stone-700">
              {t('adminContent.publicationStatus')}
              <Select
                value={status}
                onChange={setStatus}
                options={[
                  { value: 'DRAFT', label: t('adminContent.draft') },
                  { value: 'PUBLISHED', label: t('adminContent.publishedStatus') },
                ]}
                className="w-36"
              />
            </label>
            <div className="quill-editor">
              <ReactQuill
                theme="snow"
                value={contentHtml}
                onChange={setContentHtml}
                modules={EDITOR_MODULES}
                formats={EDITOR_FORMATS}
                placeholder={t('adminContent.writeContent')}
              />
            </div>
            <div className="flex flex-wrap justify-end gap-2 pt-4">
              {!isNew && status === 'PUBLISHED' && (
                <Button
                  icon={<ExternalLink className="w-4 h-4" />}
                  href={`/${slug}`}
                  target="_blank"
                >
                  {t('adminContent.preview')}
                </Button>
              )}
              {!isNew && !DEFAULT_PAGE_SLUGS.has(slug) && (
                <Button danger onClick={deletePage}>{t('adminContent.deletePage')}</Button>
              )}
              <Button type="primary" icon={<Save className="w-4 h-4" />} loading={saving} onClick={savePage} className="bg-[#7A1C24]">
                {status === 'PUBLISHED' ? t('adminContent.publishPage') : t('adminContent.saveDraft')}
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
