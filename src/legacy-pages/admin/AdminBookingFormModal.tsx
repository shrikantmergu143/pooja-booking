import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import type { FormInstance } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Booking, Pandit, Pooja } from '../../types/index.ts';
import { api, BookingRequest } from '../../services/api.ts';
import { useLanguage } from '../../hooks/useLanguage.tsx';
import { useToaster } from '../../hooks/useToaster.ts';

interface FormValues {
  fullName: string;
  phone: string;
  email?: string;
  gotra: string;
  rashi: string;
  dateOfBirth: Dayjs;
  birthPlace: string;
  poojaId?: string;
  packageId?: string;
  serviceMode: 'HOME' | 'VENUE' | 'ONLINE';
  appointmentStartsAt: Dayjs;
  preferredPanditId?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  customerNotes?: string;
}

interface AdminBookingFormModalProps {
  open: boolean;
  booking?: Booking | null;
  onClose: () => void;
  onSaved: (booking: Booking) => void;
}

const requiredWhenOnsite = (form: FormInstance<FormValues>, requiredMessage: string) => ({
  validator: (_: unknown, value: string) =>
    form.getFieldValue('serviceMode') === 'ONLINE' || value?.trim()
      ? Promise.resolve()
      : Promise.reject(new Error(requiredMessage)),
});

