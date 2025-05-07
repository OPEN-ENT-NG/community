export interface CommunityParams {
  title: string;
  note: string;
  startYear: string;
  endYear: string;
}
export interface communityCover {
  color?: string;
  image?: string;
}

export interface WizardData {
  communityType: {
    type: string;
  };
  communityParams: CommunityParams;
  communityCover: communityCover;
}
