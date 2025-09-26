interface FloatingShapesProps {
  className?: string;
}

export const FloatingShapes = ({ className = "" }: FloatingShapesProps) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Top row - 5 icons spread across full width */}
      <div 
        className="absolute top-20 left-8 w-8 h-8 rounded-full shape-float opacity-80" 
        style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}
      />
      <div 
        className="absolute top-20 left-1/4 w-6 h-6 rounded-lg shape-float-delay opacity-70" 
        style={{ background: 'linear-gradient(135deg, #FFA500, #FFD700)' }}
      />
      <div 
        className="absolute top-20 left-1/2 w-8 h-8 rounded-full shape-float opacity-90" 
        style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
      />
      <div 
        className="absolute top-20 left-3/4 w-6 h-6 rounded-lg shape-float-delay-2 opacity-75" 
        style={{ background: 'linear-gradient(135deg, #10B981, #3B82F6)' }}
      />
      <div 
        className="absolute top-20 right-8 w-8 h-8 rounded-full shape-float-delay opacity-60" 
        style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
      />
      
      {/* Middle top row - 4 icons */}
      <div 
        className="absolute top-40 left-16 w-6 h-6 rounded-lg shape-float-delay opacity-60" 
        style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
      />
      <div 
        className="absolute top-40 left-1/3 w-10 h-10 rounded-full shape-float opacity-70" 
        style={{ background: 'linear-gradient(135deg, #FFA500, #FFD700)' }}
      />
      <div 
        className="absolute top-40 left-2/3 w-6 h-6 rounded-lg shape-float-delay-2 opacity-50" 
        style={{ background: 'linear-gradient(135deg, #10B981, #3B82F6)' }}
      />
      <div 
        className="absolute top-40 right-16 w-8 h-8 rounded-lg shape-float opacity-80" 
        style={{ background: 'linear-gradient(135deg, #87CEEB, #3B82F6)' }}
      />
      
      {/* Center row - 5 icons */}
      <div 
        className="absolute top-1/2 left-12 w-8 h-8 rounded-lg shape-float-delay opacity-60" 
        style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
      />
      <div 
        className="absolute top-1/2 left-1/4 w-6 h-6 rounded-full shape-float opacity-70" 
        style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
      />
      <div 
        className="absolute top-1/2 left-1/2 w-10 h-10 rounded-full shape-float-delay-2 opacity-80" 
        style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}
      />
      <div 
        className="absolute top-1/2 left-3/4 w-6 h-6 rounded-lg shape-float-delay opacity-75" 
        style={{ background: 'linear-gradient(135deg, #FFA500, #FFD700)' }}
      />
      <div 
        className="absolute top-1/2 right-12 w-8 h-8 rounded-full shape-float-delay-2 opacity-60" 
        style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
      />
      
      {/* Middle bottom row - 4 icons */}
      <div 
        className="absolute top-3/5 left-20 w-6 h-6 rounded-lg shape-float opacity-70" 
        style={{ background: 'linear-gradient(135deg, #10B981, #3B82F6)' }}
      />
      <div 
        className="absolute top-3/5 left-1/3 w-8 h-8 rounded-full shape-float-delay opacity-80" 
        style={{ background: 'linear-gradient(135deg, #FFA500, #FFD700)' }}
      />
      <div 
        className="absolute top-3/5 left-2/3 w-6 h-6 rounded-lg shape-float-delay-2 opacity-60" 
        style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
      />
      <div 
        className="absolute top-3/5 right-20 w-8 h-8 rounded-full shape-float-delay-2 opacity-70" 
        style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
      />
      
      {/* Bottom row - 5 icons */}
      <div 
        className="absolute bottom-32 left-16 w-8 h-8 rounded-full shape-float-delay-2 opacity-80" 
        style={{ background: 'linear-gradient(135deg, #87CEEB, #3B82F6)' }}
      />
      <div 
        className="absolute bottom-32 left-1/4 w-6 h-6 rounded-lg shape-float-delay opacity-60" 
        style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
      />
      <div 
        className="absolute bottom-32 left-1/2 w-8 h-8 rounded-full shape-float opacity-90" 
        style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
      />
      <div 
        className="absolute bottom-32 left-3/4 w-6 h-6 rounded-lg shape-float-delay-2 opacity-75" 
        style={{ background: 'linear-gradient(135deg, #FFA500, #FFD700)' }}
      />
      <div 
        className="absolute bottom-32 right-16 w-10 h-10 rounded-full shape-float-delay opacity-70" 
        style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}
      />
      
      {/* Additional scattered elements - 4 icons */}
      <div 
        className="absolute top-1/4 left-1/8 w-4 h-4 rounded-lg shape-float-delay opacity-40" 
        style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
      />
      <div 
        className="absolute top-1/4 right-1/8 w-6 h-6 rounded-full shape-float opacity-55" 
        style={{ background: 'linear-gradient(135deg, #10B981, #3B82F6)' }}
      />
      <div 
        className="absolute top-2/3 left-1/8 w-6 h-6 rounded-full shape-float opacity-55" 
        style={{ background: 'linear-gradient(135deg, #10B981, #3B82F6)' }}
      />
      <div 
        className="absolute top-2/3 right-1/8 w-6 h-6 rounded-lg shape-float-delay-2 opacity-45" 
        style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
      />
    </div>
  );
};