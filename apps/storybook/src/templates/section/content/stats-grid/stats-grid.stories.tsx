// import type { Meta, StoryObj } from "@storybook/react-vite";
// import { StatsGrid } from ".";
// import {
//     Users,
//     DollarSign,
//     Download,
//     Clock,
//     Star,
//     Shield,
//     Globe,
//     Award,
//     Rocket,
//     Heart,
//     Activity,
//     BarChart3,
//     ShoppingCart,
//     Mail,
// } from "lucide-react";

// const meta: Meta<typeof StatsGrid> = {
//     title: "Templates/Section/Content/StatsGrid",
//     component: StatsGrid,
//     parameters: {
//         layout: "fullscreen",
//     },
//     tags: ["autodocs"],
//     argTypes: {
//         variant: {
//             control: { type: "select" },
//             options: ["default", "dark", "light", "primary", "secondary", "accent"],
//             description: "Background variant for the section",
//         },
//         cardStyle: {
//             control: { type: "select" },
//             options: ["default", "glass", "bordered", "gradient", "minimal"],
//             description: "Style variant for stat cards",
//         },
//         columns: {
//             control: { type: "select" },
//             options: [2, 3, 4, 5, 6],
//             description: "Number of columns in the grid",
//         },
//         showIcons: {
//             control: { type: "boolean" },
//             description: "Show/hide icons on stat cards",
//         },
//         showSubtext: {
//             control: { type: "boolean" },
//             description: "Show/hide subtext on stat cards",
//         },
//         showTrends: {
//             control: { type: "boolean" },
//             description: "Show/hide trend indicators",
//         },
//         animationType: {
//             control: { type: "select" },
//             options: ["none", "fadeIn", "fadeInUp", "fadeInDown", "scaleIn", "slideIn", "bounceIn"],
//             description: "Animation type for stat cards",
//         },
//         containerSize: {
//             control: { type: "select" },
//             options: ["small", "normal", "large", "full", "readable"],
//             description: "Container max width",
//         },
//     },
// };

// export default meta;
// type Story = StoryObj<typeof StatsGrid>;

// // Sample data
// const sampleStats = [
//     {
//         id: "1",
//         value: "10M+",
//         label: "Active Users",
//         subtext: "Growing 20% month over month",
//         icon: Users,
//         trend: { value: 20, direction: "up" as const, label: "increase" },
//     },
//     {
//         id: "2",
//         value: "99.9%",
//         label: "Uptime SLA",
//         subtext: "Enterprise-grade reliability",
//         icon: Shield,
//         trend: { value: 0.1, direction: "up" as const, label: "improvement" },
//     },
//     {
//         id: "3",
//         value: "$2.5B",
//         label: "Revenue",
//         subtext: "Annual recurring revenue",
//         icon: DollarSign,
//         trend: { value: 45, direction: "up" as const, label: "growth" },
//     },
//     {
//         id: "4",
//         value: "50M",
//         label: "Downloads",
//         subtext: "Across all platforms",
//         icon: Download,
//         trend: { value: 30, direction: "up" as const, label: "increase" },
//     },
//     {
//         id: "5",
//         value: "4.9",
//         label: "App Rating",
//         subtext: "From 100K+ reviews",
//         icon: Star,
//         trend: { value: 0.3, direction: "up" as const, label: "improvement" },
//     },
//     {
//         id: "6",
//         value: "24/7",
//         label: "Support",
//         subtext: "Round-the-clock assistance",
//         icon: Clock,
//     },
// ];

// const marketingStats = [
//     {
//         id: "1",
//         value: "1.2M",
//         label: "Email Subscribers",
//         subtext: "32% open rate",
//         icon: Mail,
//         trend: { value: 15, direction: "up" as const },
//     },
//     {
//         id: "2",
//         value: "500K",
//         label: "Social Followers",
//         subtext: "Across all platforms",
//         icon: Globe,
//         trend: { value: 25, direction: "up" as const },
//     },
//     {
//         id: "3",
//         value: "75K",
//         label: "Monthly Visitors",
//         subtext: "Organic traffic",
//         icon: Activity,
//         trend: { value: 8, direction: "up" as const },
//     },
//     {
//         id: "4",
//         value: "250",
//         label: "Blog Posts",
//         subtext: "Published this year",
//         icon: BarChart3,
//         trend: { value: 12, direction: "up" as const },
//     },
// ];

