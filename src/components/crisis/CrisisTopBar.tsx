import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Save, Download, Upload, Plus, Newspaper,
  Settings2, AlertTriangle, Check, Loader2,
} from 'lucide-react';

interface Props {
  workspaceName: string;
  saveStatus: 'saved' | 'unsaved' | 'saving';
  onRename: (name: string) => void;
  onSave: () => void;
  onExport: () => void;
  onImport: () => void;
  onAddNode: () => void;
  onToggleNews: () => void;
  onOpenProviders: () => void;
  onLoadDemo: () => void;
  hasNodes: boolean;
}

export function CrisisTopBar({
  workspaceName,
  saveStatus,
  onRename,
  onSave,
  onExport,
  onImport,
  onAddNode,
  onToggleNews,
  onOpenProviders,
  onLoadDemo,
  hasNodes,
}: Props) {
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(workspaceName);

  const handleNameSubmit = () => {
    if (nameVal.trim()) onRename(nameVal.trim());
    setEditingName(false);
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-background/80 backdrop-blur-sm shrink-0">
      {/* Workspace name */}
      <div className="flex items-center gap-1.5 mr-1">
        <span className="text-base">🗺️</span>
        {editingName ? (
          <Input
            value={nameVal}
            onChange={e => setNameVal(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={e => e.key === 'Enter' && handleNameSubmit()}
            className="h-7 w-48 text-sm font-semibold"
            autoFocus
          />
        ) : (
          <button
            onClick={() => { setNameVal(workspaceName); setEditingName(true); }}
            className="text-sm font-semibold hover:text-primary transition-colors"
          >
            {workspaceName}
          </button>
        )}
      </div>

      {/* Save status indicator */}
      <div className={cn(
        'flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full',
        saveStatus === 'saved' && 'bg-emerald-500/10 text-emerald-400',
        saveStatus === 'unsaved' && 'bg-amber-500/10 text-amber-400',
        saveStatus === 'saving' && 'bg-blue-500/10 text-blue-400',
      )}>
        {saveStatus === 'saving' && <Loader2 className="h-2.5 w-2.5 animate-spin" />}
        {saveStatus === 'saved' && <Check className="h-2.5 w-2.5" />}
        {saveStatus === 'unsaved' && <AlertTriangle className="h-2.5 w-2.5" />}
        {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving…' : 'Unsaved'}
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {!hasNodes && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1 border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
            onClick={onLoadDemo}
          >
            Load Demo
          </Button>
        )}

        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={onAddNode}>
          <Plus className="h-3.5 w-3.5" /> Add Node
        </Button>

        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={onToggleNews}>
          <Newspaper className="h-3.5 w-3.5" /> News
        </Button>

        <Button
          size="sm"
          variant={saveStatus === 'unsaved' ? 'default' : 'outline'}
          className="h-7 text-xs gap-1"
          onClick={onSave}
          disabled={saveStatus === 'saving'}
        >
          <Save className="h-3.5 w-3.5" /> Save
        </Button>

        <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={onExport} title="Export workspace JSON">
          <Download className="h-3.5 w-3.5" />
        </Button>

        <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={onImport} title="Import workspace JSON">
          <Upload className="h-3.5 w-3.5" />
        </Button>

        <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={onOpenProviders} title="Configure AI providers">
          <Settings2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
