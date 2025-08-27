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
