import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { StatusBadge } from '../components/ui/StatusBadge';
import { api, apiClient, Product } from '../api/client';

type TabType = 'raw' | 'final' | 'metadata' | 'files';

const TEMPLATE_LABELS: Record<string, string> = {
  BUNDLE_OVERVIEW:                 'Bundle Overview',
  VOCABULARY_PACK:                 'Vocabulary Pack',
  ANCHOR_READING_PASSAGE:          'Anchor Reading Passage',
  READING_COMPREHENSION_QUESTIONS: 'Reading Comprehension Questions',
  SHORT_QUIZ:                      'Short Quiz',
  EXIT_TICKETS:                    'Exit Tickets',
  WRITING_PROMPTS:                 'Writing Prompts',
};

const TEMPLATE_ICONS: Record<string, string> = {
  BUNDLE_OVERVIEW:                 '📦',
  VOCABULARY_PACK:                 '📖',
  ANCHOR_READING_PASSAGE:          '📄',
  READING_COMPREHENSION_QUESTIONS: '❓',
  SHORT_QUIZ:                      '✏️',
  EXIT_TICKETS:                    '🎫',
  WRITING_PROMPTS:                 '✍️',
};

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('raw');
  const [product, setProduct] = useState<Product | null>(null);
  const [productContent, setProductContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const downloadPptx = async () => {
    if (!product) return;
    setDownloading(true);
    try {
      const response = await apiClient.get(`/products/${product.id}/download/pptx`, {
        responseType: 'blob',
      });
      const cd = response.headers['content-disposition'];
      const filename = cd?.split('filename=')[1]?.replace(/"/g, '')
        || `${product.template_type?.toLowerCase()}_grade_${product.grade_level}_${product.id}.pptx`;
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`PPTX download failed: ${err.response?.data?.detail || err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await api.getProduct(parseInt(id));
        setProduct(response.data);
        
        // Try to get content, but don't fail if endpoint doesn't exist
        try {
          const contentData = await api.getProductContent(parseInt(id));
          setProductContent(contentData);
        } catch (contentError) {
          console.error('Failed to load content:', contentError);
          setProductContent(null);
        }
      } catch (error: any) {
        console.error('Failed to fetch product:', error);
        setError(error.response?.data?.detail || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-12">
          <div className="text-neutral-500">Loading product...</div>
        </div>
      </PageContainer>
    );
  }

  if (error || !product) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Product not found</h2>
          <p className="text-neutral-600 mb-4">{error || "The product you're looking for doesn't exist."}</p>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </PageContainer>
    );
  }

  const getProductTitle = (product: Product) => {
    const label = TEMPLATE_LABELS[product.template_type] || product.template_type.replace(/_/g, ' ');
    const standard = product.ela_standard_code || '';
    const grade = product.grade_level ? `Grade ${product.grade_level}` : '';
    return standard ? `${label} — ${standard} ${grade}` : `${label} ${grade}`;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'GENERATED': return 'Generated';
      case 'DRAFT': return 'Draft';
      case 'FAILED': return 'Failed';
      default: return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'GENERATED': return 'success';
      case 'DRAFT': return 'pending';
      case 'FAILED': return 'error';
      default: return 'pending';
    }
  };

  const tabs = [
    { id: 'raw', label: 'Raw Output' },
    { id: 'final', label: 'Final Output' },
    { id: 'metadata', label: 'Metadata' },
    { id: 'files', label: 'Files' }
  ];

  return (
    <PageContainer>
      <PageHeader
        title={getProductTitle(product)}
        description={`${product.curriculum_board} · ${product.worldview_flag === 'CHRISTIAN' ? '✝️ Christian Content' : '📚 Neutral Content'} · ID #${product.id}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/products')}>Back</Button>
            {product.status === 'GENERATED' && (
              <Button variant="primary" onClick={downloadPptx} loading={downloading} disabled={downloading}>Download PPTX</Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Product Summary */}
          <Card className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{TEMPLATE_ICONS[product.template_type] || '📝'}</span>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-neutral-900 truncate">
                  {getProductTitle(product)}
                </h2>
                <p className="text-sm text-neutral-500 mt-0.5">
                  {product.curriculum_board}
                </p>
              </div>
              <div className="ml-auto shrink-0">
                <StatusBadge status={getStatusVariant(product.status) as any}>
                  {getStatusLabel(product.status)}
                </StatusBadge>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-neutral-100">
              <div className="bg-neutral-50 rounded-lg px-3 py-2">
                <p className="text-xs font-medium text-neutral-400 mb-0.5">Product ID</p>
                <p className="text-sm font-semibold text-neutral-800">#{product.id}</p>
              </div>
              <div className="bg-neutral-50 rounded-lg px-3 py-2">
                <p className="text-xs font-medium text-neutral-400 mb-0.5">Standard</p>
                <p className="text-sm font-semibold text-neutral-800 font-mono">{product.ela_standard_code || '—'}</p>
              </div>
              <div className="bg-neutral-50 rounded-lg px-3 py-2">
                <p className="text-xs font-medium text-neutral-400 mb-0.5">Grade</p>
                <p className="text-sm font-semibold text-neutral-800">Grade {product.grade_level}</p>
              </div>
              <div className="bg-neutral-50 rounded-lg px-3 py-2">
                <p className="text-xs font-medium text-neutral-400 mb-0.5">Created</p>
                <p className="text-sm font-semibold text-neutral-800">{new Date(product.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Card>
            <div className="border-b border-neutral-200 mb-6">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-96">
              {activeTab === 'raw' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Raw AI Output</h3>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                    {product.status === 'GENERATED' ? (
                      productContent ? (
                        <pre className="whitespace-pre-wrap text-sm text-neutral-800">
                          {JSON.stringify(productContent, null, 2)}
                        </pre>
                      ) : (
                        <div>
                          <p className="text-neutral-600 text-sm mb-3">Content endpoint not available. Showing product metadata:</p>
                          <pre className="whitespace-pre-wrap text-sm text-neutral-800">
                            {JSON.stringify(product, null, 2)}
                          </pre>
                        </div>
                      )
                    ) : (
                      <p className="text-neutral-600 text-sm">
                        Raw content will be available once generation is complete.
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'final' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Final Processed Output</h3>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                    {product.status === 'GENERATED' ? (
                      productContent ? (
                        <div className="prose max-w-none">
                          {/* Title - use template_type label, not raw AI title */}
                          {product.template_type && (
                            <h4 className="text-xl font-bold text-neutral-900 mb-4">
                              {product.template_type.replace(/_/g, ' ')} — Grade {product.grade_level}
                            </h4>
                          )}
                          
                          {/* Reading Passage Content */}
                          {productContent.passage_text && (
                            <div className="mb-6">
                              <div className="bg-white border border-neutral-300 rounded-lg p-4">
                                <div className="flex items-center gap-4 mb-3 text-sm text-neutral-600">
                                  {productContent.reading_level && (
                                    <span><strong>Reading Level:</strong> {productContent.reading_level}</span>
                                  )}
                                  {productContent.word_count && (
                                    <span><strong>Word Count:</strong> {productContent.word_count}</span>
                                  )}
                                </div>
                                <div className="text-neutral-800 leading-relaxed whitespace-pre-wrap">
                                  {productContent.passage_text}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Main Theme */}
                          {productContent.main_theme && (
                            <div className="mb-4">
                              <strong className="text-neutral-900">Main Theme:</strong>
                              <p className="mt-1 text-neutral-700 italic">{productContent.main_theme}</p>
                            </div>
                          )}
                          
                          {/* Key Vocabulary */}
                          {productContent.key_vocabulary && Array.isArray(productContent.key_vocabulary) && productContent.key_vocabulary.length > 0 && (
                            <div className="mb-4">
                              <strong className="text-neutral-900">Key Vocabulary:</strong>
                              <ul className="mt-2 space-y-2">
                                {productContent.key_vocabulary.map((vocab: string, idx: number) => {
                                  const [term, ...defParts] = vocab.split(':');
                                  const definition = defParts.join(':').trim();
                                  return (
                                    <li key={idx} className="ml-5">
                                      <strong className="text-neutral-900">{term.trim()}:</strong>
                                      <span className="text-neutral-700"> {definition}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                          
                          {/* Discussion Questions */}
                          {productContent.discussion_questions && Array.isArray(productContent.discussion_questions) && productContent.discussion_questions.length > 0 && (
                            <div className="mb-4">
                              <strong className="text-neutral-900">Discussion Questions:</strong>
                              <ol className="mt-2 space-y-2 list-decimal ml-5">
                                {productContent.discussion_questions.map((question: string, idx: number) => (
                                  <li key={idx} className="text-neutral-700">{question}</li>
                                ))}
                              </ol>
                            </div>
                          )}
                          
                          {/* Worksheet Content */}
                          {productContent.instructions && <div className="mb-4"><strong>Instructions:</strong> <span className="text-neutral-700">{productContent.instructions}</span></div>}
                          {productContent.learning_objectives && (
                            <div className="mb-4">
                              <strong>Learning Objectives:</strong>
                              <ul className="list-disc ml-5 mt-2">
                                {productContent.learning_objectives.map((obj: string, idx: number) => (
                                  <li key={idx} className="text-neutral-700">{obj}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {productContent.questions && (
                            <div className="mb-4">
                              <strong>Questions:</strong>
                              <div className="mt-2 space-y-3">
                                {productContent.questions.map((q: any, idx: number) => (
                                  <div key={idx} className="border-l-4 border-blue-200 pl-4 py-2">
                                    <p className="text-neutral-900"><strong>Q{q.number ?? idx + 1}:</strong> {q.question || q.text || q}</p>
                                    {q.options && typeof q.options === 'object' && !Array.isArray(q.options) && (
                                      <ul className="list-none ml-2 mt-1 space-y-1">
                                        {Object.entries(q.options).map(([key, val]) => (
                                          <li key={key} className="text-neutral-700">
                                            <strong>{key}.</strong> {val as string}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                    {q.options && Array.isArray(q.options) && (
                                      <ul className="list-disc ml-5 mt-1">
                                        {q.options.map((opt: string, optIdx: number) => (
                                          <li key={optIdx} className="text-neutral-700">{opt}</li>
                                        ))}
                                      </ul>
                                    )}
                                    {q.answer && (
                                      <p className="text-sm text-green-700 mt-1"><strong>Answer:</strong> {q.answer}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {productContent.answer_key && (
                            <div className="mb-4">
                              <strong>Answer Key:</strong>
                              <div className="mt-2 bg-gray-50 p-3 rounded">
                                {Array.isArray(productContent.answer_key) ? (
                                  <ul className="space-y-1">
                                    {productContent.answer_key.map((answer: any, idx: number) => (
                                      <li key={idx} className="text-neutral-700"><strong>{idx + 1}:</strong> {answer.answer || answer.explanation || answer}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-neutral-700">{productContent.answer_key}</p>
                                )}
                              </div>
                            </div>
                          )}
                          {productContent.extension_activities && (
                            <div className="mb-4">
                              <strong>Extension Activities:</strong>
                              <ul className="list-disc ml-5 mt-2">
                                {productContent.extension_activities.map((activity: any, idx: number) => (
                                  <li key={idx} className="text-neutral-700">
                                    {typeof activity === 'string' ? activity : (
                                      <div>
                                        <strong>{activity.title}:</strong> {activity.description}
                                        {activity.difficulty && <span className="text-xs text-neutral-500 ml-2">({activity.difficulty})</span>}
                                      </div>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-neutral-600 text-sm">Loading content...</p>
                          <div className="bg-white border rounded p-3">
                            <h5 className="font-medium mb-2">Product Summary:</h5>
                            <p><strong>Type:</strong> {product.template_type}</p>
                            <p><strong>Grade:</strong> {product.grade_level}</p>
                            <p><strong>Curriculum:</strong> {product.curriculum_board}</p>
                            <p><strong>Status:</strong> {product.status}</p>
                          </div>
                        </div>
                      )
                    ) : (
                      <p className="text-neutral-600 text-sm">
                        Final content will be available once generation is complete.
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'metadata' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Product Metadata</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-neutral-700 mb-2">Template Info</p>
                        <div className="space-y-1 text-sm text-neutral-600">
                          <p><strong>Type:</strong> {product.template_type}</p>
                          <p><strong>Standard:</strong> {product.ela_standard_code}</p>
                          <p><strong>Standard Type:</strong> {product.ela_standard_type}</p>
                          <p><strong>Worldview:</strong> {product.worldview_flag}</p>
                          <p><strong>Christian Content:</strong> {product.is_christian_content ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-neutral-700 mb-2">Generation Info</p>
                        <div className="space-y-1 text-sm text-neutral-600">
                          <p><strong>Job ID:</strong> #{product.generation_job_id || 'N/A'}</p>
                          <p><strong>Grade Level:</strong> {product.grade_level}</p>
                          <p><strong>Locale:</strong> {product.locale}</p>
                          <p><strong>Curriculum:</strong> {product.curriculum_board}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-neutral-700 mb-3">SEO Metadata</p>
                      <div className="space-y-3 text-sm text-neutral-600">
                        <div>
                          <strong className="text-neutral-700">SEO Title:</strong>
                          <p className="mt-1 text-neutral-900">{product.seo_title || 'Not set'}</p>
                        </div>
                        <div>
                          <strong className="text-neutral-700">SEO Description:</strong>
                          <p className="mt-1 text-neutral-900">{product.seo_description || 'Not set'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {product.internal_linking_block && (
                      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-neutral-700 mb-3">Internal Linking Block</p>
                        <div className="bg-white border border-neutral-300 rounded p-3 text-sm">
                          <div 
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: product.internal_linking_block }}
                          />
                        </div>
                        <details className="mt-2">
                          <summary className="text-xs text-neutral-500 cursor-pointer hover:text-neutral-700">View HTML Source</summary>
                          <pre className="mt-2 text-xs bg-neutral-100 p-2 rounded overflow-x-auto">
                            {product.internal_linking_block}
                          </pre>
                        </details>
                      </div>
                    )}
                    
                    {product.social_snippets && Array.isArray(product.social_snippets) && product.social_snippets.length > 0 && (
                      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-neutral-700 mb-3">Social Media Snippets</p>
                        <div className="space-y-3">
                          {product.social_snippets.map((snippet: any, index: number) => (
                            <div key={index} className="bg-white border border-neutral-300 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                  {snippet.platform || 'Social Media'}
                                </span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(snippet.text || '');
                                    alert('Copied to clipboard!');
                                  }}
                                  className="text-xs text-neutral-500 hover:text-neutral-700 underline"
                                >
                                  Copy
                                </button>
                              </div>
                              <p className="text-sm text-neutral-800 whitespace-pre-wrap">{snippet.text || ''}</p>
                              {snippet.hashtags && Array.isArray(snippet.hashtags) && snippet.hashtags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {snippet.hashtags.map((tag: string, tagIndex: number) => (
                                    <span key={tagIndex} className="text-xs text-blue-600">#{tag}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-neutral-700 mb-2">Processing Info</p>
                      <div className="space-y-1 text-sm text-neutral-600">
                        <p><strong>Status:</strong> {product.status}</p>
                        <p><strong>Created:</strong> {new Date(product.created_at).toLocaleString()}</p>
                        <p><strong>Product ID:</strong> #{product.id}</p>
                        <p><strong>Standard ID:</strong> #{product.standard_id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'files' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Generated Files</h3>
                  <div className="space-y-3">
                    {product.status === 'GENERATED' ? (
                      <>
                        {/* PPTX Download */}
                        <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                          <div>
                            <p className="font-medium text-neutral-900">{product.template_type?.toLowerCase().replace(/_/g, '-')}-grade-{product.grade_level}-{product.id}.pptx</p>
                            <p className="text-sm text-neutral-500">PowerPoint • Filled template</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={downloadPptx} loading={downloading} disabled={downloading}>
                            {downloading ? 'Downloading...' : 'Download PPTX'}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                          <div>
                            <p className="font-medium text-neutral-900">{product.template_type?.toLowerCase().replace(/_/g, '-') || 'template'}-metadata.json</p>
                            <p className="text-sm text-neutral-500">JSON • Metadata file</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const dataStr = JSON.stringify(product, null, 2);
                              const dataBlob = new Blob([dataStr], {type: 'application/json'});
                              const url = URL.createObjectURL(dataBlob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `product-${product.id}-metadata.json`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              URL.revokeObjectURL(url);
                            }}
                          >
                            Download
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p className="text-neutral-600 text-sm">
                        Files will be available once generation is complete.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Details</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Worldview</span>
                <span className={`font-medium ${
                  product.worldview_flag === 'CHRISTIAN' ? 'text-blue-600' : 'text-neutral-700'
                }`}>
                  {product.worldview_flag === 'CHRISTIAN' ? '✝️ Christian' : '📚 Neutral'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Standard Type</span>
                <span className="font-medium text-neutral-700">{product.ela_standard_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Locale</span>
                <span className="font-medium text-neutral-700">{product.locale || 'US'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Job ID</span>
                <span className="font-medium text-neutral-700">#{product.generation_job_id || '—'}</span>
              </div>
            </div>
          </div>

          {product.status === 'GENERATED' && (
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Download</p>
              <Button variant="primary" fullWidth onClick={downloadPptx} loading={downloading} disabled={downloading}>
                {downloading ? 'Downloading...' : '⬇️ Download PPTX'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};