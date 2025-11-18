import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GanttChart, GanttTask } from '@/components/atlvs/GanttChart';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
}));

describe('GanttChart', () => {
  // Use consistent UTC dates to avoid timezone issues
  const startDate = new Date(Date.UTC(2024, 0, 1));
  const endDate = new Date(Date.UTC(2024, 2, 31));

  const mockTasks: GanttTask[] = [
    {
      id: '1',
      name: 'Task 1',
      startDate: new Date(Date.UTC(2024, 0, 1)),
      endDate: new Date(Date.UTC(2024, 0, 31)),
      progress: 50,
      assignee: 'John Doe',
    },
    {
      id: '2',
      name: 'Task 2',
      startDate: new Date(Date.UTC(2024, 1, 1)),
      endDate: new Date(Date.UTC(2024, 1, 28)),
      progress: 100,
      assignee: 'Jane Smith',
    },
    {
      id: '3',
      name: 'Parent Task',
      startDate: new Date(Date.UTC(2024, 0, 1)),
      endDate: new Date(Date.UTC(2024, 2, 31)),
      progress: 75,
      expanded: true,
      subtasks: [
        {
          id: '3-1',
          name: 'Subtask 1',
          startDate: new Date(Date.UTC(2024, 0, 1)),
          endDate: new Date(Date.UTC(2024, 0, 15)),
          progress: 100,
        },
      ],
    },
  ];

  describe('Rendering', () => {
    it('renders the gantt chart container', () => {
      render(<GanttChart tasks={mockTasks} startDate={startDate} endDate={endDate} />);
      
      expect(screen.getByText('TASKS')).toBeInTheDocument();
    });

    it('renders all tasks', () => {
      render(<GanttChart tasks={mockTasks} startDate={startDate} endDate={endDate} />);
      
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('Parent Task')).toBeInTheDocument();
    });

    it('renders task assignees', () => {
      render(<GanttChart tasks={mockTasks} startDate={startDate} endDate={endDate} />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('renders progress percentages', () => {
      render(<GanttChart tasks={mockTasks} startDate={startDate} endDate={endDate} />);
      
      expect(screen.getByText('50%')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('renders timeline months', () => {
      render(<GanttChart tasks={mockTasks} startDate={startDate} endDate={endDate} />);
      
      expect(screen.getByText(/Jan 2024/)).toBeInTheDocument();
      expect(screen.getByText(/Feb 2024/)).toBeInTheDocument();
      expect(screen.getByText(/Mar 2024/)).toBeInTheDocument();
    });

    it('renders subtasks when parent is expanded', () => {
      render(<GanttChart tasks={mockTasks} startDate={startDate} endDate={endDate} />);
      
      expect(screen.getByText('Subtask 1')).toBeInTheDocument();
    });
  });

  describe('Task Interactions', () => {
    it('calls onTaskClick when task is clicked', () => {
      const onTaskClick = jest.fn();
      render(<GanttChart tasks={mockTasks} startDate={startDate} endDate={endDate} onTaskClick={onTaskClick} />);
      
      const taskBars = screen.getAllByText('Task 1');
      const taskBar = taskBars[taskBars.length - 1]; // Get the one in the timeline
      fireEvent.click(taskBar);
      
      expect(onTaskClick).toHaveBeenCalledWith(mockTasks[0]);
    });

    it('does not call onTaskClick when not provided', () => {
      render(<GanttChart tasks={mockTasks} startDate={startDate} endDate={endDate} />);
      
      const taskBars = screen.getAllByText('Task 1');
      const taskBar = taskBars[taskBars.length - 1];
      expect(() => fireEvent.click(taskBar)).not.toThrow();
    });
  });

  describe('Progress Colors', () => {
    it('applies different colors based on progress', () => {
      const { container } = render(<GanttChart tasks={mockTasks} startDate={startDate} endDate={endDate} />);
      
      // Check for progress-based color classes
      expect(container.querySelector('.bg-warning-light0')).toBeInTheDocument(); // 50% progress
      expect(container.querySelector('.bg-atlvs-green-500')).toBeInTheDocument(); // 100% progress
    });
  });

  describe('Empty States', () => {
    it('renders with no tasks', () => {
      render(<GanttChart tasks={[]} startDate={startDate} endDate={endDate} />);
      
      expect(screen.getByText('TASKS')).toBeInTheDocument();
    });
  });

  describe('Subtask Handling', () => {
    it('does not render subtasks when parent is collapsed', () => {
      const collapsedTasks: GanttTask[] = [
        {
          id: '1',
          name: 'Collapsed Parent',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-03-31'),
          progress: 50,
          expanded: false,
          subtasks: [
            {
              id: '1-1',
              name: 'Hidden Subtask',
              startDate: new Date('2024-01-01'),
              endDate: new Date('2024-01-15'),
              progress: 100,
            },
          ],
        },
      ];

      render(<GanttChart tasks={collapsedTasks} startDate={startDate} endDate={endDate} />);
      
      expect(screen.getByText('Collapsed Parent')).toBeInTheDocument();
      expect(screen.queryByText('Hidden Subtask')).not.toBeInTheDocument();
    });
  });
});
