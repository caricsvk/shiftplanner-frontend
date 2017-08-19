import { ShiftplannerPage } from './app.po';

describe('shiftplanner App', () => {
  let page: ShiftplannerPage;

  beforeEach(() => {
    page = new ShiftplannerPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
