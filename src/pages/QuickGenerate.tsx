import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const QuickGenerate: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Quick Generate</h1>
      
      <div className="max-w-3xl">
        <Card>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Generate Curriculum Content
          </h2>
          <p className="text-neutral-600 mb-6">
            Use AI to quickly generate curriculum content for your products. Fill in the details below to get started.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Product Type
              </label>
              <select className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Select product type</option>
                <option>Course</option>
                <option>Module</option>
                <option>Lesson</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Topic
              </label>
              <input
                type="text"
                placeholder="Enter topic or subject"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Additional Instructions
              </label>
              <textarea
                rows={4}
                placeholder="Provide any specific requirements or context..."
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="primary">Generate Content</Button>
              <Button variant="outline">Reset Form</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
