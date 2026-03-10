import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { PromptTemplate } from '@/lib/crisis/types';
import { interpolateTemplate } from '@/lib/crisis/promptTemplates';
import { Copy, Play } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  template: PromptTemplate | null;
  onClose: () => void;
  onRun: (prompt: string, templateName: string) => void;
}

export function TemplateRunDialog({ template, onClose, onRun }: Props) {
  const [variables, setVariables] = useState<Record<string, string>>({});

  if (!template) return null;

  const preview = interpolateTemplate(template.prompt, variables);

  const handleRun = () => {
    onRun(preview, template.name);
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(preview);
    toast.success('Prompt copied to clipboard');
  };

  return (
    <Dialog open={!!template} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base">📋 {template.name}</DialogTitle>
          <DialogDescription className="text-xs">{template.description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-3 pr-1">
            {/* Variable inputs */}
            {template.variables.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Variables</p>
                {template.variables.map(v => {
                  const isLong = ['context', 'analysis', 'nodes', 'opportunities', 'risks', 'constraints', 'profile'].includes(v);
                  return (
                    <div key={v}>
                      <Label className="text-xs capitalize">{v.replace(/_/g, ' ')}</Label>
                      {isLong ? (
                        <Textarea
                          value={variables[v] ?? ''}
                          onChange={e => setVariables(s => ({ ...s, [v]: e.target.value }))}
                          className="mt-1 text-xs min-h-[60px]"
                          placeholder={`Enter ${v}…`}
                        />
                      ) : (
                        <Input
                          value={variables[v] ?? ''}
                          onChange={e => setVariables(s => ({ ...s, [v]: e.target.value }))}
                          className="mt-1 h-8 text-xs"
                          placeholder={`Enter ${v}…`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Prompt preview */}
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Prompt Preview</p>
              <pre className="text-[11px] leading-relaxed whitespace-pre-wrap bg-secondary/40 border border-border/50 rounded-lg p-3 max-h-48 overflow-y-auto text-foreground/80">
                {preview}
              </pre>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-3 border-t border-border/50">
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 text-xs">
            <Copy className="h-3.5 w-3.5" /> Copy Prompt
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleRun} className="gap-1.5 text-xs">
            <Play className="h-3.5 w-3.5" /> Run with AI
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
