import React, { useState, useEffect, useCallback } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Spinner } from './Spinner';
import { templatesApi, TemplatePreview } from '../../api/templates';
import { TemplateType, WorldviewFlag } from '../../types/api';

interface TemplatePreviewCardProps {
  templateType: TemplateType;
  worldviewFlag: WorldviewFlag;
  onPreviewLoad?: (preview: TemplatePreview) => void;
}

const TEMPLATE_LABELS: Record<TemplateType, string> = {
  BUNDLE_OVERVIEW: 'Bundle Overview',
  VOCABULARY_PACK: 'Vocabulary Pack',
  ANCHOR_READING_PASSAGE: 'Anchor Reading Passage',
  READING_COMPREHENSION_QUESTIONS: 'Reading Comprehension',
  SHORT_QUIZ: 'Short Quiz',
  EXIT_TICKETS: 'Exit Tickets',
  WRITING_PROMPTS: 'Writing Prompts',
};

const TEMPLATE_DESCRIPTIONS: Record<TemplateType, string> = {
  BUNDLE_OVERVIEW: 'A complete curriculum package overview with standard alignment, learning objectives, and pacing guide.',
  VOCABULARY_PACK: 'Key vocabulary terms with definitions, example sentences, and a quiz section.',
  ANCHOR_READING_PASSAGE: 'A core reading text with pre-reading vocabulary, full passage, and discussion questions.',
  READING_COMPREHENSION_QUESTIONS: '10 questions: 5 multiple choice, 3 short answer, and 2 extended response.',
  SHORT_QUIZ: '7 questions: 5 multiple choice and 2 short response with answer key.',
  EXIT_TICKETS: '5 exit ticket prompts with sample answers for quick end-of-lesson checks.',
  WRITING_PROMPTS: '3 structured writing prompts with a model exemplar response.',
};

const TEMPLATE_ICONS: Record<TemplateType, string> = {
  BUNDLE_OVERVIEW: '📦',
  VOCABULARY_PACK: '📖',
  ANCHOR_READING_PASSAGE: '📄',
  READING_COMPREHENSION_QUESTIONS: '❓',
  SHORT_QUIZ: '✏️',
  EXIT_TICKETS: '🎫',
  WRITING_PROMPTS: '✍️',
};

export const TemplatePreviewCard: React.FC<TemplatePreviewCardProps> = ({
  templateType,
  worldviewFlag,
  onPreviewLoad,
}) => {
  const [preview, setPreview] = useState<TemplatePreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPreview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const previewData = await templatesApi.getTemplatePreview(templateType);
      setPreview(previewData);
      onPreviewLoad?.(previewData);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load preview');
    } finally {
      setLoading(false);
    }
  }, [templateType, onPreviewLoad]);

  useEffect(() => {
    loadPreview();
  }, [loadPreview]);

  return (
    <div className="space-y-4">
      {/* Template Info Card */}
      <Card className="!p-5">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl">{TEMPLATE_ICONS[templateType]}</span>
          <div className="min-w-0">
            <h3 className="font-semibold text-neutral-900 text-base leading-tight">
              {TEMPLATE_LABELS[templateType]}
            </h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
              worldviewFlag === 'CHRISTIAN'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-neutral-100 text-neutral-600'
            }`}>
              {worldviewFlag === 'CHRISTIAN' ? '✝️ Christian' : '📚 Neutral'}
            </span>
          </div>
        </div>
        <p className="text-sm text-neutral-600 leading-relaxed">
          {TEMPLATE_DESCRIPTIONS[templateType]}
        </p>
      </Card>

      {/* Preview Content Card */}
      <Card className="!p-5">
        <h4 className="text-sm font-semibold text-neutral-700 mb-3 uppercase tracking-wide">
          Example Output
        </h4>

        {loading && (
          <div className="flex items-center gap-2 py-4 text-neutral-500 text-sm">
            <Spinner size="sm" />
            <span>Loading preview...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-sm text-red-500 mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={loadPreview}>Retry</Button>
          </div>
        )}

        {!loading && !error && preview && preview.preview && (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {Object.entries(preview.preview).map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0)) return null;
              const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

              if (Array.isArray(value)) {
                return (
                  <div key={key}>
                    <p className="text-xs font-medium text-neutral-500 mb-1">{label}</p>
                    <ul className="space-y-1">
                      {(value as any[]).slice(0, 3).map((item, idx) => (
                        <li key={idx} className="text-xs text-neutral-700 bg-neutral-50 rounded px-2 py-1 truncate">
                          {typeof item === 'string' ? `• ${item}` : typeof item === 'object' ? `• ${item.title || item.word || item.question || JSON.stringify(item).slice(0, 60)}` : `• ${item}`}
                        </li>
                      ))}
                      {value.length > 3 && (
                        <li className="text-xs text-neutral-400 px-2">+{value.length - 3} more...</li>
                      )}
                    </ul>
                  </div>
                );
              }

              if (typeof value === 'string') {
                return (
                  <div key={key}>
                    <p className="text-xs font-medium text-neutral-500 mb-1">{label}</p>
                    <p className="text-xs text-neutral-700 bg-neutral-50 rounded px-2 py-1.5 leading-relaxed line-clamp-3">
                      {value}
                    </p>
                  </div>
                );
              }

              if (typeof value === 'number') {
                return (
                  <div key={key} className="flex items-center justify-between">
                    <p className="text-xs font-medium text-neutral-500">{label}</p>
                    <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{value}</span>
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}
      </Card>

      {/* Christian Guidelines */}
      {worldviewFlag === 'CHRISTIAN' && preview?.structure?.christian_guidelines &&
        Object.keys(preview.structure.christian_guidelines).length > 0 && (
        <Card className="!p-4 border border-blue-100 !bg-blue-50">
          <h4 className="text-xs font-semibold text-blue-800 mb-2 uppercase tracking-wide">
            ✝️ Christian Content Guidelines
          </h4>
          <div className="space-y-1">
            {Object.entries(preview.structure.christian_guidelines).map(([key, value]) => (
              <p key={key} className="text-xs text-blue-700">
                <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span> {value}
              </p>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
