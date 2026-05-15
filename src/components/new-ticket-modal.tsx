'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { SparklesIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PRIORITY_LABELS } from '@/lib/constants';

type ClassifyResult = {
  type: 'incident' | 'service_request' | 'change_request';
  priority: number;
  reason: string;
};

const TYPE_LABELS: Record<ClassifyResult['type'], string> = {
  incident: 'Incident',
  service_request: 'Service Request',
  change_request: 'Change Request',
};

const STAFF_ROUTES: Record<ClassifyResult['type'], string> = {
  incident: '/incidents/new',
  service_request: '/requests/new',
  change_request: '/change/new',
};

const USER_ROUTES: Record<ClassifyResult['type'], string> = {
  incident: '/my-tickets/incidents/new',
  service_request: '/my-tickets/requests/new',
  change_request: '/my-tickets/change/new',
};

export function NewTicketModal({ isStaff }: { isStaff: boolean }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<ClassifyResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setDescription('');
      setResult(null);
      setError(null);
    }
  }

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      if (!res.ok) throw new Error('Classification failed');
      const data = (await res.json()) as ClassifyResult;
      setResult(data);
    } catch {
      setError('AI classification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleContinue() {
    if (!result) return;
    const routes = isStaff ? STAFF_ROUTES : USER_ROUTES;
    const base = routes[result.type];
    const params = new URLSearchParams({
      description,
      priority: String(result.priority),
    });
    router.push(`${base}?${params}`);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <SparklesIcon className="size-4" />
        New Ticket
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Ticket</DialogTitle>
        </DialogHeader>

        {!result ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Describe your issue or request. AI will classify it and suggest a
              priority.
            </p>
            <Textarea
              placeholder="e.g. My laptop won't connect to the VPN after the latest Windows update..."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter>
              <Button
                onClick={handleAnalyze}
                disabled={loading || description.trim().length < 20}
              >
                <SparklesIcon className="size-4" />
                {loading ? 'Analyzing…' : 'Analyze with AI'}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border bg-muted/40 p-4 flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge>{TYPE_LABELS[result.type]}</Badge>
                <Badge variant="outline">
                  {PRIORITY_LABELS[result.priority] ?? result.priority} priority
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{result.reason}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Your description will be pre-filled in the form.
            </p>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setResult(null)}>
                Start over
              </Button>
              <Button onClick={handleContinue}>Continue to form</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
