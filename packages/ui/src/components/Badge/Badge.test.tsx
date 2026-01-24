import { render } from '@testing-library/react';

import { Badge } from '.';

describe('Badge', () => {
  it('(Snapshot) renders all variants', () => {
    const { container } = render(
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Badge variant="dot" color="green" />
          <Badge variant="dot" color="cyan" />
          <Badge variant="dot" color="orange" />
          <Badge variant="dot" color="red" />
          <Badge variant="dot" color="yellow" />
        </div>
        <div className="flex gap-2">
          <Badge variant="dot" color="green" animated />
          <Badge variant="dot" color="cyan" animated />
        </div>
        <div className="flex gap-2">
          <Badge variant="pill" color="green">
            NEW
          </Badge>
          <Badge variant="pill" color="cyan">
            Update
          </Badge>
          <Badge variant="pill" color="orange">
            Beta
          </Badge>
          <Badge variant="pill" color="red">
            Error
          </Badge>
          <Badge variant="pill" color="yellow">
            Warning
          </Badge>
        </div>
        <div className="flex gap-2">
          <Badge variant="pill" color="green" animated>
            Live
          </Badge>
        </div>
        <div className="flex gap-2">
          <Badge />
          <Badge variant="pill" color="cyan" className="custom-class">
            Custom
          </Badge>
        </div>
      </div>,
    );
    expect(container).toMatchSnapshot();
  });

  it('throws error when dot variant has children', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      render(
        <Badge variant="dot" color="green">
          Invalid
        </Badge>,
      );
    }).toThrow('Badge variant "dot" does not support children');
    consoleSpy.mockRestore();
  });
});
