/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useEffect, useState } from 'react';
import { Element } from './cards';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { InputField } from './forms';
import { NumberInputField } from './forms/NumberInputField';

interface Props {
  defaultValue: string | number;
  field: string;
  type?: string;
  value: string | number;
  onValueChange: (value: string | number | boolean) => unknown;
}
export function CustomSurchargeField(props: Props) {
  const [label, setLabel] = useState('');
  const company = useCurrentCompany();

  useEffect(() => {
    const [fieldLabel] = [company.custom_fields[props.field], ''];
    setLabel(fieldLabel || '');
  }, []);

  return (
    <Element leftSide={label}>
      {props.type === 'number' ? (
        <NumberInputField {...props} />
      ) : (
        <InputField {...props} />
      )}
    </Element>
  );
}
