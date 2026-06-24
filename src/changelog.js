export const changelog = [
  {
    version: '1.0',
    date: '2026-06-23',
    fixed: [
      'On phones, the Goku-on-nimbus animation now layers directly behind the Fight button as intended instead of appearing in a separate row above it.',
      'Background music no longer stacks overlapping copies of a track when switching screens or toggling sound, so only one track plays at a time at the set volume.',
    ],
    changed: [
      'The background music now plays at a consistent volume across the home and play screens.',
      'The background music now plays at a lower, quieter volume across the home and play screens.',
      'New sessions now start with the background music at an even quieter default volume.',
    ],
  },
];
