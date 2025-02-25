/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ActivityRecordBase } from './activity-record';

export interface PurchaseOrderActivity {
  user: Client;
  invoice: Client;
  contact: Client;
  client: Client;
  activity_type_id: number;
  id: string;
  hashed_id: string;
  notes: string;
  created_at: number;
  ip: string;
  recurring_invoice?: Client;
  payment?: Client;
  payment_amount?: ActivityRecordBase;
  purchase_order?: ActivityRecordBase;
}

export interface Client {
  label: string;
  hashed_id: string;
}
