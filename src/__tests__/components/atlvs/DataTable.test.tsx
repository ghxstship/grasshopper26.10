import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable, DataTableColumn } from '@/components/ui-rebuild/organisms/DataTable';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props}>{children}</tr>,
  },
}));

interface TestData extends Record<string, unknown> {
  id: string;
  name: string;
  status: string;
  value: number;
}

describe('DataTable', () => {
  const mockData: TestData[] = [
    { id: '1', name: 'Item 1', status: 'active', value: 100 },
    { id: '2', name: 'Item 2', status: 'pending', value: 200 },
    { id: '3', name: 'Item 3', status: 'active', value: 150 },
    { id: '4', name: 'Item 4', status: 'inactive', value: 50 },
    { id: '5', name: 'Item 5', status: 'active', value: 300 },
  ];

  const mockColumns: DataTableColumn<TestData>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'status', header: 'Status', sortable: true },
    { key: 'value', header: 'Value', sortable: true },
  ];

  describe('Rendering', () => {
    it('renders table with data', () => {
      render(<DataTable data={mockData} columns={mockColumns} />);
      
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Value')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('renders empty table when no data', () => {
      render(<DataTable data={[]} columns={mockColumns} />);
      
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });

    it('renders custom column content with render function', () => {
      const customColumns: DataTableColumn<TestData>[] = [
        {
          key: 'status',
          header: 'Status',
          render: (value) => <span className="custom">{String(value).toUpperCase()}</span>,
        },
      ];

      render(<DataTable data={mockData} columns={customColumns} />);
      
      expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    });

    it('displays result count badge', () => {
      render(<DataTable data={mockData} columns={mockColumns} />);
      
      expect(screen.getByText('5 results')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('renders search input when searchable is true', () => {
      render(<DataTable data={mockData} columns={mockColumns} searchable={true} />);
      
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('hides search input when searchable is false', () => {
      render(<DataTable data={mockData} columns={mockColumns} searchable={false} />);
      
      expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
    });

    it('filters data based on search query', () => {
      render(<DataTable data={mockData} columns={mockColumns} searchable={true} />);
      
      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.change(searchInput, { target: { value: 'Item 2' } });
      
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
      expect(screen.getByText('1 results')).toBeInTheDocument();
    });

    it('performs case-insensitive search', () => {
      render(<DataTable data={mockData} columns={mockColumns} searchable={true} />);
      
      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.change(searchInput, { target: { value: 'ACTIVE' } });
      
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('3 results')).toBeInTheDocument();
    });
  });

  describe('Sorting Functionality', () => {
    it('sorts data in ascending order when column header is clicked', () => {
      render(<DataTable data={mockData} columns={mockColumns} />);
      
      const nameHeader = screen.getByText('Name').parentElement?.querySelector('button');
      fireEvent.click(nameHeader!);
      
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('Item 1');
    });

    it('toggles sort direction on repeated clicks', () => {
      render(<DataTable data={mockData} columns={mockColumns} />);
      
      const valueHeader = screen.getByText('Value').parentElement?.querySelector('button');
      
      // First click - ascending
      fireEvent.click(valueHeader!);
      let rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('50');
      
      // Second click - descending
      fireEvent.click(valueHeader!);
      rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('300');
    });

    it('does not show sort button for non-sortable columns', () => {
      const nonSortableColumns: DataTableColumn<TestData>[] = [
        { key: 'name', header: 'Name', sortable: false },
      ];

      render(<DataTable data={mockData} columns={nonSortableColumns} />);
      
      const nameHeader = screen.getByText('Name').parentElement;
      expect(nameHeader?.querySelector('button')).not.toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Item ${i + 1}`,
      status: 'active',
      value: i * 10,
    }));

    it('displays pagination controls when data exceeds page size', () => {
      render(<DataTable data={largeData} columns={mockColumns} pageSize={10} />);
      
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('navigates to next page', () => {
      render(<DataTable data={largeData} columns={mockColumns} pageSize={10} />);
      
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      
      expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
      expect(screen.getByText('Item 11')).toBeInTheDocument();
    });

    it('navigates to previous page', () => {
      render(<DataTable data={largeData} columns={mockColumns} pageSize={10} />);
      
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      
      const prevButton = screen.getByText('Previous');
      fireEvent.click(prevButton);
      
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    });

    it('disables Previous button on first page', () => {
      render(<DataTable data={largeData} columns={mockColumns} pageSize={10} />);
      
      const prevButton = screen.getByText('Previous');
      expect(prevButton).toBeDisabled();
    });

    it('disables Next button on last page', () => {
      render(<DataTable data={largeData} columns={mockColumns} pageSize={10} />);
      
      // Navigate to last page
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      
      expect(screen.getByText('Next')).toBeDisabled();
    });

    it('hides pagination when data fits on one page', () => {
      render(<DataTable data={mockData} columns={mockColumns} pageSize={10} />);
      
      expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument();
    });
  });

  describe('Export Functionality', () => {
    let mockCreateObjectURL: jest.Mock;
    let mockRevokeObjectURL: jest.Mock;
    let mockClick: jest.Mock;
    let createElementSpy: jest.SpyInstance;

    beforeEach(() => {
      // Mock URL methods
      mockCreateObjectURL = jest.fn(() => 'mock-url');
      mockRevokeObjectURL = jest.fn();
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;
      
      // Mock document.createElement for anchor element
      mockClick = jest.fn();
      const originalCreateElement = document.createElement.bind(document);
      createElementSpy = jest.spyOn(document, 'createElement');
      createElementSpy.mockImplementation((tag: string) => {
        if (tag === 'a') {
          const mockAnchor = {
            click: mockClick,
            href: '',
            download: '',
            style: {},
          } as unknown as HTMLAnchorElement;
          return mockAnchor;
        }
        return originalCreateElement(tag);
      });
    });

    afterEach(() => {
      createElementSpy.mockRestore();
    });

    it('renders export button when exportable is true', () => {
      render(<DataTable data={mockData} columns={mockColumns} exportable={true} />);
      
      expect(screen.getByText('Export')).toBeInTheDocument();
    });

    it('hides export button when exportable is false', () => {
      render(<DataTable data={mockData} columns={mockColumns} exportable={false} />);
      
      expect(screen.queryByText('Export')).not.toBeInTheDocument();
    });

    it('triggers export on button click', () => {
      render(<DataTable data={mockData} columns={mockColumns} exportable={true} />);
      
      const exportButton = screen.getByText('Export');
      fireEvent.click(exportButton);
      
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });
  });

  describe('Row Interactions', () => {
    it('calls onRowClick when row is clicked', () => {
      const onRowClick = jest.fn();
      render(<DataTable data={mockData} columns={mockColumns} onRowClick={onRowClick} />);
      
      const firstRow = screen.getByText('Item 1').closest('tr');
      fireEvent.click(firstRow!);
      
      expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
    });

    it('does not call onRowClick when not provided', () => {
      render(<DataTable data={mockData} columns={mockColumns} />);
      
      const firstRow = screen.getByText('Item 1').closest('tr');
      expect(() => fireEvent.click(firstRow!)).not.toThrow();
    });
  });

  describe('Column Width', () => {
    it('applies custom column width', () => {
      const columnsWithWidth: DataTableColumn<TestData>[] = [
        { key: 'name', header: 'Name', width: '200px' },
      ];

      render(<DataTable data={mockData} columns={columnsWithWidth} />);
      
      const header = screen.getByText('Name').closest('th');
      expect(header).toHaveStyle({ width: '200px' });
    });
  });

  describe('Filter Button', () => {
    it('renders filter button', () => {
      render(<DataTable data={mockData} columns={mockColumns} />);
      
      expect(screen.getByText('Filter')).toBeInTheDocument();
    });
  });
});
