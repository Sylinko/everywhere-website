import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type RiskLevel = 'low' | 'medium' | 'high';

interface PermissionBadgeProps {
  /**
   * The risk level of the permission
   * - low: Blue badge (fd-info)
   * - medium: Yellow badge (fd-warning)
   * - high: Red badge (fd-error)
   */
  risk?: RiskLevel;
  /**
   * Custom icon to display before the text
   */
  icon?: ReactNode;
  /**
   * The permission name/text
   */
  children: ReactNode;
  /**
   * Additional class name
   */
  className?: string;
}

const riskStyles: Record<RiskLevel, string> = {
  low: 'bg-fd-info/15 text-fd-info border-fd-info/30',
  medium: 'bg-fd-warning/15 text-fd-warning border-fd-warning/30',
  high: 'bg-fd-error/15 text-fd-error border-fd-error/30',
};

/**
 * A badge component to display a single permission with its risk level.
 *
 * @example
 * ```tsx
 * <PermissionBadge risk="low">Access Network</PermissionBadge>
 * <PermissionBadge risk="medium">Read Clipboard</PermissionBadge>
 * <PermissionBadge risk="high">Execute Commands</PermissionBadge>
 * ```
 */
export function PermissionBadge({
  risk = 'low',
  icon,
  children,
  className,
}: PermissionBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        riskStyles[risk],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

interface PermissionsProps {
  /**
   * The permissions to display. Can be an array of strings (all same risk level)
   * or an array of objects with name and risk level.
   */
  permissions:
    | string[]
    | Array<{
        name: string;
        risk?: RiskLevel;
        icon?: ReactNode;
      }>;
  /**
   * Default risk level for all permissions (when using string array)
   */
  defaultRisk?: RiskLevel;
  /**
   * Additional class name for the container
   */
  className?: string;
}

/**
 * A container component to display multiple permission badges.
 *
 * @example
 * ```tsx
 * <Permissions permissions={['Access Network', 'Read Files']} defaultRisk="low" />
 *
 * <Permissions
 *   permissions={[
 *     { name: 'Access Network', risk: 'low' },
 *     { name: 'Read Clipboard', risk: 'medium' },
 *     { name: 'Execute Commands', risk: 'high' },
 *   ]}
 * />
 * ```
 */
export function Permissions({
  permissions,
  defaultRisk = 'low',
  className,
}: PermissionsProps) {
  return (
    <div className={cn('not-prose my-4 flex flex-wrap gap-2', className)}>
      {permissions.map((permission, index) => {
        if (typeof permission === 'string') {
          return (
            <PermissionBadge key={index} risk={defaultRisk}>
              {permission}
            </PermissionBadge>
          );
        }
        return (
          <PermissionBadge
            key={index}
            risk={permission.risk ?? defaultRisk}
            icon={permission.icon}
          >
            {permission.name}
          </PermissionBadge>
        );
      })}
    </div>
  );
}