// const ecommerceStats = [
//     {
//         id: "1",
//         value: "150K",
//         label: "Orders",
//         subtext: "Processed this month",
//         icon: ShoppingCart,
//         trend: { value: 28, direction: "up" as const },
//     },
//     {
//         id: "2",
//         value: "$4.2M",
//         label: "Revenue",
//         subtext: "Monthly GMV",
//         icon: DollarSign,
//         trend: { value: 35, direction: "up" as const },
//     },
//     {
//         id: "3",
//         value: "85K",
//         label: "Customers",
//         subtext: "Active buyers",
//         icon: Users,
//         trend: { value: 18, direction: "up" as const },
//     },
//     {
//         id: "4",
//         value: "4.8",
//         label: "Avg Rating",
//         subtext: "Product reviews",
//         icon: Star,
//         trend: { value: 0.2, direction: "up" as const },
//     },
// ];

// const startupStats = [
//     {
//         id: "1",
//         value: "$5M",
//         label: "Funding Raised",
//         subtext: "Series A led by VC Partners",
//         icon: Rocket,
//     },
//     {
//         id: "2",
//         value: "50+",
//         label: "Team Members",
//         subtext: "Across 4 countries",
//         icon: Users,
//     },
//     {
//         id: "3",
//         value: "3",
//         label: "Years Active",
//         subtext: "Since founding",
//         icon: Award,
//     },
//     {
//         id: "4",
//         value: "100K",
//         label: "Users",
//         subtext: "And growing fast",
//         icon: Heart,
//         trend: { value: 200, direction: "up" as const },
//     },
// ];

// /* -------------------------------------------------------------------------- */
// /*                                STORIES                                     */
// /* -------------------------------------------------------------------------- */

// export const Default: Story = {
//     args: {
//         stats: sampleStats,
//         title: "Key Performance Indicators",
//         description: "Track our growth and success metrics in real-time",
//         columns: 4,
//         showIcons: true,
//         showSubtext: true,
//         variant: "default",
//         cardStyle: "default",
//     },
// };

// export const DarkTheme: Story = {
//     args: {
//         stats: sampleStats,
//         title: "Performance Metrics",
//         description: "Dark theme with glass morphism cards",
//         columns: 4,
//         showIcons: true,
//         showSubtext: true,
//         variant: "dark",
//         cardStyle: "glass",
//     },
// };

// export const LightTheme: Story = {
//     args: {
//         stats: sampleStats,
//         title: "Company Stats",
//         description: "Clean light theme with bordered cards",
//         columns: 4,
//         showIcons: true,
//         showSubtext: true,
//         variant: "light",
//         cardStyle: "bordered",
//     },
// };

// export const WithTrendIndicators: Story = {
//     args: {
//         stats: sampleStats,
//         title: "Growth Metrics",
//         description: "Showing positive trends across all KPIs",
//         columns: 4,
//         showIcons: true,
//         showSubtext: true,
//         showTrends: true,
//         variant: "default",
//         cardStyle: "default",
//     },
// };

// export const MinimalCards: Story = {
//     args: {
//         stats: sampleStats,
//         title: "Quick Stats",
//         description: "Minimal card style with no backgrounds",
//         columns: 4,
//         showIcons: true,
//         showSubtext: true,
//         variant: "light",
//         cardStyle: "minimal",
//     },
// };

// export const GradientCards: Story = {
//     args: {
//         stats: sampleStats,
//         title: "Impact Numbers",
//         description: "Gradient cards for visual emphasis",
//         columns: 4,
//         showIcons: true,
//         showSubtext: true,
//         variant: "light",
//         cardStyle: "gradient",
//     },
// };

// export const ThreeColumns: Story = {
//     args: {
//         stats: sampleStats.slice(0, 3),
//         title: "Three Key Metrics",
//         description: "Focused layout with 3 columns",
//         columns: 3,
//         showIcons: true,
//         showSubtext: true,
//         variant: "default",
//         cardStyle: "default",
//     },
// };

// export const SixColumns: Story = {
//     args: {
//         stats: sampleStats,
//         title: "Comprehensive Metrics",
//         description: "All 6 stats in a 6-column layout on large screens",
//         columns: 6,
//         showIcons: true,
//         showSubtext: true,
//         variant: "default",
//         cardStyle: "default",
//     },
// };

// export const NoIcons: Story = {
//     args: {
//         stats: sampleStats,
//         title: "Clean Numbers",
//         description: "Focus on numbers with no icons",
//         columns: 4,
//         showIcons: false,
//         showSubtext: true,
//         variant: "default",
//         cardStyle: "default",
//     },
// };

// export const NoSubtext: Story = {
//     args: {
//         stats: sampleStats,
//         title: "Simple Stats",
//         description: "Numbers and labels only, no additional text",
//         columns: 4,
//         showIcons: true,
//         showSubtext: false,
//         variant: "default",
//         cardStyle: "default",
//     },
// };

