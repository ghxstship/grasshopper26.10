import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { KanbanBoard, KanbanColumn, KanbanTask } from '@/components/atlvs/KanbanBoard';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
  Reorder: {
    Group: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    Item: ({ children, value, ...props }: React.HTMLAttributes<HTMLDivElement> & { value: KanbanTask }) => (
      <div data-testid={`task-${value.id}`} {...props}>{children}</div>
    ),
  },
}));

describe('KanbanBoard', () => {
  const mockTasks: KanbanTask[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      assignee: 'John Doe',
      dueDate: '2024-12-31',
      priority: 'high',
      tags: ['urgent', 'bug'],
    },
    {
      id: '2',
      title: 'Task 2',
      priority: 'low',
    },
  ];

  const mockColumns: KanbanColumn[] = [
    {
      id: 'todo',
      title: 'To Do',
      tasks: [mockTasks[0]],
      color: 'bg-blue-500',
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      tasks: [mockTasks[1]],
    },
  ];

  describe('Rendering', () => {
    it('renders all columns', () => {
      render(<KanbanBoard columns={mockColumns} />);
      
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });

    it('renders task count badges', () => {
      render(<KanbanBoard columns={mockColumns} />);
      
      const badges = screen.getAllByText('1');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('renders tasks in columns', () => {
      render(<KanbanBoard columns={mockColumns} />);
      
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    it('renders task descriptions', () => {
      render(<KanbanBoard columns={mockColumns} />);
      
      expect(screen.getByText('Description 1')).toBeInTheDocument();
    });

    it('renders task assignees', () => {
      render(<KanbanBoard columns={mockColumns} />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('renders task due dates', () => {
      render(<KanbanBoard columns={mockColumns} />);
      
      expect(screen.getByText('2024-12-31')).toBeInTheDocument();
    });

    it('renders task tags', () => {
      render(<KanbanBoard columns={mockColumns} />);
      
      expect(screen.getByText('urgent')).toBeInTheDocument();
      expect(screen.getByText('bug')).toBeInTheDocument();
    });

    it('applies custom column colors', () => {
      render(<KanbanBoard columns={mockColumns} />);
      
      const colorDivs = document.querySelectorAll('.bg-blue-500');
      expect(colorDivs.length).toBeGreaterThan(0);
    });
  });

  describe('Priority Indicators', () => {
    it('renders priority indicators for tasks', () => {
      render(<KanbanBoard columns={mockColumns} />);
      
      const priorityDots = document.querySelectorAll('[title="high"]');
      expect(priorityDots.length).toBeGreaterThan(0);
    });
  });

  describe('Interactions', () => {
    it('calls onTaskClick when task is clicked', () => {
      const onTaskClick = jest.fn();
      render(<KanbanBoard columns={mockColumns} onTaskClick={onTaskClick} />);
      
      const task = screen.getByText('Task 1').closest('div');
      fireEvent.click(task!);
      
      expect(onTaskClick).toHaveBeenCalledWith(mockTasks[0]);
    });

    it('calls onAddTask when add button is clicked', () => {
      const onAddTask = jest.fn();
      render(<KanbanBoard columns={mockColumns} onAddTask={onAddTask} />);
      
      const addButtons = screen.getAllByRole('button');
      const firstAddButton = addButtons[0];
      fireEvent.click(firstAddButton);
      
      expect(onAddTask).toHaveBeenCalledWith('todo');
    });

    it('does not call onTaskClick when not provided', () => {
      render(<KanbanBoard columns={mockColumns} />);
      
      const task = screen.getByText('Task 1').closest('div');
      expect(() => fireEvent.click(task!)).not.toThrow();
    });
  });

  describe('Empty States', () => {
    it('renders columns with no tasks', () => {
      const emptyColumns: KanbanColumn[] = [
        { id: 'empty', title: 'Empty Column', tasks: [] },
      ];
      
      render(<KanbanBoard columns={emptyColumns} />);
      
      expect(screen.getByText('Empty Column')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });
});
