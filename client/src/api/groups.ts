import { http } from './http';

export interface Group {
  _id: string;
  name: string;
  description: string;
  category?: string;
  members: string[];
  admins: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface JoinGroupResponse {
  success: boolean;
  group: Group;
  message: string;
}

export const groupsApi = {
  // Join a group by category
  joinGroup: async (category: string, userId: string): Promise<JoinGroupResponse> => {
    const response = await http.post(`/api/groups/join/${category}`, { userId });
    return response.data;
  },

  // Leave a group
  leaveGroup: async (groupId: string, userId: string): Promise<{ success: boolean; message: string }> => {
    const response = await http.post(`/api/groups/leave/${groupId}`, { userId });
    return response.data;
  },

  // Get user's groups
  getUserGroups: async (userId: string): Promise<Group[]> => {
    const response = await http.get(`/api/groups/user/${userId}`);
    return response.data;
  },

  // Get groups by category
  getGroupsByCategory: async (category: string): Promise<Group[]> => {
    const response = await http.get(`/api/groups/category/${category}`);
    return response.data;
  },

  // Check if user is member of group
  checkMembership: async (groupId: string, userId: string): Promise<{ isMember: boolean }> => {
    const response = await http.get(`/api/groups/${groupId}/member/${userId}`);
    return response.data;
  },

  // Get all groups
  getAllGroups: async (): Promise<Group[]> => {
    const response = await http.get('/api/groups');
    return response.data;
  },

  // Get group by ID
  getGroupById: async (groupId: string): Promise<Group> => {
    const response = await http.get(`/api/groups/${groupId}`);
    return response.data;
  }
}; 