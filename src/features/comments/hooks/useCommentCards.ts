import * as React from "react";

export type CommentMode = "draft" | "collapsed";

export interface CommentCardState {
  id: string;
  mode: CommentMode;
  comment: string;
  day: string;
  savedComment: string;
  savedDay: string;
}

export interface UseCommentCardsOptions {
  initialCount?: number;
  initialComment?: string;
  initialDay?: string;
}

const DEFAULT_COMMENT = "This is the comment that I added.";
const DEFAULT_DAY = "saturday";

function createInitialCard(index: number, comment: string, day: string): CommentCardState {
  return {
    id: `comment-${index}`,
    mode: "collapsed",
    comment,
    day,
    savedComment: comment,
    savedDay: day,
  };
}

export function useCommentCards({
  initialCount = 5,
  initialComment = DEFAULT_COMMENT,
  initialDay = DEFAULT_DAY,
}: UseCommentCardsOptions = {}) {
  const [cards, setCards] = React.useState<CommentCardState[]>(() =>
    Array.from({ length: initialCount }, (_, index) =>
      createInitialCard(index, initialComment, initialDay)
    )
  );

  const updateCard = React.useCallback((next: CommentCardState) => {
    setCards((previous) =>
      previous.map((card) => (card.id === next.id ? next : card))
    );
  }, []);

  return {
    cards,
    updateCard,
  };
}
