declare module '@/types/lucide-react-icons' {
  import type { ForwardRefExoticComponent, RefAttributes } from 'react';
  import type { LucideProps } from 'lucide-react/dist/esm/shared';

  /**
   * Type pour une icône Lucide
   */
  export type LucideIcon = ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;
}

declare module 'lucide-react/dist/esm/icons/*' {
  import type { ForwardRefExoticComponent, RefAttributes } from 'react';
  import type { LucideProps } from 'lucide-react/dist/esm/shared';

  const Icon: ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;
  export default Icon;
}

/* (Optionnel, si tu souhaites tester "lucide-react/icons/*") */
declare module 'lucide-react/icons/*' {
  import type { ForwardRefExoticComponent, RefAttributes } from 'react';
  import type { LucideProps } from 'lucide-react/dist/esm/shared';

  const Icon: ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;
  export default Icon;
}
