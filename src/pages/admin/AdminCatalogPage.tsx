import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.ts';
import { Pooja, PoojaCategory, PoojaPackage, PoojaAddon, Pandit } from '../../types/index.ts';
import {
  Tabs,
  Table,
  Button,
  Modal,
  Input,
  Select,
  Switch,
  message,
  InputNumber,
  Tag,
} from 'antd';
import { Plus, Edit, BookOpen, Layers, Tag as TagIcon, Flame, Quote, Sparkles } from 'lucide-react';

const { TextArea } = Input;
const { Option } = Select;

export const AdminCatalogPage: React.FC = () => {
  const [categories, setCategories] = useState<PoojaCategory[]>([]);
  const [poojas, setPoojas] = useState<Pooja[]>([]);
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit / Create Pooja Modal
  const [poojaModalOpen, setPoojaModalOpen] = useState(false);
  const [editingPooja, setEditingPooja] = useState<Partial<Pooja> | null>(null);

  // Edit / Create Category Modal
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<PoojaCategory> | null>(null);

  // Action Loading
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const [cats, pjs, pndts] = await Promise.all([
        api.getAdminCategories(),
        api.getAdminPoojas(),
        api.getAllPanditsAdmin(),
      ]);
      setCategories(cats);
      setPoojas(pjs);
      setPandits(pndts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save Pooja
  const handleSavePooja = async () => {
    if (!editingPooja?.name?.trim()) {
      message.error('Please enter a Pooja title.');
      return;
    }
    setSaving(true);
    try {
      await api.upsertPooja(editingPooja);
      message.success('Pooja successfully saved!');
      setPoojaModalOpen(false);
      setEditingPooja(null);
      await loadData();
    } catch (err: any) {
      message.error(err.message || 'Failed to save pooja.');
    } finally {
      setSaving(false);
    }
  };

  // Save Category
  const handleSaveCategory = async () => {
    if (!editingCategory?.name?.trim()) {
      message.error('Please enter a Category name.');
      return;
    }
    setSaving(true);
    try {
      await api.upsertCategory(editingCategory);
      message.success('Category successfully saved!');
      setCategoryModalOpen(false);
      setEditingCategory(null);
      await loadData();
    } catch (err: any) {
      message.error(err.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  // --- Poojas Columns ---
  const poojaColumns = [
    {
      title: 'Ceremony Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Pooja) => (
        <div>
          <div className="font-bold text-xs text-stone-900">{name}</div>
          <div className="text-[10px] text-stone-500 font-mono">/{record.slug}</div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (cat: string) => <Tag color="orange">{cat}</Tag>,
    },
    {
      title: 'Duration',
      dataIndex: 'durationMinutes',
      key: 'durationMinutes',
      render: (m: number) => <span className="font-mono text-xs">{m} mins</span>,
    },
    {
      title: 'Default Priest',
      dataIndex: 'defaultPanditId',
      key: 'defaultPanditId',
      render: (id: string) => {
        const p = pandits.find((p) => p.id === id);
        return <span className="text-xs">{p?.fullName || 'Auto / None'}</span>;
      },
    },
    {
      title: 'Active Tiers',
      key: 'packages',
      render: (_: any, record: Pooja) => (
        <span className="text-xs font-semibold text-stone-700">
          {record.packages.length} package(s)
        </span>
      ),
    },
    {
      title: 'Quote & Shloka',
      key: 'quote',
      render: (_: any, record: Pooja) => (
        <div className="space-y-1 max-w-[210px]">
          <div className="flex items-center gap-1">
            {record.allowCustomQuote !== false ? (
              <Tag color="cyan" className="text-[10px] font-mono m-0">
                Custom Quote: Active (₹{(record.customQuoteStartingPrice || 11000).toLocaleString('en-IN')}+)
              </Tag>
            ) : (
              <Tag color="default" className="text-[10px] font-mono m-0">
                Custom Quote: Off
              </Tag>
            )}
          </div>
          {record.quote ? (
            <div
              className="text-[10px] text-amber-900 bg-amber-50/80 px-2 py-0.5 rounded border border-amber-200/60 truncate italic font-serif-title"
              title={record.quote}
            >
              "{record.quote}"
            </div>
          ) : (
            <span className="text-[10px] text-stone-400 italic block">No quote assigned</span>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'default'}>{active ? 'ACTIVE' : 'INACTIVE'}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Pooja) => (
        <Button
          size="small"
          onClick={() => {
            setEditingPooja({ ...record });
            setPoojaModalOpen(true);
          }}
          icon={<Edit className="w-3.5 h-3.5" />}
        >
          Edit
        </Button>
      ),
    },
  ];

  // --- Categories Columns ---
  const categoryColumns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: PoojaCategory) => (
        <div>
          <div className="font-bold text-xs text-stone-900">{name}</div>
          <div className="text-[10px] text-stone-400 font-mono">/{record.slug}</div>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (d: string) => <span className="text-xs text-stone-600 line-clamp-1">{d}</span>,
    },
    {
      title: 'Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      render: (ord: number) => <span className="font-mono text-xs">{ord}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'default'}>{active ? 'ACTIVE' : 'INACTIVE'}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: PoojaCategory) => (
        <Button
          size="small"
          onClick={() => {
            setEditingCategory({ ...record });
            setCategoryModalOpen(true);
          }}
          icon={<Edit className="w-3.5 h-3.5" />}
        >
          Edit
        </Button>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'poojas',
      label: `Ceremonies (${poojas.length})`,
      children: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-stone-500">
              Manage ceremonies, duration, default priests, and ritual instructions.
            </span>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setEditingPooja({
                  name: '',
                  shortDescription: '',
                  description: '',
                  purpose: '',
                  quote: '',
                  allowCustomQuote: true,
                  customQuoteStartingPrice: 11000,
                  customQuoteNotes: '',
                  durationMinutes: 120,
                  categoryId: categories[0]?.id || 'cat-1',
                  isActive: true,
                  supportedModes: ['HOME', 'VENUE', 'ONLINE'],
                });
                setPoojaModalOpen(true);
              }}
              icon={<Plus className="w-3.5 h-3.5" />}
              className="bg-[#7A1C24]"
            >
              Add New Ceremony
            </Button>
          </div>
          <Table
            dataSource={poojas}
            columns={poojaColumns}
            rowKey="id"
            loading={loading}
            pagination={false}
            size="middle"
            className="text-xs overflow-x-auto"
          />
        </div>
      ),
    },
    {
      key: 'categories',
      label: `Categories (${categories.length})`,
      children: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-stone-500">
              Ceremony taxonomy, groupings, and public display sort order.
            </span>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setEditingCategory({
                  name: '',
                  description: '',
                  sortOrder: categories.length + 1,
                  isActive: true,
                });
                setCategoryModalOpen(true);
              }}
              icon={<Plus className="w-3.5 h-3.5" />}
              className="bg-[#7A1C24]"
            >
              Add Category
            </Button>
          </div>
          <Table
            dataSource={categories}
            columns={categoryColumns}
            rowKey="id"
            loading={loading}
            pagination={false}
            size="middle"
            className="text-xs overflow-x-auto"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-serif-title text-2xl font-bold text-stone-900">
          Catalog & Ceremony Configuration
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Configure pooja details, package tiers, pricing snapshots, and default Pandit assignment rules.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
        <Tabs items={tabItems} defaultActiveKey="poojas" />
      </div>

      {/* Edit Pooja Modal */}
      <Modal
        title={editingPooja?.id ? 'Edit Ceremony' : 'Create New Vedic Ceremony'}
        open={poojaModalOpen}
        onOk={handleSavePooja}
        onCancel={() => {
          setPoojaModalOpen(false);
          setEditingPooja(null);
        }}
        confirmLoading={saving}
        width={680}
        okText="Save Ceremony"
      >
        {editingPooja && (
          <div className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold block mb-1">Ceremony Title *</label>
                <Input
                  value={editingPooja.name}
                  onChange={(e) => setEditingPooja({ ...editingPooja, name: e.target.value })}
                  placeholder="e.g. Navgrah Shanti Havan"
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Category *</label>
                <Select
                  value={editingPooja.categoryId}
                  onChange={(val) => setEditingPooja({ ...editingPooja, categoryId: val })}
                  className="w-full"
                >
                  {categories.map((c) => (
                    <Option key={c.id} value={c.id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Short Summary (Catalog snippet) *</label>
              <Input
                value={editingPooja.shortDescription}
                onChange={(e) => setEditingPooja({ ...editingPooja, shortDescription: e.target.value })}
                placeholder="One sentence Vedic summary"
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Full Ceremony Description</label>
              <TextArea
                rows={3}
                value={editingPooja.description}
                onChange={(e) => setEditingPooja({ ...editingPooja, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold block mb-1">Duration (Minutes)</label>
                <InputNumber
                  min={30}
                  max={600}
                  value={editingPooja.durationMinutes || 120}
                  onChange={(v) => setEditingPooja({ ...editingPooja, durationMinutes: v || 120 })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Default Pandit Override</label>
                <Select
                  value={editingPooja.defaultPanditId || ''}
                  onChange={(val) => setEditingPooja({ ...editingPooja, defaultPanditId: val || undefined })}
                  className="w-full"
                >
                  <Option value="">Auto / System Default</Option>
                  {pandits.map((p) => (
                    <Option key={p.id} value={p.id}>
                      {p.fullName}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold block mb-1">Cover Image URL</label>
                <Input
                  value={editingPooja.imageUrl || ''}
                  onChange={(e) => setEditingPooja({ ...editingPooja, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Ceremonial Purpose & Benefits</label>
                <Input
                  value={editingPooja.purpose || ''}
                  onChange={(e) => setEditingPooja({ ...editingPooja, purpose: e.target.value })}
                  placeholder="e.g. Removing hurdles, business growth, health blessings"
                />
              </div>
            </div>

            {/* Quote & Custom Quote Section */}
            <div className="p-4 bg-gradient-to-br from-amber-50/80 to-orange-50/50 rounded-xl border border-amber-200/90 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#7A1C24] text-white rounded-lg shadow-xs">
                    <Quote className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-amber-950 uppercase tracking-wide block">
                      Spiritual Quote & Custom Quote Settings
                    </span>
                    <span className="text-[11px] text-amber-900/70">
                      Configure sacred shlokas and enable bespoke quote requests for devotees
                    </span>
                  </div>
                </div>
                {editingPooja.allowCustomQuote !== false && (
                  <Tag color="cyan" className="font-mono text-[10px]">
                    Quote Mode Enabled
                  </Tag>
                )}
              </div>

              {/* 1. Vedic Quote / Sacred Shloka */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <span>Sacred Vedic Quote / Shloka</span>
                    <Sparkles className="w-3 h-3 text-amber-600" />
                  </label>
                  <span className="text-[10px] text-stone-500 font-mono">Appears on ceremony header</span>
                </div>
                <TextArea
                  rows={2}
                  value={editingPooja.quote || ''}
                  onChange={(e) => setEditingPooja({ ...editingPooja, quote: e.target.value })}
                  placeholder="e.g. वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥"
                  className="font-serif-title text-stone-800"
                />
                <span className="text-[10px] text-stone-500 mt-1 block">
                  Add the auspicious Sanskrit shloka, Vedic mantra, or spiritual quote to be displayed on the Pooja Detail page.
                </span>
              </div>

              {/* 2. Custom Quote Request Settings */}
              <div className="pt-3 border-t border-amber-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-stone-800 block">
                      Enable Custom Quote Requests for this Ceremony
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Allows devotees to request tailored estimates for bespoke rituals, extended havan, or special venues.
                    </span>
                  </div>
                  <Switch
                    checked={editingPooja.allowCustomQuote ?? true}
                    onChange={(checked) => setEditingPooja({ ...editingPooja, allowCustomQuote: checked })}
                  />
                </div>

                {(editingPooja.allowCustomQuote ?? true) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 bg-white/70 p-3 rounded-lg border border-amber-200/50">
                    <div>
                      <label className="text-xs font-bold block mb-1 text-stone-800">
                        Starting / Base Quote Price (₹)
                      </label>
                      <InputNumber
                        min={1000}
                        step={500}
                        value={editingPooja.customQuoteStartingPrice ?? 11000}
                        onChange={(val) =>
                          setEditingPooja({ ...editingPooja, customQuoteStartingPrice: val || 11000 })
                        }
                        className="w-full"
                        formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      />
                      <span className="text-[10px] text-stone-400 mt-0.5 block">
                        Baseline proposal guidance for devotees
                      </span>
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-1 text-stone-800">
                        Custom Quote Notes & Scope
                      </label>
                      <Input
                        value={editingPooja.customQuoteNotes || ''}
                        onChange={(e) => setEditingPooja({ ...editingPooja, customQuoteNotes: e.target.value })}
                        placeholder="e.g. Includes custom havan, 2+ priests, full samagri"
                      />
                      <span className="text-[10px] text-stone-400 mt-0.5 block">
                        Internal or devotee-facing quote guidelines
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Status</label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editingPooja.isActive ?? true}
                  onChange={(v) => setEditingPooja({ ...editingPooja, isActive: v })}
                />
                <span className="text-xs text-stone-600">
                  {editingPooja.isActive ?? true ? 'Active & Bookable by Public' : 'Inactive / Hidden'}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        title={editingCategory?.id ? 'Edit Category' : 'Create Category'}
        open={categoryModalOpen}
        onOk={handleSaveCategory}
        onCancel={() => {
          setCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        confirmLoading={saving}
        okText="Save Category"
      >
        {editingCategory && (
          <div className="space-y-4 py-2 text-xs">
            <div>
              <label className="text-xs font-bold block mb-1">Category Name *</label>
              <Input
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                placeholder="e.g. Sanskars & Rites"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Description</label>
              <TextArea
                rows={2}
                value={editingCategory.description}
                onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Display Sort Order</label>
              <InputNumber
                value={editingCategory.sortOrder || 1}
                onChange={(v) => setEditingCategory({ ...editingCategory, sortOrder: v || 1 })}
                className="w-full"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
