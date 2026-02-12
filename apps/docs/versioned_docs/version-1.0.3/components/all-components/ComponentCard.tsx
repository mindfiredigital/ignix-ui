import Link from '@docusaurus/Link';
import type { LucideIcon } from 'lucide-react';

type Props = {
  title: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
};

export default function ComponentCard({ title, href, description, icon: Icon }: Props) {
  return (
    <Link 
      to={href} 
      className="flex flex-col p-4 rounded-xl border border-[var(--ifm-color-emphasis-300)] bg-[var(--ifm-background-surface-color)] no-underline hover:no-underline underline-offset-0 text-inherit font-medium transition-all duration-200 ease-in-out min-h-[100px] hover:border-[var(--ifm-color-primary)]"
      style={{ textDecoration: 'none' }}
    >
        <div className="flex flex-col items-center md:flex-row md:justify-between md:items-start gap-3 md:gap-6">
         {Icon && (
        <div className="mb-0 md:mb-0 flex-shrink-0">
          <div className="bg-gray-100 p-2 rounded flex items-center justify-center w-12 h-12">
            <Icon className="w-6 h-6 text-[var(--ifm-color-primary)]" />
          </div>
        </div>
        )}
        <div className="flex flex-col gap-1 flex-1 text-center md:text-left">
          <span className="no-underline hover:no-underline underline-offset-0 text-base font-semibold m-0 text-[var(--ifm-font-color-base)]" style={{ textDecoration: 'none' }}>{title}</span>
          {description && <p className="hidden md:block no-underline hover:no-underline underline-offset-0 text-sm m-0 text-[var(--ifm-color-emphasis-700)] leading-6 font-normal" style={{ textDecoration: 'none' }}>{description}</p>}
        </div>
      </div>
    </Link>
  );
}
