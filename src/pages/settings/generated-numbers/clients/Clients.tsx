/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, ClickableElement, Element } from '../../../../components/cards';
import { InputField } from '../../../../components/forms';
import { useCompanyChanges } from '$app/common/hooks/useCompanyChanges';
import { CopyToClipboard } from '$app/components/CopyToClipboard';
import { Divider } from '$app/components/cards/Divider';
import { LinkToVariables } from '../common/components/LinkToVariables';
import { useAtomValue } from 'jotai';
import { companySettingsErrorsAtom } from '../../common/atoms';
import { useHandleCurrentCompanyChangeProperty } from '../../common/hooks/useHandleCurrentCompanyChange';
import { PropertyCheckbox } from '$app/components/PropertyCheckbox';
import { SettingsLabel } from '$app/components/SettingsLabel';
import { useDisableSettingsField } from '$app/common/hooks/useDisableSettingsField';
import { NumberInputField } from '$app/components/forms/NumberInputField';

export function Clients() {
  const [t] = useTranslation();
  const [pattern, setPattern] = useState<string>('');

  const companyChanges = useCompanyChanges();

  const disableSettingsField = useDisableSettingsField();

  const errors = useAtomValue(companySettingsErrorsAtom);

  const handleChange = useHandleCurrentCompanyChangeProperty();

  const variables = [
    '{$counter}',
    '{$year}',
    '{$date:Y-m-d}',
    '{$user_id}',
    '{$user_custom1}',
    '{$user_custom2}',
    '{$user_custom3}',
    '{$user_custom4}',
  ];

  return (
    <Card title={t('clients')}>
      <Element
        leftSide={
          <PropertyCheckbox
            propertyKey="client_number_pattern"
            labelElement={<SettingsLabel label={t('number_pattern')} />}
          />
        }
      >
        <InputField
          value={companyChanges?.settings?.client_number_pattern || ''}
          onValueChange={(value) =>
            handleChange('settings.client_number_pattern', value)
          }
          disabled={disableSettingsField('client_number_pattern')}
          errorMessage={errors?.errors['settings.client_number_pattern']}
        />
      </Element>
      <Element
        leftSide={
          <PropertyCheckbox
            propertyKey="client_number_counter"
            labelElement={<SettingsLabel label={t('number_counter')} />}
          />
        }
      >
        <NumberInputField
          precision={0}
          value={companyChanges?.settings?.client_number_counter || ''}
          onValueChange={(value) =>
            handleChange(
              'settings.client_number_counter',
              parseFloat(value) || 0
            )
          }
          disabled={disableSettingsField('client_number_counter')}
          errorMessage={errors?.errors['settings.client_number_counter']}
        />
      </Element>

      <Divider />

      {variables.map((item, index) => (
        <ClickableElement
          onClick={() => setPattern(pattern + item)}
          key={index}
        >
          <CopyToClipboard text={item} />
        </ClickableElement>
      ))}

      <Divider />

      <LinkToVariables />
    </Card>
  );
}