// export const PrimaryBackground: Story = {
//     args: {
//         stats: sampleStats,
//         title: "Primary Theme",
//         description: "Primary color background with glass cards",
//         columns: 4,
//         showIcons: true,
//         showSubtext: true,
//         variant: "primary",
//         cardStyle: "glass",
//     },
// };

// export const SecondaryBackground: Story = {
//     args: {
//         stats: sampleStats,
//         title: "Secondary Theme",
//         description: "Secondary color background with bordered cards",
//         columns: 4,
//         showIcons: true,
//         showSubtext: true,
//         variant: "secondary",
//         cardStyle: "bordered",
//     },
// };

// export const MarketingMetrics: Story = {
//     args: {
//         stats: marketingStats,
//         title: "Marketing Performance",
//         description: "Key metrics from our marketing campaigns",
//         columns: 4,
//         showIcons: true,
//         showSubtext: true,
//         showTrends: true,
//         variant: "light",
//         cardStyle: "default",
//     },
// };

// export const EcommerceDashboard: Story = {
//     args: {
//         stats: ecommerceStats,
//         title: "E-commerce Dashboard",
//         description: "Real-time store performance metrics",
//         columns: 4,
//         showIcons: true,
//         showSubtext: true,
//         showTrends: true,
//         variant: "default",
//         cardStyle: "gradient",
//     },
// };

// export const StartupMetrics: Story = {
//     args: {
//         stats: startupStats,
//         title: "Startup Milestones",
//         description: "Key achievements on our growth journey",
//         columns: 4,
//         showIcons: true,
//         showSubtext: true,
//         variant: "dark",
//         cardStyle: "glass",
//     },
// };

// export const WithBounceAnimation: Story = {
//     args: {
//         stats: sampleStats,
//         title: "Animated Stats",
//         description: "Stats with bounce animation on entrance",
//         columns: 4,
//         showIcons: true,
//         showSubtext: true,
//         animationType: "bounceIn",
//         variant: "default",
//         cardStyle: "default",
//     },
// };

// export const WithScaleAnimation: Story = {
//     args: {
//         stats: sampleStats,
//         title: "Scale In Animation",
//         description: "Stats scale in as they appear",
//         columns: 4,
//         showIcons: true,
//         showSubtext: true,
//         animationType: "scaleIn",
//         variant: "default",
//         cardStyle: "default",
//     },
// };

// export const MobileResponsive: Story = {
//     parameters: {
//         viewport: {
//             defaultViewport: "mobile1",
//         },
//     },
//     args: {
//         stats: sampleStats,
//         title: "Mobile View",
//         description: "Stats stack vertically on mobile devices",
//         columns: 4,
//         showIcons: true,
//         showSubtext: true,
//         variant: "default",
//         cardStyle: "default",
//     },
// };

// export const TabletResponsive: Story = {
//     parameters: {
//         viewport: {
//             defaultViewport: "tablet",
//         },
//     },
//     args: {
//         stats: sampleStats,
//         title: "Tablet View",
//         description: "2 columns on tablet screens",
//         columns: 4,
//         showIcons: true,
//         showSubtext: true,
//         variant: "default",
//         cardStyle: "default",
//     },
// };

// export const WithCustomTitle: Story = {
//     render: () => (
//         <StatsGrid
//             stats={sampleStats}
//             variant="dark"
//             cardStyle="glass"
//             columns={4}
//         >
//             <div className="text-center mt-12">
//                 <p className="text-white/70 text-sm">
//                     * All metrics are updated in real-time
//                 </p>
//             </div>
//         </StatsGrid>
//     ),
// };

// export const ComparisonView: Story = {
//     render: () => (
//         <div className="space-y-16">
//             <StatsGrid
//                 stats={sampleStats.slice(0, 4)}
//                 title="Q1 2024 Results"
//                 variant="light"
//                 cardStyle="bordered"
//                 columns={4}
//             />
//             <StatsGrid
//                 stats={sampleStats.slice(0, 4).map(stat => ({
//                     ...stat,
//                     value: typeof stat.value === 'string'
//                         ? stat.value.replace('M', '') + 'M' // Simple example, in real app you'd calculate actual growth
//                         : stat.value
//                 }))}
//                 title="Q2 2024 Results"
//                 description="Showing continued growth across all metrics"
//                 variant="light"
//                 cardStyle="gradient"
//                 columns={4}
//                 showTrends
//             />
//         </div>
//     ),
// };