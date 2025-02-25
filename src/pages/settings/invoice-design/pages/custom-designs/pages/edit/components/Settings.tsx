/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTranslation } from 'react-i18next';
import { Card, ClickableElement, Element } from '$app/components/cards';
import { DesignSelector } from '$app/common/generic/DesignSelector';
import { Checkbox, InputField, SelectField } from '$app/components/forms';
import { Divider } from '$app/components/cards/Divider';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { toast } from '$app/common/helpers/toast/toast';
import { trans } from '$app/common/helpers';
import { useAtom } from 'jotai';
import { Import, importModalVisiblityAtom } from './Import';
import { useDesignUtilities } from '../common/hooks';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import Toggle from '$app/components/forms/Toggle';
import { templateEntites } from '../../create/Create';
import { useOutletContext } from 'react-router-dom';
import { EntityType, PreviewPayload } from '../../../CustomDesign';
import { InvoiceSelector } from '$app/components/invoices/InvoiceSelector';
import { QuoteSelector } from '$app/components/quotes/QuoteSelector';
import { CreditSelector } from '$app/components/credit/CreditSelector';
import { PurchaseOrderSelector } from '$app/components/purchase-order/PurchaseOrderSelector';

export interface Context {
  errors: ValidationBag | undefined;
  isFormBusy: boolean;
  shouldRenderHTML: boolean;
  setShouldRenderHTML: Dispatch<SetStateAction<boolean>>;
  payload: PreviewPayload;
  setPayload: Dispatch<SetStateAction<PreviewPayload>>;
}

export default function Settings() {
  const { t } = useTranslation();

  const context: Context = useOutletContext();

  const {
    errors,
    isFormBusy,
    shouldRenderHTML,
    setShouldRenderHTML,
    payload,
    setPayload,
  } = context;

  const [, setIsImportModalVisible] = useAtom(importModalVisiblityAtom);

  const handleExportToTxtFile = () => {
    if (payload.design) {
      const blob = new Blob([JSON.stringify(payload.design.design)], {
        type: 'text/plain',
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.download = `${payload.design.name}_${t('export').toLowerCase()}`;
      link.href = url;
      link.target = '_blank';

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
    }
  };

  const handleExport = useCallback(() => {
    if (!navigator.clipboard) {
      return handleExportToTxtFile();
    }

    if (payload.design) {
      navigator.clipboard
        .writeText(JSON.stringify(payload.design.design))
        .then(() =>
          toast.success(
            trans('copied_to_clipboard', {
              value: t('design').toLowerCase(),
            })
          )
        )
        .catch(() => handleExportToTxtFile());
    }
  }, [payload.design]);

  const { handlePropertyChange, handleResourceChange } = useDesignUtilities({
    payload,
    setPayload,
  });

  return (
    <>
      <Import onImport={(parts) => handlePropertyChange('design', parts)} />

      <Card title={t('settings')} padding="small">
        <Element leftSide={t('name')}>
          <InputField
            value={payload.design?.name}
            onValueChange={(value) => handlePropertyChange('name', value)}
            errorMessage={errors?.errors.name}
          />
        </Element>

        {payload.design?.is_template ? (
          <Element leftSide={t('resource')}>
            {templateEntites.map((entity) => (
              <Checkbox
                key={entity}
                label={t(entity)}
                value={entity}
                onValueChange={(value, checked) =>
                  handleResourceChange(value, Boolean(checked))
                }
                checked={payload.design?.entities.includes(entity)}
              />
            ))}
          </Element>
        ) : null}

        <Element leftSide={t('design')}>
          <DesignSelector
            onChange={(design) => handlePropertyChange('design', design.design)}
            actionVisibility={false}
            errorMessage={
              errors?.errors['design.header'] ||
              errors?.errors['design.body'] ||
              errors?.errors['design.footer'] ||
              errors?.errors['design.includes']
            }
          />
        </Element>

        {!payload.design?.is_template && (
          <>
            <Element leftSide={t('entity')}>
              <SelectField
                value={payload.entity || 'invoice'}
                onValueChange={(value) =>
                  setPayload((current) => ({
                    ...current,
                    entity: value as EntityType,
                    entity_id: '-1',
                  }))
                }
                errorMessage={errors?.errors.entity}
              >
                <option value="invoice">{t('invoice')}</option>
                <option value="quote">{t('quote')}</option>
                <option value="credit">{t('credit')}</option>
                <option value="purchase_order">{t('purchase_order')}</option>
              </SelectField>
            </Element>

            {payload.entity === 'invoice' && (
              <Element leftSide={t('invoice')}>
                <InvoiceSelector
                  value={payload.entity_id}
                  onChange={(value) =>
                    setPayload((current) => ({
                      ...current,
                      entity_id: value.id || '-1',
                    }))
                  }
                  onClearButtonClick={() =>
                    setPayload((current) => ({
                      ...current,
                      entity_id: '-1',
                    }))
                  }
                  errorMessage={errors?.errors.entity_id}
                />
              </Element>
            )}

            {payload.entity === 'quote' && (
              <Element leftSide={t('quote')}>
                <QuoteSelector
                  value={payload.entity_id}
                  onChange={(value) =>
                    setPayload((current) => ({
                      ...current,
                      entity_id: value.id || '-1',
                    }))
                  }
                  onClearButtonClick={() =>
                    setPayload((current) => ({
                      ...current,
                      entity_id: '-1',
                    }))
                  }
                  errorMessage={errors?.errors.entity_id}
                />
              </Element>
            )}

            {payload.entity === 'credit' && (
              <Element leftSide={t('credit')}>
                <CreditSelector
                  value={payload.entity_id}
                  onChange={(value) =>
                    setPayload((current) => ({
                      ...current,
                      entity_id: value.id || '-1',
                    }))
                  }
                  onClearButtonClick={() =>
                    setPayload((current) => ({
                      ...current,
                      entity_id: '-1',
                    }))
                  }
                  errorMessage={errors?.errors.entity_id}
                />
              </Element>
            )}

            {payload.entity === 'purchase_order' && (
              <Element leftSide={t('purchase_order')}>
                <PurchaseOrderSelector
                  value={payload.entity_id}
                  onChange={(value) =>
                    setPayload((current) => ({
                      ...current,
                      entity_id: value.id || '-1',
                    }))
                  }
                  onClearButtonClick={() =>
                    setPayload((current) => ({
                      ...current,
                      entity_id: '-1',
                    }))
                  }
                  errorMessage={errors?.errors.entity_id}
                />
              </Element>
            )}
          </>
        )}

        <Divider />

        <ClickableElement href="https://invoiceninja.github.io/en/custom-fields/">
          {t('view_docs')}
        </ClickableElement>

        <ClickableElement onClick={() => setIsImportModalVisible(true)}>
          {t('import')}
        </ClickableElement>

        <ClickableElement onClick={handleExport}>
          {t('export')}
        </ClickableElement>

        <Element leftSide={t('html_mode')}>
          <Toggle
            checked={shouldRenderHTML}
            onChange={(value) => setShouldRenderHTML(value)}
            disabled={isFormBusy}
          />
        </Element>
      </Card>
    </>
  );
}
