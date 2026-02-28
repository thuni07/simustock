import { useState, useEffect } from 'react';
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
  X,
  UserPlus,
  Send,
  Check
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { UserProfile } from '../types';

interface CommunityProps {
  currentUser: UserProfile;
}

export default function Community({ currentUser }: CommunityProps) {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);

  const posts = [
    {
      id: 'p1',
      userId: 'user_wang',
      user: '量化大V-老王',
      avatar: 'W',
      content: '刚才在智能体实验室模拟了一下“黑天鹅”冲击，发现机构智能体在跌幅超过5%时会出现明显的“均值回归”吸筹行为，大家可以关注一下 BIO 的底部支撑。',
      time: '10分钟前',
      likes: 128,
      comments: 45,
      tags: ['策略分享', '黑天鹅模拟']
    },
    {
      id: 'p2',
      userId: 'user_qiang',
      user: '策略达人-阿强',
      avatar: 'Q',
      content: '本周挑战赛“90%羊群效应强度”太硬核了！我尝试了 20 多次，最后发现通过设置“反向情绪对冲”参数，在恐慌顶点分批入场，收益率竟然达到了 15%。大家可以去实验室试试这个思路。',
      time: '35分钟前',
      likes: 245,
      comments: 82,
      tags: ['本周挑战赛', '实战心得']
    },
    {
      id: 'p3',
      userId: 'user_li',
      user: '新手小白-小李',
      avatar: 'L',
      content: '教育中心的“风险管理”课程太有用了！以前总是追涨杀跌，现在学会看羊群效应指标了，今天成功避开了 TECH 的高位回调。',
      time: '1小时前',
      likes: 56,
      comments: 12,
      tags: ['学习心得', '避坑指南']
    }
  ];

  const leaderboard = [
    { id: 'u1', name: 'AlphaGo', score: '+24.8%', avatar: 'A' },
    { id: 'u2', name: 'DeepMind', score: '+21.5%', avatar: 'D' },
    { id: 'u3', name: 'QuantKing', score: '+19.2%', avatar: 'Q' },
  ];

  const handleAvatarClick = (user: any) => {
    setSelectedUser({
      id: user.userId || user.id,
      username: user.user || user.name,
      avatar: user.avatar,
      userType: 'Professional',
      balance: 150000,
      followers: Math.floor(Math.random() * 1000),
      following: Math.floor(Math.random() * 500)
    });
    setIsFollowing(false);
    setIsMessaging(false);
    setMessageText('');
  };

  const handleFollow = async () => {
    if (!selectedUser) return;
    try {
      await fetch('/api/social/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followerId: currentUser.id,
          followingId: selectedUser.id
        })
      });
      setIsFollowing(true);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      console.error('Follow failed');
    }
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !messageText.trim()) return;
    try {
      await fetch('/api/social/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: selectedUser.id,
          content: messageText
        })
      });
      setMessageText('');
      setIsMessaging(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      console.error('Message failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
      <div className="lg:col-span-2 space-y-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Simustock 社区</h2>
            <p className="text-slate-500">晒单、讨论、策略分享，与万千投资者共同成长</p>
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-400 text-white p-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
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
              className="bg-[#0F0F12] border border-white/5 rounded-[2rem] p-8 hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleAvatarClick(post)}
                    className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-white hover:scale-110 transition-transform cursor-pointer"
                  >
                    {post.avatar}
                  </button>
                  <div>
                    <h4 className="font-bold text-white">{post.user}</h4>
                    <p className="text-xs text-slate-500">{post.time}</p>
                  </div>
                </div>
                <button className="text-slate-500 hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <p className="text-slate-300 leading-relaxed mb-6">
                {post.content}
              </p>

              <div className="flex gap-2 mb-8">
                {post.tags.map(tag => (
                  <span key={tag} className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1",
                    tag === '本周挑战赛' ? "bg-rose-500/10 text-rose-400" : "bg-white/5 text-emerald-400"
                  )}>
                    {tag === '本周挑战赛' ? <Target className="w-3 h-3" /> : <Tag className="w-3 h-3" />} {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-8 pt-6 border-t border-white/5">
                <button className="flex items-center gap-2 text-slate-500 hover:text-rose-400 transition-colors group">
                  <Heart className="w-5 h-5 group-hover:fill-rose-400" />
                  <span className="text-sm font-bold">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm font-bold">{post.comments}</span>
                </button>
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
            {leaderboard.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => handleAvatarClick(user)}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-slate-300 cursor-pointer hover:bg-white/20 transition-colors"
                  >
                    {user.avatar}
                  </div>
                  <span className="text-sm font-bold text-white">{user.name}</span>
                </div>
                <span className="text-sm font-mono font-bold text-emerald-400">{user.score}</span>
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
              className="bg-[#0F0F12] border border-white/10 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="relative h-32 bg-gradient-to-r from-emerald-500/20 to-teal-500/20">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="px-8 pb-8 -mt-12">
                <div className="flex items-end justify-between mb-6">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 border-4 border-[#0F0F12] flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                    {selectedUser.avatar}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleFollow}
                      disabled={isFollowing}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all",
                        isFollowing 
                          ? "bg-white/5 text-slate-400 cursor-default" 
                          : "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                      )}
                    >
                      {isFollowing ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      {isFollowing ? '已追踪' : '追踪ta'}
                    </button>
                    <button 
                      onClick={() => setIsMessaging(!isMessaging)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-xs text-white transition-all"
                    >
                      <MessageSquare className="w-4 h-4" />
                      写留言
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{selectedUser.username}</h3>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded uppercase tracking-widest">
                      {selectedUser.userType}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">ID: {selectedUser.id}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">总资产</p>
                    <p className="text-sm font-mono font-bold text-white">¥{selectedUser.balance.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">粉丝</p>
                    <p className="text-sm font-mono font-bold text-white">{selectedUser.followers}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">追踪</p>
                    <p className="text-sm font-mono font-bold text-white">{selectedUser.following}</p>
                  </div>
                </div>

                {isMessaging && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <textarea 
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="写下你想对ta说的话..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[100px] resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setIsMessaging(false)}
                        className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-white transition-colors"
                      >
                        取消
                      </button>
                      <button 
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                      >
                        <Send className="w-4 h-4" />
                        发送
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl shadow-2xl flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            操作成功
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
