'use client';

/**
 * 干预规则管理页面
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/design-system/GlassCard';
import GlowBadge from '@/components/design-system/GlowBadge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockRules, mockAvailableMetrics, mockAvailableActions } from '@/lib/admin-mock-data';
import { InterventionRule, ConditionConfig, ActionConfig } from '@/lib/types';
import { Plus, Edit, Trash2, X, ChevronDown } from 'lucide-react';

export default function RulesPage() {
  const [rules, setRules] = useState<InterventionRule[]>(mockRules);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<InterventionRule | null>(null);

  // 切换规则启用状态
  const handleToggle = (ruleId: string, enabled: boolean) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, is_enabled: enabled } : r))
    );
  };

  // 删除规则
  const handleDelete = (ruleId: string) => {
    if (confirm('确定要删除此规则吗？')) {
      setRules((prev) => prev.filter((r) => r.id !== ruleId));
    }
  };

  // 打开编辑对话框
  const handleEdit = (rule: InterventionRule) => {
    setEditingRule(rule);
    setIsDialogOpen(true);
  };

  // 打开新建对话框
  const handleCreate = () => {
    setEditingRule(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">干预规则</h1>
          <p className="text-sm text-gray-500 mt-1">配置自动干预触发条件和动作</p>
        </div>
        <Button onClick={handleCreate} className="bg-blue-500 hover:bg-blue-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          新建规则
        </Button>
      </div>

      {/* 规则列表 */}
      <GlassCard className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead>规则名称</TableHead>
              <TableHead>触发条件</TableHead>
              <TableHead>执行动作</TableHead>
              <TableHead>启用</TableHead>
              <TableHead>触发次数</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <motion.tr
                key={rule.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-gray-50 hover:bg-gray-50/30"
              >
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-800">{rule.name}</p>
                    {rule.description && (
                      <p className="text-xs text-gray-400 mt-0.5">{rule.description}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {rule.conditions.map((cond, idx) => (
                      <GlowBadge key={idx} color="#F97316" variant="outline" size="sm">
                        {mockAvailableMetrics.find(m => m.key === cond.metric)?.name || cond.metric}
                        {cond.operator} {cond.value}
                      </GlowBadge>
                    ))}
                    <span className="text-xs text-gray-400 px-1">
                      ({rule.condition_logic})
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {rule.actions.map((action, idx) => {
                      const actionDef = mockAvailableActions.find(a => a.type === action.type);
                      return (
                        <GlowBadge key={idx} color="#4A90D9" variant="outline" size="sm">
                          {actionDef?.name || action.type}
                        </GlowBadge>
                      );
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={rule.is_enabled}
                    onCheckedChange={(checked) => handleToggle(rule.id, checked)}
                  />
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{rule.trigger_count} 次</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(rule)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(rule.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </GlassCard>

      {/* 规则编辑对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? '编辑规则' : '新建规则'}
            </DialogTitle>
          </DialogHeader>
          
          <RuleEditor
            rule={editingRule}
            onSave={(data) => {
              if (editingRule) {
                setRules(prev => prev.map(r => r.id === editingRule.id ? { ...r, ...data } : r));
              } else {
                const newRule: InterventionRule = {
                  id: `rule-${Date.now()}`,
                  tenant_id: 'default-tenant',
                  ...data,
                  trigger_count: 0,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };
                setRules(prev => [...prev, newRule]);
              }
              setIsDialogOpen(false);
            }}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 规则编辑器组件
interface RuleEditorProps {
  rule: InterventionRule | null;
  onSave: (data: Partial<InterventionRule>) => void;
  onCancel: () => void;
}

function RuleEditor({ rule, onSave, onCancel }: RuleEditorProps) {
  const [name, setName] = useState(rule?.name || '');
  const [description, setDescription] = useState(rule?.description || '');
  const [conditionLogic, setConditionLogic] = useState<'AND' | 'OR'>(rule?.condition_logic || 'AND');
  const [conditions, setConditions] = useState<ConditionConfig[]>(rule?.conditions || []);
  const [actions, setActions] = useState<ActionConfig[]>(rule?.actions || []);

  const addCondition = () => {
    setConditions([...conditions, { metric: 'stress_index', operator: '>', value: 50 }]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, field: keyof ConditionConfig, value: any) => {
    setConditions(conditions.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };

  const addAction = () => {
    setActions([...actions, { type: 'aromatherapy', params: {} }]);
  };

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      name,
      description,
      condition_logic: conditionLogic,
      conditions,
      actions,
      is_enabled: true,
    });
  };

  return (
    <div className="space-y-6 py-4">
      {/* 规则名称 */}
      <div className="space-y-2">
        <Label>规则名称</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="如：高压力自动减压"
        />
      </div>

      {/* 规则描述 */}
      <div className="space-y-2">
        <Label>规则描述</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="描述此规则的作用"
        />
      </div>

      {/* 触发条件 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>🔔 触发条件</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">逻辑关系：</span>
            <Select value={conditionLogic} onValueChange={(v) => setConditionLogic(v as 'AND' | 'OR')}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">AND</SelectItem>
                <SelectItem value="OR">OR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {conditions.map((cond, index) => (
          <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Select
              value={cond.metric}
              onValueChange={(v) => updateCondition(index, 'metric', v)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="选择指标" />
              </SelectTrigger>
              <SelectContent>
                {mockAvailableMetrics.map((m) => (
                  <SelectItem key={m.key} value={m.key}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={cond.operator}
              onValueChange={(v) => updateCondition(index, 'operator', v)}
            >
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=">">&gt;</SelectItem>
                <SelectItem value="<">&lt;</SelectItem>
                <SelectItem value=">=">≥</SelectItem>
                <SelectItem value="<=">≤</SelectItem>
                <SelectItem value="==">=</SelectItem>
                <SelectItem value="!=">≠</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              value={cond.value}
              onChange={(e) => updateCondition(index, 'value', Number(e.target.value))}
              className="w-20"
            />

            <Button variant="ghost" size="sm" onClick={() => removeCondition(index)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <Button variant="outline" size="sm" onClick={addCondition}>
          <Plus className="w-4 h-4 mr-1" /> 添加条件
        </Button>
      </div>

      {/* 执行动作 */}
      <div className="space-y-3">
        <Label>⚡ 执行动作</Label>

        {actions.map((action, index) => {
          const actionDef = mockAvailableActions.find((a) => a.type === action.type);
          return (
            <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <Select
                  value={action.type}
                  onValueChange={(v) => {
                    const newActions = [...actions];
                    newActions[index] = { type: v, params: {} };
                    setActions(newActions);
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="选择动作" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAvailableActions.map((a) => (
                      <SelectItem key={a.type} value={a.type}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={() => removeAction(index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* 动作参数 */}
              {actionDef?.params.map((param) => (
                <div key={param.key} className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-16">{param.name}</span>
                  {param.type === 'select' ? (
                    <Select
                      value={String(action.params[param.key] || param.default)}
                      onValueChange={(v) => {
                        const newActions = [...actions];
                        newActions[index] = {
                          ...action,
                          params: { ...action.params, [param.key]: v },
                        };
                        setActions(newActions);
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {param.options?.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : param.type === 'number' ? (
                    <Input
                      type="number"
                      min={param.min}
                      max={param.max}
                      value={action.params[param.key] || param.default}
                      onChange={(e) => {
                        const newActions = [...actions];
                        newActions[index] = {
                          ...action,
                          params: { ...action.params, [param.key]: Number(e.target.value) },
                        };
                        setActions(newActions);
                      }}
                      className="w-24"
                    />
                  ) : (
                    <Input
                      value={String(action.params[param.key] || param.default)}
                      onChange={(e) => {
                        const newActions = [...actions];
                        newActions[index] = {
                          ...action,
                          params: { ...action.params, [param.key]: e.target.value },
                        };
                        setActions(newActions);
                      }}
                      className="flex-1"
                    />
                  )}
                </div>
              ))}
            </div>
          );
        })}

        <Button variant="outline" size="sm" onClick={addAction}>
          <Plus className="w-4 h-4 mr-1" /> 添加动作
        </Button>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
          保存规则
        </Button>
      </div>
    </div>
  );
}
