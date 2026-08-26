import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';

export const SettingsPage = () => {
  return (
    <div>
      <PageHeader
        title="Platform & AI Settings"
        subtitle="Configure ML risk sensitivity thresholds, API backend integration keys, notification preferences, and user role access."
      />
      <Card className="p-8 text-center text-slate-500 border-dashed">
        <p className="text-sm font-medium">Settings configuration panels & preferences will be loaded here in Phase 2.</p>
      </Card>
    </div>
  );
};

export default SettingsPage;
