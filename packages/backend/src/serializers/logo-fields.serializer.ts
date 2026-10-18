/**
 * Logo Fields Serializer
 *
 * Projects the denormalized logo columns any logo-bearing entity carries onto
 * its API response.
 */
import type { EntityLogoFields } from '@bt/shared/types';

export const EMPTY_LOGO_FIELDS: EntityLogoFields = {
  logoDomain: null,
  logoInitials: null,
  logoColor: null,
  logoIcon: null,
  logoImageId: null,
};

export function serializeLogoFields({ entity }: { entity: EntityLogoFields }): EntityLogoFields {
  return {
    logoDomain: entity.logoDomain,
    logoInitials: entity.logoInitials,
    logoColor: entity.logoColor,
    logoIcon: entity.logoIcon,
    logoImageId: entity.logoImageId,
  };
}
