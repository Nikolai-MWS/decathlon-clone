export interface ReviewDto {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
}

export interface ReviewSummaryDto {
  average: number;
  count: number;
  /** Count of submitted reviews per star (1–5). */
  breakdown: Record<number, number>;
}

export interface ReviewsResponseDto {
  summary: ReviewSummaryDto;
  items: ReviewDto[];
}

export interface CreateReviewInput {
  rating: number;
  title: string;
  body: string;
}
