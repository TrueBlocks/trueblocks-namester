import { FormField, Table, TableProps } from '@components';
import { ViewStateKey } from '@contexts';
import { MantineProvider } from '@mantine/core';
import { types } from '@models';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

type TestRow = {
  id: number;
  name: string;
  description: string;
  status?: string;
  deleted?: boolean;
};

const mockColumns: FormField<TestRow>[] = [
  { key: 'id', header: 'ID', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'description', header: 'Description', sortable: false },
  {
    key: 'status',
    header: 'Status',
    render: (row: TestRow) => `${row.deleted ? 'Deleted' : 'Active'}`,
    sortable: false,
  },
];

const mockData = [
  { id: 1, name: 'Item 1', description: 'First item' },
  { id: 2, name: 'Item 2', description: 'Second item', deleted: true },
  { id: 3, name: 'Item 3', description: 'Third item' },
];

const viewStateKey: ViewStateKey = {
  viewName: 'test-view',
  tabName: types.DataFacet.ALL,
};

const defaultProps: TableProps<TestRow> = {
  columns: mockColumns,
  data: mockData,
  loading: false,
  viewStateKey,
  onSubmit: vi.fn(),
};

const setupTest = (props: Partial<TableProps<TestRow>> = {}) => {
  const testProps = { ...defaultProps, ...props };
  return render(
    <MantineProvider>
      <Table {...testProps} />
    </MantineProvider>,
  );
};

describe('Table', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Group 1: Basic rendering tests
  describe('Rendering', () => {
    it('renders column headers', () => {
      setupTest();
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('renders data rows', () => {
      setupTest();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
      expect(screen.getByText('First item')).toBeInTheDocument();
      expect(screen.getByText('Second item')).toBeInTheDocument();
      expect(screen.getByText('Third item')).toBeInTheDocument();
    });

    it('renders custom cell content using render function', () => {
      setupTest();
      const activeElements = screen.getAllByText('Active');
      const deletedElements = screen.getAllByText('Deleted');

      expect(activeElements.length).toBe(2);
      expect(deletedElements.length).toBe(1);
    });
  });

  // Group 2: State handling tests
  describe('State handling', () => {
    it('shows loading state', () => {
      setupTest({ loading: true, data: [] });
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows no data message when data is empty', () => {
      setupTest({ data: [] });
      expect(screen.getByText('No data found.')).toBeInTheDocument();
    });
  });

  // Group 3: ViewStateKey integration tests
  describe('ViewStateKey integration', () => {
    it('includes viewStateKey prop in rendered table', () => {
      expect(() => setupTest()).not.toThrow();
    });
  });

  // Group 4: Edge cases and special scenarios
  describe('Edge cases', () => {
    it('handles no sortable columns', () => {
      const nonSortableColumns = mockColumns.map((col) => ({
        ...col,
        sortable: false,
      }));
      setupTest({ columns: nonSortableColumns });
      expect(screen.getByText('ID')).toBeInTheDocument();
    });

    it('handles large datasets', () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        description: `Description ${i + 1}`,
      }));

      setupTest({
        data: largeDataset.slice(0, 10),
        viewStateKey: viewStateKey,
      });

      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(11);
    });

    it('handles column with custom render function', () => {
      const columnsWithCustomRenderer: FormField<TestRow>[] = [
        ...mockColumns,
        {
          key: 'custom',
          header: 'Custom Column',
          render: () => 'Static content',
        },
      ];

      setupTest({ columns: columnsWithCustomRenderer });
      expect(screen.getByText('Custom Column')).toBeInTheDocument();
      expect(screen.getAllByText('Static content').length).toBe(3);
    });
  });
});
