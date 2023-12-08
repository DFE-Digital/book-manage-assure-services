const { getArtefacts } = require('../path-to-your-functions'); // Adjust the path

jest.mock('airtable'); 

describe('Database Operations', () => {
  it('fetches artefacts successfully from Airtable', async () => {
    const artefacts = await getArtefacts('test-id');
    expect(artefacts).toHaveLength(1); // Assuming the mock returns one artefact
    expect(artefacts[0].id).toBe('123');
  });
});