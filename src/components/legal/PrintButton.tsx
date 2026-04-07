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
      <Button type="button" onClick={handlePrint} icon={Printer} aria-label="Imprimer cette page">
        Imprimer cette page
      </Button>
    </div>
  );
}
