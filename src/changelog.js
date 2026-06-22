export const changelog = [
  {
    version: '1.0',
    date: '2026-06-22',
    fixed: [
      'Background music now starts at half its previous loudness on both the home and play screens.',
    ],
    changed: [
      'The menu button is now a bigger, bolder tap target with thicker bars on both the home and play screens, scaling down gracefully on the narrowest phones.',
      'On phones, the Goku-on-nimbus animation now sits directly beneath the Dragon Ball Z title above the Fight button, while keeping its original position on larger screens.',
    ],
  },
  {
    version: '1.0',
    date: '2026-05-31',
    changed: [
      'The Memory Game title cloud on mobile now uses structural grid placement to sit reliably just below the Dragon Ball Z logo, with no large viewport offsets that could push the Fight button off screen.',
    ],
  },
  {
    version: '1.0',
    date: '2026-05-30',
    fixed: [
      'Restored the original mobile home screen layout, so the Memory Game title cloud sits just below the Dragon Ball Z logo and the Fight button stays fully on screen.',
    ],
  },
];
