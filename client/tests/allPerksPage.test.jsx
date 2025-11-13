
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';

import AllPerks from '../src/pages/AllPerks.jsx';
import { renderWithRouter } from './utils/renderWithRouter.js';




describe('AllPerks page (Directory)', () => {
test('lists public perks and responds to name filtering', async () => {
// The seeded record gives us a deterministic expectation regardless of the
// rest of the shared database contents.
const seededPerk = global.__TEST_CONTEXT__.seededPerk;

// Render the exploration page so it performs its real HTTP fetch.
renderWithRouter(
<Routes>
<Route path="/explore" element={<AllPerks />} />
</Routes>,
{ initialEntries: ['/explore'] }
);

// Wait for the baseline card to appear which guarantees the asynchronous
// fetch finished.
await waitFor(() => {
expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
});

// Interact with the name filter input using the real value that
// corresponds to the seeded record.
const nameFilter = screen.getByPlaceholderText('Enter perk name...');
fireEvent.change(nameFilter, { target: { value: seededPerk.title } });

await waitFor(() => {
expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
});

// The summary text should continue to reflect the number of matching perks.
expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
});

/*
TODO: Test merchant filtering
- use the seeded record
- perform a real HTTP fetch.
- wait for the fetch to finish
- choose the record's merchant from the dropdown
- verify the record is displayed
- verify the summary text reflects the number of matching perks
*/

test('lists public perks and responds to merchant filtering', async () => {
// use the seeded record for deterministic expectations
const seededPerk = global.__TEST_CONTEXT__.seededPerk;

// Render the exploration page so it performs its real HTTP fetch.
renderWithRouter(
<Routes>
<Route path="/explore" element={<AllPerks />} />
</Routes>,
{ initialEntries: ['/explore'] }
);

// wait for initial fetch to complete by asserting the seeded record appears
await waitFor(() => {
expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
});

// choose the record's merchant from the dropdown
// There is a single <select> on the page (role=combobox)
const merchantSelect = screen.getByRole('combobox');
fireEvent.change(merchantSelect, { target: { value: seededPerk.merchant } });

// wait for the debounced auto-search + fetch to complete
await waitFor(() => {
// verify the record is displayed (still present under the merchant filter)
expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
});

// verify the summary text reflects the number of matching perks
// (we at least expect it to say "Showing" and not be 0)
const summary = screen.getByText(/showing/i);
expect(summary).toHaveTextContent(/Showing/i);
expect(summary).not.toHaveTextContent(/Showing\s+0\s+perks?/i);
});
});