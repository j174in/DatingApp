export type Member = {
  id: string;
  dateOfBirth: string;
  imageUrl?: string;
  displayName: string;
  created: string;
  lastActive: string;
  gender: string;
  description?: string;
  city: string;
  country: string;
};

export type Photo = {
  id: number;
  url: string;
  publicId?: string;
  memberId: string;
  isApproved: boolean;
};

export type EditableMember = {
  displayName: string;
  description?: string;
  city: string;
  country: string;
};

export class MemberParams {
  gender?: string;
  maxAge: number = 100;
  minAge: number = 18;
  pageSize = 10;
  pageNumber = 1;
  orderBy = 'lastActive';
}
