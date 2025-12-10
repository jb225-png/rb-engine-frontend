import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableCellProps extends TableProps {
  colSpan?: number;
}

export const Table: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-neutral-200 ${className}`}>
        {children}
      </table>
    </div>
  );
};

export const TableHead: React.FC<TableProps> = ({ children }) => {
  return <thead className="bg-neutral-50">{children}</thead>;
};

export const TableBody: React.FC<TableProps> = ({ children }) => {
  return <tbody className="bg-white divide-y divide-neutral-200">{children}</tbody>;
};

export const TableRow: React.FC<TableProps> = ({ children, className = '' }) => {
  return <tr className={className}>{children}</tr>;
};

export const TableHeader: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <th className={`px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
};

export const TableCell: React.FC<TableCellProps> = ({ children, className = '', colSpan }) => {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-neutral-900 ${className}`} colSpan={colSpan}>
      {children}
    </td>
  );
};
