/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { route } from '$app/common/helpers/route';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { useEntityAssigned } from '$app/common/hooks/useEntityAssigned';
import { RecurringInvoice } from '$app/common/interfaces/recurring-invoice';
import { DocumentsTabLabel } from '$app/components/DocumentsTabLabel';
import { Tab } from '$app/components/Tabs';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface Params {
  recurringInvoice: RecurringInvoice | undefined;
}
export function useTabs(params: Params) {
  const [t] = useTranslation();

  const hasPermission = useHasPermission();
  const entityAssigned = useEntityAssigned();

  const { id } = useParams();

  const { recurringInvoice } = params;

  const canEditAndView =
    hasPermission('view_recurring_invoice') ||
    hasPermission('edit_recurring_invoice') ||
    entityAssigned(recurringInvoice);

  const tabs: Tab[] = [
    {
      name: t('edit'),
      href: route('/recurring_invoices/:id/edit', { id }),
    },
    {
      name: t('documents'),
      href: route('/recurring_invoices/:id/documents', { id }),
      enabled: canEditAndView,
      formatName: () => (
        <DocumentsTabLabel
          numberOfDocuments={recurringInvoice?.documents?.length}
        />
      ),
    },
    {
      name: t('settings'),
      href: route('/recurring_invoices/:id/settings', { id }),
    },
    {
      name: t('activity'),
      href: route('/recurring_invoices/:id/activity', { id }),
    },
    {
      name: t('history'),
      href: route('/recurring_invoices/:id/history', { id }),
    },
    {
      name: t('schedule'),
      href: route('/recurring_invoices/:id/schedule', { id }),
    },
  ];

  return tabs;
}
