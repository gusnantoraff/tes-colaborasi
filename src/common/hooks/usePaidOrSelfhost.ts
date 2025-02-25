/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { isHosted, isSelfHosted } from '$app/common/helpers';
import dayjs from 'dayjs';
import { enterprisePlan } from '../guards/guards/enterprise-plan';
import { proPlan } from '../guards/guards/pro-plan';
import { useCurrentAccount } from './useCurrentAccount';

export function usePaidOrSelfHost() {
  const account = useCurrentAccount();

  const isPaidPlan =
    new Date(account?.plan_expires) > new Date() &&
    (enterprisePlan() || proPlan());

  return (isHosted() && isPaidPlan) || isSelfHosted();
}

export function useIsPaid() {
  const account = useCurrentAccount();

  const isPaidPlan =
    new Date(account?.plan_expires) > new Date() &&
    (enterprisePlan() || proPlan());

  return isPaidPlan;
}

export function useIsWhitelabelled() {
  const account = useCurrentAccount();

  return (
    account?.plan_expires !== '' &&
    !dayjs(account.plan_expires).isBefore(dayjs())
  );
}
