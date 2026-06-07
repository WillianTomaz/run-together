interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export const Card = ({ children, className = '', padding = true }: CardProps) => {
  return (
    <div className={`card ${padding ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  );
};
