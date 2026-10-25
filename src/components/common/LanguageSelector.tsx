import React from 'react';
import { Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useLanguage } from '../../hooks/useLanguage.tsx';

interface LanguageSelectorProps {
  className?: string;
  color?: string;
  borderColor?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  color = 'white',
  borderColor = 'rgba(255, 255, 255, 0.2)',
}) => {
  const { language, setLanguage, t } = useLanguage();

  const items: MenuProps['items'] = [
    {
      key: 'en',
      label: t('language.english'),
    },
    {
      key: 'mr',
      label: t('language.marathi'),
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    setLanguage(key === 'mr' ? 'mr' : 'en');
  };

  return (
    <div className={className}>
      <Dropdown
        menu={{
          items,
          selectedKeys: [language],
          onClick: handleMenuClick,
        }}
        trigger={['click']}
        placement="bottomRight"
      >
        <Button
          type="text"
          aria-label={t('language.label')}
          style={{
            color,
            border: `1px solid ${borderColor}`,
          }}
          className="!inline-flex !items-center !gap-2 !text-xs !font-medium"
        >
          {language === 'mr'
            ? t('language.marathi')
            : t('language.english')}
          <DownOutlined className="!text-[10px]" />
        </Button>
      </Dropdown>
    </div>
  );
};