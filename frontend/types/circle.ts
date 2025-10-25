/**
 * Circle State Enum
 */
export enum CircleState {
  Pending = 0,
  Active = 1,
  Completed = 2,
  Cancelled = 3,
}

/**
 * Circle Information
 */
export interface CircleInfo {
  id: number;
  address: string;
  creator: string;
  contributionAmount: bigint;
  contributionFrequency: bigint; // in seconds
  maxMembers: number;
  currentMembers: number;
  state: CircleState;
  currentRound: number;
  startTime: bigint;
  name?: string;
  description?: string;
}

/**
 * Member Information
 */
export interface MemberInfo {
  address: string;
  isMember: boolean;
  hasPaid: boolean;
  hasReceivedPayout: boolean;
  totalContributed: bigint;
  joinedAt: bigint;
}

/**
 * Circle Card Props (for display)
 */
export interface CircleCardData {
  id: number;
  address: string;
  name: string;
  contributionAmount: string;
  frequency: string;
  members: number;
  maxMembers: number;
  state: CircleState;
  progress: number;
  nextPayout?: string;
}

/**
 * Create Circle Form Data
 */
export interface CreateCircleFormData {
  name: string;
  description: string;
  contributionAmount: string;
  contributionFrequency: number; // in days
  maxMembers: number;
  isPrivate: boolean;
}
