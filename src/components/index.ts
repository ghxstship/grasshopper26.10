/**
 * Atomic Design System - Component Index
 * 
 * Centralized exports for all design system components.
 * Import components from this file for consistency.
 */

// ============================================================================
// ATOMS - Basic building blocks
// ============================================================================

export { Button, buttonVariants } from "./atoms/Button";
export type { ButtonProps } from "./atoms/Button";

export { Input } from "./atoms/Input";
export type { InputProps } from "./atoms/Input";

export { Select } from "./atoms/Select";
export type { SelectProps } from "./atoms/Select";

export { Textarea } from "./atoms/Textarea";
export type { TextareaProps } from "./atoms/Textarea";

export { Checkbox } from "./atoms/Checkbox";
export type { CheckboxProps } from "./atoms/Checkbox";

export { Radio } from "./atoms/Radio";
export type { RadioProps } from "./atoms/Radio";

export { Switch } from "./atoms/Switch";
export type { SwitchProps } from "./atoms/Switch";

export { Label } from "./atoms/Label";
export type { LabelProps } from "./atoms/Label";

export { Badge, badgeVariants } from "./atoms/Badge";
export type { BadgeProps } from "./atoms/Badge";

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "./atoms/Card";

export { Avatar, avatarVariants } from "./atoms/Avatar";
export type { AvatarProps } from "./atoms/Avatar";

export { Separator } from "./atoms/Separator";
export type { SeparatorProps } from "./atoms/Separator";

export { Spinner, spinnerVariants } from "./atoms/Spinner";
export type { SpinnerProps } from "./atoms/Spinner";

export { Tooltip } from "./atoms/Tooltip";
export type { TooltipProps } from "./atoms/Tooltip";

export { IconButton, iconButtonVariants } from "./atoms/IconButton";
export type { IconButtonProps } from "./atoms/IconButton";

export { Text, textVariants } from "./atoms/Text";
export type { TextProps } from "./atoms/Text";

export { 
  Typography,
  HeroTitle,
  PageTitle,
  SectionHeader,
  SubsectionHeader,
  CardTitle as TypographyCardTitle,
  SmallHeader,
  Subtitle,
  BodyText,
  Metadata,
  Caption
} from "./atoms/Typography";
export type { TypographyProps } from "./atoms/Typography";

// ============================================================================
// MOLECULES - Simple component combinations
// ============================================================================

export { FormField } from "./molecules/FormField";
export type { FormFieldProps } from "./molecules/FormField";

export { SearchBar } from "./molecules/SearchBar";
export type { SearchBarProps } from "./molecules/SearchBar";

export { Breadcrumb } from "./molecules/Breadcrumb";
export type { BreadcrumbProps, BreadcrumbItem } from "./molecules/Breadcrumb";

export { Tabs } from "./molecules/Tabs";
export type { TabsProps, Tab } from "./molecules/Tabs";

export { Accordion } from "./molecules/Accordion";
export type { AccordionProps, AccordionItem } from "./molecules/Accordion";

export { Alert, alertVariants } from "./molecules/Alert";
export type { AlertProps } from "./molecules/Alert";

export { Pagination } from "./molecules/Pagination";
export type { PaginationProps } from "./molecules/Pagination";

export { EmptyState } from "./molecules/EmptyState";
export type { EmptyStateProps } from "./molecules/EmptyState";

export { LoadingState } from "./molecules/LoadingState";
export type { LoadingStateProps } from "./molecules/LoadingState";

export { Toast, ToastContainer, toastVariants } from "./molecules/Toast";
export type { ToastProps, ToastContainerProps } from "./molecules/Toast";

export { ChatMessage } from "./molecules/ChatMessage";
export type { ChatMessageProps } from "./molecules/ChatMessage";

export { ChatInput } from "./molecules/ChatInput";
export type { ChatInputProps } from "./molecules/ChatInput";

export { BrandCard } from "./molecules/BrandCard";

// ============================================================================
// ORGANISMS - Complex UI sections
// ============================================================================

export { Sidebar } from "./organisms/Sidebar";
export type { SidebarProps, SidebarSection, SidebarItem } from "./organisms/Sidebar";

export { Navbar } from "./organisms/Navbar";
export type { NavbarProps } from "./organisms/Navbar";

export { Toolbar } from "./organisms/Toolbar";
export type { ToolbarProps, ToolbarAction } from "./organisms/Toolbar";

export { ActionDrawer } from "./organisms/ActionDrawer";
export type { ActionDrawerProps } from "./organisms/ActionDrawer";

export { ModalForm } from "./organisms/ModalForm";
export type { ModalFormProps } from "./organisms/ModalForm";

export { FilterPanel } from "./organisms/FilterPanel";
export type { FilterPanelProps, FilterGroup, FilterOption } from "./organisms/FilterPanel";

export { CommandPalette } from "./organisms/CommandPalette";
export type { CommandPaletteProps, CommandItem } from "./organisms/CommandPalette";

export { ChatWindow } from "./organisms/ChatWindow";
export type { ChatWindowProps } from "./organisms/ChatWindow";

export { InboxPanel } from "./organisms/InboxPanel";
export type { InboxPanelProps, Conversation } from "./organisms/InboxPanel";

// Existing ATLVS organisms
export { DataTable } from "./atlvs/DataTable";
export { KanbanBoard } from "./atlvs/KanbanBoard";
export { GanttChart } from "./atlvs/GanttChart";

// ============================================================================
// TEMPLATES - Page-level layouts
// ============================================================================

// Layout Wrappers
export { DashboardLayout } from "./templates/DashboardLayout";
export type { DashboardLayoutProps } from "./templates/DashboardLayout";

export { GvtewayLayout } from "./templates/GvtewayLayout";
export type { GvtewayLayoutProps } from "./templates/GvtewayLayout";

export { CompvssLayout } from "./templates/CompvssLayout";
export type { CompvssLayoutProps } from "./templates/CompvssLayout";

export { AtlvsLayout } from "./templates/AtlvsLayout";
export type { AtlvsLayoutProps } from "./templates/AtlvsLayout";

export { ContentLayout } from "./templates/ContentLayout";
export type { ContentLayoutProps } from "./templates/ContentLayout";

// Page Templates
export { FormPageTemplate } from "./templates/FormPageTemplate";
export type { FormPageTemplateProps, FormStep } from "./templates/FormPageTemplate";

export { SettingsPageTemplate } from "./templates/SettingsPageTemplate";
export type { SettingsPageTemplateProps, SettingsSection } from "./templates/SettingsPageTemplate";

export { CheckoutPageTemplate } from "./templates/CheckoutPageTemplate";
export type { CheckoutPageTemplateProps, CheckoutItem } from "./templates/CheckoutPageTemplate";

export { ProfilePageTemplate } from "./templates/ProfilePageTemplate";
export type { ProfilePageTemplateProps, ProfileStat, ProfileTab } from "./templates/ProfilePageTemplate";

export { WizardPageTemplate } from "./templates/WizardPageTemplate";
export type { WizardPageTemplateProps, WizardStep } from "./templates/WizardPageTemplate";

export { ErrorPageTemplate } from "./templates/ErrorPageTemplate";
export type { ErrorPageTemplateProps } from "./templates/ErrorPageTemplate";

export { SearchResultsPageTemplate } from "./templates/SearchResultsPageTemplate";
export type { SearchResultsPageTemplateProps, SearchFilter } from "./templates/SearchResultsPageTemplate";

export { ComparisonPageTemplate } from "./templates/ComparisonPageTemplate";
export type { ComparisonPageTemplateProps, ComparisonOption } from "./templates/ComparisonPageTemplate";
