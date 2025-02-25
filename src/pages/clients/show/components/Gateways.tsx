/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Client } from '$app/common/interfaces/client';
import { InfoCard } from '$app/components/InfoCard';
import { useTranslation } from 'react-i18next';
import { MdChevronRight, MdLaunch, MdPayment } from 'react-icons/md';
import { route } from '$app/common/helpers/route';
import { GatewayLogoName, GatewayTypeIcon } from './GatewayTypeIcon';
import { useCompanyGatewaysQuery } from '$app/common/queries/company-gateways';
import { useEffect, useState } from 'react';
import { CompanyGateway } from '$app/common/interfaces/company-gateway';
import { Link } from '$app/components/forms';
import { Icon } from '$app/components/icons/Icon';
import { useColorScheme } from '$app/common/colors';
import { request } from '$app/common/helpers/request';
import { endpoint } from '$app/common/helpers';
import { toast } from '$app/common/helpers/toast/toast';
import classNames from 'classnames';
import { $refetch } from '$app/common/hooks/useRefetch';
import styled from 'styled-components';

interface Props {
  client: Client;
}

const Div = styled.div`
  &:hover {
    background-color: ${(props) => props.theme.hoverBgColor};
  }
`;

export function Gateways(props: Props) {
  const [t] = useTranslation();

  const { client } = props;

  const colors = useColorScheme();
  const { data: companyGatewaysResponse } = useCompanyGatewaysQuery();

  const [companyGateways, setCompanyGateways] = useState<CompanyGateway[]>();

  const getCompanyGateway = (gatewayId: string) => {
    return companyGateways?.find(({ id }) => id === gatewayId);
  };

  const isStripeGateway = (gatewayKey: string | undefined) => {
    return Boolean(
      gatewayKey &&
        (gatewayKey === 'd14dd26a37cecc30fdd65700bfb55b23' ||
          gatewayKey === 'd14dd26a47cecc30fdd65700bfb67b34')
    );
  };

  const handleSetDefault = (id: string) => {
    request(
      'POST',
      endpoint('/api/v1/client_gateway_tokens/:id/setAsDefault', { id })
    ).then(() => {
      toast.success('success');
      $refetch(['clients']);
    });
  };

  useEffect(() => {
    if (companyGatewaysResponse) {
      setCompanyGateways(companyGatewaysResponse.data.data);
    }
  }, [companyGatewaysResponse]);

  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-3">
      <InfoCard
        title={t('payment_methods')}
        className="max-h-96 overflow-y-auto h-full"
      >
        {client.gateway_tokens.map((token) => (
          <div
            key={token.id}
            className={classNames('flex flex-col first:mt-3 mb-6 space-y-1.5', {
              'h-22': !token.is_default,
              'h-12': token.is_default,
            })}
          >
            <div className="flex items-center justify-between h-full">
              <div className="flex flex-col space-y-1.5">
                <div className="inline-flex items-center space-x-1">
                  <div>
                    <MdPayment fontSize={22} />
                  </div>
                  <div className="inline-flex items-center">
                    <span>{t('gateway')}</span>
                    <MdChevronRight size={20} />

                    <Link
                      to={route('/settings/gateways/:id/edit', {
                        id: token.company_gateway_id,
                      })}
                    >
                      {getCompanyGateway(token.company_gateway_id)?.label}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <GatewayTypeIcon name={token.meta.brand as GatewayLogoName} />

                  <div className="flex items-center">
                    <span className="mt-1">****</span>
                    <span className="ml-1">{token.meta.last4}</span>
                  </div>

                  <span>
                    {token.meta.exp_month}/{token.meta.exp_year}
                  </span>
                </div>
              </div>

              <div
                className={classNames('flex flex-col items-end h-full', {
                  'justify-center': !isStripeGateway(
                    getCompanyGateway(token.company_gateway_id)?.gateway_key
                  ),
                  'justify-between': isStripeGateway(
                    getCompanyGateway(token.company_gateway_id)?.gateway_key
                  ),
                })}
              >
                {isStripeGateway(
                  getCompanyGateway(token.company_gateway_id)?.gateway_key
                ) && (
                  <Link
                    external
                    to={route(
                      'https://dashboard.stripe.com/customers/:customerReference',
                      {
                        customerReference: token.gateway_customer_reference,
                      }
                    )}
                  >
                    <Icon element={MdLaunch} size={18} />
                  </Link>
                )}

                {token.is_default && (
                  <div
                    className="inline-flex items-center rounded-full py-1 px-3 text-xs"
                    style={{
                      backgroundColor: colors.$5,
                    }}
                  >
                    {t('default')}
                  </div>
                )}
              </div>
            </div>

            {!token.is_default && (
              <Div
                className="inline-flex items-center text-xs cursor-pointer border rounded-full py-1 px-3 self-start"
                style={{ borderColor: colors.$5 }}
                onClick={() => handleSetDefault(token.id)}
                theme={{ hoverBgColor: colors.$5 }}
              >
                {t('save_as_default')}
              </Div>
            )}
          </div>
        ))}
      </InfoCard>
    </div>
  );
}
