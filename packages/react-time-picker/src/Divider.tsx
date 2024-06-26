type DividerProps = {
  children?: React.ReactNode;
};

export default function Divider({ children }: DividerProps): React.ReactElement {
  return <span className="react-time-picker__inputGroup__divider">{children}</span>;
}
