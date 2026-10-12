import { createRef } from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import Input from './Input.js';

afterEach(() => {
  vi.restoreAllMocks();
});

it('removes a pending window load listener on update and unmount', async () => {
  vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading');
  const add = vi.spyOn(window, 'addEventListener');
  const remove = vi.spyOn(window, 'removeEventListener');
  const inputRef = createRef<HTMLInputElement>();
  const { rerender, unmount } = await render(
    <Input inputRef={inputRef} max={59} min={0} name="minute" onChange={vi.fn()} value="1" />,
  );
  const firstHandler = add.mock.calls.find(([type]) => type === 'load')?.[1];
  expect(firstHandler).toBeDefined();

  await rerender(
    <Input inputRef={inputRef} max={59} min={0} name="minute" onChange={vi.fn()} value="12" />,
  );
  expect(remove).toHaveBeenCalledWith('load', firstHandler);
  const loadCalls = add.mock.calls.filter(([type]) => type === 'load');
  expect(loadCalls).toHaveLength(2);

  await unmount();
  expect(remove).toHaveBeenCalledWith('load', loadCalls[1]?.[1]);
});

it('removes a pending font listener on update and unmount', async () => {
  vi.spyOn(document.fonts, 'check').mockReturnValue(false);
  const add = vi.spyOn(document.fonts, 'addEventListener');
  const remove = vi.spyOn(document.fonts, 'removeEventListener');
  const inputRef = createRef<HTMLInputElement>();
  const { rerender, unmount } = await render(
    <Input inputRef={inputRef} max={59} min={0} name="minute" onChange={vi.fn()} value="1" />,
  );
  const firstHandler = add.mock.calls.find(([type]) => type === 'loadingdone')?.[1];
  expect(firstHandler).toBeDefined();

  await rerender(
    <Input inputRef={inputRef} max={59} min={0} name="minute" onChange={vi.fn()} value="12" />,
  );
  expect(remove).toHaveBeenCalledWith('loadingdone', firstHandler);
  const fontCalls = add.mock.calls.filter(([type]) => type === 'loadingdone');
  expect(fontCalls).toHaveLength(2);

  await unmount();
  expect(remove).toHaveBeenCalledWith('loadingdone', fontCalls[1]?.[1]);
});
