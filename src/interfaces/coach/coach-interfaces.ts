export interface IResultCoachAvailbility {
  d: {
    results: [
      {
        ListCoach: {
          results: IResultListCoach[];
        };
        NonAvailCoach: {
          results: IResultNonAvailCoach[];
        };
      }
    ];
  };
}
export interface IResultListCoach {
  CoachId: string;
  CoachName: string;
  Gender: string;
  CoachDesc: string;
  UrlImage: string;
  MaxPlayer: string;
  TotalPrice: number;
}

export interface IConvertedListCoach {
  CoachId: string;
  CoachName: string;
  Gender: string;
  CoachDesc: string;
  UrlImage: string;
  Price: number;
}

export interface IResultNonAvailCoach {
  CoachId: string;
  TimeSlot: string;
}

export interface IConvertedCoachAvailbility {
  ListCoach: IConvertedListCoach[];
  NonAvailCoach: IResultNonAvailCoach[];
}
