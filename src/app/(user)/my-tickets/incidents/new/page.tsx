import Link from 'next/link';

import { requireUser } from '@/lib/auth-helpers';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IncidentCreateForm } from '@/components/incident-create-form';

export default async function NewMyIncidentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const session = await requireUser();
  const sp = await searchParams;
  const prefill = {
    description: sp.description,
    priority: sp.priority ? Number(sp.priority) : undefined,
  };

  return (
    <>
      <SiteHeader title="New incident" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div>
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/my-tickets?tab=incidents">Back</Link>}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Log an incident</CardTitle>
          </CardHeader>
          <CardContent>
            <IncidentCreateForm userId={session.user.id} engineers={[]} isStaff={false} prefill={prefill} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
