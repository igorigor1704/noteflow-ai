export type ReviewGrade = 0 | 1 | 2 | 3 | 4 | 5;

export type SpacedCard = {
  id: string;
  front: string;
  back: string;
  interval: number;
  repetition: number;
  easeFactor: number;
  dueDate: string;
  lastReviewedAt?: string;
};

export function createSpacedCard(
  id: string,
  front: string,
  back: string
): SpacedCard {
  return {
    id,
    front,
    back,
    interval: 1,
    repetition: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString(),
    lastReviewedAt: undefined,
  };
}

export function isDueToday(card: SpacedCard): boolean {
  return new Date(card.dueDate).getTime() <= new Date().getTime();
}

export function reviewSpacedCard(
  card: SpacedCard,
  grade: ReviewGrade
): SpacedCard {
  let repetition = card.repetition;
  let interval = card.interval;
  let easeFactor = card.easeFactor;

  if (grade < 3) {
    repetition = 0;
    interval = 1;
  } else {
    repetition += 1;

    if (repetition === 1) {
      interval = 1;
    } else if (repetition === 2) {
      interval = 6;
    } else {
      interval = Math.max(1, Math.round(interval * easeFactor));
    }
  }

  easeFactor =
    easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));

  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);

  return {
    ...card,
    repetition,
    interval,
    easeFactor,
    dueDate: dueDate.toISOString(),
    lastReviewedAt: new Date().toISOString(),
  };
}