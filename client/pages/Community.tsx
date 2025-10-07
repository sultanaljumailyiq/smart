import React, { useState } from "react";
import { 
  Home, GraduationCap, Users, MessageCircle, Grid, Plus, Heart, Share2, 
  Eye, Send, Search, Filter, Star, Clock, Calendar, MapPin, Settings,
  UserPlus, Check, X, MoreVertical, Image as ImageIcon, Video, Smile,
  Bookmark, TrendingUp, Award, Bell, LogOut, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Community = () => {
  const [activeSection, setActiveSection] = useState("main");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showComments, setShowComments] = useState<number | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState<Set<number>>(new Set());
  const [learningSubsection, setLearningSubsection] = useState<"courses" | "content" | "global" | "3d">("courses");

  const sections = [
    { id: "main", label: "الرئيسية", icon: Home },
    { id: "learning", label: "التعليم", icon: GraduationCap },
    { id: "friends", label: "الأصدقاء", icon: Users },
    { id: "messages", label: "الرسائل", icon: MessageCircle },
    { id: "others", label: "أخرى", icon: Grid },
  ];

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: { 
        name: "د. سارة أحمد", 
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100", 
        title: "أخصائي علاج العصب",
        verified: true 
      },
      content: "نهج ثوري لعلاج جذور الأسنان بدون ألم - اكتشف أحدث التقنيات في الندوة القادمة",
      image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600",
      likes: 324,
      comments: 42,
      shares: 18,
      views: 2340,
      timeAgo: "منذ 2 ساعة",
      commentsData: [
        { id: 1, author: "د. محمد علي", content: "معلومات قيمة جداً، شكراً للمشاركة", timeAgo: "منذ ساعة" },
        { id: 2, author: "د. ليلى حسن", content: "متى الندوة؟ أريد الحضور", timeAgo: "منذ 30 دقيقة" }
      ]
    },
    {
      id: 2,
      author: { 
        name: "د. أحمد محمد", 
        avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100", 
        title: "طبيب أسنان أطفال",
        verified: false 
      },
      content: "ما هي أفضل طريقة للتعامل مع قلق الأطفال من طبيب الأسنان؟ شاركوا تجاربكم 👶",
      likes: 156,
      comments: 89,
      shares: 12,
      views: 1567,
      timeAgo: "منذ 5 ساعات",
      commentsData: [
        { id: 1, author: "د. فاطمة كريم", content: "استخدم تقنية Tell-Show-Do وهي فعالة جداً", timeAgo: "منذ 3 ساعات" }
      ]
    },
    {
      id: 3,
      author: { 
        name: "د. حسام الدين", 
        avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100", 
        title: "جراح الفم والأسنان",
        verified: true 
      },
      content: "حالة معقدة تم حلها بنجاح - زراعة فورية مع تحميل فوري للأسنان الأمامية 🦷",
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600",
      likes: 892,
      comments: 134,
      shares: 45,
      views: 5234,
      timeAgo: "منذ يوم",
      commentsData: []
    }
  ]);

  const learningCategories = [
    { id: 1, name: "تقويم الأسنان", courses: 24, icon: "🦷" },
    { id: 2, name: "زراعة الأسنان", courses: 18, icon: "🔧" },
    { id: 3, name: "علاج العصب", courses: 31, icon: "💉" },
    { id: 4, name: "تجميل الأسنان", courses: 15, icon: "✨" },
    { id: 5, name: "جراحة الفم", courses: 22, icon: "🏥" },
    { id: 6, name: "طب أسنان الأطفال", courses: 19, icon: "👶" }
  ];

  const courses = [
    { 
      id: 1, 
      title: "دورة تقويم الأسنان الحديثة", 
      instructor: "د. علي حسين",
      type: "فيديو", 
      duration: "8 ساعات", 
      students: 1234,
      rating: 4.8,
      level: "متقدم",
      price: "مجاني",
      thumbnail: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400"
    },
    { 
      id: 2, 
      title: "علاج العصب المتقدم - تقنيات حديثة", 
      instructor: "د. سارة أحمد",
      type: "مقال", 
      duration: "4 ساعات", 
      students: 856,
      rating: 4.9,
      level: "متوسط",
      price: "50,000 IQD",
      thumbnail: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400"
    },
    { 
      id: 3, 
      title: "زراعة الأسنان الفورية - ورشة عملية", 
      instructor: "د. حسام الدين",
      type: "ورشة عمل", 
      duration: "12 ساعة", 
      students: 567,
      rating: 5.0,
      level: "متقدم",
      price: "150,000 IQD",
      thumbnail: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400"
    }
  ];

  const educationalContent = [
    { 
      id: 1, 
      title: "دليل شامل: علاج التهاب اللثة المزمن", 
      author: "د. سارة أحمد",
      type: "مقال",
      readTime: "10 دقائق",
      views: 2345,
      date: "منذ يومين",
      thumbnail: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400",
      category: "علاج اللثة"
    },
    { 
      id: 2, 
      title: "أحدث تقنيات التبييض الضوئي", 
      author: "د. علي حسين",
      type: "فيديو",
      readTime: "15 دقيقة",
      views: 4521,
      date: "منذ 3 أيام",
      thumbnail: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400",
      category: "تجميل"
    },
    { 
      id: 3, 
      title: "بروتوكولات التعقيم الحديثة في العيادات", 
      author: "د. حسام الدين",
      type: "دليل",
      readTime: "20 دقيقة",
      views: 3112,
      date: "منذ أسبوع",
      thumbnail: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400",
      category: "إدارة عيادات"
    }
  ];

  const globalResources = [
    { 
      id: 1, 
      title: "PubMed - Dentistry",
      description: "قاعدة بيانات الأبحاث العلمية الطبية",
      url: "pubmed.ncbi.nlm.nih.gov",
      type: "قاعدة بيانات",
      language: "English",
      icon: "📚"
    },
    { 
      id: 2, 
      title: "American Dental Association",
      description: "الجمعية الأمريكية لطب الأسنان - موارد ومعايير",
      url: "ada.org",
      type: "منظمة",
      language: "English",
      icon: "🏛️"
    },
    { 
      id: 3, 
      title: "Journal of Dental Research",
      description: "مجلة أبحاث طب الأسنان الدولية",
      url: "journals.sagepub.com/jdr",
      type: "مجلة علمية",
      language: "English",
      icon: "📰"
    },
    { 
      id: 4, 
      title: "Cochrane Oral Health",
      description: "مراجعات منهجية لأبحاث صحة الفم",
      url: "cochranelibrary.com/oral-health",
      type: "مراجعات",
      language: "English",
      icon: "🔬"
    }
  ];

  const models3D = [
    { 
      id: 1, 
      title: "تشريح الأسنان الكامل",
      description: "نموذج ثلاثي الأبعاد تفاعلي لجميع أنواع الأسنان",
      views: 5234,
      category: "تشريح",
      thumbnail: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400"
    },
    { 
      id: 2, 
      title: "زراعة الأسنان - الخطوات التفصيلية",
      description: "محاكاة ثلاثية الأبعاد لعملية زراعة الأسنان",
      views: 8921,
      category: "زراعة",
      thumbnail: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400"
    },
    { 
      id: 3, 
      title: "تقويم الأسنان - حركة الأسنان",
      description: "عرض توضيحي لحركة الأسنان خلال فترة التقويم",
      views: 6543,
      category: "تقويم",
      thumbnail: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400"
    }
  ];

  const friends = [
    { id: 1, name: "د. محمد العراقي", avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100", specialty: "جراحة فم", online: true, mutualFriends: 12, location: "بغداد" },
    { id: 2, name: "د. زينب الحسن", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100", specialty: "تقويم أسنان", online: false, mutualFriends: 8, location: "البصرة" },
    { id: 3, name: "د. حسام الدين", avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100", specialty: "علاج عصب", online: true, mutualFriends: 15, location: "أربيل" },
    { id: 4, name: "د. فاطمة كريم", avatar: "https://images.unsplash.com/photo-1594824475386-67eb4d8b5f59?w=100", specialty: "أسنان أطفال", online: true, mutualFriends: 6, location: "النجف" }
  ];

  const [friendRequests, setFriendRequests] = useState([
    { id: 1, name: "د. علي حسين", avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100", mutualFriends: 5, specialty: "تجميل أسنان" },
    { id: 2, name: "د. مريم صالح", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100", mutualFriends: 3, specialty: "زراعة أسنان" }
  ]);

  const conversations = [
    { id: 1, sender: "د. فاطمة حسن", avatar: "https://images.unsplash.com/photo-1594824475386-67eb4d8b5f59?w=100", lastMessage: "شكراً على المشاركة المفيدة", time: "منذ 5 دقائق", unread: 2, online: true },
    { id: 2, sender: "د. علي حسين", avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100", lastMessage: "هل يمكننا مناقشة الحالة؟", time: "منذ 1 ساعة", unread: 0, online: false },
    { id: 3, sender: "د. زينب محمد", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100", lastMessage: "سأرسل لك التقرير قريباً", time: "منذ 3 ساعات", unread: 1, online: true }
  ];

  const conversationMessages = [
    { id: 1, text: "مرحباً، كيف حالك؟", sent: false, time: "10:30 ص" },
    { id: 2, text: "بخير والحمد لله، شكراً لسؤالك", sent: true, time: "10:32 ص" },
    { id: 3, text: "أريد استشارتك بخصوص حالة معقدة", sent: false, time: "10:35 ص" },
    { id: 4, text: "بالتأكيد، ارسل لي التفاصيل", sent: true, time: "10:36 ص" }
  ];

  const groups = [
    { id: 1, name: "أطباء الأسنان في العراق", members: 15234, icon: "👥", category: "عام" },
    { id: 2, name: "تقويم الأسنان المتقدم", members: 3456, icon: "🦷", category: "تخصص" },
    { id: 3, name: "الزراعة الفورية", members: 2134, icon: "🔧", category: "تخصص" },
    { id: 4, name: "حالات سريرية معقدة", members: 5678, icon: "🏥", category: "علمي" }
  ];

  const events = [
    { id: 1, title: "مؤتمر طب الأسنان الدولي 2025", date: "15 نوفمبر 2025", location: "بغداد - فندق راديسون", attendees: 450, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400" },
    { id: 2, title: "ورشة عمل: زراعة الأسنان الفورية", date: "22 نوفمبر 2025", location: "أربيل - مركز التدريب الطبي", attendees: 89, image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400" }
  ];

  const handleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        toast.success("تم إلغاء الإعجاب");
      } else {
        newSet.add(postId);
        toast.success("تم الإعجاب بالمنشور");
      }
      return newSet;
    });
  };

  const handleAcceptFriend = (id: number, name: string) => {
    setFriendRequests(prev => prev.filter(req => req.id !== id));
    toast.success(`تم قبول طلب الصداقة من ${name}`);
  };

  const handleRejectFriend = (id: number, name: string) => {
    setFriendRequests(prev => prev.filter(req => req.id !== id));
    toast.error(`تم رفض طلب الصداقة من ${name}`);
  };

  const handleEnrollCourse = (courseId: number, title: string) => {
    setEnrolledCourses(prev => new Set(prev).add(courseId));
    toast.success(`تم التسجيل في ${title}`);
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast.error("الرجاء كتابة محتوى المنشور");
      return;
    }
    
    const newPost = {
      id: posts.length + 1,
      author: {
        name: "د. أحمد محمد",
        avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100",
        title: "طبيب أسنان",
        verified: false
      },
      content: newPostContent,
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      timeAgo: "الآن",
      commentsData: []
    };
    
    setPosts(prev => [newPost, ...prev]);
    setNewPostContent("");
    setShowCreatePost(false);
    toast.success("تم نشر المنشور بنجاح!");
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Mobile Navigation */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-30 shadow-sm">
        <div className="flex overflow-x-auto hide-scrollbar">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-4 whitespace-nowrap border-b-2 transition-all",
                activeSection === section.id
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <section.icon className="w-5 h-5" />
              <span className="font-medium">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-20">
        {/* Main Feed */}
        {activeSection === "main" && (
          <div className="space-y-4">
            {/* Stories Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex gap-3 overflow-x-auto hide-scrollbar">
                <div className="flex-shrink-0 w-24">
                  <div className="w-24 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-xs text-center mt-2 font-medium">أضف قصة</p>
                </div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex-shrink-0 w-24">
                    <div className="w-24 h-32 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform border-2 border-blue-500">
                      <img src={`https://images.unsplash.com/photo-${1559839734 + i}-2b71ea197ec2?w=100`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs text-center mt-2 truncate">د. مريم</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Post */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <button 
                onClick={() => setShowCreatePost(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                إنشاء منشور جديد
              </button>
              
              <div className="grid grid-cols-3 gap-2 mt-3">
                <button className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <ImageIcon className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">صورة</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Video className="w-4 h-4 text-red-600" />
                  <span className="text-gray-700">فيديو</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Smile className="w-4 h-4 text-yellow-600" />
                  <span className="text-gray-700">شعور</span>
                </button>
              </div>
            </div>

            {/* Posts */}
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                          {post.author.verified && <Check className="w-4 h-4 text-blue-500" />}
                        </div>
                        <p className="text-sm text-gray-600">{post.author.title}</p>
                        <p className="text-xs text-gray-500">{post.timeAgo}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
                </div>
                
                {post.image && (
                  <img src={post.image} alt="" className="w-full h-80 object-cover" />
                )}
                
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views}
                      </span>
                      <span>{post.comments} تعليق</span>
                      <span>{post.shares} مشاركة</span>
                    </div>
                    <button className="hover:text-blue-600 transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all",
                        likedPosts.has(post.id)
                          ? "bg-red-50 text-red-600"
                          : "hover:bg-gray-50 text-gray-600"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", likedPosts.has(post.id) && "fill-red-600")} />
                      <span className="text-sm font-medium">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                    </button>
                    <button 
                      onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">تعليق</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm font-medium">مشاركة</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {showComments === post.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                      {post.commentsData.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex-shrink-0" />
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="font-medium text-sm text-gray-900">{comment.author}</p>
                              <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-1 px-3">
                              <button className="text-xs text-gray-600 hover:text-blue-600">إعجاب</button>
                              <button className="text-xs text-gray-600 hover:text-blue-600">رد</button>
                              <span className="text-xs text-gray-500">{comment.timeAgo}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-3 mt-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex-shrink-0" />
                        <div className="flex-1 flex gap-2">
                          <input 
                            type="text" 
                            placeholder="اكتب تعليقاً..." 
                            className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors">
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Learning Section */}
        {activeSection === "learning" && (
          <div className="space-y-4">
            {/* Header with Search */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">مركز التعليم المستمر</h2>
              <p className="text-blue-100 mb-4">طور مهاراتك مع أفضل الخبراء في المجال</p>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="ابحث..." 
                    className="w-full pr-10 pl-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Learning Subsections Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200">
                <button
                  onClick={() => setLearningSubsection("courses")}
                  className={cn(
                    "flex-1 px-6 py-4 text-center font-medium whitespace-nowrap transition-all",
                    learningSubsection === "courses"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  الدورات
                </button>
                <button
                  onClick={() => setLearningSubsection("content")}
                  className={cn(
                    "flex-1 px-6 py-4 text-center font-medium whitespace-nowrap transition-all",
                    learningSubsection === "content"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  المحتوى التعليمي
                </button>
                <button
                  onClick={() => setLearningSubsection("global")}
                  className={cn(
                    "flex-1 px-6 py-4 text-center font-medium whitespace-nowrap transition-all",
                    learningSubsection === "global"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  المصادر العالمية
                </button>
                <button
                  onClick={() => setLearningSubsection("3d")}
                  className={cn(
                    "flex-1 px-6 py-4 text-center font-medium whitespace-nowrap transition-all",
                    learningSubsection === "3d"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  3D
                </button>
              </div>
            </div>

            {/* Courses Subsection */}
            {learningSubsection === "courses" && (
              <>
                {/* My Enrolled Courses */}
                {enrolledCourses.size > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      الدورات المسجل بها ({enrolledCourses.size})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courses.filter(c => enrolledCourses.has(c.id)).map((course) => (
                        <div key={course.id} className="bg-white rounded-lg p-4 border border-green-200">
                          <div className="flex items-center gap-3">
                            <img src={course.thumbnail} alt={course.title} className="w-16 h-16 rounded-lg object-cover" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm">{course.title}</h4>
                              <p className="text-xs text-gray-600 mt-1">{course.instructor}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">مُسجّل</span>
                                <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">متابعة</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">التخصصات</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {learningCategories.map((cat) => (
                      <button 
                        key={cat.id}
                        className="bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-lg p-4 text-center transition-all border border-blue-100 hover:border-blue-300"
                      >
                        <div className="text-3xl mb-2">{cat.icon}</div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{cat.name}</h4>
                        <p className="text-xs text-gray-600">{cat.courses} دورة</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Courses */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">الدورات المميزة</h3>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">عرض الكل</button>
                  </div>
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                        <div className="md:flex">
                          <img src={course.thumbnail} alt={course.title} className="w-full md:w-48 h-48 object-cover" />
                          <div className="p-6 flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">{course.type}</span>
                                  <span className="bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-full font-medium">{course.level}</span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{course.title}</h3>
                                <p className="text-sm text-gray-600 mb-3">المدرب: {course.instructor}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="font-medium">{course.rating}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{course.duration}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>{course.students} طالب</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-left mr-4">
                                <p className="text-2xl font-bold text-blue-600">{course.price}</p>
                              </div>
                            </div>
                            <Button 
                              onClick={() => handleEnrollCourse(course.id, course.title)}
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              disabled={enrolledCourses.has(course.id)}
                            >
                              {enrolledCourses.has(course.id) ? "تم التسجيل ✓" : "التسجيل الآن"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Educational Content Subsection */}
            {learningSubsection === "content" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">المحتوى التعليمي</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">عرض الكل</button>
                </div>
                {educationalContent.map((content) => (
                  <div key={content.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                    <div className="md:flex">
                      <img src={content.thumbnail} alt={content.title} className="w-full md:w-48 h-48 object-cover" />
                      <div className="p-6 flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">{content.type}</span>
                          <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">{content.category}</span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{content.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">بقلم: {content.author}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{content.readTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{content.views} مشاهدة</span>
                          </div>
                          <span className="text-xs">{content.date}</span>
                        </div>
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          قراءة المزيد
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Global Resources Subsection */}
            {learningSubsection === "global" && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">المصادر العالمية</h3>
                  <p className="text-sm text-gray-600">أفضل المصادر العلمية والأكاديمية الدولية في طب الأسنان</p>
                </div>
                {globalResources.map((resource) => (
                  <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                    <div className="flex items-start gap-4">
                      <div className="text-5xl">{resource.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 mb-2">{resource.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">{resource.type}</span>
                              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">{resource.language}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                          <Button 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            onClick={() => window.open(`https://${resource.url}`, '_blank')}
                          >
                            زيارة الموقع
                          </Button>
                          <p className="text-xs text-gray-500">{resource.url}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3D Models Subsection */}
            {learningSubsection === "3d" && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">النماذج ثلاثية الأبعاد</h3>
                  <p className="text-sm text-gray-600">نماذج تفاعلية ثلاثية الأبعاد لفهم أفضل</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {models3D.map((model) => (
                    <div key={model.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                      <div className="relative">
                        <img src={model.thumbnail} alt={model.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                          <div className="p-4 text-white w-full">
                            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">{model.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-gray-900 mb-2">{model.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{model.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Eye className="w-4 h-4" />
                            <span>{model.views} مشاهدة</span>
                          </div>
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            عرض النموذج
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Friends Section */}
        {activeSection === "friends" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="ابحث عن أصدقاء..." 
                  className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Friend Requests */}
            {friendRequests.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  طلبات الصداقة ({friendRequests.length})
                </h3>
                <div className="space-y-3">
                  {friendRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img src={request.avatar} alt={request.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <h4 className="font-semibold text-gray-900">{request.name}</h4>
                          <p className="text-sm text-gray-600">{request.specialty}</p>
                          <p className="text-xs text-gray-500">{request.mutualFriends} أصدقاء مشتركين</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAcceptFriend(request.id, request.name)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          قبول
                        </button>
                        <button 
                          onClick={() => handleRejectFriend(request.id, request.name)}
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Friends List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">أصدقائك ({friends.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {friends.map((friend) => (
                  <div key={friend.id} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <img src={friend.avatar} alt={friend.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-white" />
                        {friend.online && (
                          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{friend.name}</h3>
                        <p className="text-sm text-gray-600">{friend.specialty}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{friend.location}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">{friend.mutualFriends} أصدقاء مشتركين</p>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        رسالة
                      </button>
                      <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-white transition-colors text-sm font-medium">
                        الملف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">مقترحات الصداقة</h3>
              <p className="text-sm text-gray-600">سيتم إضافة اقتراحات بناءً على التخصص والموقع</p>
            </div>
          </div>
        )}

        {/* Messages Section */}
        {activeSection === "messages" && (
          <div className="space-y-4">
            {selectedConversation === null ? (
              <>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="ابحث في المحادثات..." 
                      className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  {conversations.map((conv) => (
                    <div 
                      key={conv.id} 
                      onClick={() => setSelectedConversation(conv.id)}
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={conv.avatar} alt={conv.sender} className="w-14 h-14 rounded-full object-cover" />
                          {conv.online && (
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900">{conv.sender}</h3>
                            <span className="text-xs text-gray-500">{conv.time}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                            {conv.unread > 0 && (
                              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mr-2">
                                {conv.unread}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Conversation Header */}
                <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedConversation(null)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <img src={conversations.find(c => c.id === selectedConversation)?.avatar} alt="" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{conversations.find(c => c.id === selectedConversation)?.sender}</h3>
                    <p className="text-sm text-green-600">نشط الآن</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-4 h-96 overflow-y-auto space-y-3">
                  {conversationMessages.map((msg) => (
                    <div key={msg.id} className={cn("flex", msg.sent ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2",
                        msg.sent ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                      )}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={cn("text-xs mt-1", msg.sent ? "text-blue-100" : "text-gray-500")}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <ImageIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <input 
                      type="text" 
                      placeholder="اكتب رسالة..." 
                      className="flex-1 bg-gray-50 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Others Section */}
        {activeSection === "others" && (
          <div className="space-y-4">
            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <Users className="w-12 h-12 mx-auto mb-3" />
                <h3 className="font-semibold">المجموعات</h3>
                <p className="text-xs text-blue-100 mt-1">{groups.length} مجموعة</p>
              </button>
              <button className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <Calendar className="w-12 h-12 mx-auto mb-3" />
                <h3 className="font-semibold">الأحداث</h3>
                <p className="text-xs text-purple-100 mt-1">{events.length} حدث قادم</p>
              </button>
              <button className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <TrendingUp className="w-12 h-12 mx-auto mb-3" />
                <h3 className="font-semibold">الإحصائيات</h3>
                <p className="text-xs text-green-100 mt-1">نشاطك</p>
              </button>
              <button className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <Settings className="w-12 h-12 mx-auto mb-3" />
                <h3 className="font-semibold">الإعدادات</h3>
                <p className="text-xs text-orange-100 mt-1">حسابك</p>
              </button>
            </div>

            {/* Groups */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">المجموعات الشائعة</h3>
              <div className="space-y-3">
                {groups.map((group) => (
                  <div key={group.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-2xl">
                        {group.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{group.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                          <span>{group.members.toLocaleString()} عضو</span>
                          <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{group.category}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">انضم</Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Events */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">الأحداث القادمة</h3>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all">
                    <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                      <div className="space-y-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees} مهتم</span>
                        </div>
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        سجل الآن
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">إعدادات الحساب</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">الإشعارات</span>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">الخصوصية والأمان</span>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-red-600">
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5" />
                    <span>تسجيل الخروج</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreatePost(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">إنشاء منشور</h3>
              <button onClick={() => setShowCreatePost(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">د. أحمد محمد</h4>
                  <select className="text-sm text-gray-600 border border-gray-200 rounded px-2 py-1 mt-1">
                    <option>عام</option>
                    <option>أصدقاء فقط</option>
                    <option>خاص</option>
                  </select>
                </div>
              </div>
              <textarea 
                placeholder="ما الذي تريد مشاركته؟" 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="flex gap-2 mt-4">
                <button className="flex-1 border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <ImageIcon className="w-5 h-5 text-green-600" />
                  <span className="text-sm">صورة</span>
                </button>
                <button className="flex-1 border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Video className="w-5 h-5 text-red-600" />
                  <span className="text-sm">فيديو</span>
                </button>
              </div>
              <Button 
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={handleCreatePost}
              >
                نشر
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
