
import type { Metadata } from 'next';
import TechnicalHelpCentre from '@/components/help/technical-help-centre';

export const metadata: Metadata = {
  title: 'Technical Help',
};

export default function HelpPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold tracking-tight">Technical Help</h1>
        <p className="text-muted-foreground">
          Having a technical issue? Ask for help here.
        </p>
      </div>
      <TechnicalHelpCentre />
    </div>
  );
}
