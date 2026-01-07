import { type VariantProps } from "class-variance-authority";
import type { PageVariants } from "./utils";

type ApiKeyScope =
  | "read:users"
  | "write:users"
  | "read:data"
  | "write:data"
  | "read:analytics"
  | "admin";

// Or define a shared type
export type ButtonVariant =
  | "default"
  | "glass"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "outline"
  | "ghost"
  | "link"
  | "subtle"
  | "elevated"
  | "neon"
  | "pill"
  | "none";

// Base interfaces
interface NewBadgeProps {
  text: string;
  type?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "default";
  variant?: "pulse" | "bounce" | "tinypop";
  className?: string;
  showIcon?: boolean;
  icon?: React.ElementType;
}

interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  keySuffix: string;
  fullKey?: string;
  scopes: ApiKeyScope[];
  createdAt: Date;
  lastUsed: Date | null;
  usageCount: number;
  usageHistory: { date: string; count: number }[];
  status: "active" | "inactive" | "expired" | "revoked";
  expiresAt?: Date;
  description?: string;
}

interface ScopeInfo {
  id: ApiKeyScope;
  name: string;
  description: string;
  risk: "low" | "medium" | "high";
  icon: React.ElementType;
}

interface FilterOptions {
  status: ("active" | "inactive" | "expired" | "revoked")[];
  scopes: ApiKeyScope[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

interface StatsData {
  totalKeys: number;
  activeKeys: number;
  totalCalls: number;
  callsToday: number;
  revokedKeys: number;
}

// Component Props interfaces
interface StatsOverviewProps {
  stats: StatsData;
  isLoading?: boolean;
  badgeVariant?: "pulse" | "bounce" | "tinypop";
}

interface StatusBadgeProps {
  status: ApiKey["status"];
  badgeVariant?: "pulse" | "bounce" | "tinypop";
  className?: string;
}

interface ScopeBadgeProps {
  scope: ApiKeyScope;
  badgeVariant?: "pulse" | "bounce" | "tinypop";
  showIcon?: boolean;
  className?: string;
}

interface DeleteKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (apiKey: ApiKey) => Promise<void>;
  apiKey: ApiKey | null;
  isLoading?: boolean;
  inputVariant?: string;
  buttonVariant?: ButtonVariant;
  buttonAnimationVariant?: string;
}

interface RevokeKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRevoke: (apiKey: ApiKey) => Promise<void>;
  apiKey: ApiKey | null;
  isLoading?: boolean;
  inputVariant?: string;
  buttonVariant?: ButtonVariant;
  buttonAnimationVariant?: string;
}

interface ViewKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReveal: (apiKey: ApiKey) => Promise<void>;
  apiKey: ApiKey | null;
  isLoading?: boolean;
  inputVariant?: string;
  buttonVariant?: ButtonVariant;
  buttonAnimationVariant?: string;
  autoHideDelay?: number;
}

interface ApiKeyCardProps {
  apiKey: ApiKey;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onReveal?: (key: ApiKey) => void;
  onDelete?: (key: ApiKey) => void;
  onCopy?: (key: ApiKey) => void;
  onRevoke?: (key: ApiKey) => void;
  // onRegenerate?: (key: ApiKey) => void;
  showActions?: boolean;
  variant?: string;
  badgeVariant?: "pulse" | "bounce" | "tinypop";
  buttonVariant?: ButtonVariant;
  buttonAnimationVariant?: string;
}

interface GenerateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: {
    name: string;
    scopes: ApiKeyScope[];
    expiresAt?: Date;
    description?: string;
  }) => Promise<ApiKey>;
  isLoading?: boolean;
  badgeVariant?: "pulse" | "bounce" | "tinypop";
  inputVariant?: string;
  buttonVariant?: ButtonVariant;
  buttonAnimationVariant?: string;
}

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableScopes: ApiKeyScope[];
  inputVariant?: string;
  buttonVariant?: ButtonVariant;
  buttonAnimationVariant?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

// Main page props interface
interface ApiKeysPageProps {
  // Header customization
  headerTitle?: string;
  headerIcon?: React.ReactNode;
  headerDescription?: string;

  // Initial data
  initialApiKeys?: ApiKey[];
  statsData?: Partial<StatsData>;

  // Callbacks
  onGenerateKey?: (
    name: string,
    scopes: ApiKeyScope[],
    expiresAt?: Date,
    description?: string
  ) => Promise<ApiKey>;
  onDeleteKey?: (id: string) => Promise<void>;
  onRevealKey?: (id: string) => Promise<string>;
  onRevokeKey?: (id: string) => Promise<void>;
  // onRegenerateKey?: (id: string) => Promise<ApiKey>;
  onCopyKey?: (key: string) => void;
  onKeys?: (format: "json" | "csv") => void;
  onExportKeys?: (format: "json" | "csv") => void;

  // Variants
  variant?: VariantProps<typeof PageVariants>["variant"];
  animationVariant?:
    | "fadeUp"
    | "scaleIn"
    | "slideUp"
    | "slideLeft"
    | "slideRight";

  // Component variants
  cardVariant?: string;
  inputVariant?: string;
  buttonVariant?: ButtonVariant;
  buttonAnimationVariant?: string;
  badgeVariant?: "pulse" | "bounce" | "tinypop";

  // Custom content
  customHeader?: React.ReactNode;
  customStatsSection?: React.ReactNode;
  customEmptyState?: React.ReactNode;

  // Labels
  generateButtonLabel?: string;
  searchPlaceholder?: string;

  // States
  isLoading?: boolean;
  isGenerating?: boolean;

  // Features
  showFilters?: boolean;
  showSearch?: boolean;
  showExport?: boolean;
  showStats?: boolean;
  // allowRegeneration?: boolean;
  requireConfirmation?: boolean;

  // Notification options
  showNotifications?: boolean;
  notificationDuration?: number;

  // Security
  requirePasswordToReveal?: boolean;
  autoHideRevealedKey?: boolean;
  autoHideDelay?: number;

  darkMode?: boolean;
}

// Add this type definition
type NotificationType = {
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
  id: string;
};

// Export all types
export type {
  ApiKeyScope,
  NewBadgeProps,
  Notification,
  ApiKey,
  ScopeInfo,
  FilterOptions,
  StatsData,
  ApiKeysPageProps,
  StatsOverviewProps,
  StatusBadgeProps,
  ScopeBadgeProps,
  DeleteKeyModalProps,
  RevokeKeyModalProps,
  ViewKeyModalProps,
  ApiKeyCardProps,
  GenerateKeyModalProps,
  SearchFilterProps,
  NotificationType,
};
