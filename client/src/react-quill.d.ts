declare module 'react-quill' {
  import * as React from 'react';

  // Minimal props definition; extend/add as needed for richer typing
  export interface ReactQuillProps {
    value?: string;
    onChange?: (content: string, delta: any, source: string, editor: any) => void;
    placeholder?: string;
    className?: string;
    theme?: string;
    ref?: React.Ref<unknown>;
    [key: string]: any;
  }

  class ReactQuill extends React.Component<ReactQuillProps> {}
  export default ReactQuill;
} 