export const AdminBookingFormModal: React.FC<AdminBookingFormModalProps> = ({
  open,
  booking,
  onClose,
  onSaved,
}) => {
  const toaster = useToaster();
  const { t } = useLanguage();
  const [form] = Form.useForm<FormValues>();
  const [poojas, setPoojas] = useState<Pooja[]>([]);
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(booking);
  const selectedPoojaId = Form.useWatch('poojaId', form);
  const serviceMode = Form.useWatch('serviceMode', form);
  const selectedPooja = poojas.find((item) => item.id === selectedPoojaId);

  useEffect(() => {
    if (!open || isEdit) return;
    let active = true;
    setLoadingCatalog(true);
    Promise.all([api.getPoojas(), api.getAllPanditsAdmin()])
      .then(([catalog, activePandits]) => {
        if (active) {
          setPoojas(catalog);
          setPandits(activePandits.filter((pandit) => pandit.isActive));
        }
      })
      .catch((error: Error) => toaster.error(error.message || t('adminBookingForm.loadFailed')))
      .finally(() => {
        if (active) setLoadingCatalog(false);
      });
    return () => {
      active = false;
    };
  }, [open, isEdit]);

  useEffect(() => {
    if (!open) return;
    if (booking) {
      form.setFieldsValue({
        fullName: booking.customer.fullName,
        phone: booking.customer.phone,
        email: booking.customer.email || undefined,
        gotra: booking.customer.gotra,
        rashi: booking.customer.rashi,
        dateOfBirth: booking.customer.dateOfBirth
          ? dayjs(booking.customer.dateOfBirth)
          : undefined,
        birthPlace: booking.customer.birthPlace,
        addressLine1: booking.serviceAddress?.addressLine1,
        addressLine2: booking.serviceAddress?.addressLine2,
        city: booking.serviceAddress?.city,
        state: booking.serviceAddress?.state,
        postalCode: booking.serviceAddress?.postalCode,
        country: booking.serviceAddress?.country,
        customerNotes: booking.customerNotes,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        serviceMode: 'HOME',
        appointmentStartsAt: dayjs().add(2, 'day').hour(9).minute(0),
        state: 'Maharashtra',
        country: 'India',
      });
    }
  }, [booking, form, open]);

  const submit = async (values: FormValues) => {
    setSaving(true);
    try {
      if (booking) {
        const updated = await api.updateAdminBooking(booking.id, {
          customer: {
            fullName: values.fullName,
            phone: values.phone,
            email: values.email?.trim() || undefined,
            gotra: values.gotra,
            rashi: values.rashi,
            dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
            birthPlace: values.birthPlace,
          },
          serviceAddress: booking.serviceMode === 'ONLINE'
            ? undefined
            : {
                addressLine1: values.addressLine1 || '',
                addressLine2: values.addressLine2,
                city: values.city || '',
                state: values.state || '',
                postalCode: values.postalCode || '',
                country: values.country || '',
              },
          customerNotes: values.customerNotes || '',
        });
        toaster.success(t('adminBookingForm.updated'));
        onSaved(updated);
        return;
      }

      if (!values.poojaId || !values.packageId || !values.appointmentStartsAt) {
        toaster.error(t('adminBookingForm.requiredSelection'));
        return;
      }

      const payload: BookingRequest = {
        bookingType: 'STANDARD',
        poojaId: values.poojaId,
        packageId: values.packageId,
        customer: {
          fullName: values.fullName,
          phone: values.phone,
          email: values.email?.trim() || undefined,
          countryCode: '+91',
          gotra: values.gotra,
          rashi: values.rashi,
          dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
          birthPlace: values.birthPlace,
        },
        serviceMode: values.serviceMode,
        serviceAddress: values.serviceMode === 'ONLINE'
          ? undefined
          : {
              addressLine1: values.addressLine1 || '',
              addressLine2: values.addressLine2,
              city: values.city || '',
              state: values.state || '',
              postalCode: values.postalCode || '',
              country: values.country || 'India',
            },
        appointmentStartsAt: values.appointmentStartsAt.toISOString(),
        preferredPanditId: values.preferredPanditId || undefined,
        customerNotes: values.customerNotes,
      };
      const created = await api.createAdminBooking(payload);
      toaster.success(t('adminBookingForm.created', { reference: created.bookingReference }));
      onSaved(created);
    } catch (error) {
      toaster.error(error instanceof Error ? error.message : t('adminBookingForm.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={isEdit
        ? t('adminBookingForm.editTitle', { reference: booking?.bookingReference || '' })
        : t('adminBookingForm.createTitle')}
      open={open}
      onCancel={onClose}
      footer={null}
      width={760}
      destroyOnClose
    >
      <Form<FormValues>
        form={form}
        layout="vertical"
        onFinish={submit}
        onValuesChange={(changed) => {
          if ('poojaId' in changed) form.setFieldValue('packageId', undefined);
        }}
        className="pt-3"
      >
        {!isEdit && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Form.Item name="poojaId" label={t('adminBookingForm.ceremony')} rules={[{ required: true }]}>
                <Select
                  loading={loadingCatalog}
                  placeholder={t('adminBookingForm.chooseCeremony')}
                  options={poojas.map((pooja) => ({
                    value: pooja.id,
                    label: pooja.name,
                  }))}
                />
              </Form.Item>
              <Form.Item name="packageId" label={t('adminBookingForm.package')} rules={[{ required: true }]}>
                <Select
                  placeholder={t('adminBookingForm.choosePackage')}
                  disabled={!selectedPooja}
                  options={(selectedPooja?.packages || [])
                    .filter((pkg) => pkg.isActive)
                    .map((pkg) => ({ value: pkg.id, label: `${pkg.name} · ₹${pkg.price}` }))}
                />
              </Form.Item>
              <Form.Item name="appointmentStartsAt" label={t('adminBookingForm.appointmentDateTime')} rules={[{ required: true }]}>
                <DatePicker
                  showTime
                  className="w-full"
                  disabledDate={(date) => date.isBefore(dayjs().startOf('day'))}
                />
              </Form.Item>
              <Form.Item name="preferredPanditId" label={t('adminBookingForm.assignPandit')}>
                <Select
                  allowClear
                  placeholder={t('adminBookingForm.defaultPandit')}
                  options={pandits.map((pandit) => ({
                    value: pandit.id,
                    label: pandit.fullName,
                  }))}
                />
              </Form.Item>
              <Form.Item name="serviceMode" label={t('adminBookingForm.serviceMode')} rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'HOME', label: t('adminBookingForm.home') },
                    { value: 'VENUE', label: t('adminBookingForm.venue') },
                    { value: 'ONLINE', label: t('adminBookingForm.online') },
                  ]}
                />
              </Form.Item>
            </div>
          </>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Form.Item name="fullName" label={t('adminBookingForm.devoteeName')} rules={[{ required: true }]}>
            <Input maxLength={150} />
          </Form.Item>
          <Form.Item
            name="phone"
            label={t('adminBookingForm.mobile')}
            rules={[
              { required: true, message: t('adminBookingForm.mobileRequired') },
              { pattern: /^\d{10}$/, message: t('adminBookingForm.mobileInvalid') },
            ]}
          >
            <Input maxLength={10} />
          </Form.Item>
          <Form.Item name="email" label={t('adminBookingForm.optionalEmail')} rules={[{ type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gotra" label={t('adminBookingForm.gotra')} rules={[{ required: true }]}>
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item name="rashi" label={t('adminBookingForm.rashi')} rules={[{ required: true }]}>
            <Input maxLength={50} />
          </Form.Item>
          <Form.Item name="dateOfBirth" label={t('adminBookingForm.dateOfBirth')} rules={[{ required: true }]}>
            <DatePicker
              className="w-full"
              disabledDate={(date) => date.isAfter(dayjs(), 'day')}
            />
          </Form.Item>
          <Form.Item name="birthPlace" label={t('adminBookingForm.birthPlace')} rules={[{ required: true }]}>
            <Input maxLength={150} />
          </Form.Item>
        </div>

        {!isEdit && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="addressLine1" label={t('adminBookingForm.address')} rules={[requiredWhenOnsite(form, t('adminBookingForm.inPersonRequired'))]}>
              <Input />
            </Form.Item>
            <Form.Item name="addressLine2" label={t('adminBookingForm.addressLine2')}>
              <Input />
            </Form.Item>
            <Form.Item name="city" label={t('adminBookingForm.city')} rules={[requiredWhenOnsite(form, t('adminBookingForm.inPersonRequired'))]}>
              <Input />
            </Form.Item>
            <Form.Item name="state" label={t('adminBookingForm.state')} rules={[requiredWhenOnsite(form, t('adminBookingForm.inPersonRequired'))]}>
              <Input />
            </Form.Item>
            <Form.Item name="postalCode" label={t('adminBookingForm.postalCode')} rules={[requiredWhenOnsite(form, t('adminBookingForm.inPersonRequired'))]}>
              <Input />
            </Form.Item>
            <Form.Item name="country" label={t('adminBookingForm.country')} rules={[requiredWhenOnsite(form, t('adminBookingForm.inPersonRequired'))]}>
              <Input />
            </Form.Item>
          </div>
        )}

        {isEdit && booking?.serviceMode !== 'ONLINE' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="addressLine1" label={t('adminBookingForm.address')}>
              <Input />
            </Form.Item>
            <Form.Item name="addressLine2" label={t('adminBookingForm.addressLine2')}>
              <Input />
            </Form.Item>
            <Form.Item name="city" label={t('adminBookingForm.city')}>
              <Input />
            </Form.Item>
            <Form.Item name="state" label={t('adminBookingForm.state')}>
              <Input />
            </Form.Item>
            <Form.Item name="postalCode" label={t('adminBookingForm.postalCode')}>
              <Input />
            </Form.Item>
            <Form.Item name="country" label={t('adminBookingForm.country')}>
              <Input />
            </Form.Item>
          </div>
        )}

        <Form.Item name="customerNotes" label={t('adminBookingForm.customerNotes')}>
          <Input.TextArea rows={3} maxLength={2000} />
        </Form.Item>
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>{t('adminBookingForm.cancel')}</Button>
          <Button type="primary" htmlType="submit" loading={saving}>
            {isEdit ? t('adminBookingForm.saveChanges') : t('adminBookingForm.createTitle')}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
