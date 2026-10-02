/**
 * Single source for the declassified letter.
 * Repository search found no existing letter to Joe Haslam.
 * Body composed only from facts in the assignment brief.
 */

export const letterMeta = {
  classification: "DECLASSIFIED MEMORANDUM",
  document: "THE FOUNDER'S SHADOW: DEPTH TO DEFECT",
  course: "Question 05 — Scaleup Masterclass",
  place: "IE Business School — IE Tower, Madrid",
  to: "Professor Joe Haslam",
  from: "Sarfaraz Singh Wahad",
  subject: "What I will scale, and the perimeter I will not cross",
} as const;

export const letterParagraphs: { id: string; text: string; lede?: boolean }[] = [
  {
    id: "open",
    lede: true,
    text: "Professor Haslam, this memorandum is my answer to Question 05. I am writing it as a report, not a pitch.",
  },
  {
    id: "facts",
    text: "I was a technical officer on Indian Navy submarines for eleven years. I then led Generative AI work at PwC. I am now the founder of AnterVid, and I am in the Scaleup Masterclass at IE Business School. Those are the facts the rest of this letter sits inside. I am not going to decorate them.",
  },
  {
    id: "romance",
    text: "What changed is the bearing. I used to think being a founder was about agency, the helm, and the cinema of building. Before scaleup, that romance had a ready vocabulary: Exponential Growth, Disruption, Founder Title, the Techstars Dream. The title felt like a qualification. I believed the helm was the point.",
  },
  {
    id: "shadow",
    text: "Now I think founding is an extreme form of debt borrowed against yourself and the people waiting at home. The instruments on that bearing are operational debt, relational stress, and a zero margin of error. Nothing in that list is a story. It is the condition.",
  },
  {
    id: "doctrine",
    text: "I can set the two systems side by side, because I have served in one and I am now in the other. At three hundred meters, a submarine is a doctrine before it is a machine. The pressure hull carries thirty atmospheres. The weight is shared across a crew of eighty. The emergency operating procedures have been tested for a century. At 03:00, a reactor scram or flooding does not ask you to invent a response. There is a written casualty drill. The safety net is naval doctrine. You are not alone with the alarm.",
  },
  {
    id: "vacuum",
    text: "Early-stage deep tech, at AnterVid, has no equivalent net. The weight sits one hundred percent on the co-founders. The protocol is a void. An Indian Railways contract can be signed on one side of the work while an inbox fills with automated corporate rejections on the other. I do not treat that dissonance as something to tidy up later. This is not the phase before the process. This IS the process.",
  },
  {
    id: "rail",
    text: "The problem I will stay with is unglamorous, and that is why I trust it. A railway track fractures silently under load and nobody sees it until the train derails. That is an unglamorous, safety-critical problem I understand from naval engineering. I would rather scale that than any idea that merely sounds good in a pitch. The fracture is sub-surface. It is cyclic fatigue. It is the reason I will not quit.",
  },
  {
    id: "speakers",
    text: "Three guest speakers in this masterclass said the same thing on different frequencies. Alex MacDonald spoke to the eradication of founder vanity, and to the unglamorous mechanics of building from scratch. Ines Sanchez-Castillo Velge made the operator's point: the people who last are anchored to the defect, not to the prospective liquidity event. Jeff Weinstein described scaling as unvarnished daily plumbing — fixing broken leaks under pressure. The founders who survive the grinder are not in love with the title; they are pathologically obsessed with a specific, stubborn problem.",
  },
  {
    id: "perimeter",
    text: "Which leaves the perimeter: what I will not do. I will not scale a deficit and call it ambition. Sacrificing physical health is bad engineering on human capital. I will not outsource the cost of my ambition to my family. The shadow doesn't land on the cap table—it lands on my wife, Simran, and my son, Shamshir. If the venture scales by abandoning them, it failed. If I cannot explain a decision in one sentence to a petty officer on my old submarine, it is ego, not substance.",
  },
  {
    id: "close",
    text: "That is my answer to Question 05. I am scaling an obsession with a defect I can point at. I am not scaling a deficit and renaming it vision.",
  },
];

export const letterSignOff = [
  "Sarfaraz Singh Wahad",
  "Founder, AnterVid",
  "Indian Navy — Submarine Technical Officer, eleven years",
  "Formerly PwC — Generative AI Lead",
  "Scaleup Masterclass, IE Business School",
] as const;

export function letterToPlainText(): string {
  const head = [
    letterMeta.classification,
    letterMeta.document,
    letterMeta.course,
    letterMeta.place,
    "",
    `To: ${letterMeta.to}`,
    `From: ${letterMeta.from}`,
    `Subject: ${letterMeta.subject}`,
    "",
  ];
  const body = letterParagraphs.map((p) => p.text);
  return [...head, ...body, "", "Respectfully,", "", ...letterSignOff].join("\n");
}
