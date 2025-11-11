import * as React from "react";

import CommentCard from "./CommentCard";
import { useCommentCards } from "../hooks/useCommentCards";

const AVATARS = [
  "https://www.figma.com/api/mcp/asset/52d66495-d5be-4d76-8239-02e6d99a8604",
  "https://www.figma.com/api/mcp/asset/c51e2b9a-0f4a-498b-bbcc-971072101e92",
  "https://www.figma.com/api/mcp/asset/87955733-90b3-431b-b6ca-5b8f0225a1d3",
];

const CommentDeck: React.FC = () => {
  const { cards, updateCard } = useCommentCards();

  return (
    <div className="flex w-full max-w-3xl flex-col gap-8">
      {cards.map((card, index) => (
        <CommentCard
          key={card.id}
          state={card}
          onChange={updateCard}
          avatarSrc={AVATARS[index % AVATARS.length]}
        />
      ))}
    </div>
  );
};

export default CommentDeck;
