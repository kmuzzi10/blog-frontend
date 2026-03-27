import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Play, RefreshCw, X } from 'lucide-react';
import { Button } from './Button';
import { ClayCard } from './ClayCard';

interface Idea {
  id: number;
  x: number;
  y: number;
  type: 'post' | 'comment' | 'insight' | 'spam';
  emoji: string;
}

export const IdeaCatcherGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const scoreRef = useRef(0);

  const spawnIdea = () => {
    const container = gameContainerRef.current;
    if (!container) return;
    
    const width = container.clientWidth;
    const types: Idea['type'][] = ['post', 'comment', 'insight', 'spam'];
    const emojis = { post: '📝', comment: '💬', insight: '💡', spam: '🚫' };
    const type = types[Math.floor(Math.random() * types.length)];
    
    const newIdea: Idea = {
      id: nextId.current++,
      x: Math.random() * (width - 60) + 10,
      y: -60,
      type,
      emoji: emojis[type]
    };
    
    setIdeas(prev => [...prev, newIdea]);
  };

  useEffect(() => {
    let spawnInterval: any;
    let moveInterval: any;

    if (isPlaying && !gameOver) {
      spawnInterval = setInterval(spawnIdea, 800);
      
      moveInterval = setInterval(() => {
        setIdeas(prev => {
          const containerHeight = gameContainerRef.current?.clientHeight || 500;
          return prev.map(idea => ({ ...idea, y: idea.y + 4 }))
                     .filter(idea => idea.y < containerHeight + 50);
        });
      }, 30);
    }

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
    };
  }, [isPlaying, gameOver]);

  const handleCatch = (id: number, type: Idea['type']) => {
    if (gameOver) return;

    setScore(prev => {
      let newScore = prev;
      if (type === 'spam') {
        newScore = Math.max(0, prev - 5);
      } else {
        newScore = prev + 1;
      }
      
      scoreRef.current = newScore;
      if (newScore >= 20 && !gameOver) {
        setGameOver(true);
        setShowVictory(true);
      }
      return newScore;
    });

    setIdeas(prev => prev.filter(i => i.id !== id));
  };

  const startGame = () => {
    setScore(0);
    scoreRef.current = 0;
    setIdeas([]);
    setGameOver(false);
    setShowVictory(false);
    setIsPlaying(true);
  };

  return (
    <ClayCard className="relative overflow-hidden w-full max-w-md mx-auto aspect-square flex flex-col items-center justify-center p-0 border-4 border-white">
      <div className="absolute top-0 left-0 right-0 p-4 bg-white/50 backdrop-blur-sm z-20 flex justify-between items-center border-b border-white">
        <div className="flex items-center gap-2">
           <Trophy className="text-yellow-500" size={18} />
           <span className="font-black text-gray-800">{score}</span>
        </div>
        <h4 className="text-xs font-black uppercase tracking-widest text-primary">Idea Catcher</h4>
        <button onClick={() => setIsPlaying(false)} className="text-gray-400 hover:text-red-500">
           <X size={18} />
        </button>
      </div>

      <div 
        ref={gameContainerRef}
        className="relative w-full h-full bg-gradient-to-b from-blue-50 to-indigo-50 overflow-hidden cursor-crosshair"
      >
        <AnimatePresence>
          {!isPlaying && !gameOver && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md z-30"
            >
              <Sparkles className="text-primary mb-4" size={48} />
              <h3 className="text-xl font-black text-gray-800 mb-2">Catch the Insights!</h3>
              <p className="text-center text-sm text-gray-500 px-8 mb-6">Click on falling ideas but avoid the spam! Reach 20 points for a surprise.</p>
              <Button onClick={startGame} variant="primary" className="rounded-full px-8 shadow-clay"><Play size={18} className="mr-2" /> Play Game</Button>
            </motion.div>
          )}

          {isPlaying && ideas.map(idea => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, scale: 0, x: idea.x, y: idea.y }}
              animate={{ opacity: 1, scale: 1, y: idea.y }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ type: 'spring', damping: 15, stiffness: 100 }}
              onClick={(e) => {
                e.stopPropagation();
                handleCatch(idea.id, idea.type);
              }}
              className="absolute w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-clay-card cursor-pointer hover:scale-110 active:scale-90 transition-transform select-none z-10 pointer-events-auto"
              style={{ left: 0, top: 0, transform: `translate(${idea.x}px, ${idea.y}px)` }}
            >
              <span className="text-2xl pointer-events-none">{idea.emoji}</span>
            </motion.div>
          ))}

          {showVictory && (
             <motion.div 
               initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
               className="absolute inset-0 flex flex-col items-center justify-center bg-accent/90 backdrop-blur-md z-40 text-white p-8 text-center"
             >
               <Trophy size={64} className="mb-4 animate-bounce" />
               <h3 className="text-2xl font-black mb-2">Insight Master!</h3>
               <p className="font-bold mb-6">You've caught 20 ideas and earned the Elite Reader rank.</p>
               <Button onClick={startGame} className="bg-white text-accent hover:bg-gray-100 rounded-full px-8"><RefreshCw size={18} className="mr-2" /> Play Again</Button>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Background decoration in game hideout */}
      <div className="absolute bottom-4 right-4 opacity-10 pointer-events-none">
         <Sparkles size={80} />
      </div>
    </ClayCard>
  );
};
