import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Share2, 
  Heart, 
  TrendingUp, 
  Tag,
  Plus,
  Flame,
  Trophy,
  ChevronRight,
  Target,
  Zap,
  UserPlus,
  UserMinus,
  Mail,
  X
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { UserProfile } from '../types';

interface CommunityProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

export default function Community({ user, setUser }: CommunityProps) {
  const [selectedUser, setSelectedUser] = useState<{ name: string, avatar: string, id: string } | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [commentText, setCommentText] = useState<{ [postId: string]: string }>({});
  const [expandedComments, setExpandedComments] = useState<{ [postId: string]: boolean }>({});
  const [likedPosts, setLikedPosts] = useState<{ [postId: string]: boolean }>({});

  const [posts, setPosts] = useState([
    {
      id: 'p1',
      userId: 'u1',
      user: '量化大V-老王',
      avatar: 'W',
      content: '刚才在智能体实验室模拟了一下“黑天鹅”冲击，发现机构智能体在跌幅超过5%时会出现明显的“均值回归”吸筹行为，大家可以关注一下 BIO 的底部支撑。',
      time: '10分钟前',
      likes: 128,
      comments: [
        { user: '策略达人-阿强', content: '老王分析得透彻！', time: '5分钟前' },
        { user: '新手小白-小李', content: '学到了，这就去实验室试试。', time: '2分钟前' }
      ],
      tags: ['策略分享', '黑天鹅模拟']
    },
    {
      id: 'p2',
      userId: 'u2',
      user: '策略达人-阿强',
      avatar: 'Q',
      content: '本周挑战赛“90%羊群效应强度”太硬核了！我尝试了 20 多次，最后发现通过设置“反向情绪对冲”参数，在恐慌顶点分批入场，收益率竟然达到了 15%。大家可以去实验室试试这个思路。',
      time: '35分钟前',
      likes: 245,
      comments: [],
      tags: ['本周挑战赛', '实战心得']
    },
    {
      id: 'p3',
      userId: 'u3',
      user: '新手小白-小李',
      avatar: 'L',
      content: '教育中心的“风险管理”课程太有用了！以前总是追涨杀跌，现在学会看羊群效应指标了，今天成功避开了 TECH 的高位回调。',
      time: '1小时前',
      likes: 56,
      comments: [],
      tags: ['学习心得', '避坑指南']
    },
    {
      id: 'p4',
      userId: 'u4',
      user: 'Simustock 官方',
      avatar: 'H',
      content: '【挑战赛播报】本周挑战赛“极度恐慌中的生还者”已有 1,240 位用户参与，目前最高收益率记录由用户 @AlphaGo 保持（+24.8%）。快来实验室挑战你的心理极限！',
      time: '3小时前',
      likes: 890,
      comments: [],
      tags: ['官方动态', '本周挑战赛']
    }
  ]);

  const leaderboard = [
    { rank: 1, name: 'AlphaGo', score: '+24.8%', avatar: 'A', id: 'u5' },
    { rank: 2, name: 'DeepMind', score: '+21.5%', avatar: 'D', id: 'u6' },
    { rank: 3, name: 'QuantKing', score: '+19.2%', avatar: 'Q', id: 'u7' },
  ];

  const isFollowing = (userId: string) => {
    return user.following?.includes(userId);
  };

  const toggleFollow = (userId: string) => {
    setUser(prev => {
      if (!prev) return null;
      const following = prev.following || [];
      const isCurrentlyFollowing = following.includes(userId);
      
      const newFollowing = isCurrentlyFollowing
        ? following.filter(id => id !== userId)
        : [...following, userId];
        
      return { ...prev, following: newFollowing };
    });
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    alert(`消息已发送给 ${selectedUser?.name}: ${messageText}`);
    setMessageText('');
    setIsMessageModalOpen(false);
  };

  const handleAddComment = (postId: string) => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, { user: user.username, content: text, time: '刚刚' }]
        };
      }
      return post;
    }));

    setCommentText(prev => ({ ...prev, [postId]: '' }));
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
  };

  const toggleLike = (postId: string) => {
    const isLiked = likedPosts[postId];
    setLikedPosts(prev => ({ ...prev, [postId]: !isLiked }));
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, likes: isLiked ? post.likes - 1 : post.likes + 1 };
      }
      return post;
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      <div className="lg:col-span-2 space-y-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">Simustock 社区</h2>
            <p className="text-[var(--muted-foreground)]">晒单、讨论、策略分享，与万千投资者共同成长</p>
          </div>
          <button className="bg-rose-500 hover:bg-rose-600 text-white p-4 rounded-2xl shadow-lg shadow-rose-500/20 transition-all active:scale-95">
            <Plus className="w-6 h-6" />
          </button>
        </header>

        <div className="space-y-6">
          {posts.map((post, idx) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[var(--card)] border border-[var(--border)] rounded-[2rem] p-8 hover:border-rose-500/30 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedUser({ name: post.user, avatar: post.avatar, id: post.userId })}
                    className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center font-bold text-white hover:scale-110 transition-transform"
                  >
                    {post.avatar}
                  </button>
                  <div>
                    <h4 className="font-bold text-[var(--foreground)] hover:text-rose-500 cursor-pointer transition-colors"
                        onClick={() => setSelectedUser({ name: post.user, avatar: post.avatar, id: post.userId })}>
                      {post.user}
                    </h4>
                    <p className="text-xs text-[var(--muted-foreground)]">{post.time}</p>
                  </div>
                </div>
                <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <p className="text-[var(--foreground)] leading-relaxed mb-6">
                {post.content}
              </p>

              <div className="flex gap-2 mb-8">
                {post.tags.map(tag => (
                  <span key={tag} className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1",
                    tag === '本周挑战赛' ? "bg-rose-500/10 text-rose-500" : "bg-[var(--muted)] text-rose-500"
                  )}>
                    {tag === '本周挑战赛' ? <Target className="w-3 h-3" /> : <Tag className="w-3 h-3" />} {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-8 pt-6 border-t border-[var(--border)]">
                <button 
                  onClick={() => toggleLike(post.id)}
                  className={cn(
                    "flex items-center gap-2 transition-colors group",
                    likedPosts[post.id] ? "text-rose-500" : "text-[var(--muted-foreground)] hover:text-rose-500"
                  )}
                >
                  <Heart className={cn("w-5 h-5", likedPosts[post.id] && "fill-rose-500")} />
                  <span className="text-sm font-bold">{post.likes}</span>
                </button>
                <button 
                  onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                  className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-rose-500 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm font-bold">{post.comments.length} 评论</span>
                </button>
              </div>

              {/* Comments Section */}
              <div className="mt-6 space-y-4">
                <div className="flex gap-3">
                  <input 
                    type="text"
                    value={commentText[post.id] || ''}
                    onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                    placeholder="写下您的评论..."
                    className="flex-1 bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-rose-500/50 transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                  />
                  <button 
                    onClick={() => handleAddComment(post.id)}
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    评论
                  </button>
                </div>

                {expandedComments[post.id] && post.comments.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3 pt-4 border-t border-white/5"
                  >
                    {post.comments.map((comment, cIdx) => (
                      <div key={cIdx} className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-rose-400">{comment.user}</span>
                          <span className="text-[10px] text-slate-600">{comment.time}</span>
                        </div>
                        <p className="text-sm text-slate-300">{comment.content}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {/* Weekly Challenge Widget */}
        <div className="bg-gradient-to-br from-rose-500/10 to-orange-500/10 border border-rose-500/20 rounded-[2rem] p-8 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all" />
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-rose-500" />
            <h3 className="text-lg font-bold text-white">本周挑战赛</h3>
          </div>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            <span className="text-white font-bold block mb-1">极度恐慌中的生还者</span>
            在羊群效应强度 90% 的极端环境下，实现 10% 以上的超额收益。
          </p>
          <NavLink 
            to="/lab?mode=challenge" 
            className="w-full py-3 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
          >
            立即挑战 <ChevronRight className="w-4 h-4" />
          </NavLink>
        </div>

        {/* Leaderboard */}
        <div className="bg-[#0F0F12] border border-white/5 rounded-[2rem] p-8">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            挑战赛排行榜
          </h3>
          <div className="space-y-4">
            {leaderboard.map((userItem) => (
              <div key={userItem.rank} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold",
                    userItem.rank === 1 ? "bg-amber-500 text-black" : "bg-white/10 text-slate-400"
                  )}>
                    {userItem.rank}
                  </span>
                  <button 
                    onClick={() => setSelectedUser({ name: userItem.name, avatar: userItem.avatar, id: userItem.id })}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-slate-300 hover:bg-white/20 transition-colors"
                  >
                    {userItem.avatar}
                  </button>
                  <span 
                    className="text-sm font-bold text-white hover:text-rose-400 cursor-pointer transition-colors"
                    onClick={() => setSelectedUser({ name: userItem.name, avatar: userItem.avatar, id: userItem.id })}
                  >
                    {userItem.name}
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-rose-400">{userItem.score}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-xs font-bold text-slate-500 hover:text-white transition-colors">
            查看完整榜单
          </button>
        </div>

        <div className="bg-[#0F0F12] border border-white/5 rounded-[2rem] p-8">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            热门话题
          </h3>
          <div className="space-y-4">
            {['#黑天鹅模拟挑战', '#我的首笔模拟收益', '#智能体实验室调参', '#行为金融学入门'].map(topic => (
              <div key={topic} className="flex justify-between items-center group cursor-pointer">
                <span className="text-sm text-slate-400 group-hover:text-rose-400 transition-colors">{topic}</span>
                <TrendingUp className="w-4 h-4 text-slate-700 group-hover:text-rose-400 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0F0F12] border border-white/10 rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl"
            >
              <div className="h-24 bg-gradient-to-r from-rose-500/20 to-orange-500/20 relative">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="px-8 pb-8 -mt-12 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 border-4 border-[#0F0F12] flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-xl">
                  {selectedUser.avatar}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">{selectedUser.name}</h3>
                <p className="text-xs text-slate-500 mb-6 uppercase tracking-widest font-bold">ID: {selectedUser.id}</p>
                
                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">关注者</p>
                    <p className="text-lg font-bold text-white">1.2k</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">收益率</p>
                    <p className="text-lg font-bold text-rose-400">+15.4%</p>
                  </div>
                </div>
                
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => toggleFollow(selectedUser.id)}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                      isFollowing(selectedUser.id)
                        ? "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10"
                        : "bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/20"
                    )}
                  >
                    {isFollowing(selectedUser.id) ? (
                      <>
                        <UserMinus className="w-4 h-4" /> 取消追踪
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" /> 追踪ta
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => setIsMessageModalOpen(true)}
                    className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Mail className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Message Modal */}
      <AnimatePresence>
        {isMessageModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[#0F0F12] border border-white/10 rounded-[2rem] w-full max-w-md p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-rose-400" />
                  写留言给 {selectedUser?.name}
                </h3>
                <button 
                  onClick={() => setIsMessageModalOpen(false)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <textarea 
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="输入您的留言内容..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all mb-6 resize-none"
              />
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsMessageModalOpen(false)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-slate-400 hover:bg-white/10 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={handleSendMessage}
                  className="flex-1 py-3 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all"
                >
                  发送留言
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
