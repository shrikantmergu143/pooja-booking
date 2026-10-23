import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, Modal, Select, message } from 'antd';
import type { FormInstance } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Booking, Pandit, Pooja } from '../../types/index.ts';
import { api, BookingRequest } from '../../services/api.ts';

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

const requiredWhenOnsite = (form: FormInstance<FormValues>) => ({
  validator: (_: unknown, value: string) =>
    form.getFieldValue('serviceMode') === 'ONLINE' || value?.trim()
      ? Promise.resolve()
      : Promise.reject(new Error('Required for in-person appointments.')),
});

export const AdminBookingFormModal: React.FC<AdminBookingFormModalProps> = ({
  open,
  booking,
  onClose,
  onSaved,
}) => {
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
      .catch((error: Error) => message.error(error.message || 'Unable to load booking options.'))
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
        message.success('Booking details updated.');
        onSaved(updated);
        return;
      }

      if (!values.poojaId || !values.packageId || !values.appointmentStartsAt) {
        message.error('Select a ceremony, package, and appointment date/time.');
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
      message.success(`Appointment created: ${created.bookingReference}`);
      onSaved(created);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to save booking.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={isEdit ? `Edit booking ${booking?.bookingReference}` : 'Create appointment'}
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
              <Form.Item name="poojaId" label="Ceremony" rules={[{ required: true }]}>
                <Select
                  loading={loadingCatalog}
                  placeholder="Choose a ceremony"
                  options={poojas.map((pooja) => ({
                    value: pooja.id,
                    label: pooja.name,
                  }))}
                />
              </Form.Item>
              <Form.Item name="packageId" label="Package" rules={[{ required: true }]}>
                <Select
                  placeholder="Choose a package"
                  disabled={!selectedPooja}
                  options={(selectedPooja?.packages || [])
                    .filter((pkg) => pkg.isActive)
                    .map((pkg) => ({ value: pkg.id, label: `${pkg.name} · ₹${pkg.price}` }))}
                />
              </Form.Item>
              <Form.Item name="appointmentStartsAt" label="Appointment date and time" rules={[{ required: true }]}>
                <DatePicker
                  showTime
                  className="w-full"
                  disabledDate={(date) => date.isBefore(dayjs().startOf('day'))}
                />
              </Form.Item>
              <Form.Item name="preferredPanditId" label="Assign Pandit (optional)">
                <Select
                  allowClear
                  placeholder="Use the ceremony's default Pandit"
                  options={pandits.map((pandit) => ({
                    value: pandit.id,
                    label: pandit.fullName,
                  }))}
                />
              </Form.Item>
              <Form.Item name="serviceMode" label="Service mode" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'HOME', label: 'At home' },
                    { value: 'VENUE', label: 'At a venue' },
                    { value: 'ONLINE', label: 'Online' },
                  ]}
                />
              </Form.Item>
            </div>
          </>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Form.Item name="fullName" label="Yajman / devotee name" rules={[{ required: true }]}>
            <Input maxLength={150} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Mobile number"
            rules={[
              { required: true },
              { pattern: /^\d{10}$/, message: 'Enter a 10-digit mobile number.' },
            ]}
          >
            <Input maxLength={10} />
          </Form.Item>
          <Form.Item name="email" label="Email (optional)" rules={[{ type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gotra" label="Gotra" rules={[{ required: true }]}>
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item name="rashi" label="Rashi" rules={[{ required: true }]}>
            <Input maxLength={50} />
          </Form.Item>
          <Form.Item name="dateOfBirth" label="Date of birth" rules={[{ required: true }]}>
            <DatePicker
              className="w-full"
              disabledDate={(date) => date.isAfter(dayjs(), 'day')}
            />
          </Form.Item>
          <Form.Item name="birthPlace" label="Place of birth" rules={[{ required: true }]}>
            <Input maxLength={150} />
          </Form.Item>
        </div>

        {!isEdit && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="addressLine1" label="Appointment address" rules={[requiredWhenOnsite(form)]}>
              <Input />
            </Form.Item>
            <Form.Item name="addressLine2" label="Address line 2">
              <Input />
            </Form.Item>
            <Form.Item name="city" label="City" rules={[requiredWhenOnsite(form)]}>
              <Input />
            </Form.Item>
            <Form.Item name="state" label="State" rules={[requiredWhenOnsite(form)]}>
              <Input />
            </Form.Item>
            <Form.Item name="postalCode" label="Postal / PIN code" rules={[requiredWhenOnsite(form)]}>
              <Input />
            </Form.Item>
            <Form.Item name="country" label="Country" rules={[requiredWhenOnsite(form)]}>
              <Input />
            </Form.Item>
          </div>
        )}

        {isEdit && booking?.serviceMode !== 'ONLINE' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="addressLine1" label="Appointment address">
              <Input />
            </Form.Item>
            <Form.Item name="addressLine2" label="Address line 2">
              <Input />
            </Form.Item>
            <Form.Item name="city" label="City">
              <Input />
            </Form.Item>
            <Form.Item name="state" label="State">
              <Input />
            </Form.Item>
            <Form.Item name="postalCode" label="Postal / PIN code">
              <Input />
            </Form.Item>
            <Form.Item name="country" label="Country">
              <Input />
            </Form.Item>
          </div>
        )}

        <Form.Item name="customerNotes" label="Customer notes">
          <Input.TextArea rows={3} maxLength={2000} />
        </Form.Item>
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={saving}>
            {isEdit ? 'Save changes' : 'Create appointment'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
