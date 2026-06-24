import { JSDOM } from 'jsdom';
import fs from 'fs';
describe('index.html', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    const html = fs.readFileSync('frontend/index.html', 'utf8');
    dom = new JSDOM(html);
    document = dom.window.document;
    window = dom.window;
  });

  it('should have increased header size', () => {
    const header = document.querySelector('header');
    expect(header.style.height).toBe('100px');
  });

  it('should have increased font size for Noir Chat', () => {
    const h1 = document.querySelector('h1');
    expect(h1.style.fontSize).toBe('36px');
  });

  it('should render header with correct styles', () => {
    const header = document.querySelector('header');
    expect(header.style.backgroundColor).toBe('rgb(240, 240, 240)');
    expect(header.style.padding).toBe('20px');
    expect(header.style.textAlign).toBe('center');
  });

  it('should render h1 with correct text', () => {
    const h1 = document.querySelector('h1');
    expect(h1.textContent).toBe('Noir Chat');
  });
});