import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Table } from 'antd';
import { CalendarPlus, Pencil, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import { api } from '../../services/api.ts';
import { Appointment } from '../../types/index.ts';
import { useLanguage } from '../../hooks/useLanguage.tsx';
import { useToaster } from '../../hooks/useToaster.ts';

type AppointmentFormValues = Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>;

const EMPTY_APPOINTMENT: AppointmentFormValues = {
  name: '',
  gotra: '',
  rashi: '',
  dateOfBirth: '',
  place: '',
  appointmentDate: '',
  appointmentTime: '',
  mobileNumber: '',
  email: '',
};

export const AdminAppointmentsPage: React.FC = () => {
  const toaster = useToaster();
  const { t } = useLanguage();
  const [form] = Form.useForm<AppointmentFormValues>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      setAppointments(await api.getAdminAppointments());
    } catch (error) {
      toaster.error(error instanceof Error ? error.message : t('adminAppointments.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAppointments();
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.setFieldsValue({ ...EMPTY_APPOINTMENT, appointmentDate: dayjs().format('YYYY-MM-DD') });
    setModalOpen(true);
  };

  const openEdit = (appointment: Appointment) => {
    setEditing(appointment);
    form.setFieldsValue({
      name: appointment.name,
      gotra: appointment.gotra,
      rashi: appointment.rashi,
      dateOfBirth: appointment.dateOfBirth,
      place: appointment.place,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime.slice(0, 5),
      mobileNumber: appointment.mobileNumber,
      email: appointment.email || '',
    });
    setModalOpen(true);
  };

  const saveAppointment = async (values: AppointmentFormValues) => {
    setSaving(true);
    const payload = {
      ...values,
      email: values.email?.trim() || null,
      mobileNumber: values.mobileNumber.trim(),
    };
    try {
      if (editing) {
        await api.updateAdminAppointment(editing.id, payload);
        toaster.success(t('adminAppointments.updated'));
      } else {
        await api.createAdminAppointment(payload);
        toaster.success(t('adminAppointments.created'));
      }
      setModalOpen(false);
      await loadAppointments();
    } catch (error) {
      toaster.error(error instanceof Error ? error.message : t('adminAppointments.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const deleteAppointment = (appointment: Appointment) => {
    Modal.confirm({
      title: t('adminAppointments.deleteTitle', { name: appointment.name }),
      content: t('adminAppointments.deleteWarning'),
      okText: t('adminAppointments.delete'),
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await api.deleteAdminAppointment(appointment.id);
          toaster.success(t('adminAppointments.deleted'));
          await loadAppointments();
        } catch (error) {
          toaster.error(error instanceof Error ? error.message : t('adminAppointments.deleteFailed'));
          throw error;
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif-title text-2xl font-bold text-stone-900">{t('adminAppointments.title')}</h1>
          <p className="text-xs text-stone-500 mt-1">{t('adminAppointments.description')}</p>
        </div>
        <Button type="primary" icon={<CalendarPlus className="w-4 h-4" />} onClick={openCreate} className="bg-[#7A1C24]">
          {t('adminAppointments.add')}
        </Button>
      </div>
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={appointments}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          scroll={{ x: 1100 }}
          columns={[
            { title: t('adminAppointments.appointment'), render: (_: unknown, item: Appointment) => (
              <div>
                <div className="font-semibold text-stone-900">{item.name}</div>
                <div className="text-xs text-stone-500">{item.mobileNumber}</div>
                {item.email && <div className="text-xs text-stone-500">{item.email}</div>}
              </div>
            ) },
            { title: t('adminAppointments.gotra'), dataIndex: 'gotra' },
            { title: t('adminAppointments.rashi'), dataIndex: 'rashi' },
            { title: t('adminAppointments.dateOfBirth'), dataIndex: 'dateOfBirth', render: (value: string) => dayjs(value).format('DD MMM YYYY') },
            { title: t('adminAppointments.place'), dataIndex: 'place' },
            // { title: t('adminAppointments.appointmentDate'), dataIndex: 'appointmentDate', render: (value: string) => dayjs(value).format('DD MMM YYYY') },
            // { title: t('adminAppointments.time'), dataIndex: 'appointmentTime', render: (value: string) => dayjs(`2000-01-01T${value}`).format('hh:mm A') },
            { title: t('adminAppointments.actions'), fixed: 'right', render: (_: unknown, item: Appointment) => (
              <div className="flex gap-2">
                <Button aria-label={t('adminAppointments.editFor', { name: item.name })} icon={<Pencil className="w-3.5 h-3.5" />} onClick={() => openEdit(item)} />
                <Button danger aria-label={t('adminAppointments.deleteFor', { name: item.name })} icon={<Trash2 className="w-3.5 h-3.5" />} onClick={() => deleteAppointment(item)} />
              </div>
            ) },
          ]}
        />
      </div>
      <Modal
        title={editing ? t('adminAppointments.editTitle') : t('adminAppointments.add')}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form<AppointmentFormValues> form={form} layout="vertical" onFinish={saveAppointment} className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="name" label={t('adminAppointments.fullName')} rules={[{ required: true }, { max: 150 }]}><Input maxLength={150} /></Form.Item>
            <Form.Item name="mobileNumber" label={t('adminAppointments.mobile')} rules={[
              { required: true, message: t('adminAppointments.mobileRequired') },
              { pattern: /^\+?[0-9\s()-]{7,30}$/, message: t('adminAppointments.mobileInvalid') },
            ]}><Input type="tel" maxLength={30} /></Form.Item>
            <Form.Item name="email" label={t('adminAppointments.optionalEmail')} rules={[{ type: 'email', message: t('adminAppointments.emailInvalid') }, { max: 255 }]}><Input type="email" maxLength={255} /></Form.Item>
            <Form.Item name="gotra" label={t('adminAppointments.gotra')} rules={[{ required: true }, { max: 150 }]}><Input maxLength={150} /></Form.Item>
            <Form.Item name="rashi" label={t('adminAppointments.rashi')} rules={[{ required: true }, { max: 100 }]}><Input maxLength={100} /></Form.Item>
            <Form.Item name="dateOfBirth" label={t('adminAppointments.dateOfBirth')} rules={[{ required: true }]}><Input type="date" /></Form.Item>
            <Form.Item name="place" label={t('adminAppointments.birthPlace')} rules={[{ required: true }, { max: 180 }]}><Input maxLength={180} /></Form.Item>
            <Form.Item name="appointmentDate" label={t('adminAppointments.appointmentDate')} rules={[{ required: true }]}><Input type="date" /></Form.Item>
            <Form.Item name="appointmentTime" label={t('adminAppointments.appointmentTime')} rules={[{ required: true }]}><Input type="time" /></Form.Item>
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setModalOpen(false)}>{t('adminAppointments.cancel')}</Button>
            <Button type="primary" htmlType="submit" loading={saving} className="bg-[#7A1C24]">
              {editing ? t('adminAppointments.saveChanges') : t('adminAppointments.create')}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
