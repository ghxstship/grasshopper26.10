import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'on-leave';
  joinedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  leaderId: string;
  members: TeamMember[];
  metadata?: Record<string, unknown>;
}

interface TeamState {
  // State
  teams: Team[];
  currentTeam: Team | null;
  filters: {
    department: string;
    status: string;
    search: string;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setTeams: (teams: Team[]) => void;
  setCurrentTeam: (team: Team | null) => void;
  addTeam: (team: Team) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  addMember: (teamId: string, member: TeamMember) => void;
  removeMember: (teamId: string, memberId: string) => void;
  updateFilters: (filters: Partial<TeamState['filters']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  teams: [],
  currentTeam: null,
  filters: {
    department: 'all',
    status: 'all',
    search: '',
  },
  isLoading: false,
  error: null,
};

export const useTeamStore = create<TeamState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setTeams: (teams) => set({ teams }),

        setCurrentTeam: (team) => set({ currentTeam: team }),

        addTeam: (team) =>
          set((state) => ({
            teams: [team, ...state.teams],
          })),

        updateTeam: (id, updates) =>
          set((state) => ({
            teams: state.teams.map((team) =>
              team.id === id ? { ...team, ...updates } : team
            ),
            currentTeam:
              state.currentTeam?.id === id
                ? { ...state.currentTeam, ...updates }
                : state.currentTeam,
          })),

        deleteTeam: (id) =>
          set((state) => ({
            teams: state.teams.filter((team) => team.id !== id),
            currentTeam:
              state.currentTeam?.id === id ? null : state.currentTeam,
          })),

        addMember: (teamId, member) =>
          set((state) => ({
            teams: state.teams.map((team) =>
              team.id === teamId
                ? { ...team, members: [...team.members, member] }
                : team
            ),
            currentTeam:
              state.currentTeam?.id === teamId
                ? {
                    ...state.currentTeam,
                    members: [...state.currentTeam.members, member],
                  }
                : state.currentTeam,
          })),

        removeMember: (teamId, memberId) =>
          set((state) => ({
            teams: state.teams.map((team) =>
              team.id === teamId
                ? {
                    ...team,
                    members: team.members.filter((m) => m.id !== memberId),
                  }
                : team
            ),
            currentTeam:
              state.currentTeam?.id === teamId
                ? {
                    ...state.currentTeam,
                    members: state.currentTeam.members.filter(
                      (m) => m.id !== memberId
                    ),
                  }
                : state.currentTeam,
          })),

        updateFilters: (filters) =>
          set((state) => ({
            filters: { ...state.filters, ...filters },
          })),

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        reset: () => set(initialState),
      }),
      {
        name: 'atlvs-team-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    ),
    { name: 'TeamStore' }
  )
);
