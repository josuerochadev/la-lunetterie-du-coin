import Printer from 'lucide-react/dist/esm/icons/printer';

import Button from '@/components/common/Button';

export default function PrintButton() {
  const handlePrint = () => {
    if (typeof window.print === 'function') {
      window.print();
    }
  };

  return (
    <div className="flex justify-center pt-12 print:hidden">
      <Button type="button" onClick={handlePrint} aria-label="Imprimer cette page">
        <Printer className="h-4 w-4" aria-hidden="true" />
        Imprimer cette page
      </Button>
    </div>
  );
}
