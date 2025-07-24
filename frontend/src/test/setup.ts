import '@testing-library/jest-dom';
import { vi, expect } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';

// Vitest's expect.extend requires an object of matcher functions. Cast to any
// to avoid TS complaints about the matcher signature.
// jest-axe exports an object of matchers
expect.extend(toHaveNoViolations as any);

// Ensure Recharts components render in tests by providing non-zero dimensions
// for elements queried by ResponsiveContainer. Without this, it falls back to
// rendering empty divs because JSDOM reports zero width/height.
Object.defineProperty(HTMLDivElement.prototype, 'getBoundingClientRect', {
  configurable: true,
  value() {
    const rect = {
      width: 800,
      height: 400,
      top: 0,
      left: 0,
      bottom: 400,
      right: 800,
      x: 0,
      y: 0,
    };
    return {
      ...rect,
      toJSON() {
        return rect;
      },
    };
  },
});

// Mock IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: class IntersectionObserver {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}
    observe() {
      return null;
    }
    disconnect() {
      return null;
    }
    unobserve() {
      return null;
    }
  },
});

// Mock ResizeObserver
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: class ResizeObserver {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}
    observe() {
      return null;
    }
    disconnect() {
      return null;
    }
    unobserve() {
      return null;
    }
  },
});

// Mock File and FileReader APIs
Object.defineProperty(window, 'File', {
  writable: true,
  value: class File {
    constructor(
      fileBits: BlobPart[],
      fileName: string,
      options?: FilePropertyBag
    ) {
      return {
        name: fileName,
        size: fileBits.length,
        type: options?.type || '',
        lastModified: Date.now(),
        slice: () => new Blob(),
        stream: () => new ReadableStream(),
        text: () => Promise.resolve(''),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      };
    }
  },
});

Object.defineProperty(window, 'FileReader', {
  writable: true,
  value: class FileReader {
    readAsDataURL() {
      this.onload?.({
        target: { result: 'data:text/plain;base64,dGVzdA==' },
      } as any);
    }
    readAsText() {
      this.onload?.({ target: { result: 'test content' } } as any);
    }
    onload: ((event: any) => void) | null = null;
    onerror: ((event: any) => void) | null = null;
    result: string | ArrayBuffer | null = null;
    readyState = 2;
  },
});

// Mock URL.createObjectURL
Object.defineProperty(window.URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'mock-object-url'),
});

Object.defineProperty(window.URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn(),
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    length: 0,
    key: (index: number) => Object.keys(store)[index] || null,
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock HTMLCanvasElement methods for chart testing
// Mock canvas context with proper typing
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn((contextId: string) => {
    if (contextId === '2d') {
      return {
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        getImageData: vi.fn(() => ({
          data: new Uint8ClampedArray(4),
          width: 1,
          height: 1,
          colorSpace: 'srgb',
        })),
        putImageData: vi.fn(),
        createImageData: vi.fn(() => ({
          data: new Uint8ClampedArray(4),
          width: 1,
          height: 1,
          colorSpace: 'srgb',
        })),
        setTransform: vi.fn(),
        drawImage: vi.fn(),
        save: vi.fn(),
        fillText: vi.fn(),
        restore: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        closePath: vi.fn(),
        stroke: vi.fn(),
        translate: vi.fn(),
        scale: vi.fn(),
        rotate: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        measureText: vi.fn(() => ({ width: 0 })),
        transform: vi.fn(),
        rect: vi.fn(),
        clip: vi.fn(),
        canvas: document.createElement('canvas'),
        globalAlpha: 1,
        globalCompositeOperation: 'source-over' as GlobalCompositeOperation,
      } as unknown as CanvasRenderingContext2D;
    }
    return null;
  }),
  writable: true,
});

// Mock SVG for chart rendering
Object.defineProperty(window, 'SVGElement', {
  writable: true,
  value: class SVGElement {
    getBBox() {
      return { x: 0, y: 0, width: 0, height: 0 };
    }
    getScreenCTM() {
      return null;
    }
  },
});


// Suppress specific console warnings during tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
