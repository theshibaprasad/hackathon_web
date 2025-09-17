interface FloatingShapesProps {
  className?: string;
}

export const FloatingShapes = ({ className = "" }: FloatingShapesProps) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Top left shapes */}
      <div className="absolute top-20 left-20 w-16 h-16 bg-shape-yellow rounded-full shape-float opacity-80" />
      <div className="absolute top-40 left-32 w-12 h-12 bg-shape-orange rounded-lg shape-float-delay opacity-70" />
      
      {/* Top right shapes */}
      <div className="absolute top-32 right-24 w-20 h-20 bg-shape-green rounded-full shape-float-delay-2 opacity-75" />
      <div className="absolute top-16 right-40 w-8 h-8 bg-shape-blue rounded-full shape-float opacity-90" />
      
      {/* Bottom left shapes */}
      <div className="absolute bottom-40 left-16 w-14 h-14 bg-shape-purple rounded-lg shape-float-delay opacity-60" />
      <div className="absolute bottom-20 left-40 w-10 h-10 bg-shape-light rounded-full shape-float-delay-2 opacity-80" />
      
      {/* Bottom right shapes */}
      <div className="absolute bottom-32 right-20 w-18 h-18 bg-shape-orange rounded-full shape-float opacity-70" />
      <div className="absolute bottom-60 right-32 w-6 h-6 bg-shape-yellow rounded-lg shape-float-delay opacity-85" />
      
      {/* Center scattered shapes */}
      <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-shape-blue rounded-full shape-float-delay-2 opacity-60" />
      <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-shape-green rounded-lg shape-float opacity-50" />
    </div>
  );
};