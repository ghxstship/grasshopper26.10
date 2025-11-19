/**
 * GHXSTSHIP Design System
 * Single source of truth for all UI components, tokens, and utilities
 * 
 * Contemporary Minimal Pop Art Aesthetic
 * Monochromatic • Geometric • Bold Typography
 */

// ============================================================================
// DESIGN TOKENS - Single Source of Truth
// ============================================================================

export * from './tokens';
export { tokens } from './tokens';
export type { Tokens } from './tokens';

// ============================================================================
// UTILITIES
// ============================================================================

export { cn } from './utils/cn';
export { createVariants, platformVariants } from './utils/variants';
export type { VariantProps, PlatformVariant } from './utils/variants';
export * from './utils/focus-management';

// ============================================================================
// HOOKS
// ============================================================================

export { useTheme } from './hooks/useTheme';
export type { Theme } from './hooks/useTheme';

export { useBreakpoint } from './hooks/useBreakpoint';
export type { Breakpoint } from './hooks/useBreakpoint';

export { useDesignTokens } from './hooks/useDesignTokens';

// ============================================================================
// COMPONENTS - Re-export from /src/components for now
// Will be migrated to /src/design-system in Phase 2
// ============================================================================

// Atoms (Primitives)
export {
  Button,
  buttonVariants,
  Input,
  Select,
  Textarea,
  Checkbox,
  Radio,
  Switch,
  Label,
  Badge,
  badgeVariants,
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  Avatar,
  avatarVariants,
  Separator,
  Spinner,
  spinnerVariants,
  Tooltip,
  IconButton,
  iconButtonVariants,
  Text,
  textVariants,
  Typography,
  HeroTitle,
  // DisplayTitle,
  PageTitle,
  SectionHeader,
  SubsectionHeader,
  SmallHeader,
  Subtitle,
  BodyText,
  // BodyTextLarge,
  // BodyTextSmall,
  Metadata,
  Caption,
  // Overline,
} from '@/components';

export type {
  ButtonProps,
  InputProps,
  SelectProps,
  TextareaProps,
  CheckboxProps,
  RadioProps,
  SwitchProps,
  LabelProps,
  BadgeProps,
  AvatarProps,
  SeparatorProps,
  SpinnerProps,
  TooltipProps,
  IconButtonProps,
  TextProps,
  TypographyProps,
} from '@/components';

// Molecules
export {
  FormField,
  SearchBar,
  Breadcrumb,
  Tabs,
  Accordion,
  Alert,
  alertVariants,
  Pagination,
  EmptyState,
  LoadingState,
  Toast,
  ToastContainer,
  toastVariants,
  ChatMessage,
  ChatInput,
  BrandCard,
  // KPICard,
  // ReportPresetCard,
  // ConnectWalletButton,
} from '@/components';

export type {
  FormFieldProps,
  SearchBarProps,
  BreadcrumbProps,
  BreadcrumbItem,
  TabsProps,
  Tab,
  AccordionProps,
  AccordionItem,
  AlertProps,
  PaginationProps,
  EmptyStateProps,
  LoadingStateProps,
  ToastProps,
  ToastContainerProps,
  ChatMessageProps,
  ChatInputProps,
} from '@/components';

// Organisms
export {
  Sidebar,
  Navbar,
  Toolbar,
  ActionDrawer,
  ModalForm,
  FilterPanel,
  CommandPalette,
  ChatWindow,
  InboxPanel,
  DataTable,
  KanbanBoard,
  GanttChart,
  // KPIGrid,
  // ReportPresetGrid,
} from '@/components';

export type {
  SidebarProps,
  SidebarSection,
  SidebarItem,
  NavbarProps,
  ToolbarProps,
  ToolbarAction,
  ActionDrawerProps,
  ModalFormProps,
  FilterPanelProps,
  FilterGroup,
  FilterOption,
  CommandPaletteProps,
  CommandItem,
  ChatWindowProps,
  InboxPanelProps,
  Conversation,
  // DataTableColumn,
  // KanbanColumn,
  // KanbanTask,
  // GanttTask,
} from '@/components';

// Templates
export {
  DashboardLayout,
  GvtewayLayout,
  CompvssLayout,
  AtlvsLayout,
  ContentLayout,
  FormPageTemplate,
  SettingsPageTemplate,
  CheckoutPageTemplate,
  ProfilePageTemplate,
  WizardPageTemplate,
  ErrorPageTemplate,
  SearchResultsPageTemplate,
  ComparisonPageTemplate,
} from '@/components';

export type {
  DashboardLayoutProps,
  GvtewayLayoutProps,
  CompvssLayoutProps,
  AtlvsLayoutProps,
  ContentLayoutProps,
  FormPageTemplateProps,
  FormStep,
  SettingsPageTemplateProps,
  SettingsSection,
  CheckoutPageTemplateProps,
  CheckoutItem,
  ProfilePageTemplateProps,
  ProfileStat,
  ProfileTab,
  WizardPageTemplateProps,
  WizardStep,
  ErrorPageTemplateProps,
  SearchResultsPageTemplateProps,
  SearchFilter,
  ComparisonPageTemplateProps,
  ComparisonOption,
} from '@/components';
